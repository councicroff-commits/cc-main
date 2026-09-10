import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Link } from 'react-router-dom';
import '../index.css';

// =================================================================
// INTERFACES
// =================================================================
interface BackgroundConfig {
  type?: string;
  source: string;
  fallbackImage: string;
}

interface HeroConfig {
  badgeText: string;
  badgeFontFamily?: string;
  titleTop: string;
  titleTopFontFamily?: string;
  titleBottom: string;
  titleBottomFontFamily?: string;
  heading: string;
  headingFontFamily?: string;
  narrative: string;
  narrativeFontFamily?: string;
  ctaText: string;
  ctaPath: string;
  background: BackgroundConfig;
}

interface CategoryCard {
  id: number;
  title: string;
  titleFontFamily?: string;
  subtitle: string;
  subtitleFontFamily?: string;
  description: string;
  descriptionFontFamily?: string;
  image: string;
  path: string;
}

interface CarouselConfig {
  eyebrow: string;
  eyebrowFontFamily?: string;
  title: string;
  titleFontFamily?: string;
  cards: CategoryCard[];
}

interface StatItem {
  number: string;
  numberFontFamily?: string;
  label: string;
  labelFontFamily?: string;
}

interface StatsConfig {
  eyebrow: string;
  eyebrowFontFamily?: string;
  heading: string;
  headingFontFamily?: string;
  items: StatItem[];
}

interface HomeData {
  hero: HeroConfig;
  carousel: CarouselConfig;
  stats: StatsConfig;
}

// =================================================================
// API CONFIGURATION
// =================================================================
const API_BASE_URL = 'https://cc-backend-yc-team.onrender.com/api/v1';

const Home: React.FC = () => {
  const [data, setData] = useState<HomeData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [activeIndex, setActiveIndex] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [isHovering, setIsHovering] = useState(false);

  const dragStartX = useRef<number | null>(null);
  const dragCurrentX = useRef<number | null>(null);
  const hasDragged = useRef(false);
  const carouselRef = useRef<HTMLDivElement>(null);

  // =================================================================
  // DATA FETCHING 
  // =================================================================
  const fetchHomeData = useCallback(async (signal?: AbortSignal) => {
    setLoading(true);
    try {
      const response = await fetch(`${API_BASE_URL}/home`, { signal });
      if (!response.ok) throw new Error(`Server responded with status ${response.status}`);
      const result: HomeData = await response.json();
      setData(result);
    } catch (err: any) {
      if (err.name !== 'AbortError') {
        console.error('[Home Component] Data Fetch Error:', err);
      }
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const controller = new AbortController();
    fetchHomeData(controller.signal);
    return () => controller.abort();
  }, [fetchHomeData]);

  // =================================================================
  // CAROUSEL LOGIC
  // =================================================================
  const cards = data?.carousel?.cards || [];
  const totalCards = cards.length;

  useEffect(() => {
    if (isDragging || isHovering || totalCards <= 1) return;
    const interval = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % totalCards);
    }, 7000);
    return () => clearInterval(interval);
  }, [isDragging, isHovering, totalCards]);

  const goTo = useCallback((index: number) => {
    if (totalCards === 0) return;
    setActiveIndex((index + totalCards) % totalCards);
  }, [totalCards]);

  const goNext = useCallback(() => {
    if (totalCards === 0) return;
    setActiveIndex((prev) => (prev + 1) % totalCards);
  }, [totalCards]);

  const goPrev = useCallback(() => {
    if (totalCards === 0) return;
    setActiveIndex((prev) => (prev === 0 ? totalCards - 1 : prev - 1));
  }, [totalCards]);

  // =================================================================
  // UNIFIED POINTER EVENTS
  // =================================================================
  const handlePointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    e.currentTarget.setPointerCapture(e.pointerId);
    dragStartX.current = e.clientX;
    dragCurrentX.current = e.clientX;
    hasDragged.current = false;
    setIsDragging(true);
  };

  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!isDragging || dragStartX.current === null) return;
    dragCurrentX.current = e.clientX;
    if (Math.abs(e.clientX - dragStartX.current) > 8) {
      hasDragged.current = true;
    }
  };

  const handlePointerUp = (e: React.PointerEvent<HTMLDivElement>) => {
    e.currentTarget.releasePointerCapture(e.pointerId);
    if (!isDragging || dragStartX.current === null || dragCurrentX.current === null) {
      setIsDragging(false);
      return;
    }
    const distance = dragStartX.current - dragCurrentX.current;
    const swipeThreshold = 55;

    if (Math.abs(distance) > swipeThreshold) {
      if (distance > 0) goNext();
      else goPrev();
    }
    dragStartX.current = null;
    dragCurrentX.current = null;
    setIsDragging(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (e.key === 'ArrowRight') goNext();
    if (e.key === 'ArrowLeft') goPrev();
  };

  // =================================================================
  // RENDER STATES
  // =================================================================
  
  if (loading || !data || !data.hero || !data.carousel || !data.stats) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-black text-white">
        <div className="relative z-10 flex flex-col items-center">
          <div className="w-12 h-12 border-2 border-sky-400/20 border-t-sky-400 rounded-full animate-spin mb-6" />
          <span className="text-[10px] sm:text-xs tracking-[0.4em] uppercase font-medium text-zinc-400">
            initializing...
          </span>
        </div>
      </div>
    );
  }

  const { hero, carousel: carouselConfig, stats: statsConfig } = data;
  const isVideoBackground = hero.background?.type === 'video' || (!hero.background?.type && hero.background?.source && !hero.background.source.match(/\.(jpeg|jpg|png|webp|gif)$/i));

  return (
    <div className="bg-black overflow-hidden selection:bg-sky-400 selection:text-black font-sans">
      
      {/* --- HERO SECTION (kept dark) --- */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        {isVideoBackground ? (
          <video
            autoPlay
            muted
            loop
            playsInline
            poster={hero.background.fallbackImage}
            className="absolute inset-0 w-full h-full object-cover scale-100 opacity-85"
          >
            <source src={hero.background.source} type="video/mp4" />
          </video>
        ) : (
          <div
            className="absolute inset-0 w-full h-full bg-cover bg-center scale-100 opacity-85"
            style={{ backgroundImage: `url(${hero.background.source || hero.background.fallbackImage})` }}
          />
        )}

        <div className="absolute inset-0 bg-black/35" />
        <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-transparent to-black/85" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(56,189,248,0.06)_0%,transparent_70%)]" />

        <div className="relative z-20 w-full max-w-6xl mx-auto px-6 text-center pt-12 sm:pt-16">
          <div className="flex justify-center mb-6 sm:mb-8">
            <div className="px-4.5 py-1.5 rounded-full border border-white/15 bg-black/40 backdrop-blur-xl shadow-lg">
              <span 
                className="text-[10px] sm:text-xs tracking-[0.35em] uppercase font-medium text-zinc-200"
                style={{ fontFamily: hero.badgeFontFamily || 'inherit' }}
              >
                {hero.badgeText}
              </span>
            </div>
          </div>

          <div className="relative flex flex-col items-center mb-5 sm:mb-6 select-none">
            <div className="absolute w-[220px] sm:w-[360px] md:w-[520px] h-[120px] bg-sky-500/10 blur-[90px] rounded-full top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none" />
            <svg width="100%" height="100%" viewBox="0 0 1000 320" fill="none" className="max-w-[720px] drop-shadow-[0_16px_36px_rgba(0,0,0,0.8)]">
              <defs>
                <linearGradient id="chromeSkyGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#F0F9FF" />
                  <stop offset="40%" stopColor="#BAE6FD" />
                  <stop offset="75%" stopColor="#38BDF8" />
                  <stop offset="100%" stopColor="#0284C7" />
                </linearGradient>
                <linearGradient id="zincSilkGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                  <stop offset="0%" stopColor="#FFFFFF" />
                  <stop offset="100%" stopColor="#D4D4D8" />
                </linearGradient>
              </defs>
              <text x="500" y="150" textAnchor="middle" fill="url(#zincSilkGrad)" fontSize="150" fontWeight="900" fontFamily={hero.titleTopFontFamily || 'system-ui, sans-serif'} letterSpacing="-0.04em">
                {hero.titleTop}
              </text>
              <text x="515" y="255" textAnchor="middle" fill="url(#chromeSkyGrad)" fontSize="175" fontWeight="950" fontFamily={hero.titleBottomFontFamily || 'system-ui, sans-serif'} letterSpacing="-0.06em" style={{ filter: 'drop-shadow(0 10px 24px rgba(14,165,233,0.35))' }}>
                {hero.titleBottom}
              </text>
            </svg>
          </div>

          <div className="max-w-2xl mx-auto">
            <h1 className="text-white font-bold text-2xl sm:text-3xl md:text-4xl tracking-tight leading-[1.2]" style={{ fontFamily: hero.headingFontFamily || 'inherit' }}>
              {hero.heading}
            </h1>
            <p className="mt-4 text-zinc-300 text-xs sm:text-sm md:text-base leading-relaxed font-light" style={{ fontFamily: hero.narrativeFontFamily || 'inherit' }}>
              {hero.narrative}
            </p>
          </div>

          <div className="flex flex-col sm:flex-row justify-center gap-3.5 mt-8 sm:mt-10">
            <Link to={hero.ctaPath} className="group relative overflow-hidden px-7 py-3 rounded-full font-bold uppercase tracking-[0.16em] text-[10px] sm:text-[11px] text-black bg-gradient-to-r from-sky-400 via-cyan-300 to-sky-500 shadow-[0_10px_30px_rgba(14,165,233,0.25)] transition-all duration-500 hover:scale-[1.02] hover:shadow-[0_14px_40px_rgba(14,165,233,0.35)]">
              <span className="relative z-10 flex items-center justify-center gap-2">
                {hero.ctaText}
                <span className="transition-transform duration-300 group-hover:translate-x-1">→</span>
              </span>
              <div className="absolute inset-0 bg-white/20 -translate-x-[120%] skew-x-12 animate-[shine_6s_infinite_ease-in-out]" />
            </Link>
          </div>
        </div>

        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex flex-col items-center select-none pointer-events-none">
          <span className="text-[9px] tracking-[0.4em] uppercase text-zinc-400 font-medium">Scroll</span>
          <div className="mt-2 w-px h-10 bg-gradient-to-b from-sky-400/60 via-sky-900/30 to-transparent" />
        </div>
      </section>

      {/* --- CAROUSEL SECTION (light theme) --- */}
      <section className="relative py-16 md:py-24 bg-slate-50">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-12 md:mb-16">
            <span className="uppercase tracking-[0.45em] text-sky-500 text-[11px] font-bold block" style={{ fontFamily: carouselConfig.eyebrowFontFamily || 'inherit' }}>
              {carouselConfig.eyebrow}
            </span>
            <h2 className="mt-2 text-slate-800 font-black text-2xl sm:text-3xl md:text-4xl tracking-tight" style={{ fontFamily: carouselConfig.titleFontFamily || 'inherit' }}>
              {carouselConfig.title}
            </h2>
            <div className="w-8 h-px bg-sky-400/50 mx-auto mt-4" />
          </div>

          <div className="relative">
            <button onClick={goPrev} aria-label="Previous slide" className="hidden md:flex absolute left-2 lg:left-12 top-1/2 -translate-y-1/2 z-50 w-12 h-12 rounded-full bg-white border border-slate-200 text-slate-700 items-center justify-center shadow-md transition-all duration-300 hover:bg-sky-400 hover:text-white hover:border-sky-400 hover:scale-105 cursor-pointer">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" /></svg>
            </button>
            <button onClick={goNext} aria-label="Next slide" className="hidden md:flex absolute right-2 lg:right-12 top-1/2 -translate-y-1/2 z-50 w-12 h-12 rounded-full bg-white border border-slate-200 text-slate-700 items-center justify-center shadow-md transition-all duration-300 hover:bg-sky-400 hover:text-white hover:border-sky-400 hover:scale-105 cursor-pointer">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" /></svg>
            </button>

            <div
              ref={carouselRef}
              role="region"
              aria-roledescription="carousel"
              aria-label="Product categories"
              tabIndex={0}
              className="relative h-[340px] sm:h-[390px] md:h-[440px] flex items-center justify-center select-none cursor-grab active:cursor-grabbing touch-pan-y outline-none"
              style={{ perspective: '2200px', transformStyle: 'preserve-3d' }}
              onMouseEnter={() => setIsHovering(true)}
              onMouseLeave={() => { setIsHovering(false); setIsDragging(false); }}
              onPointerDown={handlePointerDown}
              onPointerMove={handlePointerMove}
              onPointerUp={handlePointerUp}
              onPointerCancel={handlePointerUp}
              onKeyDown={handleKeyDown}
            >
              {cards.length > 0 && cards.map((card, index) => {
                let relative = index - activeIndex;
                if (relative < -1) relative += totalCards;
                if (relative > 1) relative -= totalCards;

                const isCenter = relative === 0;
                const isLeft = relative === -1;
                const isRight = relative === 1;

                if (!isCenter && !isLeft && !isRight) return null;

                return (
                  <div
                    key={card.id || index}
                    className={`absolute carousel-card ${isCenter ? 'animate-[floatCenter_7s_ease-in-out_infinite]' : ''}`}
                    style={{
                      transform: isCenter ? 'translateX(0%) scale(1.05) rotateY(0deg) translateZ(100px)' : isLeft ? 'translateX(-62%) scale(0.75) rotateY(22deg) translateZ(-30px)' : 'translateX(62%) scale(0.75) rotateY(-22deg) translateZ(-30px)',
                      opacity: isCenter ? 1 : 0.55,
                      zIndex: isCenter ? 40 : 10,
                      filter: isCenter ? 'none' : 'brightness(0.92)',
                      pointerEvents: isCenter ? 'auto' : 'none',
                    }}
                  >
                    {isCenter && <div className="absolute inset-2 scale-110 bg-sky-400/20 blur-[70px] rounded-[32px] pointer-events-none animate-[pulseGlow_4s_ease-in-out_infinite]" />}
                    <div className={`relative overflow-hidden rounded-[20px] transform-gpu w-[180px] sm:w-[220px] md:w-[260px] h-[260px] sm:h-[310px] md:h-[360px] bg-white border border-slate-200/80 shadow-[0_12px_32px_rgba(0,0,0,0.08)] group transition-all duration-700 ${isCenter ? 'shadow-[0_20px_45px_-8px_rgba(14,165,233,0.2)] border-sky-300/60' : ''}`}>
                      <img src={card.image} alt={card.title} draggable={false} loading="lazy" className="w-full h-full object-cover transition-transform duration-[1600ms] ease-[cubic-bezier(0.25,1,0.5,1)] group-hover:scale-[1.08]" />
                      <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 via-slate-900/30 to-transparent opacity-90" />
                      <div className="absolute inset-0 bg-gradient-to-b from-sky-400/10 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-600" />
                      
                      <div className="absolute top-3.5 left-3.5 translate-y-2 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-500">
                        <span className="px-2.5 py-1 rounded-full bg-white/90 backdrop-blur-md border border-slate-200/60 text-sky-600 text-[8px] sm:text-[9px] uppercase font-semibold tracking-[0.2em]" style={{ fontFamily: card.subtitleFontFamily || 'inherit' }}>
                          {card.subtitle}
                        </span>
                      </div>
                      <div className="absolute bottom-0 left-0 right-0 p-4 sm:p-5 translate-y-1 group-hover:translate-y-0 transition-transform duration-500">
                        <h3 className="text-white text-lg sm:text-xl md:text-2xl font-extrabold tracking-tight" style={{ fontFamily: card.titleFontFamily || 'inherit' }}>{card.title}</h3>
                        <p className="text-slate-200 text-[11px] sm:text-xs mt-1 mb-2.5 font-light leading-relaxed max-w-[180px] opacity-0 group-hover:opacity-100 transition-opacity duration-500 delay-75" style={{ fontFamily: card.descriptionFontFamily || 'inherit' }}>{card.description}</p>
                        <Link to={card.path} onClick={(e) => { if (hasDragged.current) e.preventDefault(); }} className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-white text-slate-800 font-bold text-[8px] sm:text-[9px] uppercase tracking-[0.16em] transition-all duration-300 shadow-md hover:bg-sky-400 hover:text-white hover:scale-[1.03]">
                          Explore
                        </Link>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="flex justify-center gap-2 mt-8 md:mt-10" role="tablist" aria-label="Carousel navigation">
            {cards.map((_, index) => (
              <button key={index} onClick={() => goTo(index)} aria-label={`Go to slide ${index + 1}`} aria-selected={activeIndex === index} role="tab" className={`transition-all duration-700 rounded-full h-1.5 cursor-pointer ${activeIndex === index ? 'w-7 bg-sky-500 shadow-[0_0_10px_rgba(56,189,248,0.4)]' : 'w-1.5 bg-slate-300 hover:bg-slate-400'}`} />
            ))}
          </div>
        </div>
      </section>

      {/* --- STATS SECTION (light theme) --- */}
      <section className="relative py-20 md:py-24 bg-white overflow-hidden border-t border-slate-200/60">
        <div className="absolute left-1/2 top-0 -translate-x-1/2 w-[700px] h-[700px] bg-sky-300/10 blur-[140px] rounded-full pointer-events-none" />
        <div className="relative z-10 max-w-6xl mx-auto px-6">
          <div className="text-center mb-14 md:mb-16">
            <span className="text-sky-500 uppercase tracking-[0.4em] text-[11px] font-bold block" style={{ fontFamily: statsConfig.eyebrowFontFamily || 'inherit' }}>
              {statsConfig.eyebrow}
            </span>
            <h2 className="mt-2 text-slate-800 text-2xl sm:text-3xl md:text-4xl font-black tracking-tight" style={{ fontFamily: statsConfig.headingFontFamily || 'inherit' }}>
              {statsConfig.heading}
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5 md:gap-6">
            {statsConfig.items.map((stat, index) => (
              <div key={index} className="group relative overflow-hidden rounded-2xl bg-white border border-slate-200/80 p-7 md:p-8 transition-all duration-500 hover:border-sky-300/60 hover:-translate-y-1 shadow-sm hover:shadow-md">
                <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-600 bg-gradient-to-br from-sky-50 to-transparent pointer-events-none" />
                <h3 className="relative text-3xl sm:text-4xl md:text-5xl font-black text-transparent bg-clip-text bg-gradient-to-b from-slate-800 to-slate-500 tracking-tight" style={{ fontFamily: stat.numberFontFamily || 'inherit' }}>
                  {stat.number}
                </h3>
                <div className="mt-4 w-6 h-[2px] bg-sky-400/60 transition-all duration-500 group-hover:w-12 group-hover:bg-sky-500" />
                <p className="mt-3 text-slate-500 uppercase tracking-[0.2em] text-[10px] sm:text-[11px] font-medium transition-colors duration-300 group-hover:text-slate-600" style={{ fontFamily: stat.labelFontFamily || 'inherit' }}>
                  {stat.label}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;