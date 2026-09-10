import type { ProductVariant } from './product';

export interface CartLineItem {
  id: string; // Unique cart item instance ID
  productId: string;
  name: string;
  price: number;
  quantity: number;
  selectedVariant?: ProductVariant;
  imageUrl: string;
  category: string;
}

export interface CartState {
  items: CartLineItem[];
  promoCode?: string;
  discountAmount: number;
}
