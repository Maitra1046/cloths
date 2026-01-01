import { createContext, ReactNode, useContext, useState, useEffect } from 'react';

export interface WishlistItem {
  productId: string;
  productName: string;
  productPrice: number;
  productImage: string;
  addedAt: Date;
}

interface WishlistContextType {
  wishlistItems: WishlistItem[];
  addToWishlist: (productId: string, productName: string, productPrice: number, productImage: string) => void;
  removeFromWishlist: (productId: string) => void;
  isInWishlist: (productId: string) => boolean;
  clearWishlist: () => void;
  wishlistCount: number;
}

const WishlistContext = createContext<WishlistContextType | undefined>(undefined);

const STORAGE_KEY = 'beenas-wishlist';

export const WishlistProvider = ({ children }: { children: ReactNode }) => {
  const [wishlistItems, setWishlistItems] = useState<WishlistItem[]>([]);

  // Load wishlist from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        const parsedItems = JSON.parse(saved);
        // Convert addedAt strings back to Date objects
        const itemsWithDates = parsedItems.map((item: any) => ({
          ...item,
          addedAt: new Date(item.addedAt)
        }));
        setWishlistItems(itemsWithDates);
      } catch {
        // Invalid data, ignore
      }
    }
  }, []);

  // Save wishlist to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(wishlistItems));
  }, [wishlistItems]);

  const addToWishlist = (productId: string, productName: string, productPrice: number, productImage: string) => {
    setWishlistItems((prev) => {
      // Check if item already exists
      const existing = prev.find(item => item.productId === productId);
      if (existing) {
        return prev; // Don't add duplicates
      }
      
      return [
        ...prev,
        {
          productId,
          productName,
          productPrice,
          productImage,
          addedAt: new Date()
        }
      ];
    });
  };

  const removeFromWishlist = (productId: string) => {
    setWishlistItems((prev) => prev.filter(item => item.productId !== productId));
  };

  const isInWishlist = (productId: string): boolean => {
    return wishlistItems.some(item => item.productId === productId);
  };

  const clearWishlist = () => {
    setWishlistItems([]);
    localStorage.removeItem(STORAGE_KEY);
  };

  const wishlistCount = wishlistItems.length;

  return (
    <WishlistContext.Provider
      value={{
        wishlistItems,
        addToWishlist,
        removeFromWishlist,
        isInWishlist,
        clearWishlist,
        wishlistCount,
      }}
    >
      {children}
    </WishlistContext.Provider>
  );
};

export const useWishlist = () => {
  const ctx = useContext(WishlistContext);
  if (!ctx) throw new Error('useWishlist must be used within WishlistProvider');
  return ctx;
};