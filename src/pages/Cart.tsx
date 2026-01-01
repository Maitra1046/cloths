import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { X, Minus, Plus, ShoppingBag } from 'lucide-react';
import { Layout } from '@/components/layout/Layout';
import { useCart } from '@/context/CartContext';
import { useAuth } from '@/context/AuthContext';
import { useScrollToTop } from '@/hooks/useScrollToTop';
import { Navigate } from 'react-router-dom';
import { fadeInUp, fadeInLeft, fadeInRight } from '@/lib/animations';
import { formatCurrency } from '@/utils/currency';

const Cart = () => {
  const { cartItems, removeFromCart, updateQuantity } = useCart();
  const { isAdmin, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  // Scroll to top when component mounts
  useScrollToTop();

  // Redirect admin users to admin dashboard
  if (isAdmin) {
    return <Navigate to="/admin" replace />;
  }

  // Calculate subtotal using actual prices
  const subtotal = cartItems.reduce((sum, item) => {
    return sum + (item.price * item.quantity);
  }, 0);

  const shipping = subtotal >= 250 ? 0 : 15;
  const total = subtotal + shipping;

  const handleCheckout = () => {
    if (isAuthenticated) {
      navigate('/checkout');
    } else {
      navigate('/login');
    }
  };

  if (cartItems.length === 0) {
    return (
      <Layout>
        <div className="container mx-auto px-6 py-20 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-md mx-auto"
          >
            <ShoppingBag size={48} className="mx-auto text-muted-foreground mb-6" />
            <h1 className="font-serif text-2xl mb-4">Your cart is empty</h1>
            <p className="text-muted-foreground mb-8">
              Looks like you haven't added anything to your cart yet.
            </p>
            <Link
              to="/shop"
              className="inline-flex items-center justify-center px-8 py-3.5 bg-primary text-primary-foreground text-sm tracking-wider hover:bg-brown/90 transition-all duration-300"
            >
              Continue Shopping
            </Link>
          </motion.div>
        </div>
      </Layout>
    );
  }

  const cartItemCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <Layout cartItemCount={cartItemCount}>
      <div className="bg-cream py-12 lg:py-16">
        <div className="container mx-auto px-6 lg:px-12">
          <motion.h1
            {...fadeInUp}
            className="font-serif text-3xl lg:text-4xl text-center text-foreground"
          >
            Shopping Cart
          </motion.h1>
        </div>
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-12 py-6 sm:py-8 lg:py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-8 lg:gap-12">
          <div className="lg:col-span-2 order-2 lg:order-1">
            <div className="divide-y divide-border">
              {cartItems.map((item, index) => (
                <motion.div
                  key={item.productId}
                  {...fadeInLeft}
                  transition={{ ...fadeInLeft.transition, delay: index * 0.1 }}
                  className="py-4 sm:py-6 flex gap-3 sm:gap-6"
                >
                  <div className="shrink-0">
                    <img
                      src={item.image}
                      alt={item.productName}
                      className="w-20 h-28 sm:w-24 sm:h-32 lg:w-32 lg:h-40 object-cover bg-cream"
                    />
                  </div>

                  <div className="flex-1 flex flex-col min-w-0">
                    <div className="flex justify-between gap-2">
                      <div className="min-w-0 flex-1">
                        <h3 className="font-serif text-base sm:text-lg text-foreground break-words">
                          {item.productName}
                        </h3>
                        <p className="text-xs sm:text-sm text-muted-foreground mt-1">
                          Size: {item.isCustom ? (
                            <span className="text-primary font-medium">Custom</span>
                          ) : (
                            item.size || 'Standard'
                          )}
                        </p>
                      </div>
                      <button
                        onClick={() => removeFromCart(item.productId)}
                        className="p-2 sm:p-1 text-muted-foreground hover:text-foreground active:text-foreground transition-colors touch-manipulation min-h-[44px] min-w-[44px] flex items-center justify-center shrink-0"
                      >
                        <X size={18} />
                      </button>
                    </div>

                    <div className="mt-auto flex items-center justify-between gap-2 sm:gap-4 mt-4">
                      <div className="flex items-center border border-border">
                        <button
                          onClick={() => updateQuantity(item.productId, item.quantity - 1)}
                          className="p-3 sm:p-2 hover:bg-secondary active:bg-secondary transition-colors touch-manipulation min-h-[44px] min-w-[44px] flex items-center justify-center"
                        >
                          <Minus size={16} className="sm:w-3.5 sm:h-3.5" />
                        </button>
                        <span className="w-10 text-center text-sm">{item.quantity}</span>
                        <button
                          onClick={() => updateQuantity(item.productId, item.quantity + 1)}
                          className="p-3 sm:p-2 hover:bg-secondary active:bg-secondary transition-colors touch-manipulation min-h-[44px] min-w-[44px] flex items-center justify-center"
                        >
                          <Plus size={16} className="sm:w-3.5 sm:h-3.5" />
                        </button>
                      </div>

                      {/* Price */}
                      <span className="text-foreground">
                        {formatCurrency(item.price * item.quantity)}
                      </span>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>

            <Link
              to="/shop"
              className="inline-block mt-6 text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              ← Continue Shopping
            </Link>
          </div>

          <motion.div
            {...fadeInRight}
            transition={{ ...fadeInRight.transition, delay: 0.2 }}
            className="mt-6 sm:mt-8 lg:mt-0 order-1 lg:order-2"
          >
            <div className="bg-cream p-4 sm:p-6 lg:p-8 sticky top-20 sm:top-24">
              <h2 className="font-serif text-lg sm:text-xl mb-4 sm:mb-6">Order Summary</h2>

              <div className="space-y-3 sm:space-y-4 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Subtotal</span>
                  <span className="text-foreground">{formatCurrency(subtotal)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Shipping</span>
                  <span className="text-foreground">
                    {shipping === 0 ? 'Free' : formatCurrency(shipping)}
                  </span>
                </div>
                {shipping > 0 && (
                  <p className="text-xs text-muted-foreground">
                    Free shipping on orders over ₹250
                  </p>
                )}
                <div className="pt-3 sm:pt-4 border-t border-border flex justify-between">
                  <span className="font-medium text-foreground">Total</span>
                  <span className="font-medium text-foreground">{formatCurrency(total)}</span>
                </div>
              </div>

              <button
                onClick={handleCheckout}
                className="mt-4 sm:mt-6 w-full inline-flex items-center justify-center py-4 bg-primary text-primary-foreground text-sm tracking-wider hover:bg-brown/90 active:bg-brown/80 transition-all duration-300 touch-manipulation min-h-[48px]"
              >
                Proceed to Checkout
              </button>

              <p className="mt-3 sm:mt-4 text-xs text-muted-foreground text-center">
                Secure checkout powered by Stripe
              </p>
            </div>
          </motion.div>
        </div>
      </div>
    </Layout>
  );
};

export default Cart;
