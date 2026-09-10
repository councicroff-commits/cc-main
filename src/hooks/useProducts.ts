// /src/types/product.ts

export interface ProductVariant {
  id: string;
  sku: string;
  price: number;
  stock: number;
  attributes: Record<string, string>;
}

// Ensure any other types used by your components are also exported
export interface Product {
  id: string;
  name: string;
  description: string;
  category: 'clothes' | 'perfume' | 'lifestyle';
  variants?: ProductVariant[]; // If you are using it here
  // ... rest of your product fields
}


export const useProducts = () => { // 👈 Ensure 'export' is here
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setIsLoading(true);
        // Replace this URL with your actual backend endpoint
        const response = await fetch('http://192.168.1.8:8050/api/v1/products');
        if (!response.ok) throw new Error('Failed to fetch products');
        const data = await response.json();
        setProducts(data);
      } catch (err) {
        setError('Error loading products');
      } finally {
        setIsLoading(false);
      }
    };

    fetchProducts();
  }, []);

  return { products, isLoading, error };
};

