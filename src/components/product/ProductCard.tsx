import React from 'react';
import { Link } from 'react-router-dom';
import type { Product } from '../../types/product';

interface ProductCardProps {
  product: Product;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const isOutOfStock = product.stock <= 0;

  return (
    <Link 
      to={`/product/${product.id}`}
      className="group block w-full bg-[#0a0a0a] border border-zinc-900 rounded-xl overflow-hidden hover:border-zinc-800 transition-all duration-500 relative"
    >
      {/* --- Image Container --- */}
      {/* Using aspect-[4/5] for a taller, premium fashion/lookbook aesthetic */}
      <div className="w-full aspect-[4/5] bg-zinc-950 relative overflow-hidden">
        <img 
          src={product.imageUrl || product.image} 
          alt={product.name} 
          className={`w-full h-full object-cover transition-transform duration-700 ease-in-out group-hover:scale-105 ${
            isOutOfStock ? 'opacity-40 grayscale' : 'opacity-90 group-hover:opacity-100'
          }`}
        />
        
        {/* Out of Stock Overlay */}
        {isOutOfStock && (
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-zinc-400 bg-black/80 px-5 py-2.5 rounded-full border border-zinc-800 backdrop-blur-md">
              Archived
            </span>
          </div>
        )}
      </div>

      {/* --- Details Section --- */}
      <div className="p-5 flex flex-col justify-between">
        <div>
          <span className="text-[9px] font-semibold text-zinc-500 uppercase tracking-30.2em]">
            {product.category}
          </span>
          <h4 className="text-base font-bold text-white mt-1.5 truncate">
            {product.name}
          </h4>
        </div>

        <div className="flex items-end justify-between mt-5">
          <span className="text-sm font-medium text-zinc-300 tabular-nums">
            ₱{Number(product.price).toFixed(2)}
          </span>

          {/* Minimal "View" indicator replaces the cart button */}
          <span className="text-[10px] font-bold uppercase tracking-widest text-zinc-600 group-hover:text-white transition-colors flex items-center gap-1.5">
            {isOutOfStock ? 'View Details' : 'Explore'} 
            <span className="transform group-hover:translate-x-1 transition-transform">→</span>
          </span>
        </div>
      </div>
    </Link>
  );
};

export default ProductCard;
