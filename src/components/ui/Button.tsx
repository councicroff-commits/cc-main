import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'accent' | 'outline' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  isLoading?: boolean;
  fullWidth?: boolean;
}

export const Button: React.FC<ButtonProps> = ({
  children,
  variant = 'primary',
  size = 'md',
  isLoading = false,
  fullWidth = false,
  className = '',
  disabled,
  ...props
}) => {
  // Theme assignments mapping directly to Tailwind v4 theme configurations
  const baseStyles = 'inline-flex items-center justify-center font-mono font-bold tracking-wider uppercase transition-all duration-200 outline-none select-none cursor-pointer active:scale-98 disabled:opacity-50 disabled:pointer-events-none';
  
  const variants = {
    primary: 'bg-white text-black hover:bg-zinc-200 shadow-lg shadow-white/5',
    secondary: 'bg-zinc-900 text-white border border-white/[0.08] hover:bg-zinc-800 hover:border-white/20',
    accent: 'bg-sky-500 text-black hover:bg-sky-400 shadow-lg shadow-sky-500/10',
    outline: 'bg-transparent text-white border border-white/20 hover:bg-white/[0.04] hover:border-white',
    ghost: 'bg-transparent text-zinc-400 hover:text-white hover:bg-white/[0.04]',
  };

  const sizes = {
    sm: 'h-9 px-4 rounded-lg text-[10px]',
    md: 'h-11 px-6 rounded-xl text-xs',
    lg: 'h-13 px-8 rounded-2xl text-sm tracking-wide',
  };

  return (
    <button
      className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${fullWidth ? 'w-full' : ''} ${className}`}
      disabled={disabled || isLoading}
      {...props}
    >
      {isLoading ? (
        <div className="flex items-center gap-2">
          <svg className="animate-spin h-4 w-4 text-current" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
          </svg>
          <span>Processing...</span>
        </div>
      ) : (
        children
      )}
    </button>
  );
};

export default Button;
