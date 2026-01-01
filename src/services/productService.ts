import { Product, ProductFormData, Collection } from '@/types/product';
import { productStore } from '@/store/productStore';

export class ProductService {
  private static readonly COLLECTIONS_STORAGE_KEY = 'beenas_collections';
  private static collections: Collection[] = [];

  static {
    this.loadCollections();
  }

  private static loadCollections(): void {
    try {
      const stored = localStorage.getItem(this.COLLECTIONS_STORAGE_KEY);
      if (stored) {
        const parsedCollections = JSON.parse(stored);
        // Convert date strings back to Date objects
        this.collections = parsedCollections.map((c: any) => ({
          ...c,
          createdAt: new Date(c.createdAt),
          updatedAt: new Date(c.updatedAt)
        }));
      } else {
        // Initialize with default collections if no stored data
        this.collections = [
          {
            id: 'spring-2024',
            name: 'Spring 2024',
            description: 'Fresh and vibrant pieces for the new season',
            createdAt: new Date(),
            updatedAt: new Date()
          },
          {
            id: 'summer-elegance',
            name: 'Summer Elegance',
            description: 'Sophisticated summer styles',
            createdAt: new Date(),
            updatedAt: new Date()
          },
          {
            id: 'autumn-classics',
            name: 'Autumn Classics',
            description: 'Timeless pieces for fall',
            createdAt: new Date(),
            updatedAt: new Date()
          },
          {
            id: 'winter-luxury',
            name: 'Winter Luxury',
            description: 'Luxurious winter collection',
            createdAt: new Date(),
            updatedAt: new Date()
          },
          {
            id: 'dresses',
            name: 'Dresses',
            description: 'Elegant dresses for every occasion',
            createdAt: new Date(),
            updatedAt: new Date()
          },
          {
            id: 'tops',
            name: 'Tops',
            description: 'Stylish tops and blouses',
            createdAt: new Date(),
            updatedAt: new Date()
          }
        ];
        this.saveCollections();
      }
    } catch (error) {
      console.error('Error loading collections from localStorage:', error);
      // Fallback to default collections
      this.collections = [
        {
          id: 'spring-2024',
          name: 'Spring 2024',
          description: 'Fresh and vibrant pieces for the new season',
          createdAt: new Date(),
          updatedAt: new Date()
        }
      ];
      this.saveCollections();
    }
  }

  private static saveCollections(): void {
    try {
      localStorage.setItem(this.COLLECTIONS_STORAGE_KEY, JSON.stringify(this.collections));
    } catch (error) {
      console.error('Error saving collections to localStorage:', error);
    }
  }

  static reloadProducts(): void {
    productStore.reload();
  }

  static getAllProducts(): Product[] {
    return productStore.getAllProducts();
  }

  static getProductById(id: string): Product | undefined {
    return productStore.getProductById(id);
  }

  static getProductsByCollection(collectionId: string): Product[] {
    return productStore.getProductsByCollection(collectionId);
  }

  static getProductsByCategory(category: string): Product[] {
    return productStore.getProductsByCategory(category);
  }

  static createProduct(data: ProductFormData, images: string[]): Product {
    return productStore.createProduct(data, images);
  }

  static updateProduct(id: string, data: Partial<ProductFormData>, images?: string[]): boolean {
    return productStore.updateProduct(id, data, images);
  }

  static deleteProduct(id: string): boolean {
    return productStore.deleteProduct(id);
  }

  static moveProductToCollection(productId: string, collectionId: string): boolean {
    const product = productStore.getProductById(productId);
    if (!product) return false;
    return productStore.updateProduct(productId, { collection: collectionId });
  }

  static duplicateProduct(id: string): Product | null {
    const original = productStore.getProductById(id);
    if (!original) return null;

    const duplicate: Product = {
      ...original,
      id: `prod-${Date.now()}`,
      name: `${original.name} (Copy)`,
      createdAt: new Date(),
      updatedAt: new Date()
    };

    productStore.createProduct(duplicate as any, duplicate.images);
    return duplicate;
  }

  // Collection Management
  static getAllCollections(): Collection[] {
    return [...this.collections];
  }

  static getCollectionById(id: string): Collection | undefined {
    return this.collections.find(c => c.id === id);
  }

  static createCollection(name: string, description: string, image?: string): Collection {
    const newCollection: Collection = {
      id: `col-${Date.now()}`,
      name,
      description,
      image,
      createdAt: new Date(),
      updatedAt: new Date()
    };

    this.collections.push(newCollection);
    this.saveCollections();
    return newCollection;
  }

  static updateCollection(id: string, name: string, description: string, image?: string): boolean {
    const index = this.collections.findIndex(c => c.id === id);
    if (index === -1) return false;

    this.collections[index] = {
      ...this.collections[index],
      name,
      description,
      ...(image && { image }),
      updatedAt: new Date()
    };

    this.saveCollections();
    return true;
  }

  static deleteCollection(id: string): boolean {
    const index = this.collections.findIndex(c => c.id === id);
    if (index === -1) return false;

    const products = productStore.getAllProducts();
    products.forEach(product => {
      if (product.collection === id) {
        productStore.updateProduct(product.id, { collection: 'uncategorized' });
      }
    });

    this.collections.splice(index, 1);
    this.saveCollections();
    return true;
  }

  // Bulk Operations
  static bulkUpdateProducts(productIds: string[], updates: Partial<ProductFormData>): number {
    let updatedCount = 0;
    productIds.forEach(id => {
      if (productStore.updateProduct(id, updates)) {
        updatedCount++;
      }
    });
    return updatedCount;
  }

  static bulkMoveToCollection(productIds: string[], collectionId: string): number {
    let movedCount = 0;
    
    productIds.forEach(id => {
      if (this.moveProductToCollection(id, collectionId)) {
        movedCount++;
      }
    });

    return movedCount;
  }

  static bulkDelete(productIds: string[]): number {
    let deletedCount = 0;
    productIds.forEach(id => {
      if (productStore.deleteProduct(id)) {
        deletedCount++;
      }
    });
    return deletedCount;
  }

  // Search and Filter
  static searchProducts(query: string): Product[] {
    return productStore.searchProducts(query);
  }

  static filterProducts(filters: {
    category?: string;
    collection?: string;
    inStock?: boolean;
    isNew?: boolean;
    isBestSeller?: boolean;
    isOnSale?: boolean;
    priceRange?: { min: number; max: number };
  }): Product[] {
    const allProducts = productStore.getAllProducts();
    return allProducts.filter(product => {
      if (filters.category && product.category !== filters.category) return false;
      if (filters.collection && product.collection !== filters.collection) return false;
      if (filters.inStock !== undefined && product.inStock !== filters.inStock) return false;
      if (filters.isNew !== undefined && product.isNew !== filters.isNew) return false;
      if (filters.isBestSeller !== undefined && product.isBestSeller !== filters.isBestSeller) return false;
      if (filters.isOnSale !== undefined && product.isOnSale !== filters.isOnSale) return false;
      if (filters.priceRange) {
        if (product.price < filters.priceRange.min || product.price > filters.priceRange.max) return false;
      }
      return true;
    });
  }

  // Statistics
  static getProductStats() {
    const products = productStore.getAllProducts();
    const total = products.length;
    const inStock = products.filter(p => p.inStock).length;
    const outOfStock = total - inStock;
    const newProducts = products.filter(p => p.isNew).length;
    const bestSellers = products.filter(p => p.isBestSeller).length;
    const onSale = products.filter(p => p.isOnSale).length;

    const categoryBreakdown = products.reduce((acc, product) => {
      acc[product.category] = (acc[product.category] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    const collectionBreakdown = products.reduce((acc, product) => {
      acc[product.collection] = (acc[product.collection] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    return {
      total,
      inStock,
      outOfStock,
      newProducts,
      bestSellers,
      onSale,
      categoryBreakdown,
      collectionBreakdown
    };
  }

  static clearAllProducts(): void {
    const products = productStore.getAllProducts();
    products.forEach(p => productStore.deleteProduct(p.id));
  }

  static clearLocalStorage(): void {
    if (typeof window !== 'undefined' && window.localStorage) {
      try {
        localStorage.removeItem('beenas_products');
        localStorage.removeItem(this.COLLECTIONS_STORAGE_KEY);
        this.collections = [];
        productStore.reload();
      } catch (error) {
        console.error('Error clearing localStorage:', error);
      }
    }
  }

  static optimizeStorage(): void {
    const products = productStore.getAllProducts();
    if (products.length > 100) {
      const sorted = [...products].sort((a, b) => {
        const aTime = new Date(a.updatedAt).getTime();
        const bTime = new Date(b.updatedAt).getTime();
        return bTime - aTime;
      });
      const toDelete = sorted.slice(100);
      toDelete.forEach(p => productStore.deleteProduct(p.id));
    }
  }
}