export interface ColorVariant {
  color: string;
  images: string[];
  stockCount: number;
  inStock: boolean;
  headAlignment?: number; // percentage from top, default e.g. 20
}

export interface Product {
  id: string;
  name: string;
  price: number;
  originalPrice?: number;
  description: string;
  images: string[];
  category: string;
  collection: string;
  sizes: string[];
  colors: string[];
  colorVariants?: ColorVariant[];
  materials: string[];
  care: string[];
  features: string[];
  isNew?: boolean;
  isBestSeller?: boolean;
  isOnSale?: boolean;
  inStock: boolean;
  stockCount: number;
  serialNumber?: number;
  createdAt: Date;
  updatedAt: Date;
  fabric?: string;
  careInstructions?: string;
  deliveryEstimate?: string;
}

export interface ProductFormData {
  name: string;
  price: number;
  originalPrice?: number;
  description: string;
  category: string;
  collection: string;
  sizes: string[];
  colors: string[];
  colorVariants?: ColorVariant[];
  materials: string[];
  care: string[];
  features: string[];
  isNew: boolean;
  isBestSeller: boolean;
  isOnSale: boolean;
  inStock: boolean;
  stockCount: number;
  serialNumber?: number;
}

export interface Collection {
  id: string;
  name: string;
  description: string;
  image?: string;
  createdAt: Date;
  updatedAt: Date;
}

export const CATEGORIES = [
  'Dresses',
  'Tops',
  'Blouses',
  'Skirts',
  'Pants',
  'Outerwear',
  'Accessories'
] as const;

export const SIZES = [
  'XS',
  'S', 
  'M',
  'L',
  'XL',
  'XXL',
  'Custom'
] as const;

export const MATERIALS = [
  'Silk',
  'Cotton',
  'Linen',
  'Wool',
  'Cashmere',
  'Polyester',
  'Viscose',
  'Chiffon',
  'Satin',
  'Velvet'
] as const;