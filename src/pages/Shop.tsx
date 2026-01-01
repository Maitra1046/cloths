import { useState, useMemo, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, SlidersHorizontal, X } from 'lucide-react';
import { Layout } from '@/components/layout/Layout';
import { ProductCard } from '@/components/product/ProductCard';
import { ProductOptionsModal } from '@/components/product/ProductOptionsModal';
import { ProductSlideshow } from '@/components/product/ProductSlideshow';
import { ProductService } from '@/services/productService';
import { productStore } from '@/store/productStore';
import { Product, CATEGORIES } from '@/types/product';
import { cn } from '@/lib/utils';
import { fadeInUp, scaleIn } from '@/lib/animations';

const sortOptions = [
  { label: 'Newest', value: 'newest' },
  { label: 'Price: Low to High', value: 'price-asc' },
  { label: 'Price: High to Low', value: 'price-desc' },
];

const Shop = () => {
  const [searchParams] = useSearchParams();
  const [isFiltersOpen, setIsFiltersOpen] = useState(false);
  const [sortOpen, setSortOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isProductOptionsOpen, setIsProductOptionsOpen] = useState(false);
  const [selectedSlideshowProduct, setSelectedSlideshowProduct] = useState<Product | null>(null);
  const [isSlideshowOpen, setIsSlideshowOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  
  // Get search query and filter from URL
  const searchQuery = searchParams.get('search') || '';
  const filterParam = searchParams.get('filter');
  
  // All products from ProductService
  const [allProducts, setAllProducts] = useState<Product[]>([]);

  // Filter states - only allow manual filtering when no URL filter is set
  const [showBestSellers, setShowBestSellers] = useState(
    filterParam === 'bestseller'
  );
  const [showNewArrivals, setShowNewArrivals] = useState(
    filterParam === 'new'
  );
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedCollection, setSelectedCollection] = useState<string>('all');
  const [sortBy, setSortBy] = useState('newest');

  // Determine if we're in a fixed filter mode (from URL)
  const isFixedFilterMode = filterParam === 'new' || filterParam === 'bestseller';
  const fixedFilterTitle = filterParam === 'new' ? 'New Arrivals' : 
                          filterParam === 'bestseller' ? 'Best Sellers' : 
                          'Shop All';

  useEffect(() => {
    // Use requestAnimationFrame to prevent blocking the UI
    setIsLoading(true);
    const loadProducts = () => {
      // Use setTimeout to allow initial render before loading
      requestAnimationFrame(() => {
        const products = ProductService.getAllProducts();
        setAllProducts(products);
        // Small delay to ensure smooth transition
        requestAnimationFrame(() => {
          setIsLoading(false);
        });
      });
    };
    
    const unsubscribe = productStore.subscribe(() => {
      loadProducts();
    });
    
    // Load products immediately but with slight delay for smoother UX
    loadProducts();
    
    return () => unsubscribe();
  }, []);

  // Filter and sort products
  const filteredProducts = useMemo(() => {
    let result = [...allProducts];

    // Search filter
    if (searchQuery) {
      result = ProductService.searchProducts(searchQuery);
    }

    // Apply filters based on URL parameter or manual selection
    if (!searchQuery) {
      if (filterParam === 'bestseller' || (!filterParam && showBestSellers)) {
        result = result.filter(product => product.isBestSeller);
      } else if (filterParam === 'new' || (!filterParam && showNewArrivals)) {
        result = result.filter(product => product.isNew);
      }
    }

    // Category filter
    if (selectedCategory !== 'all') {
      result = result.filter(product => product.category === selectedCategory);
    }

    // Collection filter
    if (selectedCollection !== 'all') {
      result = result.filter(product => product.collection === selectedCollection);
    }

    result = [...result].sort((a, b) => {
      const aSerial = a.serialNumber ?? Number.MAX_SAFE_INTEGER;
      const bSerial = b.serialNumber ?? Number.MAX_SAFE_INTEGER;
      if (aSerial !== bSerial) {
        return aSerial - bSerial;
      }
    switch (sortBy) {
      case 'newest':
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      case 'price-asc':
          return a.price - b.price;
      case 'price-desc':
          return b.price - a.price;
      default:
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    }
    });

    return result;
  }, [allProducts, searchQuery, filterParam, showBestSellers, showNewArrivals, selectedCategory, selectedCollection, sortBy]);

  // Get unique categories and collections for filters
  const availableCategories = useMemo(() => {
    const categories = [...new Set(allProducts.map(p => p.category))];
    return categories.sort();
  }, [allProducts]);

  const availableCollections = useMemo(() => {
    const collections = [...new Set(allProducts.map(p => p.collection))];
    return collections.sort();
  }, [allProducts]);

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

  const clearFilters = () => {
    setShowBestSellers(false);
    setShowNewArrivals(false);
    setSelectedCategory('all');
    setSelectedCollection('all');
  };

  const hasActiveFilters = (!isFixedFilterMode && (showBestSellers || showNewArrivals || selectedCategory !== 'all' || selectedCollection !== 'all'));

  return (
    <Layout>
      <div className="min-h-screen">
        {/* Header */}
        <div className="bg-cream section-padding-y-small">
          <div className="container mx-auto container-padding">
            <motion.h1
              {...fadeInUp}
              className="font-serif text-display-medium text-center text-foreground"
            >
              {searchQuery ? `Search Results for "${searchQuery}"` : fixedFilterTitle}
            </motion.h1>
            <motion.p
              {...fadeInUp}
              transition={{ ...fadeInUp.transition, delay: 0.1 }}
              className="text-center text-muted-foreground mt-3 sm:mt-4"
            >
              {isLoading ? 'Loading...' : (
                <>
                  {filteredProducts.length} {filteredProducts.length === 1 ? 'product' : 'products'}
                  {searchQuery && filteredProducts.length === 0 && ' found'}
                </>
              )}
            </motion.p>
          </div>
        </div>

        {isLoading ? (
          <div className="container mx-auto px-6 lg:px-12 py-20 text-center">
            <p className="text-muted-foreground">Loading products...</p>
          </div>
        ) : (
          <div className="container mx-auto container-padding section-padding-y-small">
            <div className={cn(
              isFixedFilterMode 
                ? "w-full" 
                : "lg:grid lg:grid-cols-[200px_1fr] xl:grid-cols-[240px_1fr] section-gap"
            )}>
            {!isFixedFilterMode && (
              <button
                onClick={() => setIsFiltersOpen(true)}
                className="lg:hidden w-full mb-6 flex items-center justify-center gap-2 py-3 border border-border text-sm text-foreground hover:bg-secondary active:bg-secondary transition-colors touch-manipulation min-h-[44px]"
              >
                <SlidersHorizontal size={16} />
                Filters
                {hasActiveFilters && (
                  <span className="w-5 h-5 bg-primary text-primary-foreground text-xs rounded-full flex items-center justify-center">
                    !
                  </span>
                )}
              </button>
            )}

            {/* Mobile Filter Drawer - Only show if not in fixed filter mode */}
            {!isFixedFilterMode && (
              <AnimatePresence>
                {isFiltersOpen && (
                  <>
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="fixed inset-0 bg-foreground/20 z-50 lg:hidden"
                      onClick={() => setIsFiltersOpen(false)}
                    />
                    <motion.div
                      initial={{ x: '-100%' }}
                      animate={{ x: 0 }}
                      exit={{ x: '-100%' }}
                      transition={{ type: 'tween', duration: 0.3 }}
                      className="fixed inset-y-0 left-0 w-[85vw] max-w-[320px] bg-background z-50 lg:hidden overflow-y-auto"
                    >
                      <div className="p-6">
                        <div className="flex items-center justify-between mb-8">
                          <h2 className="font-serif text-xl">Filters</h2>
                          <button
                            onClick={() => setIsFiltersOpen(false)}
                            className="p-2 hover:bg-secondary rounded-sm transition-colors"
                          >
                            <X size={20} />
                          </button>
                        </div>
                        <FilterContent
                          showBestSellers={showBestSellers}
                          setShowBestSellers={setShowBestSellers}
                          showNewArrivals={showNewArrivals}
                          setShowNewArrivals={setShowNewArrivals}
                          selectedCategory={selectedCategory}
                          setSelectedCategory={setSelectedCategory}
                          selectedCollection={selectedCollection}
                          setSelectedCollection={setSelectedCollection}
                          availableCategories={availableCategories}
                          availableCollections={availableCollections}
                          hasActiveFilters={hasActiveFilters}
                          clearFilters={clearFilters}
                        />
                      </div>
                    </motion.div>
                  </>
                )}
              </AnimatePresence>
            )}

            {/* Desktop Filters Sidebar - Only show if not in fixed filter mode */}
            {!isFixedFilterMode && (
              <aside className="hidden lg:block">
                <FilterContent
                  showBestSellers={showBestSellers}
                  setShowBestSellers={setShowBestSellers}
                  showNewArrivals={showNewArrivals}
                  setShowNewArrivals={setShowNewArrivals}
                  selectedCategory={selectedCategory}
                  setSelectedCategory={setSelectedCategory}
                  selectedCollection={selectedCollection}
                  setSelectedCollection={setSelectedCollection}
                  availableCategories={availableCategories}
                  availableCollections={availableCollections}
                  hasActiveFilters={hasActiveFilters}
                  clearFilters={clearFilters}
                />
              </aside>
            )}

            {/* Products Grid */}
            <div>
              {/* Sort */}
              <div className="flex justify-end mb-8">
                <div className="relative">
                  <button
                    onClick={() => setSortOpen(!sortOpen)}
                    className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground active:text-foreground transition-colors touch-manipulation min-h-[44px] px-2"
                  >
                    Sort: {sortOptions.find((o) => o.value === sortBy)?.label}
                    <ChevronDown
                      size={16}
                      className={cn(
                        'transition-transform',
                        sortOpen && 'rotate-180'
                      )}
                    />
                  </button>
                  <AnimatePresence>
                    {sortOpen && (
                      <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className="absolute right-0 top-full mt-2 w-48 bg-background border border-border shadow-medium z-10"
                      >
                        {sortOptions.map((option) => (
                          <button
                            key={option.value}
                            onClick={() => {
                              setSortBy(option.value);
                              setSortOpen(false);
                            }}
                            className={cn(
                              'w-full text-left px-4 py-3 sm:py-2.5 text-sm transition-colors touch-manipulation min-h-[44px]',
                              sortBy === option.value
                                ? 'bg-secondary text-foreground'
                                : 'text-muted-foreground hover:bg-secondary/50 active:bg-secondary/50'
                            )}
                          >
                            {option.label}
                          </button>
                        ))}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </div>

              {filteredProducts.length > 0 ? (
                <div 
                  className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6"
                >
                  {filteredProducts.map((product, index) => (
                    <ProductCard
                      key={product.id}
                      product={product}
                      index={index}
                      onAddToCart={handleOpenProductOptions}
                    />
                  ))}
                </div>
              ) : (
                <motion.div
                  {...scaleIn}
                  className="text-center py-20"
                >
                  <p className="text-muted-foreground mb-4">
                    {searchQuery 
                      ? `No products found for "${searchQuery}"`
                      : 'No products match your filters'
                    }
                  </p>
                  {searchQuery ? (
                    <p className="text-sm text-muted-foreground">
                      Try searching for different keywords like "dress", "silk", or "cotton"
                    </p>
                  ) : (
                    <button
                      onClick={clearFilters}
                      className="text-sm text-primary hover:underline"
                    >
                      Clear all filters
                    </button>
                  )}
                </motion.div>
              )}

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
          </div>
        </div>
        )}
      </div>
    </Layout>
  );
};

interface FilterContentProps {
  showBestSellers: boolean;
  setShowBestSellers: (value: boolean) => void;
  showNewArrivals: boolean;
  setShowNewArrivals: (value: boolean) => void;
  selectedCategory: string;
  setSelectedCategory: (value: string) => void;
  selectedCollection: string;
  setSelectedCollection: (value: string) => void;
  availableCategories: string[];
  availableCollections: string[];
  hasActiveFilters: boolean;
  clearFilters: () => void;
}

const FilterContent = ({
  showBestSellers,
  setShowBestSellers,
  showNewArrivals,
  setShowNewArrivals,
  selectedCategory,
  setSelectedCategory,
  selectedCollection,
  setSelectedCollection,
  availableCategories,
  availableCollections,
  hasActiveFilters,
  clearFilters,
}: FilterContentProps) => {
  return (
    <div className="space-y-8">
      {/* Clear Filters */}
      {hasActiveFilters && (
        <button
          onClick={clearFilters}
          className="text-sm text-primary hover:underline"
        >
          Clear all filters
        </button>
      )}

      {/* Collections Filter */}
      <FilterSection title="Collections">
        <div className="space-y-3">
          <label className="flex items-center gap-3 cursor-pointer">
            <input
              type="checkbox"
              checked={showBestSellers}
              onChange={(e) => setShowBestSellers(e.target.checked)}
              className="w-4 h-4 rounded-sm border-border text-primary focus:ring-primary"
            />
            <span className="text-sm text-muted-foreground">Best Sellers</span>
          </label>
          <label className="flex items-center gap-3 cursor-pointer">
            <input
              type="checkbox"
              checked={showNewArrivals}
              onChange={(e) => setShowNewArrivals(e.target.checked)}
              className="w-4 h-4 rounded-sm border-border text-primary focus:ring-primary"
            />
            <span className="text-sm text-muted-foreground">New Arrivals</span>
          </label>
        </div>
      </FilterSection>

      {/* Category Filter */}
      <FilterSection title="Category">
        <div className="space-y-2">
          <label className="flex items-center gap-3 cursor-pointer">
            <input
              type="radio"
              name="category"
              checked={selectedCategory === 'all'}
              onChange={() => setSelectedCategory('all')}
              className="w-4 h-4 text-primary focus:ring-primary"
            />
            <span className="text-sm text-muted-foreground">All Categories</span>
          </label>
          {availableCategories.map((category) => (
            <label key={category} className="flex items-center gap-3 cursor-pointer">
              <input
                type="radio"
                name="category"
                checked={selectedCategory === category}
                onChange={() => setSelectedCategory(category)}
                className="w-4 h-4 text-primary focus:ring-primary"
              />
              <span className="text-sm text-muted-foreground">{category}</span>
            </label>
          ))}
        </div>
      </FilterSection>

      {/* Collection Filter */}
      <FilterSection title="Collection">
        <div className="space-y-2">
          <label className="flex items-center gap-3 cursor-pointer">
            <input
              type="radio"
              name="collection"
              checked={selectedCollection === 'all'}
              onChange={() => setSelectedCollection('all')}
              className="w-4 h-4 text-primary focus:ring-primary"
            />
            <span className="text-sm text-muted-foreground">All Collections</span>
          </label>
          {availableCollections.map((collection) => (
            <label key={collection} className="flex items-center gap-3 cursor-pointer">
              <input
                type="radio"
                name="collection"
                checked={selectedCollection === collection}
                onChange={() => setSelectedCollection(collection)}
                className="w-4 h-4 text-primary focus:ring-primary"
              />
              <span className="text-sm text-muted-foreground capitalize">{collection.replace('-', ' ')}</span>
            </label>
          ))}
        </div>
      </FilterSection>
    </div>
  );
};

const FilterSection = ({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) => {
  return (
    <div>
      <h3 className="font-serif text-sm tracking-wider uppercase text-foreground mb-4">
        {title}
      </h3>
      {children}
    </div>
  );
};

export default Shop;
