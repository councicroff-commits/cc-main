import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  ReactNode,
} from 'react';
import { useAuth } from './AuthContext';

interface CartItem {
  id: string | number;
  name: string;
  price: number;
  quantity: number;
  image?: string;
  category?: string;
  variant?: string;
}

interface EventItem {
  title: string;
  discount_amount: number;
  start_date: string;
  end_date: string;
  status?: string;
}

interface CartContextType {
  cartItems: CartItem[];
  totalItems: number;
  addToCart: (item: CartItem) => void;
  updateQuantity: (id: string | number, delta: number) => void;
  removeFromCart: (id: string | number) => void;
  clearCart: () => void;
  cartSubtotal: number;
  appliedCoupon: any;
  couponInput: string;
  setCouponInput: (val: string) => void;
  couponError: string;
  couponSuccess: string;
  isApplying: boolean;
  handleApplyCoupon: () => void;
  handleRemoveCoupon: () => void;
  activeEvents: EventItem[];
  eventDiscountTotal: number;
  taxRate: number;
  discountAmount: number;
  tax: number;
  total: number;
  refreshCoupons: () => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

// 🔥 DYNAMIC PERMANENT FIX for Cart (Cleaned single slash)
const getApiBaseUrl = () => {
  return `https://cc-backend-yc-team.onrender.com/api/v1`;
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

export const CartProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const { user } = useAuth();

  const getStorageKey = (currentUser: any) => {
    if (!currentUser) return 'cc_cart_guest';
    const userId = currentUser.id || currentUser._id || currentUser.email;
    return userId ? `cc_cart_${userId}` : 'cc_cart_guest';
  };

  const [storageKey, setStorageKey] = useState(() => getStorageKey(user));

  const [cartItems, setCartItems] = useState<CartItem[]>(() => {
    try {
      const initialKey = getStorageKey(user);
      const saved = localStorage.getItem(initialKey);
      if (saved) {
        const parsed = JSON.parse(saved);
        return parsed.map((item: any) => ({
          ...item,
          quantity: Number(item.quantity) || 1,
        }));
      }
      return [];
    } catch {
      return [];
    }
  });

  const [couponInput, setCouponInput] = useState('');
  const [appliedCoupon, setAppliedCoupon] = useState<any>(null);
  const [couponError, setCouponError] = useState('');
  const [couponSuccess, setCouponSuccess] = useState('');
  const [isApplying, setIsApplying] = useState(false);

  const [activeEvents, setActiveEvents] = useState<EventItem[]>([]);
  const [eventDiscountTotal, setEventDiscountTotal] = useState(0);
  const [taxRate, setTaxRate] = useState<number>(0.08);

  const getAuthHeaders = (includeAuth = true) => {
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
    };
    if (includeAuth) {
      const token = localStorage.getItem('token') || localStorage.getItem('access_token');
      if (token) {
        headers.Authorization = `Bearer ${token}`;
      }
    }
    return headers;
  };

  useEffect(() => {
    const newKey = getStorageKey(user);
    setStorageKey(newKey);

    try {
      const saved = localStorage.getItem(newKey);
      if (saved) {
        const parsed = JSON.parse(saved);
        setCartItems(
          parsed.map((item: any) => ({
            ...item,
            quantity: Number(item.quantity) || 1,
          }))
        );
      } else {
        setCartItems([]);
      }
    } catch {
      setCartItems([]);
    }
  }, [user]);

  useEffect(() => {
    try {
      localStorage.setItem(storageKey, JSON.stringify(cartItems));
    } catch (e) {
      console.error(e);
    }
  }, [cartItems, storageKey]);

  const fetchDashboardData = useCallback(async () => {
    // --- Tax ---
    const taxController = new AbortController();
    const taxTimeout = setTimeout(() => taxController.abort(), 15000);

    try {
      const taxRes = await fetch(`${API_BASE_URL}/tax`, {
        method: 'GET',
        signal: taxController.signal,
        headers: getAuthHeaders(false),
      });
      clearTimeout(taxTimeout);

      const taxData = await parseResponse(taxRes);

      if (taxRes.ok && typeof taxData.taxRate === 'number') {
        setTaxRate(taxData.taxRate);
      }
    } catch (err: any) {
      if (err.name !== 'AbortError') {
        console.error('[CartContext] Failed to fetch tax rate:', err);
      }
    }

    // --- Events ---
    const eventsController = new AbortController();
    const eventsTimeout = setTimeout(() => eventsController.abort(), 15000);

    try {
      const eventsRes = await fetch(`${API_BASE_URL}/events`, {
        method: 'GET',
        signal: eventsController.signal,
        headers: getAuthHeaders(false),
      });
      clearTimeout(eventsTimeout);

      const data = await parseResponse(eventsRes);

      if (!eventsRes.ok) {
        const msg = extractErrorMessage(data, `Failed to fetch events (${eventsRes.status})`);
        console.error('[CartContext] Events error:', msg);
        return;
      }

      const eventsArray = Array.isArray(data) ? data : data.events || data.data || [];
      const now = new Date();

      const currentActiveEvents = eventsArray.filter((ev: any) => {
        if (!ev.start_date || !ev.end_date) return false;
        const start = new Date(ev.start_date);
        const end = new Date(ev.end_date);
        return (
          now >= start &&
          now <= end &&
          ev.discount_amount &&
          Number(ev.discount_amount) > 0
        );
      });

      setActiveEvents(currentActiveEvents);

      const totalEventDiscount = currentActiveEvents.reduce(
        (sum: number, ev: EventItem) => sum + (Number(ev.discount_amount) || 0),
        0
      );
      setEventDiscountTotal(totalEventDiscount);
    } catch (err: any) {
      if (err.name !== 'AbortError') {
        console.error('[CartContext] Failed to fetch events:', err);
      }
    }
  }, []);

  useEffect(() => {
    fetchDashboardData();
  }, [fetchDashboardData]);

  const refreshCoupons = useCallback(() => {
    fetchDashboardData();
  }, [fetchDashboardData]);

  const totalItems = cartItems.reduce(
    (acc, item) => acc + (Number(item.quantity) || 1),
    0
  );
  const cartSubtotal = cartItems.reduce(
    (acc, item) => acc + (Number(item.price) || 0) * (Number(item.quantity) || 1),
    0
  );

  let couponDiscountValue = 0;
  if (appliedCoupon) {
    if (appliedCoupon.type === 'percent') {
      couponDiscountValue = (cartSubtotal * appliedCoupon.discount) / 100;
    } else {
      couponDiscountValue = appliedCoupon.discount;
    }
  }

  const discountAmount = Math.min(cartSubtotal, eventDiscountTotal + couponDiscountValue);
  const taxableAmount = Math.max(0, cartSubtotal - discountAmount);
  const tax = taxableAmount * taxRate;
  const total = Math.max(0, taxableAmount + tax);

  const addToCart = useCallback((newItem: CartItem) => {
    setCartItems((prev) => {
      const quantityToAdd = Number(newItem.quantity) > 0 ? Number(newItem.quantity) : 1;

      const existingIndex = prev.findIndex(
        (item) => String(item.id) === String(newItem.id) && item.variant === newItem.variant
      );

      if (existingIndex > -1) {
        return prev.map((item, index) =>
          index === existingIndex
            ? { ...item, quantity: (Number(item.quantity) || 1) + quantityToAdd }
            : item
        );
      }

      return [...prev, { ...newItem, quantity: quantityToAdd }];
    });
  }, []);

  const updateQuantity = useCallback((id: string | number, delta: number) => {
    setCartItems((prev) =>
      prev
        .map((item) => {
          if (String(item.id) === String(id)) {
            const currentQty = Number(item.quantity) || 1;
            const newQty = currentQty + delta;
            return newQty > 0 ? { ...item, quantity: newQty } : null;
          }
          return item;
        })
        .filter(Boolean) as CartItem[]
    );
  }, []);

  const removeFromCart = useCallback((id: string | number) => {
    setCartItems((prev) => prev.filter((item) => String(item.id) !== String(id)));
  }, []);

  const clearCart = useCallback(() => {
    setCartItems([]);
    setAppliedCoupon(null);
    setCouponInput('');
  }, []);

  const handleApplyCoupon = useCallback(async () => {
    if (!couponInput.trim()) return;
    setIsApplying(true);
    setCouponError('');
    setCouponSuccess('');

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 15000);

    try {
      const response = await fetch(`${API_BASE_URL}/coupons/validate`, {
        method: 'POST',
        signal: controller.signal,
        headers: getAuthHeaders(),
        body: JSON.stringify({
          code: couponInput.trim(),
          subtotal: cartSubtotal,
        }),
      });
      clearTimeout(timeoutId);

      const data = await parseResponse(response);

      if (response.ok && data.success) {
        setAppliedCoupon(data.coupon);
        setCouponSuccess(
          `Coupon ${data.coupon?.code || couponInput.trim()} applied successfully!`
        );
        setCouponInput('');
      } else {
        const msg = extractErrorMessage(data, 'Invalid coupon code.');
        setCouponError(msg);
      }
    } catch (err: any) {
      if (err.name === 'AbortError') {
        setCouponError('Connection timed out.');
      } else {
        setCouponError('Connection error while applying coupon.');
      }
    } finally {
      setIsApplying(false);
    }
  }, [couponInput, cartSubtotal]);

  const handleRemoveCoupon = useCallback(() => {
    setAppliedCoupon(null);
    setCouponSuccess('');
    setCouponError('');
  }, []);

  return (
    <CartContext.Provider
      value={{
        cartItems,
        totalItems,
        addToCart,
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
        activeEvents,
        eventDiscountTotal,
        taxRate,
        discountAmount,
        tax,
        total,
        refreshCoupons,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};