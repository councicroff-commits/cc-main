import React, { useEffect } from 'react';
import { CheckCircle2, AlertTriangle, X } from 'lucide-react';

export interface ToastProps {
  id: string;
  message: string;
  type?: 'success' | 'error' | 'info';
  onClose: (id: string) => void;
  duration?: number;
}

export const Toast: React.FC<ToastProps> = ({
  id,
  message,
  type = 'success',
  onClose,
  duration = 3000,
}) => {
  useEffect(() => {
    const timer = setTimeout(() => onClose(id), duration);
    return () => clearTimeout(timer);
  }, [id, duration, onClose]);

  const variants = {
    success: 'border-emerald-500/20 bg-zinc-950 text-emerald-400 shadow-emerald-500/5',
    error: 'border-red-500/20 bg-zinc-950 text-red-400 shadow-red-500/5',
    info: 'border-sky-500/20 bg-zinc-950 text-sky-400 shadow-sky-500/5',
  };

  return (
    <div className={`flex items-center gap-3 w-80 max-w-full p-4 rounded-2xl border shadow-xl animate-fade-in ${variants[type]}`}>
      <div className="flex-shrink-0">
        {type === 'error' ? <AlertTriangle size={16} /> : <CheckCircle2 size={16} />}
      </div>
      
      <div className="flex-1 font-sans text-xs font-medium text-white">
        {message}
      </div>

      <button
        onClick={() => onClose(id)}
        className="flex-shrink-0 p-0.5 rounded-md text-zinc-500 hover:text-white transition-colors cursor-pointer outline-none"
      >
        <X size={14} />
      </button>
    </div>
  );
};

export default Toast;
