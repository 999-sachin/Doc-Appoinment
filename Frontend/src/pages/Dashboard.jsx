import { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { appointmentsAPI } from '../services/api';
import AppointmentCard from '../components/AppointmentCard';
import LoadingSpinner from '../components/LoadingSpinner';

export default function Dashboard() {
  const { user, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!authLoading && !user) {
      navigate('/login');
    }
  }, [user, authLoading, navigate]);

  useEffect(() => {
    if (user) {
      fetchAppointments();
    }
  }, [user]);

  const fetchAppointments = async () => {
    try {
      const res = await appointmentsAPI.getAll({ userId: user.id });
      setAppointments(res.data);
    } catch (error) {
      console.error('Error fetching appointments:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = async (id) => {
    if (window.confirm('Are you sure you want to cancel this appointment?')) {
      try {
        await appointmentsAPI.cancel(id);
        fetchAppointments();
      } catch (error) {
        alert('Error cancelling appointment');
      }
    }
  };

  if (authLoading || loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (!user) return null;

  const upcomingAppointments = appointments.filter(
    (apt) => apt.status !== 'cancelled' && apt.status !== 'completed'
  );
  const pastAppointments = appointments.filter(
    (apt) => apt.status === 'completed' || apt.status === 'cancelled'
  );

  return (
    <div className="max-w-6xl mx-auto py-4 sm:py-6 md:py-8 px-4 sm:px-6">
      <div className="mb-6 sm:mb-8">
        <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-800 mb-2">
          Welcome back, {user.name}!
        </h1>
        <p className="text-gray-600 text-sm sm:text-base">Manage your appointments and health records</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6 mb-6 sm:mb-8">
        <div className="bg-blue-500 text-white p-4 sm:p-6 rounded-xl shadow-lg">
          <h3 className="text-xl sm:text-2xl font-bold">{upcomingAppointments.length}</h3>
          <p className="text-blue-100 text-sm sm:text-base">Upcoming Appointments</p>
        </div>
        <div className="bg-green-500 text-white p-4 sm:p-6 rounded-xl shadow-lg">
          <h3 className="text-xl sm:text-2xl font-bold">{pastAppointments.length}</h3>
          <p className="text-green-100 text-sm sm:text-base">Past Appointments</p>
        </div>
        <div className="bg-purple-500 text-white p-4 sm:p-6 rounded-xl shadow-lg">
          <h3 className="text-xl sm:text-2xl font-bold">{appointments.length}</h3>
          <p className="text-purple-100 text-sm sm:text-base">Total Appointments</p>
        </div>
      </div>

      {upcomingAppointments.length > 0 && (
        <div className="mb-8 sm:mb-12">
          <h2 className="text-xl sm:text-2xl font-bold text-gray-800 mb-4 sm:mb-6">Upcoming Appointments</h2>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
            {upcomingAppointments.map((appointment) => (
              <AppointmentCard
                key={appointment._id}
                appointment={appointment}
                onCancel={handleCancel}
              />
            ))}
          </div>
        </div>
      )}

      {pastAppointments.length > 0 && (
        <div>
          <h2 className="text-xl sm:text-2xl font-bold text-gray-800 mb-4 sm:mb-6">Past Appointments</h2>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
            {pastAppointments.map((appointment) => (
              <AppointmentCard key={appointment._id} appointment={appointment} />
            ))}
          </div>
        </div>
      )}

      {appointments.length === 0 && (
        <div className="text-center py-8 sm:py-12 bg-white rounded-xl shadow-md px-4">
          <p className="text-gray-600 text-base sm:text-lg mb-4">You don't have any appointments yet.</p>
          <a
            href="/"
            className="inline-block bg-blue-600 text-white px-4 sm:px-6 py-2 sm:py-3 rounded-lg hover:bg-blue-700 transition text-sm sm:text-base"
          >
            Book Your First Appointment
          </a>
        </div>
      )}
    </div>
  );
}

