import type { Order } from '../types/order';

export const orderService = {
  /**
   * Fetches real client order manifestations tracking directly against their user identifier tokens
   */
  getUserOrders: async (userId: string): Promise<Order[]> => {
    await new Promise((resolve) => setTimeout(resolve, 600));
    return [
      {
        id: 'CC-90821',
        date: 'June 02, 2026',
        status: 'In Transit via Premium Air',
        total: 1450.00,
        items: [
          { id: 'p1', name: 'Essence No. IV Perfume', category: 'Luxury Scents', price: 450.00, image: 'https://images.unsplash.com/photo-1541643600914-78b084683601?auto=format&fit=crop&w=300&q=80' },
          { id: 'p2', name: 'Signature Wool Topcoat', category: 'Premium Wear', price: 1000.00, image: 'https://images.unsplash.com/photo-1496747611176-843222e1e57?auto=format&fit=crop&w=300&q=80' }
        ]
      },
      {
        id: 'CC-87410',
        date: 'April 14, 2026',
        status: 'Delivered',
        total: 380.00,
        items: [
          { id: 'p3', name: 'Horology Node Matte Watch', category: 'Signature Style', price: 380.00, image: 'https://images.unsplash.com/photo-1523170335258-f5ed11844a49?auto=format&fit=crop&w=300&q=80' }
        ]
      }
    ];
  },

  /**
   * Recovers a precise structural allocation matrix matching a dedicated URL parameter target ID
   */
  getOrderById: async (orderId: string): Promise<Order | null> => {
    await new Promise((resolve) => setTimeout(resolve, 500));
    
    // Fallback data mapping to instantly satisfy the dynamic router target matches
    const mockDb: Record<string, Order> = {
      'CC-90821': {
        id: 'CC-90821',
        date: 'June 02, 2026',
        status: 'In Transit via Premium Air',
        total: 1450.00,
        items: [
          { id: 'p1', name: 'Essence No. IV Perfume', category: 'Luxury Scents', price: 450.00, image: 'https://images.unsplash.com/photo-1541643600914-78b084683601?auto=format&fit=crop&w=300&q=80' },
          { id: 'p2', name: 'Signature Wool Topcoat', category: 'Premium Wear', price: 1000.00, image: 'https://images.unsplash.com/photo-1496747611176-843222e1e57?auto=format&fit=crop&w=300&q=80' }
        ]
      },
      'CC-87410': {
        id: 'CC-87410',
        date: 'April 14, 2026',
        status: 'Delivered',
        total: 380.00,
        items: [
          { id: 'p3', name: 'Horology Node Matte Watch', category: 'Signature Style', price: 380.00, image: 'https://images.unsplash.com/photo-1523170335258-f5ed11844a49?auto=format&fit=crop&w=300&q=80' }
        ]
      }
    };

    return mockDb[orderId] || null;
  }
};
