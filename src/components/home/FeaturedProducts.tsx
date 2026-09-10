import { useNavigate } from 'react-router-dom';
import { ShoppingBag, ArrowRight } from 'lucide-react';
import { MOCK_DATA } from '../../utils/constants';
import { useCart } from '../../context/CartContext';

const FeaturedProducts = () => {
  const navigate = useNavigate();
  const { addToCart } = useCart();

  // Filters items tied strictly to the 3 category models
  const featuredItems = MOCK_DATA.PRODUCTS.filter(product => product.featured);

  return (
    <section className="w-full py-16 bg-zinc-950 border-b border-white/[0.04]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">

        {/* Section Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-10">
          <div className="text-left">
            <div className="text-[10px] font-mono font-bold tracking-[0.3em] text-sky-400 uppercase">
              // CURRENT RELEASES
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight mt-1">
              FEATURED UTILITIES
            </h2>
          </div>
          <button 
            onClick={() => navigate('/shop')}
            className="flex items-center gap-2 font-mono text-xs font-bold text-zinc-400 hover:text-white transition-colors cursor-pointer outline-none"
          >
            <span>VIEW ENTIRE DROP</span>
            <ArrowRight size={14} />
          </button>
        </div>

        {/* Product List Deck */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {featuredItems.map((product) => (
            <div 
              key={product.id}
              className="group bg-zinc-900/40 border border-white/[0.06] rounded-3xl overflow-hidden flex flex-col justify-between transition-all duration-300 hover:border-white/10"
            >
              {/* Product Visual Container */}
              <div 
                onClick={() => navigate(`/product/${product.id}`)}
                className="relative aspect-square w-full bg-zinc-900 overflow-hidden cursor-pointer"
              >
                <img 
                  src={product.images[0]} 
                  alt={product.name}
                  className="w-full h-full object-cover opacity-80 group-hover:scale-102 group-hover:opacity-100 transition-all duration-500"
                />
                
                {/* Discount Percentage Sales Badge */}
                {product.compareAtPrice && (
                  <span className="absolute top-4 left-4 bg-sky-400 text-black font-mono text-[9px] font-black tracking-wider uppercase px-2 py-1 rounded-md shadow-lg">
                    SALE
                  </span>
                )}

                {/* Inline Category Tag routing */}
                <span className="absolute bottom-4 left-4 bg-black/60 border border-white/10 text-zinc-400 font-mono text-[9px] tracking-widest uppercase px-2.5 py-1 rounded-lg backdrop-blur-md">
                  // {product.category}
                </span>
              </div>

              {/* Product Metas details content */}
              <div className="p-5 space-y-4 flex-1 flex flex-col justify-between">
                <div 
                  onClick={() => navigate(`/product/${product.id}`)}
                  className="space-y-1 text-left cursor-pointer"
                >
                  <h3 className="text-sm font-bold text-white tracking-wide group-hover:text-sky-400 transition-colors line-clamp-1">
                    {product.name}
                  </h3>
                  <p className="text-xs text-zinc-500 line-clamp-2 leading-relaxed font-sans">
                    {product.description}
                  </p>
                </div>

                {/* Footer Interaction metrics */}
                <div className="flex items-center justify-between pt-2 border-t border-white/[0.04]">
                  <div className="flex items-baseline gap-2">
                    <span className="text-sm font-mono font-black text-white">
                      ${product.price.toFixed(2)}
                    </span>
                    {product.compareAtPrice && (
                      <span className="text-xs font-mono text-zinc-600 line-through">
                        ${product.compareAtPrice.toFixed(2)}
                      </span>
                    )}
                  </div>

                  <button
                    onClick={() => addToCart({
                      id: product.id,
                      name: product.name,
                      price: product.price,
                      image: product.images[0],
                      category: product.category
                    })}
                    className="p-2.5 rounded-xl bg-white/[0.03] border border-white/[0.08] text-zinc-400 hover:text-white hover:bg-sky-500/10 hover:border-sky-500/30 transition-all cursor-pointer outline-none"
                    aria-label="Add product instance to bag"
                  >
                    <ShoppingBag size={16} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
};

export default FeaturedProducts;
