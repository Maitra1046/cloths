import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { X, Minus, Plus, ShoppingBag } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { useCart } from '@/context/CartContext';
import { useAuth } from '@/context/AuthContext';
import { formatCurrency } from '@/utils/currency';

export const CartModal = () => {
  const { cartItems, isCartOpen, closeCart, removeFromCart, updateQuantity } = useCart();
  const { isAdmin, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  // Don't render cart modal for admin users
  if (isAdmin) {
    return null;
  }

  const subtotal = cartItems.reduce((sum, item) => {
    return sum + (item.price * item.quantity);
  }, 0);
  const shipping = subtotal >= 250 ? 0 : 15;
  const total = subtotal + shipping;

  const handleCheckout = () => {
    closeCart(); // Close the modal first
    if (isAuthenticated) {
      navigate('/checkout');
    } else {
      navigate('/login');
    }
  };

  return (
    <Dialog open={isCartOpen} onOpenChange={closeCart}>
      <DialogContent className="max-w-2xl modal-mobile-fix overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="font-serif text-2xl">Shopping Cart</DialogTitle>
        </DialogHeader>

        {cartItems.length === 0 ? (
          <div className="py-12 text-center">
            <ShoppingBag size={48} className="mx-auto text-muted-foreground mb-4" />
            <p className="text-muted-foreground mb-6">Your cart is empty</p>
            <Link
              to="/shop"
              onClick={closeCart}
              className="inline-flex items-center justify-center px-6 py-2.5 bg-primary text-primary-foreground text-sm tracking-wider hover:bg-brown/90 transition-all duration-300"
            >
              Continue Shopping
            </Link>
          </div>
        ) : (
          <>
            {/* Cart Items */}
            <div className="divide-y divide-border">
              {cartItems.map((item, index) => (
                <motion.div
                  key={item.folderId}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="py-4 flex gap-4"
                >
                  {/* Image */}
                  <div className="shrink-0">
                    <img
                      src={item.image}
                      alt={item.productName}
                      className="w-20 h-24 object-cover bg-cream"
                    />
                  </div>

                  {/* Details */}
                  <div className="flex-1 flex flex-col">
                    <div className="flex justify-between">
                      <div>
                        <h3 className="font-serif text-base text-foreground">
                          {item.productName}
                        </h3>
                        <p className="text-xs text-muted-foreground mt-0.5">
                          Size: {item.isCustom ? (
                            <span className="text-primary">Custom</span>
                          ) : (
                            item.size || 'Standard'
                          )}
                        </p>
                      </div>
                      <button
                        onClick={() => removeFromCart(item.productId)}
                        className="p-1 text-muted-foreground hover:text-foreground transition-colors"
                      >
                        <X size={16} />
                      </button>
                    </div>

                    <div className="mt-auto flex items-center justify-between">
                      {/* Quantity */}
                      <div className="flex items-center border border-border">
                        <button
                          onClick={() => updateQuantity(item.productId, item.quantity - 1)}
                          className="p-1.5 hover:bg-secondary transition-colors"
                        >
                          <Minus size={12} />
                        </button>
                        <span className="w-8 text-center text-sm">{item.quantity}</span>
                        <button
                          onClick={() => updateQuantity(item.productId, item.quantity + 1)}
                          className="p-1.5 hover:bg-secondary transition-colors"
                        >
                          <Plus size={12} />
                        </button>
                      </div>

                      {/* Price */}
                      <span className="text-foreground text-sm">
                        {formatCurrency(item.price * item.quantity)}
                      </span>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Order Summary */}
            <div className="border-t border-border pt-4 mt-4">
              <div className="space-y-2 text-sm">
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
                <div className="pt-2 border-t border-border flex justify-between font-medium">
                  <span className="text-foreground">Total</span>
                  <span className="text-foreground">{formatCurrency(total)}</span>
                </div>
              </div>

              <div className="flex gap-3 mt-6">
                <Link
                  to="/cart"
                  onClick={closeCart}
                  className="flex-1 inline-flex items-center justify-center py-2.5 border border-border text-foreground text-sm tracking-wider hover:bg-secondary transition-all duration-300"
                >
                  View Cart
                </Link>
                <button
                  onClick={handleCheckout}
                  className="flex-1 inline-flex items-center justify-center py-2.5 bg-primary text-primary-foreground text-sm tracking-wider hover:bg-brown/90 transition-all duration-300"
                >
                  Checkout
                </button>
              </div>
            </div>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
};

