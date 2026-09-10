import type { CartLineItem } from './cart';
import type { ShippingAddress } from './user';

export type OrderStatus = 'PENDING' | 'PROCESSING' | 'SHIPPED' | 'DELIVERED' | 'CANCELLED';

export interface Order {
  id: string;
  orderNumber: string;
  items: CartLineItem[];
  totalAmount: number;
  subtotalAmount: number;
  taxAmount: number;
  shippingCost: number;
  status: OrderStatus;
  shippingAddress: ShippingAddress;
  paymentMethod: 'STRIPE' | 'CRYPTO' | 'CREDIT_CARD';
  createdAt: string;
}
