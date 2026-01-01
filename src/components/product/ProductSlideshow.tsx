import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ChevronLeft, ChevronRight } from 'lucide-react';
import { Product } from '@/types/product';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';

interface ProductSlideshowProps {
  product: Product | null;
  isOpen: boolean;
  onClose: () => void;
}

export const ProductSlideshow = ({ product, isOpen, onClose }: ProductSlideshowProps) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const images = product?.images || [];
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

  // Reset index when product changes
  useEffect(() => {
    if (product) {
      setCurrentIndex(0);
    }
  }, [product]);

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
  }, [isOpen, goToPrevious, goToNext, onClose]);

  if (!product) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl w-[100vw] sm:w-[95vw] max-h-[100vh] sm:max-h-[90vh] p-0 m-0 sm:m-4 rounded-none sm:rounded-lg">
        <div className="flex flex-col h-full max-h-[100vh] sm:max-h-[90vh] overflow-hidden">
          <DialogHeader className="p-4 sm:p-6 pb-3 sm:pb-4 border-b flex-shrink-0">
            <DialogTitle className="font-serif text-lg sm:text-xl break-words">{product.name}</DialogTitle>
            <p className="text-xs sm:text-sm text-muted-foreground">{product.category}</p>
          </DialogHeader>

          <div className="flex-1 p-4 sm:p-6 space-y-3 sm:space-y-4 overflow-y-auto">
            <div className="relative">
              <div className="aspect-[4/5] max-h-[50vh] sm:max-h-[60vh] overflow-hidden bg-cream rounded-lg">
                <AnimatePresence mode="wait">
                  <motion.img
                    key={currentIndex}
                    src={currentImage}
                    alt={`${product.name} - Image ${currentIndex + 1}`}
                    className="w-full h-full object-cover"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.3, ease: "easeInOut" }}
                  />
                </AnimatePresence>

                {images.length > 1 && (
                  <>
                    <button
                      onClick={goToPrevious}
                      className="absolute left-2 sm:left-4 top-1/2 -translate-y-1/2 p-2.5 sm:p-2 bg-white/80 hover:bg-white active:bg-white rounded-full shadow-md transition-all duration-200 hover:scale-110 touch-manipulation min-h-[44px] min-w-[44px] flex items-center justify-center"
                    >
                      <ChevronLeft size={20} className="text-gray-700" />
                    </button>
                    <button
                      onClick={goToNext}
                      className="absolute right-2 sm:right-4 top-1/2 -translate-y-1/2 p-2.5 sm:p-2 bg-white/80 hover:bg-white active:bg-white rounded-full shadow-md transition-all duration-200 hover:scale-110 touch-manipulation min-h-[44px] min-w-[44px] flex items-center justify-center"
                    >
                      <ChevronRight size={20} className="text-gray-700" />
                    </button>
                  </>
                )}

                {/* Image Counter */}
                {images.length > 1 && (
                  <div className="absolute bottom-4 right-4 px-3 py-1 bg-black/60 text-white text-sm rounded-full">
                    {currentIndex + 1} / {images.length}
                  </div>
                )}
              </div>
            </div>

            {images.length > 1 && (
              <div className="flex gap-2 overflow-x-auto pb-2 -mx-4 sm:mx-0 px-4 sm:px-0">
                {images.map((image, index) => (
                  <button
                    key={index}
                    onClick={() => goToImage(index)}
                    className={`flex-shrink-0 w-16 h-16 sm:w-20 sm:h-20 border-2 rounded-lg overflow-hidden transition-all duration-200 touch-manipulation ${
                      index === currentIndex
                        ? 'border-primary shadow-md scale-105'
                        : 'border-border hover:border-primary/50 active:border-primary'
                    }`}
                  >
                    <img
                      src={image}
                      alt={`${product.name} thumbnail ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
            )}

            {/* Product Details */}
            <div className="pt-4 border-t space-y-2">
              <div className="flex items-center justify-between">
                <h3 className="font-serif text-lg">{product.name}</h3>
                <p className="text-lg font-medium">${product.price}</p>
              </div>
              <p className="text-sm text-muted-foreground line-clamp-2">
                {product.description}
              </p>
              {product.colors.length > 0 && (
                <div className="flex items-center gap-2">
                  <span className="text-sm text-muted-foreground">Colors:</span>
                  <div className="flex gap-1">
                    {product.colors.map((color, index) => (
                      <span
                        key={index}
                        className="w-4 h-4 rounded-full border border-border"
                        style={{ backgroundColor: color }}
                        title={color}
                      />
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};