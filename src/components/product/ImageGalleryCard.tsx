import { useState, useEffect, useRef, useCallback } from 'react';
import { createPortal } from 'react-dom';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ChevronLeft, ChevronRight, ShoppingBag, Heart } from 'lucide-react';
import { ImageFolder } from '@/data/imageFolders';
import { getStaggeredItem } from '@/lib/animations';
import { formatCurrency } from '@/utils/currency';
import { useWishlist } from '@/context/WishlistContext';
import { useInViewportCenter } from '@/hooks/useIntersectionObserver';
import { useIsMobile } from '@/hooks/useIsMobile';
import { cn } from '@/lib/utils';

interface ImageGalleryCardProps {
  folder: ImageFolder;
  index?: number;
  onOpenSlideshow?: (folder: ImageFolder) => void;
  onOpenProductOptions?: (folder: ImageFolder) => void;
}

export const ImageGalleryCard = ({ folder, index = 0, onOpenSlideshow, onOpenProductOptions }: ImageGalleryCardProps) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isHovering, setIsHovering] = useState(false);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlist();
  
  // Mobile auto-slideshow functionality
  const { elementRef, isIntersecting } = useInViewportCenter();
  const isMobile = useIsMobile();

  const isWishlisted = isInWishlist(folder.id);

  const handleWishlistToggle = (e: React.MouseEvent) => {
    e.preventDefault(); // Prevent navigation to product page
    e.stopPropagation();
    
    if (isWishlisted) {
      removeFromWishlist(folder.id);
    } else {
      addToWishlist(folder.id, folder.name, folder.price, folder.images[0]);
    }
  };

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault(); // Prevent navigation to product page
    e.stopPropagation();
    if (onOpenProductOptions) {
      onOpenProductOptions(folder);
    }
  };

  // Auto-slideshow logic for both hover (desktop) and viewport center (mobile)
  useEffect(() => {
    const shouldAutoSlide = (isMobile && isIntersecting) || (!isMobile && isHovering);
    
    if (shouldAutoSlide && folder.images.length > 1) {
      intervalRef.current = setInterval(() => {
        setCurrentImageIndex((prev) => (prev + 1) % folder.images.length);
      }, isMobile ? 2000 : 1300); // Slower on mobile for better UX
    } else {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
      // Reset to first image when not auto-sliding
      if (!shouldAutoSlide) {
        setCurrentImageIndex(0);
      }
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isHovering, isIntersecting, isMobile, folder.images.length]);

  return (
    <motion.div
      {...getStaggeredItem(index)}
      className="group"
      ref={elementRef}
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}
    >
      <Link 
        to={`/folder/${folder.id}`}
        className="block cursor-pointer"
      >
        {/* Image Container */}
        <div className="relative aspect-[3/4] overflow-hidden bg-cream mb-4">
          {folder.images.map((image, imgIndex) => (
            <img
              key={imgIndex}
              src={image}
              alt={`${folder.name} - View ${imgIndex + 1}`}
              className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-500 ease-in-out ${
                imgIndex === currentImageIndex ? 'opacity-100' : 'opacity-0'
              } ${isHovering ? 'group-hover:scale-105' : ''}`}
              style={{ transition: 'transform 0.5s ease-in-out' }}
            />
          ))}

          {/* Image Indicators - Show on hover (desktop) or when in viewport (mobile) */}
          {((isMobile && isIntersecting) || (!isMobile && isHovering)) && folder.images.length > 1 && (
            <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5 z-10">
              {folder.images.map((_, imgIndex) => (
                <span
                  key={imgIndex}
                  className={`w-1.5 h-1.5 rounded-full transition-all duration-300 ${
                    imgIndex === currentImageIndex
                      ? 'bg-foreground w-4'
                      : 'bg-foreground/40'
                  }`}
                />
              ))}
            </div>
          )}

          {/* Wishlist Heart Button */}
          <button
            onClick={handleWishlistToggle}
            className={cn(
              "absolute top-3 right-3 p-2 rounded-full transition-all duration-200",
              "bg-white/80 hover:bg-white shadow-sm hover:shadow-md",
              "opacity-0 group-hover:opacity-100",
              isWishlisted && "opacity-100"
            )}
          >
            <Heart
              size={16}
              className={cn(
                "transition-colors",
                isWishlisted 
                  ? "fill-red-500 text-red-500" 
                  : "text-gray-600 hover:text-red-500"
              )}
            />
          </button>

          {/* Hover Overlay */}
          <div className="absolute inset-0 bg-foreground/0 group-hover:bg-foreground/10 transition-colors duration-300" />
        </div>
      </div>

        {/* Folder Info */}
        <div className="space-y-2">
          <h3 className="font-serif text-base text-foreground group-hover:text-primary transition-colors">
            {folder.name}
          </h3>
          <div className="flex items-center justify-between">
            <p className="text-sm text-muted-foreground">
              {folder.images.length} {folder.images.length === 1 ? 'photo' : 'photos'}
            </p>
            <p className="text-base font-medium text-foreground">
              {formatCurrency(folder.price)}
            </p>
          </div>
        </div>
      </Link>
        
      {/* Add to Cart Button - Outside the Link to prevent navigation */}
      {onOpenProductOptions && (
        <button
          onClick={handleAddToCart}
          className="w-full mt-3 py-2 px-4 bg-primary text-primary-foreground text-sm tracking-wider hover:bg-brown/90 transition-all duration-300 flex items-center justify-center gap-2"
        >
          <ShoppingBag size={16} />
          Add to Cart
        </button>
      )}
    </motion.div>
  );
};

interface ImageSlideshowProps {
  folder: ImageFolder | null;
  isOpen: boolean;
  onClose: () => void;
}

export const ImageSlideshow = ({ folder, isOpen, onClose }: ImageSlideshowProps) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const images = folder?.images || [];
  const currentImage = images[currentIndex];

  const goToPrevious = useCallback(() => {
    setCurrentIndex((prev) => (prev - 1 + images.length) % images.length);
  }, [images.length]);

  const goToNext = useCallback(() => {
    setCurrentIndex((prev) => (prev + 1) % images.length);
  }, [images.length]);

  const goToImage = (index: number) => {
    setCurrentIndex(index);
  };

  // Reset index when folder changes
  useEffect(() => {
    if (folder) {
      setCurrentIndex(0);
    }
  }, [folder]);

  // Prevent body scroll when slideshow is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  // Keyboard navigation
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft') {
        goToPrevious();
      } else if (e.key === 'ArrowRight') {
        goToNext();
      } else if (e.key === 'Escape') {
        onClose();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, images.length, goToNext, goToPrevious, onClose]);

  if (!folder || !isOpen || images.length === 0) {
    return null;
  }

  const slideshowContent = (
    <AnimatePresence mode="wait">
      {isOpen && folder && (
        <motion.div
          key="slideshow"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[100] bg-background/95 backdrop-blur-sm flex items-center justify-center p-4"
          onClick={onClose}
        >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        className="relative max-w-6xl w-full max-h-[90vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-10 p-2 bg-background/80 backdrop-blur-sm rounded-full hover:bg-background transition-colors"
          aria-label="Close slideshow"
        >
          <X size={24} className="text-foreground" />
        </button>

        {/* Main Image */}
        <div className="relative w-full flex-1 flex items-center justify-center bg-cream rounded-lg overflow-hidden mb-4">
          <AnimatePresence mode="wait">
            <motion.img
              key={currentImage}
              initial={{ opacity: 0, x: 60 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -60 }}
              transition={{ duration: 0.45, ease: 'easeInOut' }}
              src={currentImage}
              alt={`${folder.name} - Image ${currentIndex + 1}`}
              className="max-w-full max-h-[70vh] object-contain"
            />
          </AnimatePresence>

          {/* Navigation Arrows */}
          {images.length > 1 && (
            <>
              <button
                onClick={goToPrevious}
                className="absolute left-4 top-1/2 -translate-y-1/2 p-2 bg-background/80 backdrop-blur-sm rounded-full hover:bg-background transition-colors"
                aria-label="Previous image"
              >
                <ChevronLeft size={24} className="text-foreground" />
              </button>
              <button
                onClick={goToNext}
                className="absolute right-4 top-1/2 -translate-y-1/2 p-2 bg-background/80 backdrop-blur-sm rounded-full hover:bg-background transition-colors"
                aria-label="Next image"
              >
                <ChevronRight size={24} className="text-foreground" />
              </button>
            </>
          )}

          {/* Image Counter */}
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-background/80 backdrop-blur-sm px-3 py-1.5 rounded-full">
            <span className="text-sm text-foreground">
              {currentIndex + 1} / {images.length}
            </span>
          </div>
        </div>

        {/* Thumbnail Strip */}
        {images.length > 1 && (
          <div className="flex gap-2 overflow-x-auto pb-2">
            {images.map((image, index) => (
              <button
                key={index}
                onClick={() => goToImage(index)}
                className={`flex-shrink-0 w-20 h-20 rounded overflow-hidden border-2 transition-all ${
                  index === currentIndex
                    ? 'border-primary scale-105'
                    : 'border-border hover:border-primary/50'
                }`}
              >
                <img
                  src={image}
                  alt={`Thumbnail ${index + 1}`}
                  className="w-full h-full object-cover"
                />
              </button>
            ))}
          </div>
        )}

        {/* Folder Name */}
        <div className="mt-4 text-center">
          <h3 className="font-serif text-xl text-foreground">{folder.name}</h3>
        </div>
      </motion.div>
      </motion.div>
      )}
    </AnimatePresence>
  );

  return createPortal(slideshowContent, document.body);
};

