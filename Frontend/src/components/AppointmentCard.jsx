export default function AppointmentCard({ appointment, onCancel }) {
  const statusColors = {
    confirmed: 'bg-green-100 text-green-800',
    pending: 'bg-yellow-100 text-yellow-800',
    completed: 'bg-blue-100 text-blue-800',
    cancelled: 'bg-red-100 text-red-800',
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-4 sm:p-6 border-l-4 border-blue-500">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start mb-3 sm:mb-4 gap-2">
        <div className="flex-1">
          <h3 className="text-lg sm:text-xl font-bold text-gray-800">
            {appointment.doctorId?.name || 'Doctor'}
          </h3>
          <p className="text-blue-600 font-medium text-sm sm:text-base">
            {appointment.doctorId?.specialty || 'Specialty'}
          </p>
        </div>
        <span
          className={`px-2 sm:px-3 py-1 rounded-full text-xs font-semibold self-start ${statusColors[appointment.status] || statusColors.pending}`}
        >
          {appointment.status?.toUpperCase()}
        </span>
      </div>
      
      <div className="space-y-2 mb-3 sm:mb-4">
        <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2 text-gray-600 text-sm sm:text-base">
          <span className="font-semibold">Date:</span>
          <span>{appointment.date}</span>
        </div>
        <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2 text-gray-600 text-sm sm:text-base">
          <span className="font-semibold">Time:</span>
          <span>{appointment.time}</span>
        </div>
        <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2 text-gray-600 text-sm sm:text-base">
          <span className="font-semibold">Patient:</span>
          <span>{appointment.patientName}</span>
        </div>
        {appointment.notes && (
          <div className="mt-3 p-2 sm:p-3 bg-gray-50 rounded">
            <p className="text-xs sm:text-sm text-gray-700">{appointment.notes}</p>
          </div>
        )}
      </div>
      
      {appointment.status !== 'cancelled' && appointment.status !== 'completed' && onCancel && (
        <button
          onClick={() => onCancel(appointment._id)}
          className="w-full mt-3 sm:mt-4 bg-red-500 text-white py-2 rounded-lg hover:bg-red-600 transition-colors text-sm sm:text-base"
        >
          Cancel Appointment
        </button>
      )}
    </div>
  );
}

