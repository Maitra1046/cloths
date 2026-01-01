import { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';
import { motion, AnimatePresence } from 'framer-motion';

interface ImageNavigatorProps {
  images: string[];
  alt: string;
  className?: string;
  showThumbnails?: boolean;
  showCounter?: boolean;
  onImageChange?: (index: number) => void;
  objectPosition?: string;
}

export const ImageNavigator = ({
  images,
  alt,
  className,
  showThumbnails = true,
  showCounter = true,
  onImageChange,
  objectPosition = 'center center'
}: ImageNavigatorProps) => {
  const [selectedImage, setSelectedImage] = useState(0);
  const [touchStart, setTouchStart] = useState<number | null>(null);
  const [touchEnd, setTouchEnd] = useState<number | null>(null);

  // Image navigation functions
  const goToPreviousImage = () => {
    const newIndex = selectedImage === 0 ? images.length - 1 : selectedImage - 1;
    setSelectedImage(newIndex);
    onImageChange?.(newIndex);
  };

  const goToNextImage = () => {
    const newIndex = selectedImage === images.length - 1 ? 0 : selectedImage + 1;
    setSelectedImage(newIndex);
    onImageChange?.(newIndex);
  };

  const goToImage = (index: number) => {
    setSelectedImage(index);
    onImageChange?.(index);
  };

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft') {
        e.preventDefault();
        goToPreviousImage();
      } else if (e.key === 'ArrowRight') {
        e.preventDefault();
        goToNextImage();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedImage, images.length]);

  // Auto-advance (optional)
  const [isAutoPlaying, setIsAutoPlaying] = useState(false);
  
  useEffect(() => {
    if (!isAutoPlaying || images.length <= 1) return;
    
    const interval = setInterval(() => {
      goToNextImage();
    }, 3000);
    
    return () => clearInterval(interval);
  }, [isAutoPlaying, selectedImage, images.length]);

  // Touch/swipe handling for mobile
  const minSwipeDistance = 50;

  const onTouchStart = (e: React.TouchEvent) => {
    setTouchEnd(null);
    setTouchStart(e.targetTouches[0].clientX);
  };

  const onTouchMove = (e: React.TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const onTouchEnd = () => {
    if (!touchStart || !touchEnd) return;
    
    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > minSwipeDistance;
    const isRightSwipe = distance < -minSwipeDistance;

    if (isLeftSwipe) {
      goToNextImage();
    } else if (isRightSwipe) {
      goToPreviousImage();
    }
  };

  if (images.length === 0) {
    return (
      <div className={cn("aspect-[3/4] bg-gray-100 flex items-center justify-center", className)}>
        <span className="text-gray-400">No images available</span>
      </div>
    );
  }

  const MainImageDisplay = () => (
    <div 
      className="relative overflow-hidden bg-cream group aspect-[3/4]"
      onTouchStart={onTouchStart}
      onTouchMove={onTouchMove}
      onTouchEnd={onTouchEnd}
    >
      <AnimatePresence mode="wait">
        <motion.img
          key={selectedImage}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          transition={{ duration: 0.3, ease: 'easeInOut' }}
          src={images[selectedImage]}
          alt={`${alt} - Image ${selectedImage + 1}`}
          className="w-full h-full object-cover select-none"
          style={{ objectPosition }}
          draggable={false}
        />
      </AnimatePresence>
      
      {/* Navigation Buttons */}
      {images.length > 1 && (
        <>
          <button
            onClick={goToPreviousImage}
            className="absolute left-2 sm:left-3 top-1/2 -translate-y-1/2 p-2 sm:p-3 bg-white/90 hover:bg-white text-foreground rounded-full shadow-lg transition-all duration-300 hover:scale-110 z-10 opacity-100 sm:opacity-0 sm:group-hover:opacity-100"
            aria-label="Previous image"
          >
            <ChevronLeft size={18} className="sm:w-6 sm:h-6" />
          </button>
          
          <button
            onClick={goToNextImage}
            className="absolute right-2 sm:right-3 top-1/2 -translate-y-1/2 p-2 sm:p-3 bg-white/90 hover:bg-white text-foreground rounded-full shadow-lg transition-all duration-300 hover:scale-110 z-10 opacity-100 sm:opacity-0 sm:group-hover:opacity-100"
            aria-label="Next image"
          >
            <ChevronRight size={18} className="sm:w-6 sm:h-6" />
          </button>
        </>
      )}
      
      {/* Image Counter */}
      {showCounter && images.length > 1 && (
        <div className="absolute bottom-3 left-1/2 -translate-x-1/2 bg-black/70 text-white px-3 py-1.5 rounded-full text-sm font-medium">
          {selectedImage + 1} / {images.length}
        </div>
      )}
      
      {/* Mobile swipe indicator - only show on first load */}
      {images.length > 1 && (
        <div className="absolute bottom-12 left-1/2 -translate-x-1/2 text-white/70 text-xs font-medium sm:hidden animate-pulse">
          Swipe or tap arrows
        </div>
      )}
      
      {/* Auto-play toggle */}
      {images.length > 1 && (
        <button
          onClick={() => setIsAutoPlaying(!isAutoPlaying)}
          className={cn(
            "absolute top-2 sm:top-3 left-2 sm:left-3 px-2 sm:px-3 py-1 sm:py-1.5 text-xs font-medium rounded-full shadow-lg transition-all duration-300 z-10 opacity-80 sm:opacity-0 sm:group-hover:opacity-100",
            isAutoPlaying 
              ? "bg-primary text-primary-foreground" 
              : "bg-white/90 hover:bg-white text-foreground"
          )}
        >
          {isAutoPlaying ? 'Pause' : 'Auto'}
        </button>
      )}
    </div>
  );

  return (
    <div className={className}>
      <MainImageDisplay />
      
      {/* Thumbnail Gallery */}
      {showThumbnails && images.length > 1 && (
        <div className="flex gap-2 sm:gap-3 overflow-x-auto pb-2 mt-4 -mx-4 sm:mx-0 px-4 sm:px-0">
          {images.map((image, index) => (
            <button
              key={index}
              onClick={() => goToImage(index)}
              className={cn(
                'w-16 h-20 sm:w-20 sm:h-24 flex-shrink-0 overflow-hidden border-2 transition-all duration-200 rounded-sm touch-manipulation',
                selectedImage === index
                  ? 'border-primary ring-2 ring-primary/20'
                  : 'border-transparent hover:border-border active:border-primary'
              )}
            >
              <img
                src={image}
                alt={`${alt} thumbnail ${index + 1}`}
                className="w-full h-full object-cover"
                style={{ objectPosition }}
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
};