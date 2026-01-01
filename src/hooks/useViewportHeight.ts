import { useEffect } from 'react';

/**
 * Hook to handle mobile viewport height issues
 * Sets CSS custom properties for dynamic viewport height
 */
export const useViewportHeight = () => {
  useEffect(() => {
    const setViewportHeight = () => {
      // Get the actual viewport height
      const vh = window.innerHeight * 0.01;
      // Set CSS custom property
      document.documentElement.style.setProperty('--vh', `${vh}px`);
    };

    // Set initial value
    setViewportHeight();

    // Update on resize and orientation change
    window.addEventListener('resize', setViewportHeight);
    window.addEventListener('orientationchange', setViewportHeight);

    // Also update after a short delay to handle mobile browser UI changes
    const timeoutId = setTimeout(setViewportHeight, 100);

    return () => {
      window.removeEventListener('resize', setViewportHeight);
      window.removeEventListener('orientationchange', setViewportHeight);
      clearTimeout(timeoutId);
    };
  }, []);
};