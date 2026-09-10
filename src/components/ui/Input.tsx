import React from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  icon?: React.ComponentType<{ className?: string; size?: number }>;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, icon: Icon, className = '', ...props }, ref) => {
    return (
      <div className="w-full space-y-1.5 text-left">
        {label && (
          <label className="block text-[10px] font-mono font-bold tracking-widest text-zinc-400 uppercase">
            // {label}
          </label>
        )}
        <div className="relative flex items-center group">
          {Icon && (
            <Icon className="absolute left-4 text-zinc-500 group-focus-within:text-sky-400 transition-colors duration-200 pointer-events-none" size={16} />
          )}
          <input
            ref={ref}
            className={`w-full h-11 bg-white/[0.02] hover:bg-white/[0.04] focus:bg-zinc-900 border text-xs text-white placeholder-zinc-600 rounded-xl outline-none transition-all duration-200 ${
              Icon ? 'pl-11 pr-4' : 'px-4'
            } ${
              error 
                ? 'border-red-500/50 focus:border-red-500 bg-red-500/[0.01]' 
                : 'border-white/[0.06] focus:border-sky-500/40'
            } ${className}`}
            {...props}
          />
        </div>
        {error && (
          <p className="text-[11px] text-red-400 font-mono tracking-wide">× {error}</p>
        )}
      </div>
    );
  }
);

Input.displayName = 'Input';
export default Input;
