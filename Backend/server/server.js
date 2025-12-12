require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const app = express();
app.use(cors());
app.use(express.json());

// --- Database Connection ---
const MONGO_URI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/cureconnect';

mongoose.connect(MONGO_URI)
.then(() => console.log('✅ MongoDB Connected'))
.catch(err => console.error('❌ DB Error:', err));

// --- Mongoose Models ---
const UserSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, enum: ['patient', 'admin'], default: 'patient' },
  phone: String,
  createdAt: { type: Date, default: Date.now }
});
const User = mongoose.model('User', UserSchema);

const DoctorSchema = new mongoose.Schema({
  name: { type: String, required: true },
  specialty: { type: String, required: true },
  price: { type: Number, required: true },
  image: { type: String, required: true },
  startHour: { type: Number, default: 9 },
  endHour: { type: Number, default: 17 },
  experience: { type: Number, default: 0 },
  education: String,
  description: String,
  rating: { type: Number, default: 0 },
  reviews: { type: Number, default: 0 },
  createdAt: { type: Date, default: Date.now }
});
const Doctor = mongoose.model('Doctor', DoctorSchema);

const AppointmentSchema = new mongoose.Schema({
  doctorId: { type: mongoose.Schema.Types.ObjectId, ref: 'Doctor', required: true },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  patientName: { type: String, required: true },
  patientEmail: String,
  patientPhone: String,
  date: { type: String, required: true },
  time: { type: String, required: true },
  status: { type: String, enum: ['pending', 'confirmed', 'completed', 'cancelled'], default: 'confirmed' },
  notes: String,
  createdAt: { type: Date, default: Date.now }
});
const Appointment = mongoose.model('Appointment', AppointmentSchema);

// --- Middleware ---
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  
  if (!token) {
    return res.status(401).json({ message: 'Access denied. No token provided.' });
  }
  
  jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key', (err, user) => {
    if (err) return res.status(403).json({ message: 'Invalid token.' });
    req.user = user;
    next();
  });
};

// --- Auth Routes ---
app.post('/api/auth/register', async (req, res) => {
  try {
    const { name, email, password, phone } = req.body;
    if (!name || !email || !password) {
      return res.status(400).json({ message: 'Please provide name, email, and password' });
    }
    
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists' });
    }
    
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await User.create({ name, email, password: hashedPassword, phone });
    
    const token = jwt.sign({ userId: user._id, email: user.email }, process.env.JWT_SECRET || 'your-secret-key');
    res.status(201).json({ token, user: { id: user._id, name: user.name, email: user.email, role: user.role } });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ message: 'Please provide email and password' });
    }
    
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }
    
    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }
    
    const token = jwt.sign({ userId: user._id, email: user.email }, process.env.JWT_SECRET || 'your-secret-key');
    res.json({ token, user: { id: user._id, name: user.name, email: user.email, role: user.role } });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// --- Doctor Routes ---
app.get('/api/doctors', async (req, res) => {
  try {
    const { specialty, search } = req.query;
    let query = {};
    
    if (specialty) query.specialty = new RegExp(specialty, 'i');
    if (search) {
      query.$or = [
        { name: new RegExp(search, 'i') },
        { specialty: new RegExp(search, 'i') }
      ];
    }
    
    const doctors = await Doctor.find(query).sort({ createdAt: -1 });
    res.json(doctors);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get a single doctor by id
app.get('/api/doctors/:id', async (req, res) => {
  try {
    const doctor = await Doctor.findById(req.params.id);
    if (!doctor) return res.status(404).json({ message: 'Doctor not found' });
    res.json(doctor);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Create a doctor
app.post('/api/doctors', async (req, res) => {
  try {
    const { name, specialty, price, image, startHour, endHour } = req.body;
    const doctor = await Doctor.create({ name, specialty, price, image, startHour, endHour });
    res.status(201).json(doctor);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Update a doctor
app.put('/api/doctors/:id', async (req, res) => {
  try {
    const updates = req.body;
    const doctor = await Doctor.findByIdAndUpdate(req.params.id, updates, { new: true });
    if (!doctor) return res.status(404).json({ message: 'Doctor not found' });
    res.json(doctor);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Delete a doctor
app.delete('/api/doctors/:id', async (req, res) => {
  try {
    const doctor = await Doctor.findByIdAndDelete(req.params.id);
    if (!doctor) return res.status(404).json({ message: 'Doctor not found' });
    res.json({ message: 'Doctor deleted' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// --- Appointment Routes ---
app.get('/api/appointments', async (req, res) => {
  try {
    const { doctorId, date, userId } = req.query;
    let query = {};
    
    // If both doctorId and date are provided, return just booked times (for booking page)
    if (doctorId && date && !userId) {
      const appointments = await Appointment.find({ doctorId, date, status: { $ne: 'cancelled' } });
      const bookedTimes = appointments.map(app => app.time);
      return res.json(bookedTimes);
    }
    
    // Otherwise, return full appointment details
    if (doctorId) query.doctorId = doctorId;
    if (date) query.date = date;
    
    // If userId is provided or user is authenticated, filter by userId
    const token = req.headers['authorization']?.split(' ')[1];
    if (token) {
      try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key');
        if (userId || decoded.userId) {
          query.userId = userId || decoded.userId;
        }
      } catch (err) {
        // Token invalid, continue without user filter
      }
    } else if (userId) {
      query.userId = userId;
    }
    
    const appointments = await Appointment.find(query)
      .populate('doctorId', 'name specialty image')
      .populate('userId', 'name email')
      .sort({ date: 1, time: 1 });
    
    res.json(appointments);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/appointments', async (req, res) => {
  try {
    const { doctorId, patientName, patientEmail, patientPhone, date, time, userId, notes } = req.body;
    if (!doctorId || !patientName || !date || !time) {
      return res.status(400).json({ message: 'Missing required fields' });
    }

    const doctor = await Doctor.findById(doctorId);
    if (!doctor) return res.status(404).json({ message: 'Doctor not found' });

    // validate time is within doctor's working hours
    const [hourStr, minuteStr] = time.split(':');
    const hour = parseInt(hourStr, 10);
    const minute = parseInt(minuteStr || '0', 10);
    if (isNaN(hour) || isNaN(minute)) return res.status(400).json({ message: 'Invalid time format' });
    if (hour < doctor.startHour || hour > doctor.endHour || (hour === doctor.endHour && minute > 0)) {
      return res.status(400).json({ message: 'Time outside doctor working hours' });
    }

    const exists = await Appointment.findOne({ doctorId, date, time, status: { $ne: 'cancelled' } });
    if (exists) return res.status(400).json({ message: 'Slot already booked' });

    const newAppointment = new Appointment({ 
      doctorId, 
      userId: userId || null,
      patientName, 
      patientEmail,
      patientPhone,
      date, 
      time,
      notes
    });
    await newAppointment.save();
    
    const populatedAppointment = await Appointment.findById(newAppointment._id)
      .populate('doctorId', 'name specialty image');
    
    res.status(201).json({ message: 'Appointment Confirmed!', appointment: populatedAppointment });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get single appointment details
app.get('/api/appointments/:id', async (req, res) => {
  try {
    const appointment = await Appointment.findById(req.params.id)
      .populate('doctorId', 'name specialty image')
      .populate('userId', 'name email');
    if (!appointment) return res.status(404).json({ message: 'Appointment not found' });

    // If appointment is linked to a user, require authentication and ownership
    if (appointment.userId) {
      const authHeader = req.headers['authorization'];
      const token = authHeader && authHeader.split(' ')[1];
      if (!token) return res.status(401).json({ message: 'Authentication required' });
      try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key');
        if (decoded.userId !== appointment.userId.toString()) return res.status(403).json({ message: 'Forbidden' });
      } catch (err) {
        return res.status(403).json({ message: 'Invalid token' });
      }
    }

    res.json(appointment);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Download appointment as an .ics calendar file
app.get('/api/appointments/:id/download', async (req, res) => {
  try {
    const appointment = await Appointment.findById(req.params.id).populate('doctorId', 'name');
    if (!appointment) return res.status(404).json({ message: 'Appointment not found' });

    if (appointment.userId) {
      const authHeader = req.headers['authorization'];
      const token = authHeader && authHeader.split(' ')[1];
      if (!token) return res.status(401).json({ message: 'Authentication required' });
      try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key');
        if (decoded.userId !== appointment.userId.toString()) return res.status(403).json({ message: 'Forbidden' });
      } catch (err) {
        return res.status(403).json({ message: 'Invalid token' });
      }
    }

    // Build ICS content
    const pad = (n) => String(n).padStart(2, '0');
    const makeUTCString = (d) => {
      // ISO to YYYYMMDDTHHMMSSZ
      return d.toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z';
    };

    const dateStr = appointment.date; // expect YYYY-MM-DD
    const timeStr = appointment.time; // expect HH:MM
    const start = new Date(`${dateStr}T${timeStr}:00`);
    const end = new Date(start.getTime() + 30 * 60000);

    const dtStart = makeUTCString(start);
    const dtEnd = makeUTCString(end);
    const uid = `${appointment._id}@cureconnect`;
    const summary = `Appointment with ${appointment.doctorId?.name || 'Doctor'}`;
    const descriptionParts = [
      `Patient: ${appointment.patientName}`,
      appointment.patientEmail ? `Email: ${appointment.patientEmail}` : null,
      appointment.patientPhone ? `Phone: ${appointment.patientPhone}` : null,
      appointment.notes ? `Notes: ${appointment.notes}` : null
    ].filter(Boolean);
    const description = descriptionParts.join('\\n');

    const ics = [
      'BEGIN:VCALENDAR',
      'VERSION:2.0',
      'PRODID:-//Cureconnect//EN',
      'CALSCALE:GREGORIAN',
      'BEGIN:VEVENT',
      `UID:${uid}`,
      `DTSTAMP:${makeUTCString(new Date())}`,
      `DTSTART:${dtStart}`,
      `DTEND:${dtEnd}`,
      `SUMMARY:${summary}`,
      `DESCRIPTION:${description}`,
      `LOCATION:Online / Clinic`,
      'END:VEVENT',
      'END:VCALENDAR'
    ].join('\r\n');

    res.setHeader('Content-Type', 'text/calendar; charset=utf-8');
    res.setHeader('Content-Disposition', `attachment; filename="appointment-${appointment._id}.ics"`);
    res.send(ics);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.put('/api/appointments/:id', authenticateToken, async (req, res) => {
  try {
    const { status, notes } = req.body;
    const appointment = await Appointment.findById(req.params.id);
    
    if (!appointment) return res.status(404).json({ message: 'Appointment not found' });
    if (appointment.userId && appointment.userId.toString() !== req.user.userId) {
      return res.status(403).json({ message: 'Unauthorized' });
    }
    
    if (status) appointment.status = status;
    if (notes !== undefined) appointment.notes = notes;
    
    await appointment.save();
    const updated = await Appointment.findById(appointment._id).populate('doctorId', 'name specialty image');
    res.json(updated);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.delete('/api/appointments/:id', authenticateToken, async (req, res) => {
  try {
    const appointment = await Appointment.findById(req.params.id);
    if (!appointment) return res.status(404).json({ message: 'Appointment not found' });
    
    if (appointment.userId && appointment.userId.toString() !== req.user.userId) {
      return res.status(403).json({ message: 'Unauthorized' });
    }
    
    appointment.status = 'cancelled';
    await appointment.save();
    res.json({ message: 'Appointment cancelled' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Utility: generate time slots (interval minutes)
function generateTimeSlots(startHour = 9, endHour = 17, interval = 30) {
  const slots = [];
  for (let h = startHour; h <= endHour; h++) {
    for (let m = 0; m < 60; m += interval) {
      // don't push times beyond endHour
      if (h === endHour && m > 0) continue;
      const hh = String(h).padStart(2, '0');
      const mm = String(m).padStart(2, '0');
      slots.push(`${hh}:${mm}`);
    }
  }
  return slots;
}

// Get available slots for a doctor on a date
app.get('/api/doctors/:id/available', async (req, res) => {
  try {
    const doctorId = req.params.id;
    const date = req.query.date; // expect YYYY-MM-DD
    if (!date) return res.status(400).json({ message: 'Missing date query param' });

    const doctor = await Doctor.findById(doctorId);
    if (!doctor) return res.status(404).json({ message: 'Doctor not found' });

    const appointments = await Appointment.find({ doctorId, date });
    const booked = appointments.map(a => a.time);

    const allSlots = generateTimeSlots(doctor.startHour, doctor.endHour, 30);
    const available = allSlots.filter(s => !booked.includes(s));
    res.json({ date, doctorId, available });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// --- User Routes ---
app.get('/api/users/me', authenticateToken, async (req, res) => {
  try {
    const user = await User.findById(req.user.userId).select('-password');
    res.json(user);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// --- Seed Route (Run once via browser/Postman) ---
app.post('/api/seed', async (req, res) => {
  try {
    await Doctor.deleteMany({});
    await Doctor.create([
      { 
        name: 'Dr. Sarah Smith', 
        specialty: 'Cardiologist', 
        price: 150, 
        image: 'https://img.freepik.com/free-photo/woman-doctor-wearing-lab-coat-with-stethoscope-isolated_1303-29791.jpg',
        experience: 12,
        education: 'MD, Harvard Medical School',
        description: 'Expert in cardiovascular diseases with over 12 years of experience.',
        rating: 4.8,
        reviews: 245
      },
      { 
        name: 'Dr. John Doe', 
        specialty: 'Dermatologist', 
        price: 120, 
        image: 'https://img.freepik.com/free-photo/smiling-doctor-with-stethoscope-isolated-grey_651396-974.jpg',
        experience: 8,
        education: 'MD, Johns Hopkins University',
        description: 'Specialized in skin care and cosmetic dermatology.',
        rating: 4.6,
        reviews: 189
      },
      { 
        name: 'Dr. Emily Blunt', 
        specialty: 'Pediatrician', 
        price: 100, 
        image: 'https://img.freepik.com/free-photo/pleased-young-female-doctor-wearing-medical-robe-stethoscope-around-neck-standing-with-closed-posture_409827-254.jpg',
        experience: 10,
        education: 'MD, Stanford University',
        description: 'Caring pediatrician dedicated to children\'s health and wellness.',
        rating: 4.9,
        reviews: 312
      },
      { 
        name: 'Dr. Michael Chen', 
        specialty: 'Neurologist', 
        price: 180, 
        image: 'https://img.freepik.com/free-photo/portrait-smiling-male-doctor_171337-1482.jpg',
        experience: 15,
        education: 'MD, Mayo Clinic',
        description: 'Leading neurologist specializing in brain and nervous system disorders.',
        rating: 4.7,
        reviews: 198
      },
      { 
        name: 'Dr. Lisa Anderson', 
        specialty: 'Orthopedic Surgeon', 
        price: 200, 
        image: 'https://img.freepik.com/free-photo/female-doctor-looking-camera_23-2148816293.jpg',
        experience: 14,
        education: 'MD, Cleveland Clinic',
        description: 'Expert in bone, joint, and muscle surgeries.',
        rating: 4.8,
        reviews: 267
      },
      { 
        name: 'Dr. Robert Taylor', 
        specialty: 'Psychiatrist', 
        price: 130, 
        image: 'https://img.freepik.com/free-photo/confident-male-doctor-standing-with-arms-crossed_1262-6256.jpg',
        experience: 11,
        education: 'MD, Yale School of Medicine',
        description: 'Compassionate psychiatrist helping patients with mental health.',
        rating: 4.5,
        reviews: 156
      }
    ]);
    res.json({ message: 'Database Seeded Successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));