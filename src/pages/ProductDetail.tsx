import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight, Heart, Minus, Plus, Check } from 'lucide-react';
import { Layout } from '@/components/layout/Layout';
import { ProductService } from '@/services/productService';
import { Product } from '@/types/product';
import { ImageNavigator } from '@/components/ui/ImageNavigator';
import { cn } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';
import { useCart } from '@/context/CartContext';
import { useScrollToTop } from '@/hooks/useScrollToTop';
import { fadeInUp, fadeInLeft, fadeInRight } from '@/lib/animations';
import { formatCurrency } from '@/utils/currency';
import { useWishlist } from '@/context/WishlistContext';

interface CustomMeasurements {
  bust: string;
  waist: string;
  hip: string;
  shoulder: string;
  sleeve: string;
  length: string;
}

const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { addToCart } = useCart();
  const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlist();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);

  // Scroll to top when component mounts
  useScrollToTop();

  const handleBackNavigation = () => {
    // Check if there's a previous page in history
    if (window.history.length > 1) {
      navigate(-1);
    } else {
      // Fallback to shop page if no history
      navigate('/shop');
    }
  };

  useEffect(() => {
    if (id) {
      try {
        const foundProduct = ProductService.getProductById(id);
        setProduct(foundProduct || null);
      } catch (error) {
        console.error('Error loading product:', error);
        setProduct(null);
      } finally {
        setLoading(false);
      }
    }
  }, [id]);

  const [selectedImage, setSelectedImage] = useState(0);
  const [selectedColor, setSelectedColor] = useState<string>('');
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    if (product) {
      if (product.colors.length > 0) {
        const initialColor = product.colors[0];
        setSelectedColor(initialColor);
        setSelectedImage(0);
      }
    }
  }, [product]);

  const currentVariant = product?.colorVariants?.find(v => v.color === selectedColor);
  const currentImages = currentVariant?.images && currentVariant.images.length > 0 
    ? currentVariant.images 
    : (product?.images || []);
  
  const currentStock = currentVariant ? currentVariant.stockCount : (product?.stockCount || 0);
  const headPos = currentVariant?.headAlignment ?? 20;

  useEffect(() => {
    setSelectedImage(0);
  }, [selectedColor]);

  useEffect(() => {
    if (currentImages.length > 0 && selectedImage >= currentImages.length) {
      setSelectedImage(0);
    }
  }, [currentImages.length, selectedImage]);

  const handleColorSelect = (color: string) => {
    setSelectedColor(color);
    setSelectedImage(0);
  };
  const [customMeasurements, setCustomMeasurements] = useState<CustomMeasurements>({
    bust: '',
    waist: '',
    hip: '',
    shoulder: '',
    sleeve: '',
    length: '',
  });

  const isWishlisted = product ? isInWishlist(product.id) : false;

  const handleWishlistToggle = () => {
    if (!product) return;
    
    if (isWishlisted) {
      removeFromWishlist(product.id);
      toast({
        title: 'Removed from wishlist',
        description: `${product.name} has been removed from your wishlist`,
      });
    } else {
      const firstImage = currentImages[0] || product.images[0] || '';
      addToWishlist(product.id, product.name, product.price, firstImage);
      toast({
        title: 'Added to wishlist',
        description: `${product.name} has been added to your wishlist`,
      });
    }
  };

  if (loading) {
    return (
      <Layout>
        <div className="container mx-auto px-6 py-20 text-center">
          <p className="text-muted-foreground">Loading product...</p>
        </div>
      </Layout>
    );
  }

  if (!product) {
    return (
      <Layout>
        <div className="container mx-auto px-6 py-20 text-center">
          <h1 className="font-serif text-2xl mb-4">Product not found</h1>
          <button 
            onClick={handleBackNavigation}
            className="text-primary hover:underline"
          >
            Go back
          </button>
        </div>
      </Layout>
    );
  }

  const handleAddToCart = () => {
    // Only check for custom measurements since we removed standard sizes
    const allFilled = Object.values(customMeasurements).every((v) => v.trim() !== '');
    if (!allFilled) {
      toast({
        title: 'Complete your measurements',
        description: 'Please fill in all measurement fields for your custom fit',
      });
      return;
    }

    // Actually add the product to cart (always custom since no standard sizes)
    addToCart(
      product.id,
      product.name,
      product.images[selectedImage],
      product.price,
      undefined, // No standard size
      true, // Always custom
      customMeasurements,
      'product'
    );

    toast({
      title: 'Added to cart',
      description: `${product.name} has been added to your cart with custom measurements`,
    });
  };

  const handleMeasurementChange = (field: keyof CustomMeasurements, value: string) => {
    // Only allow numbers and decimals
    const sanitized = value.replace(/[^0-9.]/g, '');
    setCustomMeasurements((prev) => ({ ...prev, [field]: sanitized }));
  };

  return (
    <Layout>
      <div className="container mx-auto px-4 sm:px-6 lg:px-12 py-6 sm:py-8 lg:py-12">
        <motion.div
          {...fadeInUp}
          transition={{ ...fadeInUp.transition, duration: 0.5 }}
          className="mb-6 sm:mb-8"
        >
          <button
            onClick={handleBackNavigation}
            className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors touch-manipulation min-h-[44px] min-w-[44px]"
          >
            <ChevronLeft size={16} />
            Back
          </button>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8 lg:gap-16">
          <motion.div {...fadeInLeft} key={selectedColor}>
            <ImageNavigator
              images={currentImages}
              alt={product.name}
              showThumbnails={true}
              showCounter={true}
              onImageChange={setSelectedImage}
              objectPosition={`center ${headPos}%`}
            />
          </motion.div>

          {/* Product Details */}
          <motion.div
            {...fadeInRight}
            transition={{ ...fadeInRight.transition, delay: 0.1 }}
            className="lg:py-4"
          >
            {/* Tags */}
            <div className="flex gap-2 mb-4">
              {product.isBestSeller && <span className="tag-bestseller">Best Seller</span>}
              {product.isNew && <span className="tag-new">New</span>}
            </div>

            {/* Title & Price */}
            <div className="flex items-start justify-between mb-3">
              <h1 className="font-serif text-2xl sm:text-3xl lg:text-4xl text-foreground break-words pr-2">
                {product.name}
              </h1>
              <button
                onClick={handleWishlistToggle}
                className={cn(
                  "p-2 sm:p-2.5 rounded-full transition-all duration-200 touch-manipulation min-h-[44px] min-w-[44px] flex items-center justify-center shrink-0",
                  "hover:bg-secondary active:bg-secondary",
                  isWishlisted && "bg-red-50"
                )}
              >
                <Heart
                  size={20}
                  className={cn(
                    "sm:w-6 sm:h-6 transition-colors",
                    isWishlisted 
                      ? "fill-red-500 text-red-500" 
                      : "text-gray-600 hover:text-red-500"
                  )}
                />
              </button>
            </div>
            <p className="text-lg sm:text-xl text-foreground mb-4 sm:mb-6">{formatCurrency(product.price)}</p>

            {/* Description */}
            <p className="text-sm sm:text-base text-muted-foreground leading-relaxed mb-6 sm:mb-8 break-words">
              {product.description}
            </p>

            <div className="grid grid-cols-2 gap-3 sm:gap-4 mb-6 sm:mb-8 py-4 sm:py-6 border-y border-border">
              <div>
                <span className="text-xs tracking-wider uppercase text-taupe block mb-1">
                  Fabric
                </span>
                <span className="text-sm text-foreground">{product.fabric}</span>
              </div>
              <div>
                <span className="text-xs tracking-wider uppercase text-taupe block mb-1">
                  Stock
                </span>
                <span className={cn(
                  "text-sm font-medium",
                  currentStock > 0 ? "text-green-600" : "text-red-600"
                )}>
                  {currentStock > 0 ? `${currentStock} available` : 'Out of stock'}
                </span>
              </div>
            </div>

            {product.colors.length > 0 && (
              <div className="mb-6 sm:mb-8">
                <span className="text-sm font-medium text-foreground block mb-3 sm:mb-4">Color: {selectedColor}</span>
                <div className="flex flex-wrap gap-2 sm:gap-3">
                  {product.colors.map((color) => (
                    <button
                      key={color}
                      onClick={() => handleColorSelect(color)}
                      className={cn(
                        "px-4 sm:px-6 py-2.5 sm:py-3 text-sm sm:text-base font-medium border-2 transition-all rounded-sm touch-manipulation min-h-[44px]",
                        selectedColor === color 
                          ? "bg-primary text-primary-foreground border-primary" 
                          : "bg-background border-border hover:border-primary hover:bg-secondary active:bg-secondary"
                      )}
                    >
                      {color}
                    </button>
                  ))}
                </div>
              </div>
            )}

            <div className="mb-6 sm:mb-8">
              <div className="flex items-center justify-between mb-3 sm:mb-4">
                <span className="text-sm font-medium text-foreground">Your Measurements</span>
                <button className="text-xs text-muted-foreground hover:text-foreground underline touch-manipulation min-h-[44px] px-2">
                  Measurement Guide
                </button>
              </div>

              <div className="space-y-3 sm:space-y-4">
                <p className="text-xs sm:text-sm text-muted-foreground">
                  Enter your measurements in inches for a perfect custom fit.
                </p>
                <div className="grid grid-cols-2 gap-3 sm:gap-4">
                  {[
                    { key: 'bust', label: 'Bust', placeholder: 'e.g., 36' },
                    { key: 'waist', label: 'Waist', placeholder: 'e.g., 28' },
                    { key: 'hip', label: 'Hip', placeholder: 'e.g., 38' },
                    { key: 'shoulder', label: 'Shoulder Width', placeholder: 'e.g., 15' },
                    { key: 'sleeve', label: 'Sleeve Length', placeholder: 'e.g., 24' },
                    { key: 'length', label: 'Dress Length', placeholder: 'e.g., 45' },
                  ].map((field) => (
                    <div key={field.key}>
                      <label className="text-xs text-muted-foreground block mb-1.5">
                        {field.label}
                      </label>
                      <div className="relative">
                        <input
                          type="text"
                          value={customMeasurements[field.key as keyof CustomMeasurements]}
                          onChange={(e) =>
                            handleMeasurementChange(
                              field.key as keyof CustomMeasurements,
                              e.target.value
                            )
                          }
                          placeholder={field.placeholder}
                          className="w-full px-3 py-3 sm:py-2.5 bg-background border border-border text-sm focus:outline-none focus:ring-1 focus:ring-primary touch-manipulation"
                        />
                        <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-muted-foreground">
                          in
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
                <p className="text-xs text-muted-foreground italic">
                  All garments are made-to-measure for the perfect fit. Need help measuring? Check our measurement guide for tips.
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3 sm:gap-4 mb-6 sm:mb-8">
              <span className="text-sm font-medium text-foreground">Quantity</span>
              <div className="flex items-center border border-border">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="p-3 sm:p-2.5 hover:bg-secondary active:bg-secondary transition-colors touch-manipulation min-h-[44px] min-w-[44px] flex items-center justify-center"
                >
                  <Minus size={18} className="sm:w-4 sm:h-4" />
                </button>
                <span className="w-12 text-center text-sm">{quantity}</span>
                <button
                  onClick={() => setQuantity(quantity + 1)}
                  className="p-3 sm:p-2.5 hover:bg-secondary active:bg-secondary transition-colors touch-manipulation min-h-[44px] min-w-[44px] flex items-center justify-center"
                >
                  <Plus size={18} className="sm:w-4 sm:h-4" />
                </button>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 mb-6 sm:mb-8">
              <button
                onClick={handleAddToCart}
                className="flex-1 py-4 sm:py-4 bg-primary text-primary-foreground text-sm sm:text-sm tracking-wider hover:bg-brown/90 active:bg-brown/80 transition-all duration-300 touch-manipulation min-h-[48px]"
              >
                Add to Cart
              </button>
              <button 
                onClick={handleWishlistToggle}
                className={cn(
                  "p-4 sm:p-4 border border-border transition-all duration-200 touch-manipulation min-h-[48px] min-w-[48px] flex items-center justify-center",
                  "hover:border-primary hover:text-primary active:bg-secondary",
                  isWishlisted && "border-red-500 bg-red-50"
                )}
              >
                <Heart 
                  size={20} 
                  className={cn(
                    "transition-colors",
                    isWishlisted 
                      ? "fill-red-500 text-red-500" 
                      : "text-gray-600 hover:text-red-500"
                  )}
                />
              </button>
            </div>

            {/* Trust Notes */}
            <div className="space-y-3 py-6 border-t border-border">
              {[
                { icon: Check, text: 'Made specially for you' },
                { icon: Check, text: 'Free shipping on orders over ₹250' },
                { icon: Check, text: 'Custom items are final sale' },
              ].map((item, index) => (
                <div key={index} className="flex items-center gap-3">
                  <item.icon size={16} className="text-taupe" />
                  <span className="text-sm text-muted-foreground">{item.text}</span>
                </div>
              ))}
            </div>

            {/* Care Instructions */}
            <details className="border-t border-border pt-6">
              <summary className="cursor-pointer text-sm font-medium text-foreground">
                Care Instructions
              </summary>
              <p className="mt-4 text-sm text-muted-foreground leading-relaxed">
                {product.careInstructions}
              </p>
            </details>
          </motion.div>
        </div>
      </div>
    </Layout>
  );
};

export default ProductDetail;
