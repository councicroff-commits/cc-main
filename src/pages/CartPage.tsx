import React, { useEffect, useState, useCallback } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { Sparkles } from 'lucide-react';

const formatPHP = (value: number): string => {
  return new Intl.NumberFormat('en-PH', {
    style: 'currency',
    currency: 'PHP',
  }).format(value);
};

// 🔥 DYNAMIC PERMANENT FIX for Events (Cleaned single slash)
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

interface EventItem {
  id?: string;
  _id?: string;
  title: string;
  description: string;
  event_type: string;
  discount_amount: number;
  start_date?: string;
  end_date?: string;
  status: string;
  is_featured: boolean;
}

const CartPage: React.FC = () => {
  const { 
    cartItems, 
    updateQuantity, 
    removeFromCart, 
    clearCart, 
    cartSubtotal,
    appliedCoupon,
    couponInput,
    setCouponInput,
    couponError,
    couponSuccess,
    isApplying,
    handleApplyCoupon,
    handleRemoveCoupon,
    taxRate,
    refreshCoupons 
  } = useCart() as any;
  
  const { user } = useAuth();
  const navigate = useNavigate();
  const [isMounted, setIsMounted] = useState(false);
  const [activeEvents, setActiveEvents] = useState<EventItem[]>([]);

  const fetchActiveEvents = useCallback(async () => {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 15000);

    try {
      const response = await fetch(`${API_BASE_URL}/events`, {
        method: 'GET',
        signal: controller.signal,
        headers: {
          'Content-Type': 'application/json',
        },
      });
      clearTimeout(timeoutId);

      const data = await parseResponse(response);

      if (!response.ok) {
        const msg = extractErrorMessage(data, `Failed to fetch events (${response.status})`);
        console.error('[CartPage] Events error:', msg);
        return;
      }

      const eventsArray = Array.isArray(data) ? data : (data.events || data.data || []);
      const now = new Date();

      const active = eventsArray.filter((ev: EventItem) => {
        const isActiveStatus = ev.status && ev.status.toLowerCase() === 'active';
        let isNotExpired = true;
        if (ev.end_date) {
          const endDate = new Date(ev.end_date);
          isNotExpired = endDate >= now;
        }
        return isActiveStatus && isNotExpired;
      });

      setActiveEvents(active);
    } catch (err: any) {
      if (err.name === 'AbortError') {
        console.warn('[CartPage] Events request timed out.');
      } else {
        console.error('[CartPage] Failed to fetch active events:', err);
      }
    }
  }, []);

  useEffect(() => {
    setIsMounted(true);
    if (typeof refreshCoupons === 'function') {
      refreshCoupons();
    }
    fetchActiveEvents();
  }, [fetchActiveEvents, refreshCoupons]);

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleApplyCoupon();
    }
  };

  // --- UNIFIED CALCULATIONS ---
  const taxPercentageLabel = Math.round(taxRate ? (taxRate <= 1 ? taxRate * 100 : taxRate) : 8);
  const effectiveTaxRate = taxRate ? (taxRate > 1 ? taxRate / 100 : taxRate) : 0.08;
  
  const eventDiscountTotal = activeEvents.reduce((acc, ev) => acc + (Number(ev.discount_amount) || 0), 0);

  let couponDiscountAmount = 0;
  if (appliedCoupon) {
    if (appliedCoupon.type === 'percent') {
      couponDiscountAmount = (cartSubtotal * appliedCoupon.discount) / 100;
      if (appliedCoupon.maxDiscount && couponDiscountAmount > appliedCoupon.maxDiscount) {
        couponDiscountAmount = appliedCoupon.maxDiscount;
      }
    } else {
      couponDiscountAmount = appliedCoupon.discount;
    }
  }

  const netSubtotal = Math.max(0, cartSubtotal - eventDiscountTotal - couponDiscountAmount);
  
  // Shipping strictly free nationwide
  const shipping = 0;

  // Tax calculated on net subtotal
  const tax = netSubtotal * effectiveTaxRate;
  const total = netSubtotal + shipping + tax;

  const handleProceedToCheckout = () => {
    // Pass pre-calculated totals to checkout to avoid tax duplication
    navigate('/checkout', {
      state: {
        summary: {
          subtotal: cartSubtotal,
          eventDiscountTotal,
          couponDiscountAmount,
          netSubtotal,
          shipping,
          tax,
          total,
          taxPercentageLabel
        }
      }
    });
  };

  return (
    <div className="min-h-screen bg-white text-slate-900 pt-24 pb-24 px-4 sm:px-8 lg:px-12 font-sans selection:bg-slate-900 selection:text-white">
      <div className={`max-w-7xl mx-auto transition-all duration-1000 ease-out transform ${isMounted ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'}`}>
        
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end border-b border-slate-200 pb-8 mb-10 md:mb-16 gap-6">
          <div>
            <p className="text-slate-500 text-[10px] tracking-[0.3em] font-semibold uppercase mb-2">Secure Checkout</p>
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight text-slate-900">Your Selection</h1>
            <p className="text-slate-500 mt-3 max-w-md text-sm sm:text-base font-light">Curated pieces from the archive. Ready for verification.</p>
          </div>
          
          <Link 
            to="/shop" 
            className="group flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-slate-600 hover:text-slate-900 transition-all duration-300"
          >
            <svg className="w-4 h-4 transform group-hover:-translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Continue Curating
          </Link>
        </div>

        {cartItems.length === 0 ? (
          <div className="py-24 sm:py-32 flex flex-col items-center justify-center text-center border border-slate-200 bg-slate-50 rounded-3xl">
            <div className="w-20 h-20 sm:w-24 sm:h-24 mb-8 border border-slate-200 rounded-2xl flex items-center justify-center text-slate-400 bg-white shadow-xs">
              <svg className="w-8 h-8 sm:w-10 sm:h-10" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
              </svg>
            </div>
            <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-slate-900 mb-3">Your archive is empty.</h2>
            <p className="text-slate-500 text-sm sm:text-base max-w-xs font-light tracking-wide mb-10">Begin your journey through our signature worlds.</p>
            
            <Link 
              to="/shop"
              className="group px-8 sm:px-12 py-4 bg-slate-900 hover:bg-slate-800 text-white text-xs sm:text-sm font-bold uppercase tracking-[0.15em] transition-all duration-300 flex items-center gap-4 rounded-full shadow-sm"
            >
              EXPLORE THE ARCHIVE
              <span className="group-hover:translate-x-1 transition-transform">→</span>
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16">
            
            {/* Left Column: Cart Items */}
            <div className="lg:col-span-7 xl:col-span-8 space-y-8">
              <div className="flex justify-between items-center text-xs uppercase tracking-[0.15em] text-slate-500 border-b border-slate-200 pb-4">
                <span className="font-semibold text-slate-900">ITEMS • {cartItems.length}</span>
                <button 
                  onClick={clearCart}
                  className="flex items-center gap-1.5 text-slate-500 hover:text-rose-600 transition-colors font-semibold cursor-pointer"
                >
                  <span>✕</span> CLEAR ALL
                </button>
              </div>

              {cartItems.map((item: any) => (
                <div 
                  key={item.id || item._id} 
                  className="group flex flex-col sm:flex-row gap-6 sm:gap-8 border-b border-slate-100 pb-8 last:border-none last:pb-0"
                >
                  <div className="w-full sm:w-36 md:w-40 h-72 sm:h-48 md:h-52 bg-slate-100 flex-shrink-0 overflow-hidden relative rounded-xl border border-slate-200">
                    <img 
                      src={item.image || item.imageUrl} 
                      alt={item.name} 
                      className="w-full h-full object-cover opacity-95 group-hover:opacity-100 group-hover:scale-105 transition-all duration-700 ease-in-out" 
                    />
                  </div>
                  
                  <div className="flex-1 flex flex-col justify-between">
                    <div className="flex flex-col sm:flex-row justify-between items-start gap-4 sm:gap-0">
                      <div className="flex-1 pr-4">
                        <p className="text-slate-500 text-[10px] tracking-[0.2em] font-semibold uppercase mb-1.5">{item.category || 'General'}</p>
                        <h3 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900 leading-tight">{item.name}</h3>
                        {item.variant && (
                          <p className="text-slate-500 mt-2 text-xs sm:text-sm font-light">{item.variant}</p>
                        )}
                      </div>
                      <div className="text-left sm:text-right">
                        <p className="text-xl sm:text-2xl font-light text-slate-900">{formatPHP(item.price)}</p>
                        <p className="text-[10px] text-slate-500 mt-1 uppercase tracking-widest font-semibold">PER UNIT</p>
                      </div>
                    </div>

                    <div className="mt-6 sm:mt-auto flex justify-between items-center sm:items-end pt-4 sm:pt-8">
                      <div className="flex items-center border border-slate-200 bg-white rounded-lg overflow-hidden h-10 sm:h-12 shadow-xs">
                        <button 
                          onClick={() => updateQuantity(item.id || item._id, -1)} 
                          className="px-4 sm:px-5 h-full text-lg sm:text-xl font-light hover:bg-slate-50 text-slate-900 transition-colors disabled:opacity-30 cursor-pointer"
                          disabled={item.quantity <= 1}
                        >
                          −
                        </button>
                        <span className="px-4 sm:px-6 h-full flex items-center justify-center text-sm sm:text-base font-medium tabular-nums border-x border-slate-200 text-slate-900">
                          {item.quantity}
                        </span>
                        <button 
                          onClick={() => updateQuantity(item.id || item._id, 1)} 
                          className="px-4 sm:px-5 h-full text-lg sm:text-xl font-light hover:bg-slate-50 text-slate-900 transition-colors cursor-pointer"
                        >
                          +
                        </button>
                      </div>

                      <div className="text-right flex flex-col items-end">
                        <p className="text-lg sm:text-xl font-medium text-slate-900 mb-2 hidden sm:block">
                          {formatPHP(item.price * item.quantity)}
                        </p>
                        <button 
                          onClick={() => removeFromCart(item.id || item._id)}
                          className="text-[10px] sm:text-xs uppercase tracking-widest font-semibold text-slate-500 hover:text-rose-600 underline underline-offset-4 transition-colors cursor-pointer"
                        >
                          Remove Item
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Right Column: Order Summary */}
            <div className="lg:col-span-5 xl:col-span-4 mt-8 lg:mt-0">
              <div className="bg-slate-50 border border-slate-200 p-6 sm:p-8 sticky top-28 rounded-2xl shadow-xs space-y-6">
                <h3 className="text-xs uppercase tracking-[0.2em] font-bold text-slate-900">Order Summary</h3>
                
                {activeEvents.length > 0 && (
                  <div className="bg-emerald-50 border border-emerald-200 p-4 rounded-xl space-y-2">
                    <div className="flex items-center gap-2 text-emerald-800 text-xs font-bold uppercase tracking-wider">
                      <Sparkles className="w-4 h-4 text-emerald-600" /> Active Event Discounts
                    </div>
                    {activeEvents.map((ev: any, i: number) => (
                      <div key={i} className="flex justify-between items-center text-xs text-emerald-900">
                        <span>{ev.title}</span>
                        <span className="font-bold">-₱{ev.discount_amount}</span>
                      </div>
                    ))}
                  </div>
                )}

                <div>
                  <div className="flex flex-col sm:flex-row gap-3">
                    <input
                      type="text"
                      value={couponInput || ''}
                      onChange={(e) => setCouponInput(e.target.value)}
                      onKeyPress={handleKeyPress}
                      placeholder="GIFT CODE OR PROMO"
                      className="flex-1 bg-white border border-slate-300 focus:border-slate-900 text-slate-900 text-xs sm:text-sm uppercase tracking-widest placeholder:text-slate-400 px-4 py-3.5 rounded-xl outline-none transition-all"
                      disabled={!!appliedCoupon}
                    />
                    <button 
                      onClick={handleApplyCoupon}
                      disabled={isApplying || !couponInput || !couponInput.trim() || !!appliedCoupon}
                      className="px-6 py-3.5 sm:py-0 bg-slate-900 hover:bg-slate-800 active:bg-slate-950 text-white font-bold uppercase tracking-widest text-xs rounded-xl transition-all disabled:opacity-40 disabled:cursor-not-allowed whitespace-nowrap cursor-pointer shadow-sm"
                    >
                      {isApplying ? '...' : 'APPLY'}
                    </button>
                  </div>

                  {couponError && <p className="text-rose-600 text-[10px] sm:text-xs mt-2.5 pl-1 tracking-wide">{couponError}</p>}
                  {couponSuccess && <p className="text-emerald-600 text-[10px] sm:text-xs mt-2.5 pl-1 tracking-wide">{couponSuccess}</p>}

                  {appliedCoupon && (
                    <div className="mt-4 flex items-center justify-between bg-white border border-slate-200 text-slate-700 px-4 py-3 rounded-xl text-xs sm:text-sm shadow-2xs">
                      <div className="flex flex-col">
                        <span className="font-mono tracking-widest font-bold text-slate-900">{appliedCoupon.code}</span>
                        <span className="mt-0.5 text-[10px] sm:text-xs text-slate-500">{appliedCoupon.description}</span>
                      </div>
                      <button 
                        onClick={handleRemoveCoupon}
                        className="text-[10px] uppercase tracking-widest font-semibold text-slate-500 hover:text-rose-600 transition-colors underline underline-offset-2 ml-4 cursor-pointer"
                      >
                        REMOVE
                      </button>
                    </div>
                  )}
                </div>

                <div className="space-y-4 text-xs sm:text-sm font-light tracking-wide text-slate-600 border-t border-slate-200 pt-6">
                  <div className="flex justify-between">
                    <span>Subtotal</span>
                    <span className="text-slate-900 tabular-nums font-medium">{formatPHP(cartSubtotal)}</span>
                  </div>

                  {eventDiscountTotal > 0 && (
                    <div className="flex justify-between text-emerald-700 font-medium">
                      <span>Event Discount</span>
                      <span className="tabular-nums">-{formatPHP(eventDiscountTotal)}</span>
                    </div>
                  )}

                  {couponDiscountAmount > 0 && (
                    <div className="flex justify-between text-emerald-700 font-medium">
                      <span>Coupon Discount</span>
                      <span className="tabular-nums">-{formatPHP(couponDiscountAmount)}</span>
                    </div>
                  )}

                  <div className="flex justify-between">
                    <span>Shipping &amp; Handling</span>
                    <span className="text-emerald-700 font-semibold uppercase text-xs tracking-wider">
                      FREE Shipping NATIONWIDE
                    </span>
                  </div>

                  <div className="flex justify-between">
                    <span>Duties &amp; Taxes ({taxPercentageLabel}%)</span>
                    <span className="text-slate-900 tabular-nums font-medium">{formatPHP(tax)}</span>
                  </div>
                </div>

                <div className="h-px bg-slate-200 my-6" />

                <div className="flex justify-between items-baseline mb-8">
                  <span className="uppercase tracking-[0.15em] text-xs font-semibold text-slate-500">Total Due Now</span>
                  <div className="text-right">
                    <span className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tighter tabular-nums">
                      {formatPHP(total)}
                    </span>
                    <p className="text-[9px] sm:text-[10px] text-slate-500 mt-1 uppercase tracking-widest font-semibold">PHP • INCLUDING TAX</p>
                  </div>
                </div>

                <button 
                  onClick={handleProceedToCheckout}
                  className="w-full py-4 sm:py-5 bg-slate-900 hover:bg-slate-800 active:scale-[0.98] text-white text-xs sm:text-sm font-extrabold uppercase tracking-[0.15em] transition-all duration-300 flex items-center justify-center gap-3 rounded-xl shadow-md cursor-pointer"
                >
                  PROCEED TO SECURE CHECKOUT
                  <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 sm:w-5 sm:h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CartPage;
