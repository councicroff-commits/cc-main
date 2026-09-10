import { useNavigate } from 'react-router-dom';
import { Shirt, Sparkles, Layers, ArrowUpRight } from 'lucide-react';
import { MOCK_DATA } from '../../utils/constants';

const CategoryCards = () => {
  const navigate = useNavigate();

  // Maps custom interface icons to our exactly 3 static slugs
  const iconMap: Record<string, React.ComponentType<{ size?: number; className?: string }>> = {
    clothes: Shirt,
    perfume: Sparkles,
    lifestyle: Layers,
  };

  return (
    <section className="w-full py-16 bg-zinc-950 border-b border-white/[0.04]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        
        {/* Section Header */}
        <div className="mb-10 text-left">
          <div className="text-[10px] font-mono font-bold tracking-[0.3em] text-sky-400 uppercase">
            // ARCHITECTURE INDEX
          </div>
          <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight mt-1">
            CORE SECTOR DIVISIONS
          </h2>
        </div>

        {/* Triple Grid Config */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {MOCK_DATA.CATEGORIES.map((category) => {
            const Icon = iconMap[category.slug] || Layers;
            
            return (
              <div 
                key={category.id}
                onClick={() => navigate(`/${category.slug}`)}
                className="group relative h-96 rounded-3xl border border-white/[0.06] bg-zinc-900 overflow-hidden cursor-pointer transition-all duration-300 hover:border-white/20 hover:shadow-2xl hover:shadow-sky-500/[0.02]"
              >
                {/* Background Image Layer */}
                <div className="absolute inset-0 z-0">
                  <img 
                    src={category.imageUrl} 
                    alt={category.name}
                    className="w-full h-full object-cover opacity-30 grayscale group-hover:scale-105 group-hover:opacity-40 group-hover:grayscale-0 transition-all duration-500"
                  />
                  {/* Bottom Vignette Gradients */}
                  <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-zinc-950/40 to-transparent" />
                </div>

                {/* Content Overlay */}
                <div className="absolute inset-0 z-10 p-6 flex flex-col justify-between">
                  {/* Top Row Icon badge */}
                  <div className="flex justify-between items-start">
                    <div className="p-3 rounded-2xl bg-zinc-950/80 border border-white/10 text-sky-400 backdrop-blur-md">
                      <Icon size={18} />
                    </div>
                    <div className="p-2 rounded-xl bg-zinc-950/40 border border-white/5 opacity-0 group-hover:opacity-100 group-hover:translate-x-0 -translate-x-2 text-white transition-all duration-300">
                      <ArrowUpRight size={16} />
                    </div>
                  </div>

                  {/* Bottom Meta Content */}
                  <div className="space-y-2">
                    <div className="text-[9px] font-mono font-bold tracking-widest text-sky-400/80 uppercase">
                      // COMPONENT HUB
                    </div>
                    <h3 className="text-xl font-black text-white tracking-wide">
                      {category.name}
                    </h3>
                    <p className="text-xs text-zinc-400 leading-relaxed font-sans opacity-90">
                      {category.description}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
};

export default CategoryCards;
