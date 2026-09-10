import React, { useMemo } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { useProducts } from '../context/ProductContext';
import ProductGrid from '../components/product/ProductGrid';

export const Shop: React.FC = () => {
  const { products, isLoading } = useProducts();
  
  // 1. Hook into the URL search parameters
  const [searchParams] = useSearchParams();
  
  // 2. Extract the '?search=' parameter if it exists
  const searchQuery = searchParams.get('search')?.toLowerCase() || '';

  // 3. Filter products dynamically based on the search query
  const filteredProducts = useMemo(() => {
    if (!searchQuery) return products;
    
    return products.filter((p) => {
      const nameMatch = p.name?.toLowerCase().includes(searchQuery);
      const categoryMatch = p.category?.toLowerCase().includes(searchQuery);
      const descriptionMatch = p.description?.toLowerCase().includes(searchQuery);
      
      return nameMatch || categoryMatch || descriptionMatch;
    });
  }, [products, searchQuery]);

  return (
    <div className="min-h-screen bg-white text-slate-800 p-6 sm:p-10 font-['Quincy',_serif] selection:bg-[#38bdf8]/20 pb-24">
      <div className="max-w-6xl mx-auto">
        
        {/* Header Block & Categories Link */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center border-b border-slate-100 pb-6 mb-10 gap-4 font-sans">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-slate-900">
              {searchQuery ? `Search Results for "${searchQuery}"` : 'Marketplace'}
            </h1>
            <p className="text-sm text-slate-500 mt-1">
              {searchQuery 
                ? `Showing ${filteredProducts.length} items matching your search.` 
                : 'Browse our complete collection of premium items.'}
            </p>
          </div>
          
          <Link
            to="/category/all"
            className="group px-6 py-2.5 bg-slate-50 border border-slate-200 hover:bg-slate-100 rounded-xl text-sm font-bold text-slate-700 hover:text-slate-900 transition-all flex items-center gap-2 shadow-sm"
          >
            <span>Browse Categories</span>
            <span className="text-slate-400 group-hover:text-slate-900 transition-colors">→</span>
          </Link>
        </div>

        {/* Content Body Area */}
        {isLoading ? (
          <div className="flex justify-center items-center py-32">
            <div className="w-10 h-10 border-4 border-[#38bdf8]/30 border-t-[#38bdf8] rounded-full animate-spin" />
          </div>
        ) : filteredProducts.length > 0 ? (
          <div className="animate-fade-in font-sans">
            <ProductGrid products={filteredProducts} />
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center text-center py-24 border border-slate-200 rounded-3xl bg-slate-50 font-sans">
            <span className="text-lg text-slate-900 font-bold mb-2">No matches found.</span>
            <p className="text-sm text-slate-500 max-w-sm mb-6">
              We couldn't find any products matching "{searchQuery}". Try checking for typos or searching with different keywords.
            </p>
            <Link to="/shop" className="px-6 py-2.5 bg-[#0a0a0a] text-white rounded-xl text-sm font-bold hover:bg-zinc-800 transition-colors">
              Clear Search
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default Shop;
