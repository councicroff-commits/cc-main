import type { Product } from '../types/product';
import type { Category } from '../types/category'; // Fixed spelling


// 1. Structural Collections Data
export interface MockDataIndex {
  CATEGORIES: Category[];
  PRODUCTS: Product[];
}

export const MOCK_DATA: MockDataIndex = {
  CATEGORIES: [
    {
      id: 'cat-01',
      name: 'Technical Attire',
      slug: 'clothes',
      description: 'Modular silhouettes engineered for everyday performance and structural durability.',
      imageUrl: 'https://images.unsplash.com/photo-1556821840-3a63f95609a7?q=80&w=600&auto=format&fit=crop',
      isActive: true
    },
    {
      id: 'cat-02',
      name: 'Olfactory Expressions',
      slug: 'perfume',
      description: 'High-concentration extraits de parfum formulated with rare botanical extracts.',
      imageUrl: 'https://images.unsplash.com/photo-1541643600914-78b084683601?q=80&w=600&auto=format&fit=crop',
      isActive: true
    },
    {
      id: 'cat-03',
      name: 'Premium Lifestyle Accessories',
      slug: 'lifestyle',
      description: 'Analog and digital desktop solutions built to streamline daily workflows.',
      imageUrl: 'https://images.unsplash.com/photo-1468495244123-6c6c332eeece?q=80&w=600&auto=format&fit=crop',
      isActive: true
    }
  ],

  PRODUCTS: [
    // === CLOTHES ===
    {
      id: 'prod-c1',
      slug: 'alpha-modular-shell',
      name: 'Alpha Modular Shell Jacket',
      description: 'Waterproof, breathable technical hard-shell crafted with triple-layered membrane weave. Features articulated sleeve structures, custom matte-black waterproof seals, and magnetic attachment modules.',
      price: 285.00,
      compareAtPrice: 340.00,
      images: [
        'https://images.unsplash.com/photo-1544923246-77307dd654cb?q=80&w=600&auto=format&fit=crop',
        'https://images.unsplash.com/photo-1548883354-7622d03aca27?q=80&w=600&auto=format&fit=crop'
      ],
      category: 'clothes',
      tags: ['Shell', 'Waterproof', 'Techwear'],
      featured: true,
      bestSeller: true,
      createdAt: '2026-01-15T08:00:00Z',
      variants: [
        { id: 'v-c1-s', name: 'Size S', sku: 'CC-ALP-SHL-S', stock: 12 },
        { id: 'v-c1-m', name: 'Size M', sku: 'CC-ALP-SHL-M', stock: 24 },
        { id: 'v-c1-l', name: 'Size L', sku: 'CC-ALP-SHL-L', stock: 0 } // Sold out item verification
      ]
    },
    {
      id: 'prod-c2',
      slug: 'heavyweight-box-hoodie',
      name: '500GSM Heavyweight Hoodie',
      description: 'Constructed from loopback French terry knit cotton. Oversized boxy silhouette, dropped shoulders, zero drawcords for clean avant-garde styling profile.',
      price: 110.00,
      images: ['https://images.unsplash.com/photo-1556821840-3a63f95609a7?q=80&w=600&auto=format&fit=crop'],
      category: 'clothes',
      tags: ['Essentials', 'Heavyweight', 'Fleece'],
      featured: false,
      bestSeller: true,
      createdAt: '2026-02-10T09:30:00Z',
      variants: [
        { id: 'v-c2-m', name: 'Size M', sku: 'CC-HD-HVY-M', stock: 45 },
        { id: 'v-c2-l', name: 'Size L', sku: 'CC-HD-HVY-L', stock: 30 }
      ]
    },

    // === PERFUMES ===
    {
      id: 'prod-p1',
      slug: 'obsidian-wood-extrait',
      name: 'Obsidian Wood Extrait',
      description: 'A deep structural olfactory statement. Raw smoky patchouli and dark agarwood top notes balanced against a clean linear ambergris and metallic violet base.',
      price: 165.00,
      images: ['https://images.unsplash.com/photo-1523293182086-7651a899d37f?q=80&w=600&auto=format&fit=crop'],
      category: 'perfume',
      tags: ['Extrait', 'Woody', 'Dark'],
      featured: true,
      bestSeller: true,
      createdAt: '2026-03-01T11:00:00Z',
      variants: [
        { id: 'v-p1-50', name: '50ml Extract', sku: 'CC-OBS-WD-50', stock: 15 },
        { id: 'v-p1-100', name: '100ml Extract', sku: 'CC-OBS-WD-100', stock: 8, additionalPrice: 60.00 }
      ]
    },
    {
      id: 'prod-p2',
      slug: 'neon-mint-edp',
      name: 'Neon Mint Eau De Parfum',
      description: 'Crisp, razor-sharp hyper-synthetic formulation. High notes of crushed winter mint, liquid nitrogen metrics, eucalyptus layers, and concrete-mineral fixatives.',
      price: 125.00,
      compareAtPrice: 145.00,
      images: ['https://images.unsplash.com/photo-1594035910387-fea47794261f?q=80&w=600&auto=format&fit=crop'],
      category: 'perfume',
      tags: ['Fresh', 'Synthetic', 'EDP'],
      featured: false,
      bestSeller: false,
      createdAt: '2026-04-12T14:15:00Z'
    },

    // === LIFESTYLE ===
    {
      id: 'prod-l1',
      slug: 'mag-charging-dock',
      name: 'Mag-Safe Heavy Anodized Dock',
      description: 'Machined from a single solid block of aerospace-grade aluminum. Weighted base prevents tipping, supporting rapid wireless alignment transfers for devices.',
      price: 85.00,
      images: ['https://images.unsplash.com/photo-1622445262465-2481c4574875?q=80&w=600&auto=format&fit=crop'],
      category: 'lifestyle',
      tags: ['Desktop', 'Aluminum', 'Power'],
      featured: true,
      bestSeller: false,
      createdAt: '2026-02-22T10:00:00Z'
    }
  ]
};
