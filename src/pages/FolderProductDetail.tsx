import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight, Heart, Minus, Plus, Check } from 'lucide-react';
import { Layout } from '@/components/layout/Layout';
import { loadAllImageFolders, ImageFolder } from '@/data/imageFolders';
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

const FolderProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { addToCart } = useCart();
  const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlist();
  
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
  
  const allFolders = loadAllImageFolders();
  const folder = allFolders.find((f) => f.id === id);

  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [customMeasurements, setCustomMeasurements] = useState<CustomMeasurements>({
    bust: '',
    waist: '',
    hip: '',
    shoulder: '',
    sleeve: '',
    length: '',
  });

  const isWishlisted = folder ? isInWishlist(folder.id) : false;

  const handleWishlistToggle = () => {
    if (!folder) return;
    
    if (isWishlisted) {
      removeFromWishlist(folder.id);
      toast({
        title: 'Removed from wishlist',
        description: `${folder.name} has been removed from your wishlist`,
      });
    } else {
      addToWishlist(folder.id, folder.name, folder.price, folder.images[0]);
      toast({
        title: 'Added to wishlist',
        description: `${folder.name} has been added to your wishlist`,
      });
    }
  };

  if (!folder) {
    return (
      <Layout>
        <div className="container mx-auto container-padding py-20 text-center">
          <h1 className="font-serif text-heading-large mb-4">Product not found</h1>
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

    // Add to cart with size information (always custom since no standard sizes)
    addToCart(
      folder.id,
      folder.name,
      folder.images[0],
      folder.price,
      undefined, // No standard size
      true, // Always custom
      customMeasurements,
      'folder' // Specify this is an ImageFolder product
    );

    toast({
      title: 'Added to cart',
      description: `${folder.name} has been added to your cart with custom measurements`,
    });
  };

  const handleMeasurementChange = (field: keyof CustomMeasurements, value: string) => {
    // Only allow numbers and decimals
    const sanitized = value.replace(/[^0-9.]/g, '');
    setCustomMeasurements((prev) => ({ ...prev, [field]: sanitized }));
  };

  return (
    <Layout>
      <div className="container mx-auto container-padding section-padding-y-small">
        {/* Breadcrumb */}
        <motion.div
          {...fadeInUp}
          transition={{ ...fadeInUp.transition, duration: 0.5 }}
          className="mb-6 sm:mb-8"
        >
          <button
            onClick={handleBackNavigation}
            className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            <ChevronLeft size={16} />
            Back
          </button>
        </motion.div>

        <div className="grid lg:grid-cols-2 section-gap">
          {/* Image Gallery */}
          <motion.div {...fadeInLeft}>
            <ImageNavigator
              images={folder.images}
              alt={folder.name}
              showThumbnails={true}
              showCounter={true}
              onImageChange={setSelectedImage}
            />
          </motion.div>

          {/* Product Details */}
          <motion.div
            {...fadeInRight}
            transition={{ ...fadeInRight.transition, delay: 0.1 }}
            className="lg:py-4"
          >
            {/* Title & Price */}
            <div className="flex items-start justify-between mb-4 sm:mb-6">
              <div>
                <h1 className="font-serif text-display-small text-foreground mb-2">
                  {folder.name}
                </h1>
                <p className="text-xl sm:text-2xl text-foreground">{formatCurrency(folder.price)}</p>
              </div>
              <button
                onClick={handleWishlistToggle}
                className={cn(
                  "p-2 rounded-full transition-all duration-200",
                  "hover:bg-secondary",
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

            {/* Description */}
            <p className="text-muted-foreground leading-relaxed mb-6 sm:mb-8">
              Handcrafted with premium materials and attention to detail. This piece combines 
              timeless elegance with modern comfort, designed to move with you through your day.
            </p>

            {/* Fabric & Care */}
            <div className="grid grid-cols-2 gap-4 mb-6 sm:mb-8 py-4 sm:py-6 border-y border-border">
              <div>
                <span className="text-xs tracking-wider uppercase text-taupe block mb-1">
                  Fabric
                </span>
                <span className="text-sm text-foreground">Premium Cotton Blend</span>
              </div>
              <div>
                <span className="text-xs tracking-wider uppercase text-taupe block mb-1">
                  Delivery
                </span>
                <span className="text-sm text-foreground">5-7 business days</span>
              </div>
            </div>

            {/* Custom Measurements */}
            <div className="mb-6 sm:mb-8">
              <div className="flex items-center justify-between mb-4">
                <span className="text-sm font-medium text-foreground">Custom Measurements</span>
                <button className="text-xs text-muted-foreground hover:text-foreground underline">
                  Size Guide
                </button>
              </div>

              <div className="space-y-4">
                <p className="text-sm text-muted-foreground">
                  Enter your measurements in inches for a perfect fit.
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
                          className="w-full px-3 py-2.5 bg-background border border-border text-sm focus:outline-none focus:ring-1 focus:ring-primary"
                        />
                        <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-muted-foreground">
                          in
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
                <p className="text-xs text-muted-foreground italic">
                  Need help measuring? Check our measurement guide for tips.
                </p>
              </div>
            </div>

            {/* Quantity */}
            <div className="flex items-center gap-4 mb-6 sm:mb-8">
              <span className="text-sm font-medium text-foreground">Quantity</span>
              <div className="flex items-center border border-border">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="p-2.5 hover:bg-secondary transition-colors"
                >
                  <Minus size={16} />
                </button>
                <span className="w-12 text-center text-sm">{quantity}</span>
                <button
                  onClick={() => setQuantity(quantity + 1)}
                  className="p-2.5 hover:bg-secondary transition-colors"
                >
                  <Plus size={16} />
                </button>
              </div>
            </div>

            {/* Actions */}
            <div className="flex gap-3 mb-6 sm:mb-8">
              <button
                onClick={handleAddToCart}
                className="flex-1 py-3 sm:py-4 bg-primary text-primary-foreground text-sm tracking-wider hover:bg-brown/90 transition-all duration-300"
              >
                Add to Cart
              </button>
              <button 
                onClick={handleWishlistToggle}
                className={cn(
                  "p-3 sm:p-4 border border-border transition-all duration-200",
                  "hover:border-primary hover:text-primary",
                  isWishlisted && "border-red-500 bg-red-50"
                )}
              >
                <Heart 
                  size={18}
                  className={cn(
                    "sm:w-5 sm:h-5 transition-colors",
                    isWishlisted 
                      ? "fill-red-500 text-red-500" 
                      : "text-gray-600 hover:text-red-500"
                  )}
                />
              </button>
            </div>

            {/* Trust Notes */}
            <div className="space-y-3 py-4 sm:py-6 border-t border-border">
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
            <details className="border-t border-border pt-4 sm:pt-6">
              <summary className="cursor-pointer text-sm font-medium text-foreground">
                Care Instructions
              </summary>
              <p className="mt-4 text-sm text-muted-foreground leading-relaxed">
                Machine wash cold with like colors. Do not bleach. Tumble dry low. 
                Iron on low heat if needed. Professional dry cleaning recommended for best results.
              </p>
            </details>
          </motion.div>
        </div>
      </div>
    </Layout>
  );
};

export default FolderProductDetail;