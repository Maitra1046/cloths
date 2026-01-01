import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Check, X } from 'lucide-react';
import { Layout } from '@/components/layout/Layout';
import { cn } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';
import { useCart, CartItem } from '@/context/CartContext';
import { useScrollToTop } from '@/hooks/useScrollToTop';
import { useNavigate, Navigate } from 'react-router-dom';
import { fadeInUp, fadeInLeft, fadeInRight } from '@/lib/animations';
import { OrderService } from '@/services/orderService';
import { useAuth } from '@/context/AuthContext';
import { formatCurrency } from '@/utils/currency';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';

const steps = ['Shipping', 'Payment', 'Review'];

const Checkout = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const { cartItems, cartItemCount, clearCart } = useCart();
  const { user, isAdmin, isAuthenticated } = useAuth();

  // Scroll to top when component mounts
  useScrollToTop();

  // Redirect admin users to admin dashboard
  if (isAdmin) {
    return <Navigate to="/admin" replace />;
  }

  // Redirect unauthenticated users to login page
  if (!isAuthenticated || !user) {
    return <Navigate to="/login" replace />;
  }
  const [currentStep, setCurrentStep] = useState(0);
  const [selectedItemForDetails, setSelectedItemForDetails] = useState<CartItem | null>(null);
  const [formData, setFormData] = useState({
    email: '',
    firstName: '',
    lastName: '',
    address: '',
    city: '',
    state: '',
    zip: '',
    phone: '',
    saveInfo: true,
    cardNumber: '',
    expiry: '',
    cvv: '',
    nameOnCard: '',
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Redirect to cart if empty
  useEffect(() => {
    if (cartItems.length === 0) {
      navigate('/cart');
    }
  }, [cartItems.length, navigate]);

  if (cartItems.length === 0) {
    return null;
  }

  const subtotal = cartItems.reduce((sum, item) => {
    return sum + (item.price * item.quantity);
  }, 0);

  const shipping = subtotal >= 250 ? 0 : 15;
  const total = subtotal + shipping;

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validateStep = (step: number): boolean => {
    const newErrors: Record<string, string> = {};
    
    if (step === 0) {
      if (!formData.email) newErrors.email = 'Email is required';
      if (!formData.firstName) newErrors.firstName = 'First name is required';
      if (!formData.lastName) newErrors.lastName = 'Last name is required';
      if (!formData.address) newErrors.address = 'Address is required';
      if (!formData.city) newErrors.city = 'City is required';
      if (!formData.state) newErrors.state = 'State is required';
      if (!formData.zip) newErrors.zip = 'ZIP code is required';
      if (!formData.phone) newErrors.phone = 'Phone is required';
    }
    
    if (step === 1) {
      if (!formData.cardNumber) newErrors.cardNumber = 'Card number is required';
      if (!formData.expiry) newErrors.expiry = 'Expiry date is required';
      if (!formData.cvv) newErrors.cvv = 'CVV is required';
      if (!formData.nameOnCard) newErrors.nameOnCard = 'Name on card is required';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = () => {
    if (!user) {
      toast({
        title: 'Error',
        description: 'You must be logged in to place an order',
        variant: 'destructive'
      });
      return;
    }

    // Create order
    const newOrder = OrderService.createOrder({
      userId: user.id,
      userName: user.name,
      userEmail: user.email,
      items: cartItems.map(item => ({
        productId: item.folderId,
        productName: item.folderName,
        quantity: item.quantity,
        price: item.price,
        size: item.size,
        color: 'Default' // Add default color since it's not captured in cart
      })),
      total: total,
      status: 'pending',
      shippingAddress: {
        fullName: `${formData.firstName} ${formData.lastName}`,
        address: formData.address,
        city: formData.city,
        state: formData.state,
        zipCode: formData.zip,
        country: 'India',
        phone: formData.phone
      },
      paymentMethod: 'Card'
    });

    // Clear cart
    clearCart();

    toast({
      title: 'Order placed successfully!',
      description: `Order #${newOrder.id} - Thank you for your order. You will receive a confirmation email shortly.`,
    });

    // Navigate to account orders page
    setTimeout(() => {
      navigate('/account');
    }, 1500);
  };

  return (
    <Layout>
      <div className="bg-cream py-8 lg:py-12">
        <div className="container mx-auto px-6 lg:px-12">
          {/* Progress */}
          <div className="flex items-center justify-center gap-4 mb-8">
            {steps.map((step, index) => (
              <div key={step} className="flex items-center">
                <div
                  className={cn(
                    'w-8 h-8 rounded-full flex items-center justify-center text-sm transition-colors',
                    index <= currentStep
                      ? 'bg-primary text-primary-foreground'
                      : 'bg-border text-muted-foreground'
                  )}
                >
                  {index < currentStep ? <Check size={16} /> : index + 1}
                </div>
                <span
                  className={cn(
                    'ml-2 text-sm hidden sm:block',
                    index <= currentStep ? 'text-foreground' : 'text-muted-foreground'
                  )}
                >
                  {step}
                </span>
                {index < steps.length - 1 && (
                  <div
                    className={cn(
                      'w-12 lg:w-20 h-px mx-4',
                      index < currentStep ? 'bg-primary' : 'bg-border'
                    )}
                  />
                )}
              </div>
            ))}
          </div>

          <motion.h1
            {...fadeInUp}
            className="font-serif text-3xl lg:text-4xl text-center text-foreground"
          >
            Checkout
          </motion.h1>
        </div>
      </div>

      <div className="container mx-auto px-6 lg:px-12 py-8 lg:py-12">
        <div className="lg:grid lg:grid-cols-3 lg:gap-12">
          {/* Form */}
          <div className="lg:col-span-2">
            {/* Shipping Step */}
            {currentStep === 0 && (
              <motion.div
                {...fadeInLeft}
                className="space-y-6"
              >
                <h2 className="font-serif text-xl mb-6">Shipping Information</h2>

                <div>
                  <label className="text-sm text-muted-foreground block mb-1.5">
                    Email
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    placeholder="your@email.com"
                    className="w-full px-4 py-3 bg-background border border-border text-sm focus:outline-none focus:ring-1 focus:ring-primary"
                  />
                  {errors.email && <p className="text-sm text-red-500 mt-1">{errors.email}</p>}
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm text-muted-foreground block mb-1.5">
                      First Name
                    </label>
                    <input
                      type="text"
                      name="firstName"
                      value={formData.firstName}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 bg-background border border-border text-sm focus:outline-none focus:ring-1 focus:ring-primary"
                    />
                    {errors.firstName && <p className="text-sm text-red-500 mt-1">{errors.firstName}</p>}
                  </div>
                  <div>
                    <label className="text-sm text-muted-foreground block mb-1.5">
                      Last Name
                    </label>
                    <input
                      type="text"
                      name="lastName"
                      value={formData.lastName}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 bg-background border border-border text-sm focus:outline-none focus:ring-1 focus:ring-primary"
                    />
                    {errors.lastName && <p className="text-sm text-red-500 mt-1">{errors.lastName}</p>}
                  </div>
                </div>

                <div>
                  <label className="text-sm text-muted-foreground block mb-1.5">
                    Address
                  </label>
                  <input
                    type="text"
                    name="address"
                    value={formData.address}
                    onChange={handleInputChange}
                    placeholder="Street address"
                    className="w-full px-4 py-3 bg-background border border-border text-sm focus:outline-none focus:ring-1 focus:ring-primary"
                  />
                  {errors.address && <p className="text-sm text-red-500 mt-1">{errors.address}</p>}
                </div>

                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <label className="text-sm text-muted-foreground block mb-1.5">
                      City
                    </label>
                    <input
                      type="text"
                      name="city"
                      value={formData.city}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 bg-background border border-border text-sm focus:outline-none focus:ring-1 focus:ring-primary"
                    />
                    {errors.city && <p className="text-sm text-red-500 mt-1">{errors.city}</p>}
                  </div>
                  <div>
                    <label className="text-sm text-muted-foreground block mb-1.5">
                      State
                    </label>
                    <input
                      type="text"
                      name="state"
                      value={formData.state}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 bg-background border border-border text-sm focus:outline-none focus:ring-1 focus:ring-primary"
                    />
                    {errors.state && <p className="text-sm text-red-500 mt-1">{errors.state}</p>}
                  </div>
                  <div>
                    <label className="text-sm text-muted-foreground block mb-1.5">
                      ZIP
                    </label>
                    <input
                      type="text"
                      name="zip"
                      value={formData.zip}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 bg-background border border-border text-sm focus:outline-none focus:ring-1 focus:ring-primary"
                    />
                    {errors.zip && <p className="text-sm text-red-500 mt-1">{errors.zip}</p>}
                  </div>
                </div>

                <div>
                  <label className="text-sm text-muted-foreground block mb-1.5">
                    Phone
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    placeholder="For delivery updates"
                    className="w-full px-4 py-3 bg-background border border-border text-sm focus:outline-none focus:ring-1 focus:ring-primary"
                  />
                  {errors.phone && <p className="text-sm text-red-500 mt-1">{errors.phone}</p>}
                </div>

                <label className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    name="saveInfo"
                    checked={formData.saveInfo}
                    onChange={handleInputChange}
                    className="w-4 h-4 rounded-sm border-border text-primary focus:ring-primary"
                  />
                  <span className="text-sm text-muted-foreground">
                    Save this information for next time
                  </span>
                </label>

                <button
                  onClick={() => {
                    if (validateStep(0)) {
                      setCurrentStep(1);
                    } else {
                      toast({
                        title: "Missing Information",
                        description: "Please fill in all required fields",
                        variant: "destructive"
                      });
                    }
                  }}
                  className="w-full py-4 bg-primary text-primary-foreground text-sm tracking-wider hover:bg-brown/90 transition-all duration-300"
                >
                  Continue to Payment
                </button>
              </motion.div>
            )}

            {/* Payment Step */}
            {currentStep === 1 && (
              <motion.div
                {...fadeInLeft}
                className="space-y-6"
              >
                <h2 className="font-serif text-xl mb-6">Payment Method</h2>

                <div>
                  <label className="text-sm text-muted-foreground block mb-1.5">
                    Card Number
                  </label>
                  <input
                    type="text"
                    name="cardNumber"
                    value={formData.cardNumber}
                    onChange={handleInputChange}
                    placeholder="1234 5678 9012 3456"
                    className="w-full px-4 py-3 bg-background border border-border text-sm focus:outline-none focus:ring-1 focus:ring-primary"
                  />
                  {errors.cardNumber && <p className="text-sm text-red-500 mt-1">{errors.cardNumber}</p>}
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm text-muted-foreground block mb-1.5">
                      Expiry Date
                    </label>
                    <input
                      type="text"
                      name="expiry"
                      value={formData.expiry}
                      onChange={handleInputChange}
                      placeholder="MM/YY"
                      className="w-full px-4 py-3 bg-background border border-border text-sm focus:outline-none focus:ring-1 focus:ring-primary"
                    />
                    {errors.expiry && <p className="text-sm text-red-500 mt-1">{errors.expiry}</p>}
                  </div>
                  <div>
                    <label className="text-sm text-muted-foreground block mb-1.5">
                      CVV
                    </label>
                    <input
                      type="text"
                      name="cvv"
                      value={formData.cvv}
                      onChange={handleInputChange}
                      placeholder="123"
                      className="w-full px-4 py-3 bg-background border border-border text-sm focus:outline-none focus:ring-1 focus:ring-primary"
                    />
                    {errors.cvv && <p className="text-sm text-red-500 mt-1">{errors.cvv}</p>}
                  </div>
                </div>

                <div>
                  <label className="text-sm text-muted-foreground block mb-1.5">
                    Name on Card
                  </label>
                  <input
                    type="text"
                    name="nameOnCard"
                    value={formData.nameOnCard}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 bg-background border border-border text-sm focus:outline-none focus:ring-1 focus:ring-primary"
                  />
                  {errors.nameOnCard && <p className="text-sm text-red-500 mt-1">{errors.nameOnCard}</p>}
                </div>

                <div className="flex gap-4">
                  <button
                    onClick={() => setCurrentStep(0)}
                    className="flex-1 py-4 border border-border text-foreground text-sm tracking-wider hover:bg-secondary transition-all duration-300"
                  >
                    Back
                  </button>
                  <button
                    onClick={() => {
                      if (validateStep(1)) {
                        setCurrentStep(2);
                      } else {
                        toast({
                          title: "Missing Information",
                          description: "Please fill in all payment details",
                          variant: "destructive"
                        });
                      }
                    }}
                    className="flex-1 py-4 bg-primary text-primary-foreground text-sm tracking-wider hover:bg-brown/90 transition-all duration-300"
                  >
                    Review Order
                  </button>
                </div>
              </motion.div>
            )}

            {/* Review Step */}
            {currentStep === 2 && (
              <motion.div
                {...fadeInLeft}
                className="space-y-6"
              >
                <h2 className="font-serif text-xl mb-6">Review Your Order</h2>

                <div className="bg-cream p-6 space-y-4">
                  <div>
                    <h3 className="text-sm font-medium text-foreground mb-2">
                      Shipping Address
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      {formData.firstName} {formData.lastName}<br />
                      {formData.address}<br />
                      {formData.city}, {formData.state} {formData.zip}
                    </p>
                  </div>

                  <div className="border-t border-border pt-4">
                    <h3 className="text-sm font-medium text-foreground mb-2">
                      Payment Method
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      Card ending in {formData.cardNumber.slice(-4) || '****'}
                    </p>
                  </div>
                </div>

                <div className="divide-y divide-border">
                  {cartItems.map((item) => (
                    <div key={item.folderId} className="py-4 flex gap-4">
                      <img
                        src={item.image}
                        alt={item.folderName}
                        className="w-16 h-20 object-cover bg-cream"
                      />
                      <div className="flex-1">
                        <p className="font-serif text-foreground">{item.folderName}</p>
                        <div className="flex items-center gap-2 mt-1">
                          <p className="text-sm text-muted-foreground">
                            Size: {item.isCustom ? (
                              <span className="text-primary font-medium">Custom</span>
                            ) : (
                              item.size || 'Standard'
                            )}
                          </p>
                          {item.isCustom && item.customMeasurements && (
                            <button
                              onClick={() => setSelectedItemForDetails(item)}
                              className="text-xs text-primary hover:underline"
                            >
                              View Details
                            </button>
                          )}
                        </div>
                        <p className="text-sm text-muted-foreground mt-1">
                          Qty: {item.quantity}
                        </p>
                      </div>
                      <p className="text-foreground">{formatCurrency(item.price * item.quantity)}</p>
                    </div>
                  ))}
                </div>

                <div className="flex gap-4">
                  <button
                    onClick={() => setCurrentStep(1)}
                    className="flex-1 py-4 border border-border text-foreground text-sm tracking-wider hover:bg-secondary transition-all duration-300"
                  >
                    Back
                  </button>
                  <button
                    onClick={handleSubmit}
                    className="flex-1 py-4 bg-primary text-primary-foreground text-sm tracking-wider hover:bg-brown/90 transition-all duration-300"
                  >
                    Place Order
                  </button>
                </div>
              </motion.div>
            )}
          </div>

          {/* Order Summary */}
          <motion.div
            {...fadeInRight}
            transition={{ ...fadeInRight.transition, delay: 0.2 }}
            className="mt-8 lg:mt-0"
          >
            <div className="bg-cream p-6 lg:p-8 sticky top-24">
              <h2 className="font-serif text-xl mb-6">Order Summary</h2>

              <div className="space-y-4 mb-6">
                {cartItems.map((item) => (
                  <div key={item.folderId} className="flex gap-3">
                    <img
                      src={item.image}
                      alt={item.folderName}
                      className="w-14 h-18 object-cover bg-card"
                    />
                    <div className="flex-1 text-sm">
                      <p className="text-foreground">{item.folderName}</p>
                      <p className="text-muted-foreground">
                        Size: {item.isCustom ? (
                          <span className="text-primary">Custom</span>
                        ) : (
                          item.size || 'Standard'
                        )}
                      </p>
                      <p className="text-muted-foreground">Qty: {item.quantity}</p>
                    </div>
                    <p className="text-sm text-foreground">
                      {formatCurrency(item.price * item.quantity)}
                    </p>
                  </div>
                ))}
              </div>

              <div className="space-y-3 text-sm border-t border-border pt-4">
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
                <div className="pt-3 border-t border-border flex justify-between">
                  <span className="font-medium text-foreground">Total</span>
                  <span className="font-medium text-foreground">{formatCurrency(total)}</span>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Custom Measurements Modal */}
      <Dialog
        open={!!selectedItemForDetails}
        onOpenChange={() => setSelectedItemForDetails(null)}
      >
        <DialogContent className="max-w-md modal-mobile-fix">
          <DialogHeader>
            <DialogTitle className="font-serif text-xl">
              Custom Size Details
            </DialogTitle>
          </DialogHeader>
          {selectedItemForDetails?.customMeasurements && (
            <div className="space-y-4 mt-4">
              <div>
                <p className="text-sm font-medium text-foreground mb-2">
                  {selectedItemForDetails.folderName}
                </p>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="text-muted-foreground">Bust</p>
                    <p className="text-foreground font-medium">
                      {selectedItemForDetails.customMeasurements.bust}" 
                    </p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Waist</p>
                    <p className="text-foreground font-medium">
                      {selectedItemForDetails.customMeasurements.waist}"
                    </p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Hip</p>
                    <p className="text-foreground font-medium">
                      {selectedItemForDetails.customMeasurements.hip}"
                    </p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Shoulder</p>
                    <p className="text-foreground font-medium">
                      {selectedItemForDetails.customMeasurements.shoulder}"
                    </p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Sleeve</p>
                    <p className="text-foreground font-medium">
                      {selectedItemForDetails.customMeasurements.sleeve}"
                    </p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Length</p>
                    <p className="text-foreground font-medium">
                      {selectedItemForDetails.customMeasurements.length}"
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </Layout>
  );
};

export default Checkout;
