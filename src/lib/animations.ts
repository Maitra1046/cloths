// Luxury fashion brand scroll animation variants inspired by YSL
// These provide smooth, refined animations for premium feel
// Optimized with smoother easing curves for better performance

// Ultra-smooth easing curve for buttery animations
const smoothEase = [0.16, 1, 0.3, 1] as [number, number, number, number]; // Custom cubic-bezier for ultra-smooth feel
const fastEase = [0.4, 0, 0.2, 1] as [number, number, number, number]; // Faster but still smooth

export const fadeInUp = {
  initial: { opacity: 0, y: 40 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: '-100px' },
  transition: { 
    duration: 0.6, 
    ease: smoothEase
  }
};

export const fadeInDown = {
  initial: { opacity: 0, y: -40 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: '-100px' },
  transition: { 
    duration: 0.6, 
    ease: smoothEase
  }
};

export const fadeInLeft = {
  initial: { opacity: 0, x: -50 },
  whileInView: { opacity: 1, x: 0 },
  viewport: { once: true, margin: '-100px' },
  transition: { 
    duration: 0.6, 
    ease: smoothEase
  }
};

export const fadeInRight = {
  initial: { opacity: 0, x: 50 },
  whileInView: { opacity: 1, x: 0 },
  viewport: { once: true, margin: '-100px' },
  transition: { 
    duration: 0.6, 
    ease: smoothEase
  }
};

export const scaleIn = {
  initial: { opacity: 0, scale: 0.95 },
  whileInView: { opacity: 1, scale: 1 },
  viewport: { once: true, margin: '-100px' },
  transition: { 
    duration: 0.5, 
    ease: smoothEase
  }
};

export const scaleInWithFade = {
  initial: { opacity: 0, scale: 0.9, y: 20 },
  whileInView: { opacity: 1, scale: 1, y: 0 },
  viewport: { once: true, margin: '-100px' },
  transition: { 
    duration: 0.6, 
    ease: smoothEase
  }
};

// Staggered grid item animation - optimized for faster appearance
export const getStaggeredItem = (index: number) => ({
  initial: { opacity: 0, y: 30, scale: 0.98 },
  whileInView: { opacity: 1, y: 0, scale: 1 },
  viewport: { once: true, margin: '-50px' },
  transition: { 
    duration: 0.5, 
    delay: Math.min(index * 0.03, 0.3), // Reduced delay, capped at 0.3s max
    ease: fastEase
  }
});

// Smooth fade only
export const fadeIn = {
  initial: { opacity: 0 },
  whileInView: { opacity: 1 },
  viewport: { once: true, margin: '-100px' },
  transition: { 
    duration: 0.6, 
    ease: smoothEase
  }
};

// Parallax-like effect for images
export const parallaxFade = {
  initial: { opacity: 0, y: 60 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: '-150px' },
  transition: { 
    duration: 0.7, 
    ease: smoothEase
  }
};

// Text reveal animation
export const textReveal = {
  initial: { opacity: 0, y: 30 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: '-50px' },
  transition: { 
    duration: 0.6, 
    ease: smoothEase
  }
};

