import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ChevronLeft, SlidersHorizontal, ChevronDown } from 'lucide-react';
import { Layout } from '@/components/layout/Layout';
import { ProductService } from '@/services/productService';
import { Collection, Product } from '@/types/product';
import { ProductCard } from '@/components/product/ProductCard';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { formatCurrency } from '@/utils/currency';
import { useScrollToTop } from '@/hooks/useScrollToTop';
import { fadeInUp, scaleIn } from '@/lib/animations';
import { cn } from '@/lib/utils';

const sortOptions = [
  { label: 'Newest', value: 'newest' },
  { label: 'Price: Low to High', value: 'price-asc' },
  { label: 'Price: High to Low', value: 'price-desc' },
  { label: 'Name: A to Z', value: 'name-asc' },
];

const CollectionDetail = () => {
  const { collectionId } = useParams<{ collectionId: string }>();
  const [collection, setCollection] = useState<Collection | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [sortBy, setSortBy] = useState('newest');
  const [sortOpen, setSortOpen] = useState(false);

  // Scroll to top when component mounts
  useScrollToTop();

  useEffect(() => {
    if (collectionId) {
      const collectionData = ProductService.getCollectionById(collectionId);
      const collectionProducts = ProductService.getProductsByCollection(collectionId);
      
      setCollection(collectionData || null);
      setProducts(collectionProducts);
    }
  }, [collectionId]);

  const sortedProducts = [...products].sort((a, b) => {
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
      case 'name-asc':
        return a.name.localeCompare(b.name);
      default:
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    }
  });

  if (!collection) {
    return (
      <Layout>
        <div className="container mx-auto px-6 lg:px-12 py-20 text-center">
          <h1 className="text-2xl font-serif mb-4">Collection Not Found</h1>
          <p className="text-muted-foreground mb-6">
            The collection you're looking for doesn't exist.
          </p>
          <Link 
            to="/collections" 
            className="inline-block px-6 py-3 bg-primary text-primary-foreground rounded hover:bg-primary/90 transition-colors"
          >
            Browse All Collections
          </Link>
        </div>
      </Layout>
    );
  }

  const minPrice = products.length > 0 ? Math.min(...products.map(p => p.price)) : 0;
  const maxPrice = products.length > 0 ? Math.max(...products.map(p => p.price)) : 0;

  return (
    <Layout>
      {/* Header */}
      <div className="bg-cream py-12 lg:py-16">
        <div className="container mx-auto px-6 lg:px-12">
          {/* Breadcrumb */}
          <motion.div
            {...fadeInUp}
            className="flex items-center gap-2 text-sm text-muted-foreground mb-6"
          >
            <Link to="/" className="hover:text-foreground transition-colors">
              Home
            </Link>
            <span>/</span>
            <Link to="/collections" className="hover:text-foreground transition-colors">
              Collections
            </Link>
            <span>/</span>
            <span className="text-foreground">{collection.name}</span>
          </motion.div>

          <motion.h1
            {...fadeInUp}
            className="font-serif text-3xl lg:text-5xl text-center text-foreground mb-4"
          >
            {collection.name}
          </motion.h1>
          
          <motion.p
            {...fadeInUp}
            transition={{ ...fadeInUp.transition, delay: 0.1 }}
            className="text-center text-muted-foreground max-w-2xl mx-auto mb-6"
          >
            {collection.description}
          </motion.p>

          <motion.div
            {...fadeInUp}
            transition={{ ...fadeInUp.transition, delay: 0.2 }}
            className="flex flex-wrap items-center justify-center gap-4 text-sm"
          >
            <Badge variant="secondary" className="px-3 py-1">
              {products.length} {products.length === 1 ? 'Product' : 'Products'}
            </Badge>
            {products.length > 0 && (
              <Badge variant="outline" className="px-3 py-1">
                {formatCurrency(minPrice)} - {formatCurrency(maxPrice)}
              </Badge>
            )}
          </motion.div>
        </div>
      </div>

      <div className="container mx-auto px-6 lg:px-12 py-8 lg:py-12">
        {products.length > 0 ? (
          <>
            {/* Sort Controls */}
            <div className="flex justify-between items-center mb-8">
              <Link
                to="/collections"
                className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                <ChevronLeft size={16} />
                Back to Collections
              </Link>

              <div className="relative">
                <button
                  onClick={() => setSortOpen(!sortOpen)}
                  className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
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
                
                {sortOpen && (
                  <div className="absolute right-0 top-full mt-2 w-48 bg-background border border-border shadow-medium z-10 rounded-sm">
                    {sortOptions.map((option) => (
                      <button
                        key={option.value}
                        onClick={() => {
                          setSortBy(option.value);
                          setSortOpen(false);
                        }}
                        className={cn(
                          'w-full text-left px-4 py-2.5 text-sm transition-colors',
                          sortBy === option.value
                            ? 'bg-secondary text-foreground'
                            : 'text-muted-foreground hover:bg-secondary/50'
                        )}
                      >
                        {option.label}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Products Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 lg:gap-8">
              {sortedProducts.map((product, index) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  index={index}
                />
              ))}
            </div>
          </>
        ) : (
          <motion.div
            {...scaleIn}
            className="text-center py-20"
          >
            <div className="text-6xl mb-4">👗</div>
            <h3 className="text-xl font-serif mb-2">No Products Yet</h3>
            <p className="text-muted-foreground mb-6">
              This collection is being curated. Check back soon for new arrivals!
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to="/collections"
                className="inline-block px-6 py-3 border border-border text-foreground rounded hover:bg-secondary transition-colors"
              >
                Browse Other Collections
              </Link>
              <Link
                to="/shop"
                className="inline-block px-6 py-3 bg-primary text-primary-foreground rounded hover:bg-primary/90 transition-colors"
              >
                Shop All Products
              </Link>
            </div>
          </motion.div>
        )}
      </div>
    </Layout>
  );
};

export default CollectionDetail;