// src/components/layout/Hero.tsx
import React from 'react';

const Hero: React.FC = () => {
  return (
    <section className="relative w-full min-h-[85vh] sm:min-h-screen flex flex-col justify-center items-center px-4 overflow-hidden bg-zinc-950">
      
      {/* Cinematic Mountain Background Layer (As seen in 1000168375.png) */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat z-0 transform scale-105"
        style={{ 
          backgroundImage: `url('https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1920&q=80')` 
        }}
      />

      {/* Dark Ambient Gradient Vignette Overlays */}
      <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-zinc-950/40 to-zinc-950/80 z-0" />
      <div className="absolute inset-0 bg-black/30 z-0" />

      {/* Subtle Background Watermark Text Layer "03" (Visible on the right side of the images) */}
      <div className="absolute right-4 sm:right-10 md:right-20 text-[12rem] sm:text-[20rem] md:text-[26rem] font-black text-white/[0.03] select-none pointer-events-none font-sans z-0 tracking-tighter">
        3
      </div>

      {/* Core Presentation Content Container */}
      <div className="relative z-10 w-full max-w-4xl mx-auto flex flex-col items-center text-center space-y-6 sm:space-y-8 px-2">
        
        {/* Tactical Pill Badge Info Node */}
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-black/60 border border-amber-500/30 backdrop-blur-md animate-fadeIn">
          <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse" />
          <span className="text-[10px] sm:text-xs font-mono font-bold text-amber-500 tracking-[0.25em] uppercase">
            The New Era of Prime Revolution
          </span>
          <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse" />
        </div>

        {/* Brand Display Typography Stack */}
        <div className="flex flex-col items-center tracking-tighter select-none">
          {/* Stark White Italic Upper Block */}
          <h1 className="text-5xl sm:text-7xl md:text-8xl lg:text-9xl font-black text-white italic uppercase leading-none drop-shadow-2xl font-sans">
            Council
          </h1>
          {/* Overlapping Luminous Sky-Blue Gradient Block */}
          <h1 className="text-5xl sm:text-7xl md:text-8xl lg:text-9xl font-black uppercase text-transparent bg-clip-text bg-gradient-to-r from-sky-400 via-blue-500 to-sky-300 leading-none -mt-2 sm:-mt-4 md:-mt-5 drop-shadow-lg font-sans">
            Croff
          </h1>
        </div>

        {/* Context Narrative Messaging Label */}
        <p className="text-zinc-300 font-medium text-base sm:text-lg md:text-xl max-w-md sm:max-w-xl leading-relaxed drop-shadow-md">
          Your comfort is always our responsibility.{' '}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-sky-400 to-blue-400 font-bold decoration-sky-500/40 underline-offset-4 hover:underline transition-all">
            Everywhere.
          </span>
        </p>

        {/* Action Flow Control Nodes */}
        <div className="w-full max-w-sm flex flex-col sm:flex-row items-center justify-center gap-3 pt-4 sm:pt-6">
          
          {/* Primary Action Button */}
          <button className="w-full sm:w-auto px-8 py-4 bg-white text-black font-black text-xs sm:text-sm uppercase tracking-widest rounded-full transition-all duration-300 hover:bg-zinc-200 active:scale-98 shadow-2xl flex items-center justify-center gap-2 group">
            <span>Explore Collection</span>
            <svg 
              className="w-4 h-4 transform group-hover:translate-x-1 transition-transform" 
              fill="none" 
              viewBox="0 0 24 24" 
              stroke="currentColor" 
              strokeWidth={3}
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M14 5l7 7m0 0l-7 7m7-7H3" />
            </svg>
          </button>

          {/* Secondary Informational Action Button (Visible in 1000167630.png) */}
          <button className="w-full sm:w-auto px-8 py-4 bg-black/30 border border-zinc-700/80 text-white font-black text-xs sm:text-sm uppercase tracking-widest rounded-full transition-all duration-300 hover:bg-zinc-900/60 hover:border-zinc-500 backdrop-blur-sm flex items-center justify-center gap-2 group">
            <svg 
              className="w-3.5 h-3.5 fill-white text-white" 
              viewBox="0 0 24 24"
            >
              <path d="M8 5v14l11-7z" />
            </svg>
            <span>Our Story</span>
          </button>

        </div>

      </div>

      {/* Decorative Bottom Vignette Blur Stripe */}
      <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-zinc-950 to-transparent pointer-events-none z-10" />
    </section>
  );
};

export default Hero;
