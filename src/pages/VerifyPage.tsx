import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import {
  ShieldAlert,
  ArrowLeft,
  RefreshCw,
  Lock,
  CheckCircle2,
  KeyRound,
  AlertCircle,
  ShieldCheck,
} from 'lucide-react';

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL ||
  'https://cc-backend-production-00fe.up.railway.app/';

const AUTH_API_URL = `https://cc-backend-production-00fe.up.railway.app/api/v1/auth`;

type TwistType =
  | 'NORMAL'
  | 'REVERSE'
  | 'APPEND_X'
  | 'APPEND_7'
  | 'REMOVE_FIRST'
  | 'REMOVE_LAST'
  | 'ODD_POSITIONS'
  | 'EVEN_POSITIONS'
  | 'REVERSE_APPEND_X'
  | 'SORT_ASCENDING'
  | 'DUPLICATE_FIRST'
  | 'DUPLICATE_LAST'
  | 'SWAP_EDGES'
  | 'ROTATE_LEFT'
  | 'ROTATE_RIGHT'
  | 'REVERSE_APPEND_7'
  | 'FIRST_THREE'
  | 'LAST_THREE'
  | 'MIDDLE_THREE'
  | 'REPEAT_CODE';

interface TwistConfig {
  type: TwistType;
  title: string;
  instruction: string;
}

const TWIST_CONFIGS: TwistConfig[] = [
  {
    type: 'NORMAL',
    title: 'Standard Verification',
    instruction:
      'Enter the visual security code exactly as displayed.',
  },
  {
    type: 'REVERSE',
    title: 'Reverse Verification',
    instruction:
      'Read the visual security code from right to left and enter the result.',
  },
  {
    type: 'APPEND_X',
    title: 'Verification Suffix',
    instruction:
      "Enter the visual security code exactly as displayed, then add the letter 'X' at the end.",
  },
  {
    type: 'APPEND_7',
    title: 'Verification Suffix',
    instruction:
      "Enter the visual security code exactly as displayed, then add the number '7' at the end.",
  },
  {
    type: 'REMOVE_FIRST',
    title: 'Character Adjustment',
    instruction:
      'Enter the visual security code without its first character.',
  },
  {
    type: 'REMOVE_LAST',
    title: 'Character Adjustment',
    instruction:
      'Enter the visual security code without its final character.',
  },
  {
    type: 'ODD_POSITIONS',
    title: 'Position Verification',
    instruction:
      'Enter only the characters in positions 1, 3 and 5 of the visual code.',
  },
  {
    type: 'EVEN_POSITIONS',
    title: 'Position Verification',
    instruction:
      'Enter only the characters in positions 2 and 4 of the visual code.',
  },
  {
    type: 'REVERSE_APPEND_X',
    title: 'Combined Verification',
    instruction:
      "Enter the visual code backwards and add the letter 'X' at the end.",
  },
  {
    type: 'SORT_ASCENDING',
    title: 'Character Ordering',
    instruction:
      'Rearrange all characters in alphabetical and numerical ascending order before entering them.',
  },
  {
    type: 'DUPLICATE_FIRST',
    title: 'Character Duplication',
    instruction:
      'Enter the visual code and repeat its first character one additional time at the beginning.',
  },
  {
    type: 'DUPLICATE_LAST',
    title: 'Character Duplication',
    instruction:
      'Enter the visual code and repeat its final character one additional time at the end.',
  },
  {
    type: 'SWAP_EDGES',
    title: 'Character Exchange',
    instruction:
      'Enter the visual code with its first and final characters exchanged.',
  },
  {
    type: 'ROTATE_LEFT',
    title: 'Character Rotation',
    instruction:
      'Move the first character to the end, then enter the resulting code.',
  },
  {
    type: 'ROTATE_RIGHT',
    title: 'Character Rotation',
    instruction:
      'Move the final character to the beginning, then enter the resulting code.',
  },
  {
    type: 'REVERSE_APPEND_7',
    title: 'Combined Verification',
    instruction:
      "Enter the visual code backwards and add the number '7' at the end.",
  },
  {
    type: 'FIRST_THREE',
    title: 'Partial Verification',
    instruction:
      'Enter only the first three characters of the visual code.',
  },
  {
    type: 'LAST_THREE',
    title: 'Partial Verification',
    instruction:
      'Enter only the final three characters of the visual code.',
  },
  {
    type: 'MIDDLE_THREE',
    title: 'Partial Verification',
    instruction:
      'Enter only the three middle characters of the visual code.',
  },
  {
    type: 'REPEAT_CODE',
    title: 'Sequence Verification',
    instruction:
      'Enter the complete visual code twice consecutively.',
  },
];

const VerifyPage: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const registrationData = location.state;

  const [captchaInput, setCaptchaInput] = useState('');
  const [captchaCode, setCaptchaCode] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isVerifiedSuccess, setIsVerifiedSuccess] = useState(false);

  const [twistRule, setTwistRule] = useState<TwistType>('NORMAL');
  const [, setRefreshCount] = useState(0);

  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    if (!registrationData) {
      navigate('/register', { replace: true });
    }
  }, [registrationData, navigate]);

  const selectRandomTwist = useCallback(() => {
    const randomIndex = Math.floor(
      Math.random() * TWIST_CONFIGS.length
    );
    setTwistRule(TWIST_CONFIGS[randomIndex].type);
  }, []);

  const drawCaptcha = useCallback((code: string) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const width = canvas.width;
    const height = canvas.height;

    ctx.clearRect(0, 0, width, height);
    ctx.fillStyle = '#f8fafc';
    ctx.fillRect(0, 0, width, height);

    for (let i = 0; i < 80; i++) {
      ctx.fillStyle = `rgba(
        ${Math.floor(Math.random() * 120)},
        ${Math.floor(Math.random() * 120)},
        ${Math.floor(Math.random() * 120)},
        0.08
      )`;
      ctx.fillRect(Math.random() * width, Math.random() * height, 1, 1);
    }

    for (let i = 0; i < 7; i++) {
      ctx.beginPath();
      ctx.strokeStyle = `rgba(
        ${Math.floor(Math.random() * 120)},
        ${Math.floor(Math.random() * 120)},
        ${Math.floor(Math.random() * 120)},
        0.35
      )`;
      ctx.lineWidth = 1;
      ctx.moveTo(Math.random() * width, Math.random() * height);
      ctx.bezierCurveTo(
        Math.random() * width,
        Math.random() * height,
        Math.random() * width,
        Math.random() * height,
        Math.random() * width,
        Math.random() * height
      );
      ctx.stroke();
    }

    ctx.textBaseline = 'middle';
    ctx.textAlign = 'center';
    const spacing = width / (code.length + 1);

    for (let i = 0; i < code.length; i++) {
      ctx.save();
      const x = spacing * (i + 1);
      const y = height / 2 + (Math.random() * 8 - 4);
      const angle = (Math.random() - 0.5) * 0.45;
      const fontSize = 22 + Math.floor(Math.random() * 4);

      ctx.translate(x, y);
      ctx.rotate(angle);
      ctx.font = `700 ${fontSize}px monospace`;
      ctx.fillStyle = `rgb(
        ${Math.floor(Math.random() * 80)},
        ${Math.floor(Math.random() * 80)},
        ${Math.floor(Math.random() * 120)}
      )`;
      ctx.fillText(code[i], 0, 0);
      ctx.restore();
    }

    ctx.strokeStyle = '#d1d5db';
    ctx.lineWidth = 1;
    ctx.strokeRect(0, 0, width, height);
  }, []);

  const generateCaptcha = useCallback(
    (isInitial = false) => {
      const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
      let code = '';
      for (let i = 0; i < 5; i++) {
        code += chars.charAt(Math.floor(Math.random() * chars.length));
      }

      setCaptchaCode(code);
      if (!isInitial) {
        setRefreshCount((prev) => prev + 1);
      }

      requestAnimationFrame(() => {
        drawCaptcha(code);
      });
    },
    [drawCaptcha]
  );

  useEffect(() => {
    selectRandomTwist();
    generateCaptcha(true);
  }, [selectRandomTwist, generateCaptcha]);

  const getExpectedResponse = (): string => {
    const code = captchaCode;

    switch (twistRule) {
      case 'NORMAL':
        return code;
      case 'REVERSE':
        return code.split('').reverse().join('');
      case 'APPEND_X':
        return `${code}X`;
      case 'APPEND_7':
        return `${code}7`;
      case 'REMOVE_FIRST':
        return code.slice(1);
      case 'REMOVE_LAST':
        return code.slice(0, -1);
      case 'ODD_POSITIONS':
        return code
          .split('')
          .filter((_, index) => index % 2 === 0)
          .join('');
      case 'EVEN_POSITIONS':
        return code
          .split('')
          .filter((_, index) => index % 2 !== 0)
          .join('');
      case 'REVERSE_APPEND_X':
        return code.split('').reverse().join('') + 'X';
      case 'SORT_ASCENDING':
        return code.split('').sort().join('');
      case 'DUPLICATE_FIRST':
        return code[0] + code;
      case 'DUPLICATE_LAST':
        return code + code[code.length - 1];
      case 'SWAP_EDGES':
        if (code.length < 2) return code;
        return code[code.length - 1] + code.slice(1, -1) + code[0];
      case 'ROTATE_LEFT':
        return code.slice(1) + code[0];
      case 'ROTATE_RIGHT':
        return code[code.length - 1] + code.slice(0, -1);
      case 'REVERSE_APPEND_7':
        return code.split('').reverse().join('') + '7';
      case 'FIRST_THREE':
        return code.slice(0, 3);
      case 'LAST_THREE':
        return code.slice(-3);
      case 'MIDDLE_THREE':
        return code.slice(1, 4);
      case 'REPEAT_CODE':
        return code + code;
      default:
        return code;
    }
  };

  const validateTwistLogic = (): string | null => {
    const input = captchaInput.toUpperCase().trim();
    const expected = getExpectedResponse();

    if (input !== expected) {
      return 'The security code response is incorrect. Please review the instruction and try again.';
    }
    return null;
  };

  const resetChallenge = () => {
    setCaptchaInput('');
    setRefreshCount(0);
    selectRandomTwist();
    generateCaptcha();
  };

  const handleVerifySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!captchaInput.trim()) {
      setError('Please enter the required security verification response.');
      return;
    }

    const validationError = validateTwistLogic();
    if (validationError) {
      setError(validationError);
      resetChallenge();
      return;
    }

    setIsSubmitting(true);

    try {
      const email = registrationData?.email;
      const password = registrationData?.password;

      if (!email || !password) {
        throw new Error('Email or password missing from registration data.');
      }

      // Submit registration data directly to your backend service on Render
      const response = await fetch(`${AUTH_API_URL}/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(registrationData),
      });

      let data: any = null;
      try {
        data = await response.json();
      } catch {
        data = null;
      }

      if (!response.ok) {
        throw new Error(
          data?.detail ||
            data?.message ||
            'Registration could not be completed.'
        );
      }

      setIsVerifiedSuccess(true);
    } catch (err: any) {
      setError(
        err?.message ||
          'An unexpected error occurred while creating the account.'
      );
      resetChallenge();
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleProceedToLogin = () => {
    navigate('/login', {
      state: {
        message:
          'Your account has been successfully registered and verified. Please sign in to continue.',
      },
    });
  };

  const currentTwist = TWIST_CONFIGS.find(
    (twist) => twist.type === twistRule
  );

  if (!registrationData) {
    return null;
  }

  return (
    <div className="min-h-screen bg-[#f3f4f6] font-sans text-[#111] flex flex-col selection:bg-sky-200">
      <header className="w-full bg-[#131921] py-3 px-5 sm:px-6 flex items-center justify-between border-b border-white/10 shadow-sm">
        <Link
          to="/"
          className="select-none outline-none flex flex-col items-start hover:opacity-90 transition-opacity"
        >
          <div className="flex items-center">
            <span className="text-[25px] sm:text-[26px] font-black text-white tracking-tight">
              CC
            </span>
            <span className="ml-1 text-[25px] sm:text-[26px] font-light text-sky-400 tracking-tight">
              Ecom
            </span>
          </div>
          <p className="text-[9px] sm:text-[10px] tracking-[1.5px] uppercase text-zinc-400 -mt-1 font-medium">
            Counci Croff
          </p>
        </Link>
      </header>

      <main className="w-full max-w-[430px] mx-auto px-4 flex-grow py-8 sm:py-12">
        {error && (
          <div className="mb-5 border-l-4 border-[#c40000] bg-white rounded-r-md pl-4 pr-3 py-4 shadow-sm flex gap-3 items-start">
            <div className="text-[#c40000] shrink-0 mt-0.5">
              <AlertCircle size={18} />
            </div>
            <div>
              <h4 className="text-[#c40000] font-bold text-sm mb-0.5">
                Verification Error
              </h4>
              <p className="text-sm text-gray-700 leading-relaxed">
                {error}
              </p>
            </div>
          </div>
        )}

        <section className="bg-white border border-gray-200 rounded-[8px] shadow-sm p-5 sm:p-7">
          <div className="mx-auto w-14 h-14 rounded-full bg-slate-100 flex items-center justify-center mb-5 text-slate-700 shadow-inner">
            <ShieldAlert size={28} />
          </div>

          <h1 className="text-[21px] sm:text-[22px] font-bold mb-2 text-center text-gray-800">
            Final Security Check
          </h1>

          <p className="text-[13px] text-gray-500 text-center mb-6 leading-relaxed">
            Complete the security verification below to finalize your account registration.
          </p>

          <div className="bg-sky-50 border border-sky-200 rounded p-3.5 mb-6 text-sm text-sky-900 leading-relaxed shadow-sm">
            <strong className="text-sky-700 uppercase text-[10px] tracking-wider block mb-1.5">
              {currentTwist?.title || 'Security Directive'}
            </strong>
            {currentTwist?.instruction}
            <div className="mt-2 text-[11px] text-sky-700">
              Each challenge is independently generated for this verification session.
            </div>
          </div>

          <form onSubmit={handleVerifySubmit}>
            <div className="mb-6 p-3 bg-slate-50 border border-slate-200 rounded-[6px]">
              <div className="flex items-center justify-between mb-2">
                <label
                  htmlFor="security-code"
                  className="text-xs font-bold uppercase text-gray-600 tracking-wider"
                >
                  Visual Code
                </label>
                <button
                  type="button"
                  onClick={() => {
                    setError(null);
                    setCaptchaInput('');
                    selectRandomTwist();
                    generateCaptcha();
                  }}
                  disabled={isSubmitting}
                  className="text-sky-600 hover:text-sky-800 disabled:opacity-50 text-[11px] font-semibold flex items-center gap-1 normal-case bg-sky-100/50 px-2 py-1 rounded transition-colors"
                >
                  <RefreshCw size={11} />
                  Refresh Code
                </button>
              </div>

              <div className="flex items-center justify-center mb-3 bg-white p-2 rounded border border-gray-300 shadow-inner overflow-hidden">
                <canvas
                  ref={canvasRef}
                  width={180}
                  height={45}
                  className="rounded select-none max-w-full"
                  aria-label="Visual security code"
                />
              </div>

              <input
                id="security-code"
                type="text"
                value={captchaInput}
                onChange={(e) => setCaptchaInput(e.target.value.toUpperCase())}
                placeholder="Enter verification response"
                autoComplete="off"
                spellCheck={false}
                maxLength={10}
                disabled={isSubmitting}
                className="w-full px-3 py-2.5 text-center text-sm font-bold tracking-widest border border-[#a6a6a6] rounded-[4px] outline-none bg-white focus:border-sky-400 focus:shadow-[0_0_3px_2px_rgba(56,189,248,0.3)] uppercase transition-all disabled:bg-gray-100 disabled:cursor-not-allowed"
              />
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-[#f0c14b] hover:bg-[#f4d078] active:bg-[#e2b442] border border-[#a88734] text-[#111] text-[15px] py-2.5 rounded-[4px] shadow-sm font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed mb-4"
            >
              {isSubmitting ? 'Creating Account...' : 'Create & Verify Account'}
            </button>

            <div className="text-center pt-2 border-t border-gray-200">
              <button
                type="button"
                onClick={() => navigate('/register')}
                disabled={isSubmitting}
                className="text-gray-500 hover:text-gray-800 disabled:opacity-50 flex items-center justify-center gap-1.5 text-[13px] font-medium mx-auto transition-colors"
              >
                <ArrowLeft size={14} />
                Back to Registration
              </button>
            </div>
          </form>
        </section>

        <div className="mt-5 text-center text-[11px] text-gray-500 leading-relaxed px-4">
          <ShieldCheck size={13} className="inline-block mr-1 -mt-0.5" />
          This security verification helps protect the registration system from automated requests.
        </div>
      </main>

      {isVerifiedSuccess && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div
            className="bg-white max-w-[430px] w-full rounded-[6px] shadow-2xl border border-gray-200 overflow-hidden"
            role="dialog"
            aria-modal="true"
            aria-labelledby="registration-success-title"
          >
            <div className="px-6 py-5 border-b border-gray-200 bg-gray-50">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center">
                  <CheckCircle2 size={23} />
                </div>

                <div>
                  <p className="text-[10px] uppercase tracking-wider font-bold text-gray-500">
                    Account Registration
                  </p>

                  <h2
                    id="registration-success-title"
                    className="text-[18px] font-bold text-gray-800"
                  >
                    Registration Successful
                  </h2>
                </div>
              </div>
            </div>

            <div className="px-6 py-6">
              <p className="text-[14px] text-gray-700 leading-relaxed mb-5">
                Your registration has been completed successfully. The security verification was accepted and your account has been created in the system.
              </p>

              <div className="border border-gray-200 rounded-[5px] bg-white mb-6">
                <div className="px-4 py-3 border-b border-gray-200">
                  <p className="text-[11px] uppercase tracking-wide font-bold text-gray-500">
                    Account Status
                  </p>
                </div>

                <div className="px-4 py-3 flex items-center justify-between">
                  <span className="text-[13px] text-gray-600">Registration</span>
                  <span className="text-[12px] font-semibold text-emerald-700">Completed</span>
                </div>

                <div className="px-4 py-3 border-t border-gray-100 flex items-center justify-between">
                  <span className="text-[13px] text-gray-600">Security Verification</span>
                  <span className="text-[12px] font-semibold text-emerald-700">Verified</span>
                </div>

                <div className="px-4 py-3 border-t border-gray-100 flex items-center justify-between">
                  <span className="text-[13px] text-gray-600">Account Access</span>
                  <span className="text-[12px] font-semibold text-gray-700">Sign-in Required</span>
                </div>
              </div>

              <div className="border-l-4 border-[#d4a72c] bg-[#fffdf5] px-4 py-3.5 mb-6">
                <div className="flex items-start gap-3">
                  <Lock size={17} className="text-[#8a6d1d] shrink-0 mt-0.5" />
                  <div>
                    <p className="text-[12px] font-bold text-[#6f5817] mb-1">Sign-in Required</p>
                    <p className="text-[12px] text-[#665b3c] leading-relaxed">
                      Please sign in using the credentials associated with your newly created account to continue.
                    </p>
                  </div>
                </div>
              </div>

              <button
                onClick={handleProceedToLogin}
                className="w-full bg-[#131921] hover:bg-[#232f3e] text-white text-[14px] py-3 rounded-[4px] font-medium shadow-sm transition-colors flex items-center justify-center gap-2"
              >
                <KeyRound size={16} />
                Continue to Sign In
              </button>
            </div>

            <div className="px-6 py-3 bg-gray-50 border-t border-gray-200">
              <p className="text-[10px] text-gray-500 text-center leading-relaxed">
                Thank you for registering with CC Ecom.
              </p>
            </div>
          </div>
        </div>
      )}

      <footer className="mt-auto w-full border-t border-gray-200 bg-white pt-6 pb-8 text-center text-xs text-gray-500 px-4">
        © {new Date().getFullYear()} CC Ecom Enterprise. All rights reserved.
      </footer>
    </div>
  );
};

export default VerifyPage;
