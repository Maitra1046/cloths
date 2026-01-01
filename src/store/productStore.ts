import { Product, ProductFormData } from '@/types/product';
import { products as folderProducts } from '@/data/products';

const STORAGE_KEY = 'beenas_products';

const getDemoProducts = (): Product[] => {
  return [
    {
      id: 'demo-1',
      name: 'Elegant Silk Dress',
      price: 299,
      originalPrice: 0,
      description: 'A beautifully crafted silk dress designed with attention to detail and premium quality materials. Perfect for any occasion.',
      category: 'Dresses',
      collection: 'spring-2024',
      sizes: ['S', 'M', 'L'],
      colors: ['Ivory', 'Rose'],
      materials: ['Silk'],
      care: ['Dry clean only', 'Store on padded hanger'],
      features: ['Premium quality', 'Handcrafted', 'Made to order'],
      isNew: true,
      isBestSeller: false,
      isOnSale: false,
      inStock: true,
      stockCount: 10,
      serialNumber: 1,
      images: [],
      colorVariants: [
        {
          color: 'Ivory',
          images: [],
          stockCount: 5,
          inStock: true,
          headAlignment: 20
        },
        {
          color: 'Rose',
          images: [],
          stockCount: 5,
          inStock: true,
          headAlignment: 20
        }
      ],
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      id: 'demo-2',
      name: 'Classic Linen Blouse',
      price: 189,
      originalPrice: 0,
      description: 'A timeless linen blouse crafted from premium European linen. The flowing silhouette flatters every figure.',
      category: 'Tops',
      collection: 'spring-2024',
      sizes: ['S', 'M', 'L', 'XL'],
      colors: ['Cream', 'White'],
      materials: ['Linen'],
      care: ['Machine wash cold', 'Tumble dry low'],
      features: ['Premium quality', 'Handcrafted'],
      isNew: false,
      isBestSeller: true,
      isOnSale: false,
      inStock: true,
      stockCount: 15,
      serialNumber: 2,
      images: [],
      colorVariants: [
        {
          color: 'Cream',
          images: [],
          stockCount: 8,
          inStock: true,
          headAlignment: 20
        },
        {
          color: 'White',
          images: [],
          stockCount: 7,
          inStock: true,
          headAlignment: 20
        }
      ],
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      id: 'demo-3',
      name: 'Wool Tailored Coat',
      price: 495,
      originalPrice: 0,
      description: 'A refined tailored coat in double-faced Italian wool. Classic notched lapels and horn buttons create a sophisticated silhouette.',
      category: 'Outerwear',
      collection: 'winter-luxury',
      sizes: ['S', 'M', 'L'],
      colors: ['Camel', 'Black'],
      materials: ['Wool'],
      care: ['Professional dry clean only'],
      features: ['Premium quality', 'Handcrafted', 'Made to order'],
      isNew: false,
      isBestSeller: true,
      isOnSale: false,
      inStock: true,
      stockCount: 8,
      serialNumber: 3,
      images: [],
      colorVariants: [
        {
          color: 'Camel',
          images: [],
          stockCount: 4,
          inStock: true,
          headAlignment: 20
        },
        {
          color: 'Black',
          images: [],
          stockCount: 4,
          inStock: true,
          headAlignment: 20
        }
      ],
      createdAt: new Date(),
      updatedAt: new Date()
    }
  ];
};

class ProductStore {
  private listeners: Set<() => void> = new Set();

  initializeProducts(): void {
    if (typeof window === 'undefined' || !window.localStorage) {
      return;
    }

    const stored = localStorage.getItem(STORAGE_KEY);
    const folderProductsArray = Array.isArray(folderProducts) ? folderProducts.map((p: any) => ({
      ...p,
      createdAt: new Date(p.createdAt || Date.now()),
      updatedAt: new Date(p.updatedAt || Date.now())
    })) : [];
    
    if (stored === null) {
      const initialProducts = folderProductsArray.length > 0 ? folderProductsArray : getDemoProducts();
      localStorage.setItem(STORAGE_KEY, JSON.stringify(initialProducts));
    } else if (folderProductsArray.length > 0) {
      try {
        const existingProducts = JSON.parse(stored);
        const existingIds = new Set(existingProducts.map((p: any) => p.id));
        const newProducts = folderProductsArray.filter((p: any) => !existingIds.has(p.id));
        if (newProducts.length > 0) {
          const merged = [...existingProducts, ...newProducts];
          localStorage.setItem(STORAGE_KEY, JSON.stringify(merged));
        }
      } catch (e) {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(folderProductsArray));
      }
    }
  }

  private getProductsFromStorage(): Product[] {
    if (typeof window === 'undefined' || !window.localStorage) {
      return [];
    }

    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored === null) {
        const folderProductsArray = Array.isArray(folderProducts) ? folderProducts : [];
        return folderProductsArray.map((p: any) => ({
          ...p,
          createdAt: new Date(p.createdAt || Date.now()),
          updatedAt: new Date(p.updatedAt || Date.now())
        }));
      }
      const parsed = JSON.parse(stored);
      if (Array.isArray(parsed)) {
        return parsed.map((p: any) => ({
          ...p,
          createdAt: new Date(p.createdAt),
          updatedAt: new Date(p.updatedAt)
        }));
      }
      return [];
    } catch (error) {
      return [];
    }
  }

  private saveToStorage(products: Product[]): void {
    if (typeof window === 'undefined' || !window.localStorage) {
      return;
    }
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(products));
    } catch (quotaError: any) {
      if (quotaError.name === 'QuotaExceededError' || quotaError.code === 22) {
        if (products.length > 50) {
          const reduced = products.slice(-50);
          localStorage.setItem(STORAGE_KEY, JSON.stringify(reduced));
        }
      }
    }
  }

  subscribe(listener: () => void): () => void {
    this.listeners.add(listener);
    return () => {
      this.listeners.delete(listener);
    };
  }

  private notify(): void {
    this.listeners.forEach(listener => listener());
  }

  getAllProducts(): Product[] {
    const products = this.getProductsFromStorage();
    return [...products].sort((a, b) => {
      const aSerial = a.serialNumber ?? Number.MAX_SAFE_INTEGER;
      const bSerial = b.serialNumber ?? Number.MAX_SAFE_INTEGER;
      if (aSerial !== bSerial) {
        return aSerial - bSerial;
      }
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    });
  }

  getProductById(id: string): Product | undefined {
    const products = this.getProductsFromStorage();
    return products.find(p => p.id === id);
  }

  getProductsByCollection(collectionId: string): Product[] {
    return this.getAllProducts().filter(p => p.collection === collectionId);
  }

  getProductsByCategory(category: string): Product[] {
    return this.getAllProducts().filter(p => p.category === category);
  }

  createProduct(data: ProductFormData, images: string[]): Product {
    const products = this.getProductsFromStorage();
    const defaultImages = data.colorVariants?.[0]?.images || images || [];
    const newProduct: Product = {
      id: `prod-${Date.now()}`,
      name: data.name || '',
      price: data.price || 0,
      originalPrice: data.originalPrice || 0,
      description: data.description || '',
      category: data.category || '',
      collection: data.collection || '',
      sizes: data.sizes || [],
      colors: data.colors || [],
      materials: data.materials || [],
      care: data.care || [],
      features: data.features || [],
      isNew: data.isNew || false,
      isBestSeller: data.isBestSeller || false,
      isOnSale: data.isOnSale || false,
      inStock: data.inStock !== undefined ? data.inStock : true,
      stockCount: data.stockCount || 0,
      serialNumber: data.serialNumber,
      images: defaultImages,
      colorVariants: data.colorVariants || [],
      createdAt: new Date(),
      updatedAt: new Date()
    };

    const updatedProducts = [...products, newProduct];
    this.saveToStorage(updatedProducts);
    this.notify();
    return newProduct;
  }

  updateProduct(id: string, data: Partial<ProductFormData>, images?: string[]): boolean {
    const products = this.getProductsFromStorage();
    const index = products.findIndex(p => p.id === id);
    if (index === -1) return false;

    const defaultImages = data.colorVariants?.[0]?.images || images || products[index].images || [];
    products[index] = {
      ...products[index],
      ...data,
      images: defaultImages,
      colorVariants: data.colorVariants || products[index].colorVariants || [],
      updatedAt: new Date()
    };

    this.saveToStorage(products);
    this.notify();
    return true;
  }

  deleteProduct(id: string): boolean {
    const products = this.getProductsFromStorage();
    const index = products.findIndex(p => p.id === id);
    if (index === -1) return false;

    products.splice(index, 1);
    this.saveToStorage(products);
    this.notify();
    return true;
  }

  searchProducts(query: string): Product[] {
    const lowercaseQuery = query.toLowerCase();
    return this.getAllProducts().filter(product =>
      product.name.toLowerCase().includes(lowercaseQuery) ||
      product.description.toLowerCase().includes(lowercaseQuery) ||
      product.category.toLowerCase().includes(lowercaseQuery) ||
      product.materials.some(m => m.toLowerCase().includes(lowercaseQuery))
    );
  }

  reload(): void {
    this.notify();
  }
}

export const productStore = new ProductStore();
productStore.initializeProducts();

