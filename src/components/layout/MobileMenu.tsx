import { Link } from 'react-router-dom';
import { X, ArrowRight } from 'lucide-react';

const MobileMenu = ({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] bg-[#020505] p-6 flex flex-col animate-in fade-in slide-in-from-right duration-300">
      <button onClick={onClose} className="self-end p-2 text-white">
        <X size={32} />
      </button>

      <div className="mt-12 space-y-8">
        {['Clothes', 'Perfume', 'Lifestyle', 'Account'].map((item) => (
          <Link 
            key={item} 
            to={`/${item.toLowerCase()}`} 
            onClick={onClose}
            className="flex items-center justify-between text-2xl font-black text-white hover:text-cyan-400 uppercase tracking-widest"
          >
            {item}
            <ArrowRight size={24} />
          </Link>
        ))}
      </div>

      <div className="mt-auto border-t border-cyan-900/30 pt-8">
        <p className="text-[10px] font-mono text-zinc-500 uppercase tracking-[0.3em]">System Status: Online</p>
        <p className="text-[10px] font-mono text-zinc-500">// Council Croff v4.0.0</p>
      </div>
    </div>
  );
};

export default MobileMenu;
