import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import LoadingSpinner from '../components/LoadingSpinner';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const params = new URLSearchParams(location.search);
  const next = params.get('next');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    const result = await login(email.trim(), password);
    setLoading(false);

    if (result.success) {
      navigate(next || '/dashboard');
    } else {
      setError(result.error);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 py-12 px-4">
      <div className="w-full max-w-3xl bg-white rounded-2xl shadow-xl overflow-hidden grid grid-cols-1 md:grid-cols-2">
        <div className="hidden md:block bg-blue-600 p-8 flex flex-col justify-center">
          <h2 className="text-white text-3xl font-extrabold mb-2">Welcome back</h2>
          <p className="text-blue-100">Sign in to manage your appointments and records.</p>
          <div className="mt-6">
            <img src="/assets/doctor-illustration.png" alt="illustration" className="w-48 opacity-90" />
          </div>
        </div>

        <div className="p-8 md:p-10">
          <h3 className="text-2xl font-bold text-gray-800">Sign in to CureConnect</h3>
          <p className="mt-2 text-sm text-gray-600">Or <Link to={`/register${next ? `?next=${encodeURIComponent(next)}` : ''}`} className="text-blue-600 font-medium">create a new account</Link></p>

          <form className="mt-6 space-y-5" onSubmit={handleSubmit}>
            {error && (
              <div className="text-sm text-red-700 bg-red-50 border border-red-100 px-3 py-2 rounded">
                {error}
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full border border-gray-200 rounded-md px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="you@example.com"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="w-full border border-gray-200 rounded-md px-4 py-3 pr-14 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Enter your password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-2 top-1/2 -translate-y-1/2 text-sm text-gray-600 px-2 py-1 rounded-md hover:bg-gray-100"
                >
                  {showPassword ? 'Hide' : 'Show'}
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <input id="remember" type="checkbox" className="h-4 w-4 text-blue-600" />
                <label htmlFor="remember" className="text-sm text-gray-600">Remember me</label>
              </div>
              <Link to="/forgot" className="text-sm text-blue-600">Forgot?</Link>
            </div>

            <div>
              <button
                type="submit"
                disabled={loading}
                className="w-full inline-flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-md px-4 py-3 disabled:opacity-60"
              >
                {loading ? <LoadingSpinner size="sm" /> : 'Sign in'}
              </button>
            </div>

            <div className="text-center text-sm text-gray-500">
              By signing in you agree to our <a className="text-blue-600">Terms</a>.
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

