import { useEffect, useState, useRef } from 'react';
import { doctorsAPI, seedAPI } from '../services/api';
import DoctorCard from '../components/DoctorCard';
import LoadingSpinner from '../components/LoadingSpinner';

export default function Home() {
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSpecialty, setSelectedSpecialty] = useState('');
  const [seeding, setSeeding] = useState(false);
  const searchTimeoutRef = useRef(null);
  const initialLoadRef = useRef(true);

  // Initial load on mount
  useEffect(() => {
    if (initialLoadRef.current) {
      initialLoadRef.current = false;
      fetchDoctors();
    }
  }, []);

  // Refetch when search/filter changes
  useEffect(() => {
    if (!initialLoadRef.current) {
      // Clear previous timeout
      if (searchTimeoutRef.current) {
        clearTimeout(searchTimeoutRef.current);
      }

      // Debounce search term
      searchTimeoutRef.current = setTimeout(() => {
        fetchDoctors();
      }, searchTerm ? 500 : 0); // 500ms delay for search, immediate for filter

      return () => {
        if (searchTimeoutRef.current) {
          clearTimeout(searchTimeoutRef.current);
        }
      };
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchTerm, selectedSpecialty]);

  const fetchDoctors = async () => {
    setLoading(true);
    setError('');
    try {
      const params = {};
      if (searchTerm) params.search = searchTerm;
      if (selectedSpecialty) params.specialty = selectedSpecialty;
      
      const res = await doctorsAPI.getAll(params);
      setDoctors(res.data || []);
    } catch (error) {
      console.error('Error fetching doctors:', error);
      setError(error.response?.data?.error || error.message || 'Failed to load doctors. Please check if the backend server is running.');
      setDoctors([]);
    } finally {
      setLoading(false);
    }
  };

  const handleSeedDatabase = async () => {
    setSeeding(true);
    setError('');
    try {
      await seedAPI.seed();
      // Wait a moment for database to update
      setTimeout(() => {
        fetchDoctors();
        setSeeding(false);
      }, 500);
    } catch (error) {
      console.error('Error seeding database:', error);
      setError(error.response?.data?.error || error.message || 'Failed to seed database.');
      setSeeding(false);
    }
  };

  const specialties = doctors.length > 0 ? [...new Set(doctors.map(doc => doc.specialty).filter(Boolean))] : [];

  return (
    <div className="w-full overflow-x-hidden">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-6 sm:py-8 md:py-12 lg:py-16 mb-4 sm:mb-6 md:mb-8 lg:mb-12 rounded-lg sm:rounded-xl md:rounded-2xl shadow-xl px-3 sm:px-4 md:px-6">
        <div className="text-center max-w-3xl mx-auto">
          <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold mb-2 sm:mb-3 md:mb-4 leading-tight">Find Your Perfect Doctor</h1>
          <p className="text-sm sm:text-base md:text-lg lg:text-xl text-blue-100 mb-2 sm:mb-4 md:mb-6 lg:mb-8 px-2">
            Book appointments with top specialists in minutes
          </p>
        </div>
      </div>

      {/* Search and Filter Section */}
      <div className="bg-white rounded-lg sm:rounded-xl shadow-lg p-3 sm:p-4 md:p-6 mb-4 sm:mb-6 md:mb-8 relative z-10">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
          <div className="relative z-0">
            <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1.5 sm:mb-2">
              Search Doctors
            </label>
            <input
              type="text"
              placeholder="Search by name or specialty..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-3 sm:px-4 py-2.5 sm:py-2.5 text-base sm:text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 touch-manipulation min-h-[44px]"
            />
          </div>
          <div className="relative z-0">
            <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1.5 sm:mb-2">
              Filter by Specialty
            </label>
            <select
              value={selectedSpecialty}
              onChange={(e) => setSelectedSpecialty(e.target.value)}
              className="w-full px-3 sm:px-4 py-2.5 sm:py-2.5 text-base sm:text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white appearance-none touch-manipulation min-h-[44px]"
              style={{ WebkitAppearance: 'none', MozAppearance: 'none' }}
            >
              <option value="">All Specialties</option>
              {specialties.map((specialty) => (
                <option key={specialty} value={specialty}>
                  {specialty}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div className="bg-red-50 border-l-4 border-red-500 text-red-700 p-4 mb-6 rounded-lg">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium">{error}</p>
              <p className="mt-2 text-sm">
                Make sure the backend server is running on port 5000. 
                <button 
                  onClick={fetchDoctors}
                  className="ml-2 text-red-600 underline hover:text-red-800"
                >
                  Try again
                </button>
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Doctors Grid */}
      {loading ? (
        <div className="flex justify-center items-center py-12 sm:py-20">
          <LoadingSpinner size="lg" />
        </div>
      ) : error ? null : doctors.length > 0 ? (
        <>
          <h2 className="text-xl sm:text-2xl md:text-3xl font-bold mb-3 sm:mb-4 md:mb-6 text-gray-800 px-2 sm:px-0">
            {searchTerm || selectedSpecialty ? 'Search Results' : 'Top Specialists'}
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 md:gap-6 lg:gap-8">
            {doctors.map((doctor) => (
              <DoctorCard key={doctor._id} doctor={doctor} />
            ))}
          </div>
        </>
      ) : (
        <div className="text-center py-8 sm:py-12 bg-white rounded-xl shadow-md px-4">
          <p className="text-gray-600 text-base sm:text-lg mb-4">No doctors found.</p>
          {!searchTerm && !selectedSpecialty && (
            <div>
              <p className="text-gray-500 text-sm mb-4">
                The database is empty. Click the button below to add sample doctors:
              </p>
              <button
                onClick={handleSeedDatabase}
                disabled={seeding}
                className="inline-flex items-center justify-center bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 active:bg-blue-800 transition disabled:opacity-50 disabled:cursor-not-allowed text-sm sm:text-base font-semibold min-h-[44px] touch-manipulation"
              >
                {seeding ? (
                  <>
                    <LoadingSpinner size="sm" />
                    <span className="ml-2">Seeding Database...</span>
                  </>
                ) : (
                  'Seed Database'
                )}
              </button>
              <p className="text-gray-400 text-xs mt-3">
                This will add 6 sample doctors to the database
              </p>
            </div>
          )}
          {(searchTerm || selectedSpecialty) && (
            <div>
              <p className="text-gray-500 text-sm mb-3">No doctors match your search criteria.</p>
              <button
                onClick={() => {
                  setSearchTerm('');
                  setSelectedSpecialty('');
                }}
                className="text-blue-600 hover:text-blue-800 underline text-sm font-medium"
              >
                Clear filters
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}