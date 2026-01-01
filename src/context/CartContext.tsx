import { createContext, ReactNode, useContext, useState, useEffect } from 'react';

export interface CustomMeasurements {
  bust: string;
  waist: string;
  hip: string;
  shoulder: string;
  sleeve: string;
  length: string;
}

export interface CartItem {
  productId: string;
  productName: string;
  image: string;
  price: number;
  quantity: number;
  size?: string;
  isCustom?: boolean;
  customMeasurements?: CustomMeasurements;
  productType?: 'product' | 'folder'; // Add type to distinguish between product types
}

interface CartContextType {
  cartItems: CartItem[];
  addToCart: (
    productId: string,
    productName: string,
    image: string,
    price: number,
    size?: string,
    isCustom?: boolean,
    customMeasurements?: CustomMeasurements,
    productType?: 'product' | 'folder'
  ) => void;
  removeFromCart: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  cartItemCount: number;
  isCartOpen: boolean;
  openCart: () => void;
  closeCart: () => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

const STORAGE_KEY = 'beenas-cart';

export const CartProvider = ({ children }: { children: ReactNode }) => {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);

  // Load cart from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        const parsedItems = JSON.parse(saved);
        // Migrate old cart items to new format
        const migratedItems = parsedItems.map((item: any) => {
          // If item has old folderId/folderName structure, migrate it
          if (item.folderId && !item.productId) {
            return {
              productId: item.folderId,
              productName: item.folderName,
              image: item.image,
              price: item.price,
              quantity: item.quantity,
              size: item.size,
              isCustom: item.isCustom,
              customMeasurements: item.customMeasurements,
              productType: 'folder'
            };
          }
          // If item already has new structure, keep it
          return item;
        });
        setCartItems(migratedItems);
      } catch {
        // Invalid data, ignore
      }
    }
  }, []);

  // Save cart to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(cartItems));
  }, [cartItems]);

  const addToCart = (
    productId: string,
    productName: string,
    image: string,
    price: number,
    size?: string,
    isCustom?: boolean,
    customMeasurements?: CustomMeasurements,
    productType: 'product' | 'folder' = 'product'
  ) => {
    setCartItems((prev) => {
      const existing = prev.find(
        (item) =>
          item.productId === productId &&
          item.size === size &&
          item.isCustom === isCustom
      );
      if (existing) {
        return prev.map((item) =>
          item.productId === productId &&
          item.size === size &&
          item.isCustom === isCustom
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      return [
        ...prev,
        {
          productId,
          productName,
          image,
          price,
          quantity: 1,
          size,
          isCustom,
          customMeasurements,
          productType,
        },
      ];
    });
    setIsCartOpen(true); // Open cart modal when item is added
  };

  const removeFromCart = (productId: string) => {
    setCartItems((prev) => prev.filter((item) => item.productId !== productId));
  };

  const updateQuantity = (productId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(productId);
      return;
    }
    setCartItems((prev) =>
      prev.map((item) =>
        item.productId === productId ? { ...item, quantity } : item
      )
    );
  };

  const clearCart = () => {
    setCartItems([]);
    localStorage.removeItem(STORAGE_KEY);
  };

  const cartItemCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <CartContext.Provider
      value={{
        cartItems,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        cartItemCount,
        isCartOpen,
        openCart: () => setIsCartOpen(true),
        closeCart: () => setIsCartOpen(false),
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error('useCart must be used within CartProvider');
  return ctx;
};

