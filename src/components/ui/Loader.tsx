import React from 'react';

const Loader = () => {
  return (
    <div className="flex min-h-[60vh] w-full items-center justify-center bg-zinc-950">
      <div className="relative flex items-center justify-center">
        {/* Outer Spinner */}
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-zinc-800 border-t-sky-400" />
        
        {/* Inner Pulse */}
        <div className="absolute h-4 w-4 rounded-full bg-sky-400 animate-pulse" />
      </div>
    </div>
  );
};

export default Loader;
