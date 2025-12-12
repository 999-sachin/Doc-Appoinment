import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/');
    setMobileMenuOpen(false);
  };

  return (
    <nav className="bg-blue-600 text-white shadow-lg sticky top-0 z-50">
      <div className="container mx-auto px-3 sm:px-4">
        <div className="flex justify-between items-center py-4">
          <Link to="/" className="text-xl sm:text-2xl font-bold hover:text-blue-200 transition">
            CureConnect 🩺
          </Link>
          
          {/* Desktop Menu */}
          <div className="hidden lg:flex items-center gap-6">
            <Link to="/" className="hover:text-blue-200 transition font-medium">
              Find Doctors
            </Link>
            <Link to="/about" className="hover:text-blue-200 transition font-medium">
              About
            </Link>
            <Link to="/contact" className="hover:text-blue-200 transition font-medium">
              Contact
            </Link>
            {user ? (
              <>
                <Link
                  to="/dashboard"
                  className="hover:text-blue-200 transition font-medium"
                >
                  Dashboard
                </Link>
                <div className="flex items-center gap-3">
                  <span className="text-blue-100 text-sm">Hi, {user.name}</span>
                  <button
                    onClick={handleLogout}
                    className="bg-blue-700 hover:bg-blue-800 px-3 py-1.5 sm:px-4 sm:py-2 rounded-lg transition font-medium text-sm sm:text-base"
                  >
                    Logout
                  </button>
                </div>
              </>
            ) : (
              <div className="flex items-center gap-3">
                <Link
                  to="/login"
                  className="hover:text-blue-200 transition font-medium"
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  className="bg-blue-700 hover:bg-blue-800 px-3 py-1.5 sm:px-4 sm:py-2 rounded-lg transition font-medium text-sm sm:text-base"
                >
                  Sign Up
                </Link>
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-2 rounded-md hover:bg-blue-700 focus:outline-none"
            aria-label="Toggle menu"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              {mobileMenuOpen ? (
                <path d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="lg:hidden pb-4 border-t border-blue-500 mt-2 pt-4">
            <div className="flex flex-col space-y-3">
              <Link
                to="/"
                onClick={() => setMobileMenuOpen(false)}
                className="hover:text-blue-200 transition font-medium py-2"
              >
                Find Doctors
              </Link>
              <Link
                to="/about"
                onClick={() => setMobileMenuOpen(false)}
                className="hover:text-blue-200 transition font-medium py-2"
              >
                About
              </Link>
              <Link
                to="/contact"
                onClick={() => setMobileMenuOpen(false)}
                className="hover:text-blue-200 transition font-medium py-2"
              >
                Contact
              </Link>
              {user ? (
                <>
                  <Link
                    to="/dashboard"
                    onClick={() => setMobileMenuOpen(false)}
                    className="hover:text-blue-200 transition font-medium py-2"
                  >
                    Dashboard
                  </Link>
                  <div className="pt-2 border-t border-blue-500">
                    <p className="text-blue-100 mb-2">Hi, {user.name}</p>
                    <button
                      onClick={handleLogout}
                      className="w-full bg-blue-700 hover:bg-blue-800 px-4 py-2 rounded-lg transition font-medium text-left"
                    >
                      Logout
                    </button>
                  </div>
                </>
              ) : (
                <div className="flex flex-col gap-2 pt-2 border-t border-blue-500">
                  <Link
                    to="/login"
                    onClick={() => setMobileMenuOpen(false)}
                    className="hover:text-blue-200 transition font-medium py-2"
                  >
                    Login
                  </Link>
                  <Link
                    to="/register"
                    onClick={() => setMobileMenuOpen(false)}
                    className="bg-blue-700 hover:bg-blue-800 px-4 py-2 rounded-lg transition font-medium text-center"
                  >
                    Sign Up
                  </Link>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}