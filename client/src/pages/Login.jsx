import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import InputField from '../components/InputField';
import { LogIn, Compass, ArrowRight } from 'lucide-react';

const Login = () => {
  const { loginUser } = useAuth();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState(null);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg(null);

    const success = await loginUser(formData.email, formData.password);
    setLoading(false);

    if (success) {
      navigate('/dashboard');
    } else {
      setErrorMsg('Invalid email or password. Please try again.');
    }
  };

  return (
    <div className="relative min-h-[calc(100vh-4rem)] flex items-center justify-center px-4 py-12">
      <div className="glow-bubble h-[300px] w-[300px] bg-cosmic-800/10 top-1/4 left-1/4"></div>

      <div className="glass-panel w-full max-w-md rounded-2xl p-6 sm:p-8 relative z-10 border border-slate-800 bg-mystic-900/40 shadow-xl">
        <div className="text-center mb-6">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-tr from-cosmic-600 to-gem-ruby text-slate-100 shadow-glow-sm mb-4">
            <Compass className="h-6 w-6" />
          </div>
          <h2 className="font-serif text-2xl font-bold text-slate-150">Welcome Back</h2>
          <p className="text-xs text-slate-400 mt-1">Sign in to retrieve your saved birth charts and reports</p>
        </div>

        {errorMsg && (
          <div className="mb-4 rounded-lg bg-red-950/40 border border-red-900/60 p-3 text-xs text-red-400">
            {errorMsg}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <InputField
            label="Email Address"
            name="email"
            type="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="you@example.com"
            required
          />

          <InputField
            label="Password"
            name="password"
            type="password"
            value={formData.password}
            onChange={handleChange}
            placeholder="••••••••"
            required
          />

          <button
            type="submit"
            disabled={loading}
            className="w-full flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-cosmic-600 to-cosmic-700 py-3 text-sm font-bold text-slate-100 shadow-glow-sm hover:from-cosmic-500 hover:to-cosmic-600 transition-all cursor-pointer disabled:opacity-50"
          >
            {loading ? 'Signing In...' : 'Sign In'}
            {!loading && <ArrowRight className="h-4 w-4" />}
          </button>
        </form>

        <div className="text-center mt-6 text-xs text-slate-450">
          Don't have an account?{' '}
          <Link to="/register" className="text-cosmic-400 font-semibold hover:text-cosmic-300 transition-colors">
            Register here
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Login;
