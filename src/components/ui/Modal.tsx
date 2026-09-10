import React, { useEffect } from 'react';
import { X } from 'lucide-react';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
  maxWidth?: 'sm' | 'md' | 'lg' | 'xl';
}

export const Modal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  title,
  children,
  maxWidth = 'md',
}) => {
  // Capture escape key presses to dismiss modal dynamically
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) document.body.style.overflow = 'hidden';
    document.addEventListener('keydown', handleEscape);
    
    return () => {
      document.body.style.overflow = '';
      document.removeEventListener('keydown', handleEscape);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const widthClasses = {
    sm: 'max-w-md',
    md: 'max-w-lg',
    lg: 'max-w-2xl',
    xl: 'max-w-4xl',
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black/80 backdrop-blur-md animate-fade-in"
        onClick={onClose}
      />

      {/* Content Canvas */}
      <div className={`relative w-full ${widthClasses[maxWidth]} bg-zinc-950 border border-white/[0.08] shadow-2xl rounded-3xl p-6 overflow-hidden z-10 animate-fade-in`}>
        {/* Header line split */}
        <div className="flex items-center justify-between pb-4 border-b border-white/[0.06] mb-5">
          {title ? (
            <h3 className="text-sm font-mono font-bold tracking-widest text-white uppercase">
              // {title}
            </h3>
          ) : (
            <div />
          )}
          <button 
            onClick={onClose}
            className="p-1.5 rounded-xl text-zinc-500 hover:text-white hover:bg-white/[0.05] transition-all cursor-pointer outline-none"
          >
            <X size={18} />
          </button>
        </div>

        {/* Dynamic Inner body segment */}
        <div className="text-zinc-300 text-xs leading-relaxed max-h-[75vh] overflow-y-auto pr-1">
          {children}
        </div>
      </div>
    </div>
  );
};

export default Modal;
