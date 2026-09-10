import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { ShieldAlert, ArrowLeft, RefreshCw, Lock, CheckCircle2, KeyRound, AlertCircle } from 'lucide-react';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'https://cc-backend-yc-team.onrender.com';
const AUTH_API_URL = `${API_BASE_URL}/api/v1/auth`;

type TwistType = 'REFRESH_3' | 'REVERSE' | 'APPEND_X';

const VerifyPage: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const registrationData = location.state;

  const [captchaInput, setCaptchaInput] = useState('');
  const [captchaCode, setCaptchaCode] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isVerifiedSuccess, setIsVerifiedSuccess] = useState(false);

  const [twistRule, setTwistRule] = useState<TwistType>('REVERSE');
  const [refreshCount, setRefreshCount] = useState(0);

  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    if (!registrationData) {
      navigate('/register', { replace: true });
    }
  }, [registrationData, navigate]);

  useEffect(() => {
    const twists: TwistType[] = ['REFRESH_3', 'REVERSE', 'APPEND_X'];
    const randomTwist = twists[Math.floor(Math.random() * twists.length)];
    setTwistRule(randomTwist);
    generateCaptcha(true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const generateCaptcha = (isInitial = false) => {
    const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
    let code = '';
    for (let i = 0; i < 5; i++) {
      code += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    setCaptchaCode(code);
    drawCaptcha(code);
    
    if (!isInitial) {
      setRefreshCount(prev => prev + 1);
    }
  };

  const drawCaptcha = (code: string) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.fillStyle = '#f8fafc';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    for (let i = 0; i < 6; i++) {
      ctx.strokeStyle = `rgba(${Math.random() * 150}, ${Math.random() * 150}, ${Math.random() * 150}, 0.5)`;
      ctx.beginPath();
      ctx.moveTo(Math.random() * canvas.width, Math.random() * canvas.height);
      ctx.lineTo(Math.random() * canvas.width, Math.random() * canvas.height);
      ctx.lineWidth = 1.5;
      ctx.stroke();
    }

    ctx.font = 'bold 24px monospace';
    ctx.textBaseline = 'middle';

    for (let i = 0; i < code.length; i++) {
      ctx.save();
      const x = 30 + i * 25;
      const y = canvas.height / 2 + (Math.random() * 6 - 3);
      const angle = (Math.random() - 0.5) * 0.4; 

      ctx.translate(x, y);
      ctx.rotate(angle);
      ctx.fillStyle = `rgb(${Math.floor(Math.random() * 100)}, ${Math.floor(Math.random() * 100)}, ${Math.floor(Math.random() * 150)})`;
      ctx.fillText(code[i], 0, 0);
      ctx.restore();
    }
  };

  const validateTwistLogic = (): string | null => {
    const input = captchaInput.toUpperCase().trim();
    
    if (twistRule === 'REFRESH_3') {
      if (refreshCount < 3) return `Anti-Bot Protocol Failed: You have refreshed ${refreshCount}/3 times.`;
      if (input !== captchaCode) return "The code does not match.";
    } 
    else if (twistRule === 'REVERSE') {
      const reversedCode = captchaCode.split('').reverse().join('');
      if (input !== reversedCode) return "Anti-Bot Protocol Failed: You did not enter the code backwards.";
    } 
    else if (twistRule === 'APPEND_X') {
      if (input !== captchaCode + 'X') return "Anti-Bot Protocol Failed: You forgot to add 'X' to the end.";
    }

    return null;
  };

  const handleVerifySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!captchaInput) {
      setError('Please enter the visual security code.');
      return;
    }

    const validationError = validateTwistLogic();
    if (validationError) {
      setError(validationError);
      generateCaptcha();
      setRefreshCount(0);
      setCaptchaInput('');
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await fetch(`${AUTH_API_URL}/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(registrationData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.detail || 'Registration failed.');
      }

      setIsVerifiedSuccess(true);

    } catch (err: any) {
      setError(err.message || 'An unexpected error occurred during account creation.');
      generateCaptcha();
      setRefreshCount(0);
      setCaptchaInput('');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleProceedToLogin = () => {
    navigate('/login', { 
      state: { message: 'Verification passed! Account fully created and verified in system.' } 
    });
  };

  const getTwistInstructions = () => {
    switch (twistRule) {
      case 'REFRESH_3':
        return "To prove you are human, click 'Refresh Code' exactly 3 times before typing the code below.";
      case 'REVERSE':
        return "To prove you are human, read the visual code below and type it entirely BACKWARDS.";
      case 'APPEND_X':
        return "To prove you are human, type the visual code below and add the letter 'X' at the very end.";
      default:
        return "";
    }
  };

  if (!registrationData) return null;

  return (
    <div className="min-h-screen bg-[#f3f4f6] font-sans text-[#111] flex flex-col selection:bg-sky-200 relative">
      
      <div className="w-full bg-[#131921] py-3 px-6 flex items-center justify-between border-b border-white/10 shadow-sm">
        <Link to="/" className="select-none outline-none flex flex-col items-start hover:opacity-90 transition-opacity">
          <div className="flex items-center">
            <span className="text-[26px] font-black text-white tracking-tight">CC</span>
            <span className="ml-1 text-[26px] font-light text-sky-400 tracking-tight">Ecom</span>
          </div>
          <p className="text-[10px] tracking-[1.5px] uppercase text-zinc-400 -mt-1 font-medium">
            Counci Croff
          </p>
        </Link>
      </div>

      <div className="w-full max-w-[420px] mx-auto px-4 flex-grow py-12">
        
        {error && (
          <div className="mb-6 border-l-4 border-[#c40000] bg-white rounded-r-md pl-4 pr-3 py-4 shadow-sm flex gap-3 items-start animate-in fade-in">
            <div className="text-[#c40000] shrink-0 mt-0.5"><AlertCircle size={18} /></div>
            <div>
              <h4 className="text-[#c40000] font-bold text-sm mb-0.5">Verification Error</h4>
              <p className="text-sm text-gray-700">{error}</p>
            </div>
          </div>
        )}

        <div className="bg-white border border-gray-200 rounded-[8px] shadow-sm p-7">
          <div className="mx-auto w-14 h-14 rounded-full bg-slate-100 flex items-center justify-center mb-5 text-slate-700 shadow-inner">
            <ShieldAlert size={28} />
          </div>

          <h1 className="text-[22px] font-bold mb-2 text-center text-gray-800">Final Security Check</h1>
          
          <div className="bg-sky-50 border border-sky-200 rounded p-3.5 mb-6 text-sm text-sky-900 leading-relaxed font-medium shadow-sm">
            <strong className="text-sky-700 uppercase text-xs tracking-wider block mb-1">Current Directive:</strong>
            {getTwistInstructions()}
            {twistRule === 'REFRESH_3' && (
              <span className="block mt-2 text-xs font-bold text-sky-600 bg-white inline-block px-2 py-0.5 rounded border border-sky-100">
                Refresh count: {refreshCount}
              </span>
            )}
          </div>

          <form onSubmit={handleVerifySubmit}>
            <div className="mb-6 p-3 bg-slate-50 border border-slate-200 rounded-[6px]">
              <div className="flex items-center justify-between mb-2">
                <label className="text-xs font-bold uppercase text-gray-600 tracking-wider">
                  Visual Code
                </label>
                <button
                  type="button"
                  onClick={() => generateCaptcha(false)}
                  className="text-sky-600 hover:text-sky-800 text-[11px] font-semibold flex items-center gap-1 normal-case bg-sky-100/50 px-2 py-1 rounded"
                >
                  <RefreshCw size={11} /> Refresh Code
                </button>
              </div>

              <div className="flex items-center justify-center mb-3 bg-white p-2 rounded border border-gray-300 shadow-inner">
                <canvas
                  ref={canvasRef}
                  width={180}
                  height={45}
                  className="rounded select-none cursor-not-allowed"
                />
              </div>

              <input
                type="text"
                value={captchaInput}
                onChange={(e) => setCaptchaInput(e.target.value.toUpperCase())}
                placeholder="Enter response here..."
                autoComplete="off"
                className="w-full px-3 py-2.5 text-center text-sm font-bold tracking-widest border border-[#a6a6a6] rounded-[4px] outline-none bg-white focus:border-sky-400 focus:shadow-[0_0_3px_2px_rgba(56,189,248,0.3)] uppercase transition-all"
              />
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-[#f0c14b] hover:bg-[#f4d078] active:bg-[#e2b442] border border-[#a88734] text-[#111] text-[15px] py-2.5 rounded-[4px] shadow-sm font-medium transition-colors disabled:opacity-50 mb-4"
            >
              {isSubmitting ? 'Verifying Protocol...' : 'Create & Verify Account'}
            </button>

            <div className="text-center pt-2 border-t border-gray-200">
              <button
                type="button"
                onClick={() => navigate('/register')}
                className="text-gray-500 hover:text-gray-800 flex items-center justify-center gap-1.5 text-[13px] font-medium mx-auto transition-colors"
              >
                <ArrowLeft size={14} /> Back to Registration
              </button>
            </div>
          </form>
        </div>
      </div>

      {isVerifiedSuccess && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-in fade-in">
          <div className="bg-white max-w-[420px] w-full rounded-lg shadow-xl p-6 border border-gray-100 text-center relative animate-in zoom-in-95">
            <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle2 size={36} />
            </div>

            <h2 className="text-xl font-bold text-gray-800 mb-2">Registration Complete!</h2>
            <p className="text-sm text-gray-600 mb-6 leading-relaxed">
              Your security protocol passed and your account has been registered as fully verified.
            </p>

            <div className="bg-amber-50 border border-amber-200 rounded-md p-3.5 mb-6 text-left flex items-start gap-3">
              <Lock size={18} className="text-amber-700 shrink-0 mt-0.5" />
              <p className="text-xs text-amber-900 leading-relaxed">
                <strong>Authentication Required:</strong> Please log into your newly verified account to establish your session.
              </p>
            </div>

            <button
              onClick={handleProceedToLogin}
              className="w-full bg-[#131921] hover:bg-[#232f3e] text-white text-[15px] py-3 rounded font-medium shadow transition-colors flex items-center justify-center gap-2"
            >
              <KeyRound size={16} /> Proceed to Login
            </button>
          </div>
        </div>
      )}

      <footer className="mt-auto w-full border-t border-gray-200 bg-white pt-6 pb-8 text-center text-xs text-gray-500">
        © {new Date().getFullYear()} CC Ecom Enterprise. All rights reserved.
      </footer>
    </div>
  );
};

export default VerifyPage;
