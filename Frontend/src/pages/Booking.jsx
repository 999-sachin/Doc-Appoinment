import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { doctorsAPI, appointmentsAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';
import LoadingSpinner from '../components/LoadingSpinner';

export default function Booking() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [doctor, setDoctor] = useState(null);
  const [loading, setLoading] = useState(true);
  const [availableSlots, setAvailableSlots] = useState([]);
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [selectedTime, setSelectedTime] = useState(null);
  const [formData, setFormData] = useState({
    patientName: user?.name || '',
    patientEmail: user?.email || '',
    patientPhone: '',
    notes: '',
  });
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchDoctor();
  }, [id]);

  useEffect(() => {
    if (doctor && selectedDate) {
      fetchAvailableSlots();
    }
  }, [doctor, selectedDate]);

  const fetchDoctor = async () => {
    try {
      const res = await doctorsAPI.getById(id);
      setDoctor(res.data);
    } catch (error) {
      console.error('Error fetching doctor:', error);
      setError('Doctor not found');
    } finally {
      setLoading(false);
    }
  };

  const fetchAvailableSlots = async () => {
    try {
      const res = await doctorsAPI.getAvailableSlots(id, selectedDate);
      setAvailableSlots(res.data.available || []);
    } catch (error) {
      console.error('Error fetching slots:', error);
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleBooking = async (e) => {
    e.preventDefault();
    setError('');
    
    if (!selectedTime) {
      setError('Please select a time slot');
      return;
    }
    
    if (!formData.patientName || !formData.patientEmail) {
      setError('Please fill in all required fields');
      return;
    }

    setSubmitting(true);
    try {
      await appointmentsAPI.create({
        doctorId: id,
        userId: user?.id || null,
        patientName: formData.patientName,
        patientEmail: formData.patientEmail,
        patientPhone: formData.patientPhone,
        date: selectedDate,
        time: selectedTime,
        notes: formData.notes,
      });
      
      if (user) {
        navigate('/dashboard');
      } else {
        navigate('/');
      }
      alert('Appointment booked successfully!');
    } catch (error) {
      setError(error.response?.data?.message || 'Error booking appointment');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (!doctor) {
    return (
      <div className="text-center mt-10">
        <p className="text-red-600 text-lg mb-4">Doctor not found</p>
        <button
          onClick={() => navigate('/')}
          className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700"
        >
          Go Back Home
        </button>
      </div>
    );
  }

  const minDate = new Date().toISOString().split('T')[0];

  return (
    <div className="max-w-4xl mx-auto py-4 sm:py-6 md:py-8 px-3 sm:px-4 md:px-6 w-full overflow-x-hidden">
      {/* Doctor Info Card */}
      <div className="bg-white rounded-lg sm:rounded-xl shadow-lg p-3 sm:p-4 md:p-6 mb-4 sm:mb-6 md:mb-8">
        <div className="flex flex-col sm:flex-row gap-4 sm:gap-6">
          <img
            src={doctor.image}
            alt={doctor.name}
            className="w-full sm:w-40 md:w-48 h-48 sm:h-40 md:h-48 object-cover rounded-lg mx-auto sm:mx-0"
          />
          <div className="flex-1 text-center sm:text-left">
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-2">{doctor.name}</h2>
            <p className="text-blue-600 text-lg sm:text-xl font-semibold mb-2 sm:mb-3">{doctor.specialty}</p>
            {doctor.experience && (
              <p className="text-gray-600 text-sm sm:text-base mb-2">{doctor.experience} years of experience</p>
            )}
            {doctor.description && (
              <p className="text-gray-600 text-sm sm:text-base mb-3 hidden sm:block">{doctor.description}</p>
            )}
            <div className="flex items-center justify-center sm:justify-start gap-3 sm:gap-4">
              <span className="text-xl sm:text-2xl font-bold text-gray-800">${doctor.price}</span>
              <span className="text-gray-600 text-sm sm:text-base">per consultation</span>
            </div>
          </div>
        </div>
      </div>

      {/* Booking Form */}
      <div className="bg-white rounded-lg sm:rounded-xl shadow-lg p-3 sm:p-4 md:p-6 lg:p-8">
        <h3 className="text-lg sm:text-xl md:text-2xl font-bold text-gray-800 mb-3 sm:mb-4 md:mb-6">Book Your Appointment</h3>
        
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-3 sm:px-4 py-2 sm:py-3 rounded mb-4 sm:mb-6 text-sm sm:text-base">
            {error}
          </div>
        )}

        <form onSubmit={handleBooking} className="space-y-4 sm:space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Select Date <span className="text-red-500">*</span>
            </label>
            <input
              type="date"
              min={minDate}
              value={selectedDate}
              onChange={(e) => {
                setSelectedDate(e.target.value);
                setSelectedTime(null);
              }}
              className="w-full px-3 sm:px-4 py-2.5 sm:py-2 text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 min-h-[44px] touch-manipulation"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Available Time Slots <span className="text-red-500">*</span>
            </label>
            {availableSlots.length > 0 ? (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2 sm:gap-3">
                {availableSlots.map((slot) => (
                  <button
                    key={slot}
                    type="button"
                    onClick={() => setSelectedTime(slot)}
                    className={`p-2.5 sm:p-3 rounded-lg border-2 text-center font-medium transition text-sm sm:text-base min-h-[44px] touch-manipulation
                      ${
                        selectedTime === slot
                          ? 'bg-blue-600 text-white border-blue-600'
                          : 'bg-gray-50 border-gray-300 hover:border-blue-500 hover:bg-blue-50 active:bg-blue-100'
                      }
                    `}
                  >
                    {slot}
                  </button>
                ))}
              </div>
            ) : (
              <p className="text-gray-500 text-sm sm:text-base">No available slots for this date. Please select another date.</p>
            )}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Patient Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="patientName"
                value={formData.patientName}
                onChange={handleChange}
                className="w-full px-3 sm:px-4 py-2.5 sm:py-2 text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 min-h-[44px] touch-manipulation"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email <span className="text-red-500">*</span>
              </label>
              <input
                type="email"
                name="patientEmail"
                value={formData.patientEmail}
                onChange={handleChange}
                className="w-full px-3 sm:px-4 py-2.5 sm:py-2 text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 min-h-[44px] touch-manipulation"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Phone Number
            </label>
            <input
              type="tel"
              name="patientPhone"
              value={formData.patientPhone}
              onChange={handleChange}
              className="w-full px-3 sm:px-4 py-2.5 sm:py-2 text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 min-h-[44px] touch-manipulation"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Additional Notes (Optional)
            </label>
            <textarea
              name="notes"
              value={formData.notes}
              onChange={handleChange}
              rows="4"
              className="w-full px-3 sm:px-4 py-2.5 sm:py-2 text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 touch-manipulation resize-y"
              placeholder="Any special requirements or notes..."
            ></textarea>
          </div>

          <button
            type="submit"
            disabled={submitting || !selectedTime}
            className="w-full bg-green-600 text-white py-3 sm:py-3.5 rounded-lg font-bold hover:bg-green-700 active:bg-green-800 transition disabled:opacity-50 disabled:cursor-not-allowed text-sm sm:text-base min-h-[48px] touch-manipulation"
          >
            {submitting ? <LoadingSpinner size="sm" /> : 'Confirm Booking'}
          </button>
        </form>
      </div>
    </div>
  );
}