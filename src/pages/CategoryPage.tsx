import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { useProducts } from '../context/ProductContext';
import ProductGrid from '../components/product/ProductGrid';

// =================================================================
// INTERFACES
// =================================================================
interface CategoryCard {
  id: number | string;
  title: string;
  titleFontFamily?: string;
  subtitle: string;
  subtitleFontFamily?: string;
  description: string;
  descriptionFontFamily?: string;
  image: string;
  path: string;
}

interface HomeData {
  carousel: {
    cards: CategoryCard[];
  };
}

// =================================================================
// CONSTANTS
// =================================================================
const DEFAULT_CARDS: CategoryCard[] = [
  {
    id: 'default-1',
    title: 'The Wardrobe',
    subtitle: 'Apparel',
    description: 'Minimalist silhouettes, heavy-weight cottons, and timeless tailored fits.',
    image: 'https://images.unsplash.com/photo-1489987707025-afc232f7ea0f?q=80&w=1600&auto=format&fit=crop',
    path: '/clothes'
  },
  {
    id: 'default-2',
    title: 'Signature Scents',
    subtitle: 'Fragrance',
    description: 'Artisanal olfactory creations formulated with rare botanicals and essential notes.',
    image: 'https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?q=80&w=1600&auto=format&fit=crop',
    path: '/perfume'
  },
  {
    id: 'default-3',
    title: 'Lifestyle Objects',
    subtitle: 'Essentials',
    description: 'Curated carry goods, desk accessories, and modern everyday essentials.',
    image: 'https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?q=80&w=1600&auto=format&fit=crop',
    path: '/lifestyle'
  }
];

// 🔥 DYNAMIC PERMANENT FIX for Home / Categories (Cleaned single slash)
const getApiBaseUrl = () => {
  return `https://cc-backend-production-00fe.up.railway.app/api/v1`;
};

const API_BASE_URL = getApiBaseUrl();

// 🛠️ Helper function to safely pull error messages from FastAPI responses
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

// =================================================================
// COMPONENTS
// =================================================================
const ThreeDotsWave: React.FC = () => (
  <div className="w-full min-h-[60vh] flex items-center justify-center bg-transparent" role="status" aria-label="Loading content">
    <div className="flex items-center space-x-2">
      <div className="w-3 h-3 bg-black rounded-full animate-bounce" style={{ animationDelay: '0ms', animationDuration: '0.6s' }} />
      <div className="w-3 h-3 bg-black rounded-full animate-bounce" style={{ animationDelay: '150ms', animationDuration: '0.6s' }} />
      <div className="w-3 h-3 bg-black rounded-full animate-bounce" style={{ animationDelay: '300ms', animationDuration: '0.6s' }} />
    </div>
  </div>
);

export const CategoryPage: React.FC = () => {
  const { products, isLoading: isProductsLoading } = useProducts();
  const [homeData, setHomeData] = useState<HomeData | null>(null);
  const [isHomeLoading, setIsHomeLoading] = useState<boolean>(true);
  const [apiError, setApiError] = useState<boolean>(false);

  // =================================================================
  // DATA FETCHING
  // =================================================================
  const fetchHomeData = useCallback(async () => {
    setIsHomeLoading(true);
    setApiError(false);

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 15000);

    try {
      const response = await fetch(`${API_BASE_URL}/home`, {
        method: 'GET',
        signal: controller.signal,
        headers: {
          'Content-Type': 'application/json',
        },
      });
      clearTimeout(timeoutId);

      const data = await parseResponse(response);

      if (!response.ok) {
        const msg = extractErrorMessage(data, `Server responded with status ${response.status}`);
        throw new Error(msg);
      }

      setHomeData(data);
    } catch (err: any) {
      if (err.name !== 'AbortError') {
        console.error('[CategoryPage] Failed to fetch dynamic categories. Using fallbacks.', err);
        setApiError(true);
      } else {
        console.warn('[CategoryPage] Home data request timed out. Using fallbacks.');
        setApiError(true);
      }
    } finally {
      setIsHomeLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchHomeData();
  }, [fetchHomeData]);

  // =================================================================
  // DERIVED STATE & MEMOIZATION
  // =================================================================
  const cards: CategoryCard[] = useMemo(() => {
    if (apiError || !homeData?.carousel?.cards || homeData.carousel.cards.length === 0) {
      return DEFAULT_CARDS;
    }
    return homeData.carousel.cards;
  }, [homeData, apiError]);

  // =================================================================
  // RENDER
  // =================================================================
  if (isProductsLoading || isHomeLoading) {
    return (
      <div className="min-h-screen bg-zinc-50 flex justify-center items-center">
        <ThreeDotsWave />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-zinc-50 text-zinc-900 pt-24 pb-24 px-4 sm:px-8 font-sans selection:bg-black selection:text-white">
      <div className="max-w-6xl mx-auto space-y-24">
        
        {/* HEADER */}
        <header className="border-b border-zinc-200 pb-8 text-center sm:text-left flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div>
            <span className="text-[10px] uppercase font-bold tracking-[0.3em] text-zinc-400 block mb-2">Curated Storefront</span>
            <h1 className="text-4xl sm:text-5xl font-black tracking-tight text-black">Collections</h1>
            <p className="text-sm text-zinc-500 mt-2 font-medium tracking-wide">
              Explore our premium catalog categorized by lifestyle and style requirements.
            </p>
          </div>
          <div className="text-xs font-semibold text-zinc-400 uppercase tracking-widest" aria-live="polite">
            {products?.length || 0} Total Products
          </div>
        </header>

        {/* DYNAMIC CATEGORY LIST */}
        {cards.map((card, index) => {
          const categoryProducts = (products || []).filter(p => {
            const pCat = (p.category || '').toLowerCase();
            const pathKey = card.path.replace('/', '').toLowerCase();
            const subtitleKey = card.subtitle.toLowerCase();
            
            return (
              pCat === pathKey || 
              pCat === subtitleKey ||
              (pathKey === 'clothes' && pCat === 'apparel') ||
              (pathKey === 'perfume' && pCat === 'fragrance') ||
              (pathKey === 'lifestyle' && pCat === 'essentials')
            );
          });

          // Live banner image: prefer first product image from this category, fall back to carousel card image
          const liveBannerImage =
            categoryProducts.length > 0 && categoryProducts[0]?.image
              ? categoryProducts[0].image
              : card.image;
          
          return (
            <section key={card.id} className="space-y-8" aria-label={`${card.title} Category`}>
              <Link 
                to={card.path} 
                className="group relative w-full h-72 sm:h-96 rounded-3xl overflow-hidden shadow-2xl block bg-zinc-900 border border-zinc-800 focus:outline-none focus:ring-4 focus:ring-sky-500/50"
                aria-label={`Explore ${card.title}`}
              >
                <img 
                  src={liveBannerImage} 
                  alt={`${card.title} presentation`}
                  loading={index < 2 ? "eager" : "lazy"}
                  fetchPriority={index === 0 ? "high" : "auto"}
                  decoding="async"
                  className="absolute inset-0 w-full h-full object-cover object-center transition-transform duration-1000 group-hover:scale-105 opacity-60 group-hover:opacity-75"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent z-10" />

                {/* Badges */}
                <div className="absolute top-6 left-6 z-20 flex items-center gap-3">
                  <span 
                    className="bg-white/10 backdrop-blur-md text-white border border-white/20 text-[10px] font-bold uppercase tracking-[0.2em] px-4 py-1.5 rounded-full"
                    style={{ fontFamily: card.subtitleFontFamily || 'inherit' }}
                  >
                    {card.subtitle}
                  </span>
                  <span className="text-zinc-300 text-xs font-mono backdrop-blur-md bg-black/30 px-3 py-1 rounded-full border border-white/10">
                    {categoryProducts.length} items
                  </span>
                </div>

                {/* Text Content & CTA */}
                <div className="absolute bottom-8 left-6 right-6 z-20 flex flex-col sm:flex-row sm:items-end justify-between gap-4">
                  <div className="space-y-2 max-w-lg">
                    <h2 
                      className="text-3xl sm:text-5xl font-black text-white tracking-tight leading-none group-hover:translate-x-1 transition-transform duration-300"
                      style={{ fontFamily: card.titleFontFamily || 'inherit' }}
                    >
                      {card.title}
                    </h2>
                    <p 
                      className="text-zinc-300 text-xs sm:text-sm font-normal line-clamp-2"
                      style={{ fontFamily: card.descriptionFontFamily || 'inherit' }}
                    >
                      {card.description}
                    </p>
                  </div>

                  <div 
                    className="self-start sm:self-auto flex items-center gap-2 bg-white text-black px-6 py-3 rounded-2xl text-xs font-extrabold uppercase tracking-widest group-hover:bg-zinc-200 transition-all shadow-lg"
                    aria-hidden="true"
                  >
                    <span>View All</span>
                    <span className="transform group-hover:translate-x-1 transition-transform">&rarr;</span>
                  </div>
                </div>
              </Link>

              {/* Product Grid / Empty State */}
              {categoryProducts.length > 0 ? (
                <ProductGrid products={categoryProducts.slice(0, 4)} />
              ) : (
                <div className="py-16 text-center text-zinc-400 text-xs uppercase tracking-widest border border-dashed border-zinc-200 rounded-3xl bg-white shadow-sm">
                  No {card.subtitle.toLowerCase()} items currently listed.
                </div>
              )}
            </section>
          );
        })}

      </div>
    </div>
  );
};

export default CategoryPage;
