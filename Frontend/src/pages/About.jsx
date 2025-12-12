export default function About() {
  return (
    <div className="max-w-4xl mx-auto py-6 sm:py-8 md:py-12 px-4 sm:px-6">
      <div className="text-center mb-8 sm:mb-12">
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-800 mb-3 sm:mb-4">About CureConnect</h1>
        <p className="text-base sm:text-lg md:text-xl text-gray-600 px-2">
          Your trusted healthcare partner for seamless medical appointments
        </p>
      </div>

      <div className="bg-white rounded-xl shadow-lg p-4 sm:p-6 md:p-8 mb-6 sm:mb-8">
        <h2 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-3 sm:mb-4">Our Mission</h2>
        <p className="text-gray-700 leading-relaxed mb-3 sm:mb-4 text-sm sm:text-base">
          At CureConnect, we believe that accessing quality healthcare should be simple, 
          convenient, and stress-free. Our platform connects patients with top medical 
          professionals, making it easier than ever to book appointments, manage your 
          health records, and receive the care you deserve.
        </p>
        <p className="text-gray-700 leading-relaxed text-sm sm:text-base">
          We're committed to revolutionizing the healthcare experience by leveraging 
          technology to bridge the gap between patients and healthcare providers.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 mb-6 sm:mb-8">
        <div className="bg-blue-50 rounded-xl p-4 sm:p-6">
          <div className="text-3xl sm:text-4xl mb-3 sm:mb-4">🎯</div>
          <h3 className="text-lg sm:text-xl font-bold text-gray-800 mb-2">Easy Booking</h3>
          <p className="text-gray-600 text-sm sm:text-base">
            Book appointments with top specialists in just a few clicks. 
            No more long waiting times or phone calls.
          </p>
        </div>
        <div className="bg-green-50 rounded-xl p-4 sm:p-6">
          <div className="text-3xl sm:text-4xl mb-3 sm:mb-4">🔒</div>
          <h3 className="text-lg sm:text-xl font-bold text-gray-800 mb-2">Secure & Private</h3>
          <p className="text-gray-600 text-sm sm:text-base">
            Your health information is protected with industry-leading security 
            measures and privacy protocols.
          </p>
        </div>
        <div className="bg-purple-50 rounded-xl p-4 sm:p-6 sm:col-span-2 lg:col-span-1">
          <div className="text-3xl sm:text-4xl mb-3 sm:mb-4">⭐</div>
          <h3 className="text-lg sm:text-xl font-bold text-gray-800 mb-2">Top Doctors</h3>
          <p className="text-gray-600 text-sm sm:text-base">
            Access to verified, experienced medical professionals across 
            various specialties.
          </p>
        </div>
      </div>

      <div className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl shadow-lg p-4 sm:p-6 md:p-8">
        <h2 className="text-2xl sm:text-3xl font-bold mb-3 sm:mb-4">Why Choose CureConnect?</h2>
        <ul className="space-y-2 sm:space-y-3 text-sm sm:text-base md:text-lg">
          <li className="flex items-start">
            <span className="mr-2 sm:mr-3 flex-shrink-0">✓</span>
            <span>24/7 availability - Book appointments anytime, anywhere</span>
          </li>
          <li className="flex items-start">
            <span className="mr-2 sm:mr-3 flex-shrink-0">✓</span>
            <span>Transparent pricing - No hidden fees or surprises</span>
          </li>
          <li className="flex items-start">
            <span className="mr-2 sm:mr-3 flex-shrink-0">✓</span>
            <span>Comprehensive care - All specialties in one platform</span>
          </li>
          <li className="flex items-start">
            <span className="mr-2 sm:mr-3 flex-shrink-0">✓</span>
            <span>Patient-first approach - Your health is our priority</span>
          </li>
        </ul>
      </div>
    </div>
  );
}

