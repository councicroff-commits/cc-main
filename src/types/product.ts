export interface ProductVariant {
  id: string;
  name: string;
  sku: string;
  stock: number;
  additionalPrice?: number;
}

export interface ProductReviewItem {
  id: string;
  userId: string;
  username: string;
  rating: number;
  comment: string;
  createdAt: string;
}

export interface Product {
  id: string;
  _id?: string; // Add this if MongoDB _id is sometimes used directly
  slug?: string;
  name: string;
  description: string;
  price: number;
  compareAtPrice?: number;
  images: string[];
  tags?: string[];
  category: 'clothes' | 'perfume' | 'lifestyle'; 
  badge?: string; // ✅ ADDED BADGE
  sizes?: string[]; // ✅ ADDED SIZES
  colors?: string[]; // ✅ ADDED COLORS
  featured?: boolean;
  bestSeller?: boolean;
  variants?: ProductVariant[];
  reviews?: ProductReviewItem[];
  averageRating?: number;
  createdAt: string;
}
