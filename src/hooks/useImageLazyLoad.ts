import { useEffect, useRef, useState } from 'react';

interface UseImageLazyLoadOptions {
  rootMargin?: string;
}

/**
 * Hook for lazy loading images that triggers earlier to prevent visible loading
 * Uses a larger rootMargin to start loading before the element enters viewport
 */
export const useImageLazyLoad = (options: UseImageLazyLoadOptions = {}) => {
  const {
    rootMargin = '200px 0px 200px 0px', // Start loading 200px before element enters viewport
  } = options;

  const [shouldLoad, setShouldLoad] = useState(false);
  const elementRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const element = elementRef.current;
    if (!element) return;
    if (shouldLoad) return; // Already triggered, no need to observe

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setShouldLoad(true);
          observer.unobserve(element);
        }
      },
      {
        threshold: 0.01, // Trigger as soon as any part is visible
        rootMargin,
      }
    );

    observer.observe(element);

    return () => {
      observer.unobserve(element);
    };
  }, [rootMargin, shouldLoad]);

  return { elementRef, shouldLoad };
};

