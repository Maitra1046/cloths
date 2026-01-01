import { useEffect, useRef } from 'react';

interface PreloadOptions {
  priority?: 'high' | 'low';
  format?: 'avif' | 'webp' | 'jpeg';
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
}

/**
 * Hook to preload images for better performance
 */
export const useImagePreloader = () => {
  const preloadedImages = useRef(new Set<string>());

  const preloadImage = (src: string, options: PreloadOptions = {}) => {
    const { priority = 'low', format = 'webp', size = 'md' } = options;
    
    // Don't preload the same image twice
    if (preloadedImages.current.has(src)) return;
    
    let preloadSrc = src;
    
    // Generate optimized preload URL for Collection images
    if (src.startsWith('/Collection/')) {
      const basePath = src.replace(/\.(jpg|jpeg|png)$/i, '');
      
      if (format === 'avif') {
        preloadSrc = `${basePath}-${size}.avif`;
      } else if (format === 'webp') {
        preloadSrc = `${basePath}-${size}.webp`;
      } else {
        preloadSrc = `${basePath}-${size}.jpg`;
      }
    }
    
    const link = document.createElement('link');
    link.rel = 'preload';
    link.as = 'image';
    link.href = preloadSrc;
    link.fetchPriority = priority;
    
    // Add to document head
    document.head.appendChild(link);
    preloadedImages.current.add(src);
    
    // Clean up after 30 seconds to prevent memory leaks
    setTimeout(() => {
      if (document.head.contains(link)) {
        document.head.removeChild(link);
      }
    }, 30000);
  };

  const preloadImages = (sources: string[], options: PreloadOptions = {}) => {
    sources.forEach(src => preloadImage(src, options));
  };

  // Preload critical images on page load
  const preloadCriticalImages = (images: string[]) => {
    useEffect(() => {
      // Preload first 3 images with high priority
      images.slice(0, 3).forEach(src => {
        preloadImage(src, { priority: 'high', format: 'webp', size: 'md' });
      });
      
      // Preload remaining images with low priority after a delay
      setTimeout(() => {
        images.slice(3).forEach(src => {
          preloadImage(src, { priority: 'low', format: 'webp', size: 'sm' });
        });
      }, 1000);
    }, [images]);
  };

  return {
    preloadImage,
    preloadImages,
    preloadCriticalImages
  };
};