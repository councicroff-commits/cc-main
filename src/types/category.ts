// src/types/category.ts

// Use the 'export' keyword before the interface/type definition
export interface Category {
  id: string;
  name: string;
  slug: string;
  description?: string;
  image?: string;
}

// If you have more types, export them similarly:
export interface CategoryFilter {
  active: boolean;
  sortBy: 'name' | 'date';
}
