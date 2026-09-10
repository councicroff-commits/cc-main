import React, { useState } from 'react';
import { Search, X } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const SearchBar = () => {
  const [query, setQuery] = useState('');
  const navigate = useNavigate();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      // Redirects to shop layout passing search parameter
      navigate(`/shop?search=${encodeURIComponent(query.trim())}`);
    }
  };

  const clearSearch = () => {
    setQuery('');
  };

  return (
    <form onSubmit={handleSearch} className="relative w-full group">
      <div className="relative flex items-center">
        <Search 
          size={18} 
          className="absolute left-4 text-zinc-500 group-focus-within:text-sky-400 transition-colors duration-200 pointer-events-none" 
        />
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search collections, clothes, perfumes..."
          className="w-full h-11 pl-11 pr-10 rounded-xl font-mono text-xs bg-white/[0.03] hover:bg-white/[0.05] focus:bg-zinc-900 border border-white/[0.06] focus:border-sky-500/40 text-white placeholder-zinc-500 outline-none transition-all duration-200"
        />
        {query && (
          <button
            type="button"
            onClick={clearSearch}
            className="absolute right-3 p-1 rounded-md text-zinc-500 hover:text-white transition-colors cursor-pointer"
          >
            <X size={14} />
          </button>
        )}
      </div>
    </form>
  );
};

export default SearchBar;
