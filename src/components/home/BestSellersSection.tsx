import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import { ProductCard } from '@/components/product/ProductCard';
import { ProductOptionsModal } from '@/components/product/ProductOptionsModal';
import { ProductSlideshow } from '@/components/product/ProductSlideshow';
import { ProductService } from '@/services/productService';
import { Product } from '@/types/product';
import { fadeInUp, fadeInRight } from '@/lib/animations';

export const BestSellersSection = () => {
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isProductOptionsOpen, setIsProductOptionsOpen] = useState(false);
  const [selectedSlideshowProduct, setSelectedSlideshowProduct] = useState<Product | null>(null);
  const [isSlideshowOpen, setIsSlideshowOpen] = useState(false);
  const [bestSellers, setBestSellers] = useState<Product[]>([]);

  useEffect(() => {
    // Get best seller products from ProductService
    const allProducts = ProductService.getAllProducts();
    const bestSellerProducts = allProducts.filter(product => product.isBestSeller).slice(0, 4);
    setBestSellers(bestSellerProducts);
  }, []);

  const handleOpenProductOptions = (product: Product) => {
    setSelectedProduct(product);
    setIsProductOptionsOpen(true);
  };

  const handleCloseProductOptions = () => {
    setIsProductOptionsOpen(false);
    setSelectedProduct(null);
  };

  const handleOpenSlideshow = (product: Product) => {
    setSelectedSlideshowProduct(product);
    setIsSlideshowOpen(true);
  };

  const handleCloseSlideshow = () => {
    setIsSlideshowOpen(false);
    setSelectedSlideshowProduct(null);
  };

  return (
    <section className="section-padding-y">
      <div className="container mx-auto container-padding">
        {/* Section Header */}
        <div className="flex items-end justify-between mb-8 sm:mb-12">
          <motion.div {...fadeInUp}>
            <span className="text-xs sm:text-sm tracking-[0.2em] sm:tracking-[0.3em] uppercase text-taupe mb-2 block">
              Curated for You
            </span>
            <h2 className="font-serif text-heading-large text-foreground">
              Best Sellers
            </h2>
          </motion.div>

          <motion.div
            {...fadeInRight}
            transition={{ ...fadeInRight.transition, delay: 0.2 }}
          >
            <Link
              to="/shop?filter=bestseller"
              className="group hidden sm:inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              View All
              <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
            </Link>
          </motion.div>
        </div>

        {/* Products Grid */}
        <div className="grid-responsive-4 section-gap">
          {bestSellers.map((product, index) => (
            <ProductCard
              key={product.id}
              product={product}
              index={index}
              onAddToCart={handleOpenProductOptions}
            />
          ))}
        </div>

        {/* Mobile View All Link */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.6 }}
          className="mt-8 sm:mt-10 text-center sm:hidden"
        >
          <Link
            to="/shop?filter=bestseller"
            className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            View All Best Sellers
            <ArrowRight size={16} />
          </Link>
        </motion.div>

        {/* Product Slideshow */}
        <ProductSlideshow
          product={selectedSlideshowProduct}
          isOpen={isSlideshowOpen}
          onClose={handleCloseSlideshow}
        />

        {/* Product Options Modal */}
        <ProductOptionsModal
          product={selectedProduct}
          isOpen={isProductOptionsOpen}
          onClose={handleCloseProductOptions}
        />
      </div>
    </section>
  );
};
