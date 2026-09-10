
import React, { createContext, useContext, useState, useEffect, useCallback, useMemo, useRef } from 'react';

export interface Product {
  _id?: string;
  id?: string;
  name: string;
  description: string;
  price: number;
  compare_at_price?: number | null;
  sku: string;
  inventory: number;
  category: 'clothes' | 'perfume' | 'lifestyle' | string;
  badge?: string | null;
  sizes: string[];
  colors: string[];
  images: string[];
  specifications: Record<string, any>;
  status: string;
  created_at?: string;
  updated_at?: string;
}

interface ProductContextType {
  products: Product[];
  isLoading: boolean;
  loading: boolean;
  error: string | null;
  fetchProducts: () => Promise<void>;
  fetchProductById: (id: string) => Promise<Product>;
  createProduct: (productData: Partial<Product>) => Promise<Product>;
  updateProduct: (id: string, productData: Partial<Product>) => Promise<Product>;
  deleteProduct: (id: string) => Promise<void>;
}

const API_BASE_URL = 'https://cc-backend-yc-team.onrender.com/api/v1/products';

export const ProductContext = createContext<ProductContextType | undefined>(undefined);

// Safely parses stringified arrays or comma-separated strings back into an array
const normalizeImages = (rawImages: any): string[] => {
  if (!rawImages) return [];
  if (Array.isArray(rawImages)) {
    return rawImages.filter(img => typeof img === 'string' && img.trim() !== '');
  }
  if (typeof rawImages === 'string') {
    try {
      const parsed = JSON.parse(rawImages);
      if (Array.isArray(parsed)) {
        return parsed.filter(img => typeof img === 'string' && img.trim() !== '');
      }
    } catch {
      if (rawImages.includes(',')) {
        return rawImages.split(',').map(s => s.trim()).filter(Boolean);
      }
      return [rawImages];
    }
  }
  return [];
};

export const ProductProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const activeFetchRef = useRef<Promise<any> | null>(null);

  const parseResponse = async (response: Response) => {
    const text = await response.text();
    try {
      return text ? JSON.parse(text) : {};
    } catch {
      return { detail: text || `Server error (Status ${response.status})` };
    }
  };

  const fetchProducts = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      if (!activeFetchRef.current) {
        activeFetchRef.current = fetch(API_BASE_URL, {
          headers: { 'Content-Type': 'application/json' }
        }).then(async (res) => {
          const data = await parseResponse(res);
          if (!res.ok) {
            throw new Error(data.detail || data.message || `Server returned status: ${res.status}`);
          }
          return data;
        });
      }

      const data = await activeFetchRef.current;
      const list = Array.isArray(data) ? data : data.products || data.data || [];

      const normalized = list.map((p: any) => ({
        ...p,
        id: p._id || p.id,
        price: Number(p.price) || 0,
        inventory: Number(p.inventory ?? p.stock ?? 0),
        images: normalizeImages(p.images || p.imageUrl || p.image),
        sizes: Array.isArray(p.sizes) ? p.sizes : (typeof p.sizes === 'string' ? p.sizes.split(',').map((s: string) => s.trim()).filter(Boolean) : []),
        colors: Array.isArray(p.colors) ? p.colors : (typeof p.colors === 'string' ? p.colors.split(',').map((c: string) => c.trim()).filter(Boolean) : []),
      }));

      setProducts(normalized);
    } catch (err: any) {
      console.error('[ProductContext] Fetch error details:', err);
      setError(err?.message || 'Failed to fetch products.');
    } finally {
      activeFetchRef.current = null;
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  const fetchProductById = useCallback(async (id: string): Promise<Product> => {
    if (!id || id === 'undefined') {
      throw new Error('Invalid product ID provided.');
    }

    try {
      const response = await fetch(`${API_BASE_URL}/${encodeURIComponent(id)}`, {
        headers: { 'Content-Type': 'application/json' }
      });
      const data = await parseResponse(response);
      
      if (!response.ok) {
        throw new Error(data.detail || data.message || 'Failed to fetch product details');
      }
      
      const rawProduct = data.product || data;
      const fullProductData = {
        ...rawProduct,
        id: rawProduct._id || rawProduct.id || id,
        price: Number(rawProduct.price) || 0,
        inventory: Number(rawProduct.inventory ?? rawProduct.stock ?? 0),
        images: normalizeImages(rawProduct.images || rawProduct.imageUrl || rawProduct.image),
        sizes: Array.isArray(rawProduct.sizes) ? rawProduct.sizes : (typeof rawProduct.sizes === 'string' ? rawProduct.sizes.split(',').map((s: string) => s.trim()).filter(Boolean) : []),
        colors: Array.isArray(rawProduct.colors) ? rawProduct.colors : (typeof rawProduct.colors === 'string' ? rawProduct.colors.split(',').map((c: string) => c.trim()).filter(Boolean) : []),
      };

      setProducts((prev) => {
        const index = prev.findIndex((p) => p.id === id || p._id === id);
        if (index >= 0) {
          const updated = [...prev];
          updated[index] = fullProductData;
          return updated;
        }
        return [fullProductData, ...prev];
      });

      return fullProductData;
    } catch (err: any) {
      console.error('[ProductContext] Failed to fetch single product:', err);
      throw err;
    }
  }, []);

  const createProduct = useCallback(async (productData: Partial<Product>) => {
    try {
      const response = await fetch(`${API_BASE_URL}/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(productData),
      });
      
      const data = await parseResponse(response);
      if (!response.ok) throw new Error(data.detail || data.message || 'Failed to create product');
      
      const rawProd = data.product || data;
      const newProd = {
        ...rawProd,
        id: rawProd._id || rawProd.id,
        price: Number(rawProd.price) || 0,
        inventory: Number(rawProd.inventory ?? rawProd.stock ?? 0),
        images: normalizeImages(rawProd.images || rawProd.imageUrl || rawProd.image),
      };

      setProducts((prev) => [newProd, ...prev]);
      return newProd;
    } catch (err: any) {
      throw err;
    }
  }, []);

  const updateProduct = useCallback(async (id: string, productData: Partial<Product>) => {
    try {
      const response = await fetch(`${API_BASE_URL}/${encodeURIComponent(id)}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(productData),
      });
      
      const data = await parseResponse(response);
      if (!response.ok) throw new Error(data.detail || data.message || 'Failed to update product');

      const rawProd = data.product || data;
      const updatedProd = {
        ...rawProd,
        id: rawProd._id || rawProd.id || id,
        price: Number(rawProd.price) || 0,
        inventory: Number(rawProd.inventory ?? rawProd.stock ?? 0),
        images: normalizeImages(rawProd.images || rawProd.imageUrl || rawProd.image),
      };

      setProducts((prev) => prev.map((p) => (p.id === id || p._id === id ? updatedProd : p)));
      return updatedProd;
    } catch (err: any) {
      throw err;
    }
  }, []);

  const deleteProduct = useCallback(async (id: string) => {
    try {
      const response = await fetch(`${API_BASE_URL}/${encodeURIComponent(id)}`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' }
      });
      
      if (!response.ok) {
        const data = await parseResponse(response);
        throw new Error(data.detail || data.message || 'Failed to delete product');
      }
      
      setProducts((prev) => prev.filter((p) => p.id !== id && p._id !== id));
    } catch (err: any) {
      throw err;
    }
  }, []);

  // Memoize context value to prevent unnecessary re-renders of consumers
  const contextValue = useMemo(() => ({
    products,
    isLoading,
    loading: isLoading,
    error,
    fetchProducts,
    fetchProductById,
    createProduct,
    updateProduct,
    deleteProduct
  }), [
    products, 
    isLoading, 
    error, 
    fetchProducts, 
    fetchProductById, 
    createProduct, 
    updateProduct, 
    deleteProduct
  ]);

  return (
    <ProductContext.Provider value={contextValue}>
      {children}
    </ProductContext.Provider>
  );
};

export const useProducts = () => {
  const context = useContext(ProductContext);
  if (!context) throw new Error('useProducts must be used within a ProductProvider');
  return context;
};

export default ProductProvider;