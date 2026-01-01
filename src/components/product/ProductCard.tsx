import { useState, useEffect, useRef, memo } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Heart } from 'lucide-react';
import { Product } from '@/types/product';
import { getStaggeredItem } from '@/lib/animations';
import { formatCurrency } from '@/utils/currency';
import { useWishlist } from '@/context/WishlistContext';
import { useInViewportCenter } from '@/hooks/useIntersectionObserver';
import { useImageLazyLoad } from '@/hooks/useImageLazyLoad';
import { useIsMobile } from '@/hooks/useIsMobile';
import { cn } from '@/lib/utils';

interface ProductCardProps {
  product: Product;
  index?: number;
  onAddToCart?: (product: Product) => void;
}

const ProductCardComponent = ({ product, index = 0, onAddToCart }: ProductCardProps) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isHovering, setIsHovering] = useState(false);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlist();
  
  // Mobile auto-slideshow functionality
  const { elementRef: centerRef, isIntersecting } = useInViewportCenter();
  // Image lazy loading with early trigger
  const { elementRef: imageLoadRef, shouldLoad: shouldLoadImages } = useImageLazyLoad();
  const isMobile = useIsMobile();
  
  // Callback ref to assign to both hooks
  const setRefs = (node: HTMLDivElement | null) => {
    if (centerRef) {
      (centerRef as any).current = node;
    }
    if (imageLoadRef) {
      (imageLoadRef as any).current = node;
    }
  };

  const isWishlisted = isInWishlist(product.id);

  const firstColor = product.colors.length > 0 ? product.colors[0] : '';
  const firstVariant = product.colorVariants?.find(v => v.color === firstColor);
  const displayImages = firstVariant?.images && firstVariant.images.length > 0 
    ? firstVariant.images 
    : (product.images || []);
  const headPos = firstVariant?.headAlignment ?? 20;

  const handleWishlistToggle = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (isWishlisted) {
      removeFromWishlist(product.id);
    } else {
      addToWishlist(product.id, product.name, product.price, displayImages[0] || '');
    }
  };

  useEffect(() => {
    const shouldAutoSlide = (isMobile && isIntersecting) || (!isMobile && isHovering);
    
    if (shouldAutoSlide && displayImages.length > 1) {
      intervalRef.current = setInterval(() => {
        setCurrentImageIndex((prev) => (prev + 1) % displayImages.length);
      }, isMobile ? 2000 : 1500);
    } else {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
      if (!shouldAutoSlide) {
        setCurrentImageIndex(0);
      }
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isHovering, isIntersecting, isMobile, displayImages.length]);

  return (
    <motion.div
      {...getStaggeredItem(index)}
      ref={setRefs}
      className="h-full flex flex-col"
      style={{ willChange: 'transform, opacity' }}
    >
      <Link 
        to={`/product/${product.id}`}
        className="group block flex flex-col h-full"
        onMouseEnter={() => setIsHovering(true)}
        onMouseLeave={() => setIsHovering(false)}
      >
        <div 
          className="relative aspect-[3/4] overflow-hidden bg-cream mb-4 cursor-pointer"
          style={{ willChange: 'contents' }}
        >
          {displayImages.map((image, imgIndex) => {
            const isVisible = imgIndex === currentImageIndex;
            // Load images when card is about to enter viewport (earlier trigger)
            const shouldLoad = imgIndex === 0 || (shouldLoadImages && imgIndex <= currentImageIndex + 1);
            
            return (
              <img
                key={imgIndex}
                src={shouldLoad ? image : undefined}
                alt={`${product.name} - View ${imgIndex + 1}`}
                loading={imgIndex === 0 ? "lazy" : "lazy"}
                decoding="async"
                className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-500 ease-[cubic-bezier(0.4,0,0.2,1)] ${
                  isVisible && shouldLoad ? 'opacity-100' : 'opacity-0'
                }`}
                style={{ 
                  objectPosition: `center ${headPos}%`,
                  willChange: 'opacity'
                }}
              />
            );
          })}

          {/* Tags */}
          <div className="absolute top-3 left-3 flex flex-col gap-2">
            {product.isBestSeller && (
              <span className="tag-bestseller">Best Seller</span>
            )}
            {product.isNew && (
              <span className="tag-new">New</span>
            )}
          </div>

          {/* Wishlist Heart Button */}
          <button
            onClick={handleWishlistToggle}
            className={cn(
              "absolute top-2 right-2 sm:top-3 sm:right-3 p-2 sm:p-2 rounded-full transition-all duration-200 touch-manipulation min-h-[44px] min-w-[44px] flex items-center justify-center",
              "bg-white/80 hover:bg-white active:bg-white shadow-sm hover:shadow-md",
              "opacity-0 group-hover:opacity-100 sm:opacity-0 sm:group-hover:opacity-100",
              isWishlisted && "opacity-100"
            )}
          >
            <Heart
              size={18}
              className={cn(
                "sm:w-4 sm:h-4 transition-colors",
                isWishlisted 
                  ? "fill-red-500 text-red-500" 
                  : "text-gray-600 hover:text-red-500"
              )}
            />
          </button>

          {((isMobile && isIntersecting) || (!isMobile && isHovering)) && displayImages.length > 1 && (
            <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5">
              {displayImages.map((_, imgIndex) => (
                <span
                  key={imgIndex}
                  className={`w-1.5 h-1.5 rounded-full transition-all duration-300 ease-[cubic-bezier(0.4,0,0.2,1)] ${
                    imgIndex === currentImageIndex
                      ? 'bg-foreground w-4'
                      : 'bg-foreground/40'
                  }`}
                />
              ))}
            </div>
          )}
        </div>

        <div className="space-y-2 min-h-[80px] flex flex-col">
          <h3 className="font-serif text-sm sm:text-base text-foreground group-hover:text-primary transition-colors duration-300 ease-[cubic-bezier(0.4,0,0.2,1)] break-words line-clamp-2">
            {product.name}
          </h3>
          <p className="text-xs sm:text-sm text-muted-foreground">
            {formatCurrency(product.price)}
          </p>
          {product.colors.length > 0 && (
            <div className="flex items-center gap-1.5 pt-1 mt-auto">
              {product.colors.map((color, colorIndex) => (
                <span
                  key={colorIndex}
                  className="w-3 h-3 rounded-full border border-border"
                  style={{ backgroundColor: color }}
                />
              ))}
            </div>
          )}
        </div>
      </Link>

      {/* Fixed Add to Cart Button - Outside the Link to prevent navigation */}
      {onAddToCart && (
        <button
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            onAddToCart(product);
          }}
          className="w-full mt-3 py-3 sm:py-2 px-4 bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90 active:bg-primary/80 transition-colors duration-200 ease-[cubic-bezier(0.4,0,0.2,1)] touch-manipulation min-h-[44px]"
        >
          Add to Cart
        </button>
      )}
    </motion.div>
  );
};

// Memoize component to prevent unnecessary re-renders
export const ProductCard = memo(ProductCardComponent, (prevProps, nextProps) => {
  // Return true if props are equal (skip re-render), false if different (re-render)
  return (
    prevProps.product.id === nextProps.product.id &&
    prevProps.product.name === nextProps.product.name &&
    prevProps.product.price === nextProps.product.price &&
    prevProps.product.images === nextProps.product.images &&
    prevProps.index === nextProps.index &&
    prevProps.onAddToCart === nextProps.onAddToCart
  );
});
