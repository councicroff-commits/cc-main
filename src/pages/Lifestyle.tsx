import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { useProducts } from '../context/ProductContext';
import ProductGrid from '../components/product/ProductGrid';

// =================================================================
// INTERFACES & HELPERS
// =================================================================
interface CategoryCard {
  title: string;
  titleFontFamily?: string;
  subtitle: string;
  subtitleFontFamily?: string;
  description: string;
  descriptionFontFamily?: string;
  image: string;
  path: string;
}

// 🔥 DYNAMIC PERMANENT FIX for Lifestyle (Cleaned single slash)
const getApiBaseUrl = () => {
  return `https://cc-backend-yc-team.onrender.com/api/v1`;
};

const API_BASE_URL = getApiBaseUrl();

const extractErrorMessage = (data: any, fallback: string): string => {
  if (!data) return fallback;
  if (typeof data === 'string') return data;
  if (typeof data.detail === 'string') return data.detail;
  if (Array.isArray(data.detail)) {
    return data.detail.map((err: any) => err.msg || JSON.stringify(err)).join(', ');
  }
  if (typeof data.message === 'string') return data.message;
  if (typeof data.error === 'string') return data.error;
  return fallback;
};

const parseResponse = async (response: Response) => {
  const text = await response.text();
  try {
    return text ? JSON.parse(text) : {};
  } catch {
    return { detail: text || `Server error (Status ${response.status})` };
  }
};

const FALLBACK_CARD: CategoryCard = {
  title: 'Lifestyle Objects',
  subtitle: 'Modern Essentials',
  description: 'Elevate your daily environment with minimalist everyday carry items, desk tools, and leather accessories.',
  image: '',
  path: '/lifestyle'
};

export const LifestylePage: React.FC = () => {
  const { products, isLoading: isProductsLoading } = useProducts();
  const [homeData, setHomeData] = useState<any>(null);
  const [isApiLoading, setIsApiLoading] = useState<boolean>(true);
  const [apiError, setApiError] = useState<boolean>(false);

  const fetchHomeData = useCallback(async () => {
    setIsApiLoading(true);
    setApiError(false);

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 15000);

    try {
      const response = await fetch(`${API_BASE_URL}/home`, {
        method: 'GET',
        signal: controller.signal,
        headers: { 'Content-Type': 'application/json' },
      });
      clearTimeout(timeoutId);

      const data = await parseResponse(response);

      if (!response.ok) {
        const msg = extractErrorMessage(data, `Status ${response.status}`);
        throw new Error(msg);
      }

      setHomeData(data);
    } catch (err: any) {
      if (err.name !== 'AbortError') {
        console.error('[LifestylePage] Failed to fetch dynamic banner. Using fallback.', err);
        setApiError(true);
      } else {
        console.warn('[LifestylePage] Request timed out. Using fallback.');
        setApiError(true);
      }
    } finally {
      setIsApiLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchHomeData();
  }, [fetchHomeData]);

  const pageCard: CategoryCard = useMemo(() => {
    if (apiError || !homeData?.carousel?.cards) return FALLBACK_CARD;
    const matchedCard = homeData.carousel.cards.find((c: CategoryCard) => c.path === '/lifestyle');
    return matchedCard || FALLBACK_CARD;
  }, [homeData, apiError]);

  const lifestyleProducts = useMemo(() => {
    return (products || []).filter(p => {
      const pCat = (p.category || '').toLowerCase();
      return pCat === 'lifestyle' || pCat === 'essentials';
    });
  }, [products]);

  return (
    <div className="min-h-screen bg-zinc-50 text-zinc-900 pt-24 pb-24 px-4 sm:px-8 font-sans selection:bg-black selection:text-white">
      <div className="max-w-6xl mx-auto space-y-12">
        
        <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-xs font-semibold uppercase tracking-widest text-zinc-400">
          <Link to="/category/all" className="hover:text-black transition-colors focus:outline-none focus:ring-2 focus:ring-sky-500 rounded px-1">Categories</Link>
          <span aria-hidden="true">/</span>
          <span className="text-black px-1" aria-current="page">Lifestyle</span>
        </nav>

        <header className="relative w-full h-80 sm:h-96 rounded-3xl overflow-hidden shadow-2xl bg-zinc-900 border border-zinc-800">
          {pageCard.image ? (
            <img 
              src={pageCard.image} 
              alt="Lifestyle Collection Presentation" 
              className="absolute inset-0 w-full h-full object-cover object-center opacity-50"
            />
          ) : null}
          <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent z-10" />
          
          <div className="absolute bottom-8 left-8 right-8 z-20 space-y-3">
            <span 
              className="bg-white/10 backdrop-blur-md text-white border border-white/20 text-[10px] font-bold uppercase tracking-[0.25em] px-4 py-1.5 rounded-full inline-block"
              style={{ fontFamily: pageCard.subtitleFontFamily || 'inherit' }}
            >
              {pageCard.subtitle}
            </span>
            <h1 
              className="text-4xl sm:text-6xl font-black text-white tracking-tight"
              style={{ fontFamily: pageCard.titleFontFamily || 'inherit' }}
            >
              {pageCard.title}
            </h1>
            <p 
              className="text-zinc-300 text-sm max-w-xl"
              style={{ fontFamily: pageCard.descriptionFontFamily || 'inherit' }}
            >
              {pageCard.description}
            </p>
          </div>
        </header>

        <section className="space-y-6" aria-label="Lifestyle Products">
          <div className="flex justify-between items-center border-b border-zinc-200 pb-4">
            <h2 className="text-xs uppercase font-extrabold tracking-[0.2em] text-zinc-400">
              Showing {lifestyleProducts.length} Items
            </h2>
          </div>

          {isProductsLoading || isApiLoading ? (
            <div className="py-24 text-center text-zinc-400 text-xs font-bold uppercase tracking-widest" aria-live="polite">
              Loading lifestyle collection...
            </div>
          ) : lifestyleProducts.length > 0 ? (
            <ProductGrid products={lifestyleProducts} />
          ) : (
            <div className="py-24 text-center text-zinc-400 text-xs uppercase tracking-widest border border-dashed border-zinc-200 rounded-3xl bg-white shadow-sm">
              No lifestyle items available at the moment.
            </div>
          )}
        </section>

      </div>
    </div>
  );
};

export default LifestylePage;