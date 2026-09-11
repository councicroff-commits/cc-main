// src/pages/NotFound.tsx
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const REDIRECT_DELAY_SECONDS = 5;

const NotFound: React.FC = () => {
  const navigate = useNavigate();
  const [timeLeft, setTimeLeft] = useState<number>(REDIRECT_DELAY_SECONDS);

  useEffect(() => {
    if (timeLeft <= 0) {
      navigate('/', { replace: true });
      return;
    }

    const timer = setInterval(() => {
      setTimeLeft((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [timeLeft, navigate]);

  return (
    <div className="min-h-[65vh] flex flex-col items-center justify-center p-6 text-center select-none">
      {/* System Status Tag */}
      <div className="inline-flex items-center space-x-2 bg-gray-100 border border-gray-200 px-3 py-1.5 rounded-full mb-6">
        <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
        <span className="text-[11px] font-mono font-bold tracking-widest text-gray-600 uppercase">
          404 // PATH_NOT_FOUND
        </span>
      </div>

      {/* Main Heading */}
      <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-900 tracking-tight mb-3">
        Page Non-Existent
      </h1>

      {/* Subtext */}
      <p className="text-xs sm:text-sm text-gray-500 max-w-sm mb-8 leading-relaxed">
        The route you requested could not be resolved or may have been relocated.
      </p>

      {/* Auto-Redirect Badge */}
      <div className="bg-white border border-gray-200 rounded-xl p-4 shadow-sm max-w-xs w-full mb-8 flex items-center justify-between">
        <div className="text-left">
          <p className="text-xs font-bold text-gray-900">Auto Redirect</p>
          <p className="text-[11px] text-gray-500">Returning to main page...</p>
        </div>
        <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-black text-white text-xs font-mono font-bold">
          {timeLeft}s
        </div>
      </div>

      {/* Manual Actions */}
      <div className="flex flex-col sm:flex-row gap-3 w-full max-w-xs">
        <button
          onClick={() => navigate('/', { replace: true })}
          className="w-full bg-black text-white text-xs uppercase font-bold tracking-wider px-6 py-3.5 rounded-xl hover:bg-gray-800 transition-colors shadow-sm"
        >
          Return to Main Page
        </button>
        <button
          onClick={() => navigate(-1)}
          className="w-full bg-gray-100 text-gray-700 text-xs uppercase font-bold tracking-wider px-6 py-3.5 rounded-xl hover:bg-gray-200 transition-colors"
        >
          Go Back
        </button>
      </div>
    </div>
  );
};

export default NotFound;

