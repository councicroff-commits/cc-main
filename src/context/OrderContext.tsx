import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  ReactNode,
} from 'react';
import { useAuth } from './AuthContext';

export interface OrderItem {
  id: string;
  product_id?: string;
  name: string;
  price: number;
  quantity: number;
  image?: string;
  category?: string;
}

export interface Order {
  _id?: string;
  id?: string;
  order_number?: string;
  user_id?: string;
  total_amount?: number;
  total?: number;
  status?: string;
  payment_method?: string;
  payment_status?: string;
  items: OrderItem[];
  created_at?: string;
  date?: string;
  estimated_delivery?: string;
  shipping_full_name?: string;
  shipping_mobile_number?: string;
  shipping_street?: string;
  shipping_barangay?: string;
  shipping_city?: string;
  shipping_region?: string;
  shipping_zip_code?: string;
  shipping_country?: string;
  shipping_landmark?: string;
  shippingAddress?: any;
}

interface OrderContextType {
  orders: Order[];
  fetchUserOrders: () => Promise<void>;
  syncOrders: () => Promise<void>;
  cancelOrder: (orderId: string, backendId?: string) => Promise<void>;
  isLoading: boolean;
  error: string | null;
  clearError: () => void;
}

const OrderContext = createContext<OrderContextType | undefined>(undefined);

// 🔥 DYNAMIC PERMANENT FIX for Orders (same style as AuthContext)
const getApiBaseUrl = () => {
  return 'https://cc-backend-production-00fe.up.railway.app/api/v1';
};

const API_BASE_URL = getApiBaseUrl();

// 🛠️ Helper — same as AuthContext
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

export const OrderProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const { user, isAuthenticated } = useAuth();

  const getAuthHeaders = (includeAuth = true) => {
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
    };
    if (includeAuth) {
      const token = localStorage.getItem('token') || localStorage.getItem('access_token');
      if (token) {
        headers.Authorization = 'Bearer ' + token;
      }
    }
    return headers;
  };

  const parseResponse = async (response: Response) => {
    const text = await response.text();
    try {
      return text ? JSON.parse(text) : {};
    } catch {
      return { detail: text || 'Server error (Status ' + response.status + ')' };
    }
  };

  const fetchUserOrders = useCallback(async () => {
    if (!isAuthenticated || !user) {
      setOrders([]);
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    setError(null);

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 15000);

    try {
      const userId = user.id || (user as any)._id;
      if (!userId) {
        setOrders([]);
        setIsLoading(false);
        return;
      }

      // ✅ Safe URL — no template literal, no {userId} junk
      const ordersUrl = API_BASE_URL + '/orders/user/' + encodeURIComponent(String(userId));

      const response = await fetch(ordersUrl, {
        method: 'GET',
        signal: controller.signal,
        headers: getAuthHeaders(),
      });
      clearTimeout(timeoutId);

      const data = await parseResponse(response);

      if (!response.ok) {
        if (response.status === 401 || response.status === 404) {
          setOrders([]);
          return;
        }
        const msg = extractErrorMessage(data, 'Failed to fetch orders (' + response.status + ')');
        setError(msg);
        throw new Error(msg);
      }

      const list = Array.isArray(data) ? data : data.orders || data.data || [];
      setOrders(list);
    } catch (err: any) {
      if (err.name === 'AbortError') {
        setError('Connection timed out.');
      } else {
        console.error('[OrderContext] Fetch error:', err);
        setError(err.message || 'Could not sync orders with backend.');
      }
    } finally {
      setIsLoading(false);
    }
  }, [user, isAuthenticated]);

  const cancelOrder = useCallback(
    async (orderId: string, backendId?: string) => {
      const targetId = backendId || orderId;
      setIsLoading(true);
      setError(null);

      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 15000);

      try {
        // ✅ Safe URL — no template literal
        const cancelUrl =
          API_BASE_URL + '/orders/' + encodeURIComponent(String(targetId)) + '/status';

        const response = await fetch(cancelUrl, {
          method: 'PATCH',
          signal: controller.signal,
          headers: getAuthHeaders(),
          body: JSON.stringify({ status: 'Cancelled' }),
        });
        clearTimeout(timeoutId);

        const data = await parseResponse(response);

        if (!response.ok) {
          const msg = extractErrorMessage(data, 'Failed to cancel order (' + response.status + ')');
          setError(msg);
          throw new Error(msg);
        }

        setOrders((prev) =>
          prev.map((o) =>
            o._id === targetId || o.id === targetId || o.order_number === targetId
              ? { ...o, status: 'Cancelled' }
              : o
          )
        );
      } catch (err: any) {
        if (err.name === 'AbortError') {
          setError('Connection timed out.');
        } else {
          console.error('[OrderContext] Cancel error:', err);
          setError(err.message || 'Error cancelling order.');
        }
        throw err;
      } finally {
        setIsLoading(false);
      }
    },
    []
  );

  const clearError = useCallback(() => setError(null), []);

  useEffect(() => {
    fetchUserOrders();
  }, [fetchUserOrders]);

  return (
    <OrderContext.Provider
      value={{
        orders,
        fetchUserOrders,
        syncOrders: fetchUserOrders,
        cancelOrder,
        isLoading,
        error,
        clearError,
      }}
    >
      {children}
    </OrderContext.Provider>
  );
};

export const useOrders = () => {
  const context = useContext(OrderContext);
  if (!context) {
    throw new Error('useOrders must be used within an OrderProvider');
  }
  return context;
};

export const useOrder = useOrders;
