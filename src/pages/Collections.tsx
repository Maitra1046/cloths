import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Layout } from '@/components/layout/Layout';
import { ProductService } from '@/services/productService';
import { Collection, Product } from '@/types/product';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { formatCurrency } from '@/utils/currency';
import { useScrollToTop } from '@/hooks/useScrollToTop';

const Collections = () => {
  const [collections, setCollections] = useState<Collection[]>([]);
  const [products, setProducts] = useState<Product[]>([]);

  // Scroll to top when component mounts
  useScrollToTop();

  useEffect(() => {
    const allCollections = ProductService.getAllCollections();
    const allProducts = ProductService.getAllProducts();
    
    // Sort collections with newest first
    const sortedCollections = allCollections.sort((a, b) => 
      new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
    
    setCollections(sortedCollections);
    setProducts(allProducts);
  }, []);

  const getCollectionProducts = (collectionId: string) => {
    return products.filter(product => product.collection === collectionId);
  };

  const getCollectionPreviewImage = (collectionId: string) => {
    const collectionProducts = getCollectionProducts(collectionId);
    return collectionProducts.length > 0 ? collectionProducts[0].images[0] : null;
  };

  return (
    <Layout>
      <div className="bg-cream section-padding-y-small">
        <div className="container mx-auto container-padding">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="font-serif text-display-medium text-center text-foreground"
          >
            Our Collections
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-center text-muted-foreground mt-3 sm:mt-4 max-w-2xl mx-auto text-body-large"
          >
            Discover our carefully curated collections, each telling a unique story of elegance and craftsmanship
          </motion.p>
        </div>
      </div>

      <div className="container mx-auto container-padding section-padding-y-small">
        <div className="grid-responsive-3 section-gap">
          {collections.map((collection, index) => {
            const collectionProducts = getCollectionProducts(collection.id);
            const previewImage = getCollectionPreviewImage(collection.id);
            
            return (
              <motion.div
                key={collection.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Link to={`/collection/${collection.id}`}>
                  <Card className="group overflow-hidden hover:shadow-lg transition-all duration-300">
                    <div className="aspect-[4/3] overflow-hidden bg-cream">
                      {previewImage ? (
                        <img
                          src={previewImage}
                          alt={collection.name}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-muted-foreground">
                          <div className="text-center">
                            <div className="text-4xl mb-2">👗</div>
                            <div className="text-sm">No products yet</div>
                          </div>
                        </div>
                      )}
                    </div>
                    <CardContent className="p-6">
                      <div className="flex items-start justify-between mb-2">
                        <h3 className="font-serif text-xl text-foreground group-hover:text-primary transition-colors">
                          {collection.name}
                        </h3>
                        <Badge variant="secondary" className="ml-2">
                          {collectionProducts.length} items
                        </Badge>
                      </div>
                      <p className="text-muted-foreground text-sm mb-4 line-clamp-2">
                        {collection.description}
                      </p>
                      
                      {collectionProducts.length > 0 && (
                        <div className="space-y-2">
                          <div className="text-xs text-muted-foreground">
                            Starting from
                          </div>
                          <div className="text-lg font-semibold text-primary">
                            {formatCurrency(Math.min(...collectionProducts.map(p => p.price)))}
                          </div>
                        </div>
                      )}
                      
                      <div className="mt-4 text-sm text-primary group-hover:underline">
                        Explore Collection →
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              </motion.div>
            );
          })}
        </div>

        {collections.length === 0 && (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">👗</div>
            <h3 className="text-xl font-serif mb-2">No Collections Yet</h3>
            <p className="text-muted-foreground mb-6">
              Our collections are being curated. Check back soon!
            </p>
            <Link 
              to="/shop" 
              className="inline-block px-6 py-3 bg-primary text-primary-foreground rounded hover:bg-primary/90 transition-colors"
            >
              Browse All Products
            </Link>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default Collections;