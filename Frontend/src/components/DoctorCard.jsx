import { Link } from 'react-router-dom';

export default function DoctorCard({ doctor }) {
  return (
    <div className="bg-white rounded-lg sm:rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden group w-full">
      <div className="relative overflow-hidden">
        <img
          src={doctor.image}
          alt={doctor.name}
          className="w-full h-40 sm:h-48 md:h-56 lg:h-64 object-cover group-hover:scale-110 transition-transform duration-300"
        />
        <div className="absolute top-2 sm:top-3 md:top-4 right-2 sm:right-3 md:right-4 bg-white px-2 sm:px-2.5 md:px-3 py-0.5 sm:py-1 rounded-full shadow-md">
          <span className="text-blue-600 font-semibold text-xs sm:text-sm md:text-base">${doctor.price}</span>
        </div>
      </div>
      
      <div className="p-3 sm:p-4 md:p-5 lg:p-6">
        <h3 className="text-base sm:text-lg md:text-xl font-bold text-gray-800 mb-1 sm:mb-2 leading-tight">{doctor.name}</h3>
        <p className="text-blue-600 font-semibold mb-2 sm:mb-3 text-xs sm:text-sm md:text-base">{doctor.specialty}</p>
        
        {doctor.rating > 0 && (
          <div className="flex items-center gap-1.5 sm:gap-2 mb-2 sm:mb-3">
            <span className="text-yellow-400 text-base sm:text-lg md:text-xl">⭐</span>
            <span className="text-gray-700 font-medium text-xs sm:text-sm md:text-base">{doctor.rating}</span>
            <span className="text-gray-500 text-xs sm:text-sm">({doctor.reviews} reviews)</span>
          </div>
        )}
        
        {doctor.experience && (
          <p className="text-gray-600 text-xs sm:text-sm mb-2 sm:mb-3">{doctor.experience} years experience</p>
        )}
        
        {doctor.description && (
          <p className="text-gray-600 text-xs sm:text-sm mb-3 sm:mb-4 line-clamp-2">{doctor.description}</p>
        )}
        
        <Link
          to={`/book/${doctor._id}`}
          className="flex w-full items-center justify-center bg-blue-600 text-white py-2.5 sm:py-2.5 md:py-3 rounded-lg font-semibold hover:bg-blue-700 active:bg-blue-800 transition-colors text-sm sm:text-base min-h-[44px] touch-manipulation"
        >
          Book Appointment
        </Link>
      </div>
    </div>
  );
}

