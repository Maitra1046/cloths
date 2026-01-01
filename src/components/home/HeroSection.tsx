import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ChevronLeft, ChevronRight } from 'lucide-react';

// Hero images from Collections folders
const heroImages = [
  '/Collection/C1/1/1.jpg',
  '/Collection/C2/2/4.jpg',
  '/Collection/C2/4/1.jpg',
  '/Collection/C3/1/1.jpg',
  '/Collection/C1/4/1.jpg',
];

export const HeroSection = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  // Preload all hero images for smooth transitions
  useEffect(() => {
    heroImages.forEach((src) => {
      const img = new Image();
      img.src = src;
    });
  }, []);

  // Function to start the auto-advance
  const startAutoAdvance = () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }
    intervalRef.current = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % heroImages.length);
    }, 5000);
  };

  // Auto-advance slider with proper cleanup
  useEffect(() => {
    startAutoAdvance();
    
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, []); // Empty dependency array to run once

  const goToNext = () => {
    setCurrentIndex((prev) => (prev + 1) % heroImages.length);
    startAutoAdvance(); // Restart auto-advance after manual interaction
  };

  const goToPrevious = () => {
    setCurrentIndex((prev) => (prev - 1 + heroImages.length) % heroImages.length);
    startAutoAdvance(); // Restart auto-advance after manual interaction
  };

  const goToSlide = (index: number) => {
    setCurrentIndex(index);
    startAutoAdvance(); // Restart auto-advance after manual interaction
  };

  return (
    <section className="relative h-[70vh] sm:h-[80vh] lg:h-[85vh] min-h-[500px] sm:min-h-[600px] max-h-[900px] overflow-hidden">
      {/* Background Image Slider */}
      <div className="absolute inset-0">
        {heroImages.map((image, index) => (
          <motion.div
            key={index}
            initial={false}
            animate={{ 
              opacity: index === currentIndex ? 1 : 0,
              scale: index === currentIndex ? 1 : 1.05
            }}
            transition={{ 
              duration: 1.2, 
              ease: [0.16, 1, 0.3, 1],
              opacity: { duration: 1 }
            }}
            className="absolute inset-0"
          >
            <img
              src={image}
              alt={`BEENAS Spring Summer Collection - Hero image ${index + 1}`}
              className="w-full h-full object-cover object-center"
              loading={index === 0 ? "eager" : "lazy"}
            />
          </motion.div>
        ))}
        
        <div className="absolute inset-0 bg-gradient-to-r from-background/70 via-background/40 to-transparent sm:from-background/60 sm:via-background/30" />
        
        {/* Slider Controls */}
        <button
          onClick={goToPrevious}
          className="absolute left-4 sm:left-6 top-1/2 -translate-y-1/2 p-2 sm:p-3 bg-white/80 hover:bg-white text-foreground rounded-full shadow-md transition-all duration-300 hover:scale-110 z-10"
          aria-label="Previous image"
        >
          <ChevronLeft size={24} className="sm:w-6 sm:h-6" />
        </button>
        <button
          onClick={goToNext}
          className="absolute right-4 sm:right-6 top-1/2 -translate-y-1/2 p-2 sm:p-3 bg-white/80 hover:bg-white text-foreground rounded-full shadow-md transition-all duration-300 hover:scale-110 z-10"
          aria-label="Next image"
        >
          <ChevronRight size={24} className="sm:w-6 sm:h-6" />
        </button>

        {/* Dots Indicator */}
        <div className="absolute bottom-6 sm:bottom-8 left-1/2 -translate-x-1/2 flex gap-2 z-10">
          {heroImages.map((_, index) => (
            <button
              key={index}
              onClick={() => goToSlide(index)}
              className={`h-2 rounded-full transition-all duration-300 ${
                index === currentIndex
                  ? 'w-8 bg-foreground'
                  : 'w-2 bg-foreground/40 hover:bg-foreground/60'
              }`}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      </div>

      {/* Content */}
      <div className="relative h-full container mx-auto container-padding flex items-center">
        <div className="max-w-lg lg:max-w-xl">
          <motion.span
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="inline-block text-xs sm:text-sm tracking-[0.2em] sm:tracking-[0.3em] uppercase text-taupe mb-3 sm:mb-4"
          >
            Spring / Summer Collection
          </motion.span>

          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="font-serif text-display-large text-foreground leading-[1.1] mb-4 sm:mb-6"
          >
            Effortless
            <br />
            Elegance
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.6 }}
            className="text-body-large text-muted-foreground leading-relaxed mb-6 sm:mb-8 max-w-md"
          >
            Discover modern silhouettes crafted from premium fabrics. 
            Designed to move with you, made to last forever.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.8 }}
            className="flex flex-col sm:flex-row gap-3 sm:gap-4"
          >
            <Link
              to="/shop?filter=new"
              className="inline-flex items-center justify-center px-6 sm:px-8 py-3 sm:py-3.5 bg-primary text-primary-foreground text-sm tracking-wider hover:bg-brown/90 transition-all duration-300"
            >
              Shop New Arrivals
            </Link>
            <Link
              to="/shop"
              className="inline-flex items-center justify-center px-6 sm:px-8 py-3 sm:py-3.5 border border-foreground text-foreground text-sm tracking-wider hover:bg-foreground hover:text-background transition-all duration-300"
            >
              View Lookbook
            </Link>
          </motion.div>
        </div>
      </div>

      {/* Scroll Indicator - Moved to side to avoid overlap with dots */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6, delay: 1.2 }}
        className="absolute bottom-8 right-6 sm:right-8 hidden sm:block z-10"
      >
        <div className="w-px h-12 bg-gradient-to-b from-foreground/60 to-transparent" />
      </motion.div>
    </section>
  );
};
