import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Eye, EyeOff, AlertCircle, CheckCircle } from 'lucide-react';

const LoginPage: React.FC = () => {
  const { login, isLoading, isAuthenticated } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  
  const destination = location.state?.from?.pathname || '/profile';
  
  // Cleanly capture the verification success state passed from VerifyPage
  const isVerified = location.state?.verified;
  const successMessage = location.state?.message;

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (isAuthenticated) {
      navigate(destination, { replace: true });
    }
  }, [isAuthenticated, destination, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    
    if (!email.trim() || !password.trim()) {
      setError('Enter your email and password');
      return;
    }
    
    if (!emailRegex.test(email)) {
      setError('Enter a valid email address');
      return;
    }

    const result = await login(email, password);
    
    if (result.success) {
      navigate(destination, { replace: true });
    } else {
      setError(result.message || 'We cannot find an account with that email address and password');
    }
  };

  return (
    <div className="min-h-screen bg-white font-sans text-[#111] flex flex-col selection:bg-sky-200">
      
      {/* Header */}
      <div className="w-full bg-[#131921] py-2.5 px-5 flex items-center justify-between border-b border-white/10">
        <Link to="/" className="select-none outline-none flex flex-col items-start">
          <div className="flex items-center">
            <span className="text-[22px] font-black text-white tracking-tight">CC</span>
            <span className="ml-1 text-[22px] font-light text-sky-400 tracking-tight">Ecom</span>
          </div>
          <p className="text-[9px] tracking-[1px] uppercase text-zinc-400 -mt-0.5">
            Counci Croff
          </p>
        </Link>

        <div className="flex items-center gap-5 text-white text-sm">
          <div className="flex items-center gap-1.5">
            <span className="text-emerald-400">🇵🇭</span>
            <span className="font-medium text-[13px] hidden sm:block">Philippine Marketplace</span>
          </div>
          <Link 
            to="/register" 
            className="hover:text-sky-400 transition-colors font-medium text-[13px]"
          >
            Register
          </Link>
        </div>
      </div>

      {/* Main Content */}
      <div className="w-full max-w-[380px] mx-auto px-4 flex-grow py-8">
        
        {/* Verification Success State */}
        {isVerified && !error && (
          <div className="mb-4 border border-[#008a00] rounded pl-4 pr-3 py-3 shadow-sm flex gap-3 items-start bg-[#f0f9f0] animate-fade-in">
            <CheckCircle className="w-6 h-6 text-[#008a00] shrink-0 mt-0.5" />
            <div>
              <h4 className="text-[#008a00] font-bold text-sm mb-0.5">Verification Complete</h4>
              <p className="text-sm text-[#111]">
                {successMessage || 'Account successfully verified! Please log in to access your account.'}
              </p>
            </div>
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="mb-4 border border-[#c40000] rounded pl-4 pr-3 py-3 shadow-sm flex gap-3 items-start bg-white animate-fade-in">
            <AlertCircle className="w-6 h-6 text-[#c40000] shrink-0 mt-0.5" />
            <div>
              <h4 className="text-[#c40000] font-bold text-sm mb-0.5">There was a problem</h4>
              <p className="text-sm text-[#111]">{error}</p>
            </div>
          </div>
        )}

        <div className="pt-2">
          <h1 className="text-[26px] leading-tight font-normal mb-6">Sign in</h1>
          
          <form onSubmit={handleSubmit} noValidate>
            <div className="mb-4">
              <label htmlFor="email" className="block text-[13px] font-bold mb-1">Email</label>
              <input
                id="email"
                type="email"
                value={email}
                required
                onChange={(e) => {
                  setEmail(e.target.value);
                  setError(null);
                }}
                disabled={isLoading}
                className="w-full px-3 py-2.5 border border-[#a6a6a6] rounded-[3px] focus:outline-none focus:shadow-[0_0_3px_2px_rgba(56,189,248,0.5)] text-sm transition-shadow"
              />
            </div>

            <div className="mb-6">
              <div className="flex justify-between items-center mb-1">
                <label htmlFor="password" className="block text-[13px] font-bold">Password</label>
                <Link to="/forgot-password" className="text-[13px] text-sky-600 hover:text-orange-500 hover:underline">
                  Forgot password?
                </Link>
              </div>
              <div className="relative">
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  required
                  onChange={(e) => {
                    setPassword(e.target.value);
                    setError(null);
                  }}
                  disabled={isLoading}
                  className="w-full px-3 py-2.5 border border-[#a6a6a6] rounded-[3px] focus:outline-none focus:shadow-[0_0_3px_2px_rgba(56,189,248,0.5)] text-sm transition-shadow pr-10"
                />
                <button 
                  type="button" 
                  onClick={() => setShowPassword(!showPassword)} 
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                  tabIndex={-1}
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            <button 
              type="submit" 
              disabled={isLoading}
              className="w-full bg-sky-400 hover:bg-sky-500 text-white text-sm py-3 rounded-[8px] font-medium transition-colors disabled:opacity-70 disabled:hover:bg-sky-400 flex justify-center items-center gap-2"
            >
              {isLoading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Signing in...
                </>
              ) : (
                'Sign in'
              )}
            </button>
          </form>

          {/* New to Ecom Divider */}
          <div className="mt-8 flex flex-col items-center">
            <div className="w-full relative flex justify-center items-center mb-4">
              <div className="w-full h-px bg-[#e7e7e7] absolute"></div>
              <span className="bg-white px-3 text-xs text-gray-500 relative z-10">New to CC Ecom?</span>
            </div>
            
            <Link 
              to="/register" 
              className="w-full text-center bg-white hover:bg-gray-50 text-[#111] text-[13px] py-2.5 rounded-[8px] border border-[#d5d9d9] font-medium shadow-[0_2px_5px_rgba(213,217,217,0.5)] transition-all"
            >
              Create your CC Ecom account
            </Link>
          </div>
        </div>
      </div>

      {/* Minimized Footer */}
      <footer className="mt-auto bg-[#131921] w-full text-[#cccccc] text-xs py-8 border-t border-gray-800">
        <div className="flex justify-center gap-6 mb-4 flex-wrap px-4">
          <Link to="/conditions" className="hover:underline">Conditions of Use</Link>
          <Link to="/privacy" className="hover:underline">Privacy Notice</Link>
          <Link to="/help" className="hover:underline">Help</Link>
        </div>
        <p className="text-center">© 2025-{new Date().getFullYear()}, CC Ecom, Intercullom.</p>
      </footer>
    </div>
  );
};

export default LoginPage;
