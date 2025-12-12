import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer className="bg-gray-800 text-white mt-12 sm:mt-16 md:mt-20">
      <div className="container mx-auto px-3 sm:px-4 md:px-6 py-6 sm:py-8 md:py-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
          <div className="sm:col-span-2 lg:col-span-1">
            <h3 className="text-xl sm:text-2xl font-bold mb-3 sm:mb-4">CureConnect 🩺</h3>
            <p className="text-gray-400 text-sm sm:text-base">
              Your trusted healthcare partner. Book appointments with top specialists easily and securely.
            </p>
          </div>
          
          <div>
            <h4 className="text-base sm:text-lg font-semibold mb-3 sm:mb-4">Quick Links</h4>
            <ul className="space-y-2">
              <li>
                <Link to="/" className="text-gray-400 hover:text-white transition text-sm sm:text-base">
                  Find Doctors
                </Link>
              </li>
              <li>
                <Link to="/about" className="text-gray-400 hover:text-white transition text-sm sm:text-base">
                  About Us
                </Link>
              </li>
              <li>
                <Link to="/contact" className="text-gray-400 hover:text-white transition text-sm sm:text-base">
                  Contact
                </Link>
              </li>
            </ul>
          </div>
          
          <div>
            <h4 className="text-base sm:text-lg font-semibold mb-3 sm:mb-4">Services</h4>
            <ul className="space-y-2 text-gray-400 text-sm sm:text-base">
              <li>Online Booking</li>
              <li>24/7 Support</li>
              <li>Health Records</li>
              <li>Telemedicine</li>
            </ul>
          </div>
          
          <div className="sm:col-span-2 lg:col-span-1">
            <h4 className="text-base sm:text-lg font-semibold mb-3 sm:mb-4">Contact</h4>
            <ul className="space-y-2 text-gray-400 text-sm sm:text-base">
              <li className="break-words">Email: singhsachin4636@gmail.com</li>
              <li>Phone: +91 7898168568</li>
              <li>Address: 123 Health St, Medical City Rewa, madhya pradesh</li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-gray-700 mt-6 sm:mt-8 pt-6 sm:pt-8 text-center text-gray-400 text-sm sm:text-base">
          <p>&copy; {new Date().getFullYear()} CureConnect. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}

