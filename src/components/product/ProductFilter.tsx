import React, { useEffect, useState } from 'react';
import { Search, RotateCcw, Check } from 'lucide-react'; // Simplified imports
import { useDebounce } from '../../hooks/useDebounce';

// --- FIXED: Explicitly exported for cross-file access ---
export interface AdvancedFilterState {
  searchQuery: string;
  category: 'all' | 'clothes' | 'perfume' | 'lifestyle';
  maxPrice: number;
  minPrice: number;
  sizes: string[];
  attributes: string[]; 
  availability: 'all' | 'in-stock' | 'sale-only';
}

interface ProductFilterProps {
  filters: AdvancedFilterState;
  onFilterChange: (updater: (prev: AdvancedFilterState) => AdvancedFilterState) => void;
  onClear: () => void;
  availableCounts: {
    categories: Record<string, number>;
    sizes: Record<string, number>;
    attributes: Record<string, number>;
  };
}

export const ProductFilter: React.FC<ProductFilterProps> = ({
  filters,
  onFilterChange,
  onClear,
  availableCounts,
}) => {
  const [localSearch, setLocalSearch] = useState(filters.searchQuery);
  const debouncedSearch = useDebounce(localSearch, 300);

  useEffect(() => {
    onFilterChange((prev) => ({ ...prev, searchQuery: debouncedSearch }));
  }, [debouncedSearch, onFilterChange]);

  useEffect(() => {
    setLocalSearch(filters.searchQuery);
  }, [filters.searchQuery]);

  const handleToggleFacet = (key: 'sizes' | 'attributes', value: string) => {
    onFilterChange((prev) => {
      const currentList = [...prev[key]];
      const index = currentList.indexOf(value);
      return {
        ...prev,
        [key]: index > -1 ? currentList.filter((i) => i !== value) : [...currentList, value]
      };
    });
  };

  const sizeFacets = ['XS', 'S', 'M', 'L', 'XL', '50ml', '100ml', 'OS'];
  const attributeFacets = ['Waterproof', 'Oud Profile', 'Citrus Note', 'Premium Metal', 'Minimalist', 'Synthetic'];

  return (
    <div className="space-y-7 text-left select-none animate-in fade-in duration-300">
      
      {/* Search Input */}
      <div className="space-y-2">
        <label className="text-[10px] font-mono text-zinc-400 uppercase tracking-widest font-bold">
          // CONSOLE QUERY INDEX
        </label>
        <div className="relative w-full h-10">
          <input
            type="text"
            value={localSearch}
            onChange={(e) => setLocalSearch(e.target.value)}
            placeholder="Type code, tag, name..."
            className="w-full h-full pl-10 pr-4 bg-zinc-950 border border-white/[0.06] rounded-xl text-xs text-white placeholder-zinc-700 focus:outline-none focus:border-sky-400/50 transition-colors"
          />
          <Search size={13} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-600" />
        </div>
      </div>

      {/* Domain Selector */}
      <div className="space-y-2">
        <label className="text-[10px] font-mono text-zinc-400 uppercase tracking-widest font-bold">// DOMAIN SELECTOR</label>
        <div className="grid grid-cols-2 gap-1.5">
          {(['all', 'clothes', 'perfume', 'lifestyle'] as const).map((cat) => (
            <button
              key={cat}
              type="button"
              onClick={() => onFilterChange((prev) => ({ ...prev, category: cat }))}
              className={`h-9 px-3 rounded-xl font-mono text-[10px] font-bold uppercase flex items-center justify-between border transition-all ${
                filters.category === cat ? 'bg-sky-500/10 border-sky-400/30 text-sky-400' : 'bg-zinc-900/20 border-white/[0.03] text-zinc-500 hover:border-white/10'
              }`}
            >
              <span>{cat}</span>
              <span className="text-[8px] opacity-40">({availableCounts.categories[cat] ?? 0})</span>
            </button>
          ))}
        </div>
      </div>

      {/* Metric Selector */}
      <div className="space-y-2">
        <label className="text-[10px] font-mono text-zinc-400 uppercase tracking-widest font-bold">// METRIC CAP / SCALE</label>
        <div className="flex flex-wrap gap-1.5">
          {sizeFacets.map((size) => {
            const isSelected = filters.sizes.includes(size);
            const count = availableCounts.sizes[size] ?? 0;
            return (
              <button
                key={size}
                type="button"
                disabled={count === 0}
                onClick={() => handleToggleFacet('sizes', size)}
                className={`h-8 px-2.5 rounded-lg font-mono text-[10px] border ${isSelected ? 'bg-white text-black' : 'bg-transparent border-white/[0.05] text-zinc-400'} ${count === 0 ? 'opacity-20' : ''}`}
              >
                {size}
              </button>
            );
          })}
        </div>
      </div>

      {/* Finance Margin Slider */}
      <div className="space-y-3">
        <div className="flex justify-between items-baseline">
          <label className="text-[10px] font-mono text-zinc-400 uppercase tracking-widest font-bold">// FINANCES MARGIN</label>
          <span className="font-mono text-xs text-sky-400">${filters.minPrice} - ${filters.maxPrice}</span>
        </div>
        <input
          type="range"
          min="10"
          max="350"
          value={filters.maxPrice}
          onChange={(e) => onFilterChange((prev) => ({ ...prev, maxPrice: Number(e.target.value) }))}
          className="w-full h-1 bg-zinc-900 accent-sky-400"
        />
      </div>

      {/* Production Specs */}
      <div className="space-y-2">
        <label className="text-[10px] font-mono text-zinc-400 uppercase tracking-widest font-bold">// PRODUCTION SPECS</label>
        {attributeFacets.map((attr) => {
          const isChecked = filters.attributes.includes(attr);
          return (
            <div key={attr} onClick={() => handleToggleFacet('attributes', attr)} className="flex items-center gap-2 cursor-pointer p-1">
              <div className={`w-4 h-4 rounded border flex items-center justify-center ${isChecked ? 'bg-sky-400' : 'border-zinc-700'}`}>
                {isChecked && <Check size={10} className="text-black" />}
              </div>
              <span className="text-xs text-zinc-300">{attr}</span>
            </div>
          );
        })}
      </div>

      <button onClick={onClear} className="w-full h-9 bg-zinc-900 border border-white/10 text-zinc-500 text-[10px] font-bold uppercase tracking-widest rounded-xl">
        Purge Filter Workspace
      </button>
    </div>
  );
};

