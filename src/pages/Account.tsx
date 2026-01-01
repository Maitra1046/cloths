import { useState } from "react";
import { Link, Navigate } from "react-router-dom";
import { motion } from "framer-motion";
import { User, Package, Heart, MapPin, Ruler, LogOut, ChevronRight, Edit2, Trash2, Plus, Eye } from "lucide-react";
import { Layout } from "@/components/layout/Layout";
import { cn } from "@/lib/utils";
import { ProductService } from "@/services/productService";
import { loadAllImageFolders } from "@/data/imageFolders";
import { useAuth } from "@/context/AuthContext";
import { useWishlist } from "@/context/WishlistContext";
import { useScrollToTop } from "@/hooks/useScrollToTop";
import { OrderService } from "@/services/orderService";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { formatCurrency } from "@/utils/currency";
import { Order } from "@/types/order";

const tabs = [
  { id: 'orders', label: 'Orders', icon: Package },
  { id: 'measurements', label: 'My Measurements', icon: Ruler },
  { id: 'wishlist', label: 'Wishlist', icon: Heart },
  { id: 'addresses', label: 'Addresses', icon: MapPin },
  { id: 'profile', label: 'Profile', icon: User },
];

interface Address {
  id: string;
  name: string;
  address: string;
  city: string;
  state: string;
  zip: string;
  isDefault: boolean;
}

interface Measurements {
  bust: string;
  waist: string;
  hip: string;
  shoulder: string;
  sleeve: string;
  length: string;
}

const Account = () => {
  const { isAuthenticated, logout, user } = useAuth();
  const { wishlistItems, removeFromWishlist } = useWishlist();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState('orders');

  // Scroll to top when component mounts
  useScrollToTop();
  const [isEditing, setIsEditing] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [isOrderDetailsOpen, setIsOrderDetailsOpen] = useState(false);
  
  // Profile state
  const [profileData, setProfileData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: '+91 98765 43210'
  });
  
  // Password state
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [isPasswordDialogOpen, setIsPasswordDialogOpen] = useState(false);
  
  // Measurements state
  const [measurements, setMeasurements] = useState<Measurements>({
    bust: '36',
    waist: '28',
    hip: '38',
    shoulder: '15',
    sleeve: '24',
    length: '45',
  });
  
  // Addresses state
  const [addresses, setAddresses] = useState<Address[]>([
    {
      id: '1',
      name: 'Home',
      address: '123 Main Street, Apt 4B',
      city: 'Mumbai',
      state: 'Maharashtra',
      zip: '400001',
      isDefault: true,
    },
    {
      id: '2',
      name: 'Office',
      address: '456 Business Ave, Suite 200',
      city: 'Mumbai',
      state: 'Maharashtra',
      zip: '400016',
      isDefault: false,
    },
  ]);
  
  const [newAddress, setNewAddress] = useState<Omit<Address, 'id'>>({
    name: '',
    address: '',
    city: '',
    state: '',
    zip: '',
    isDefault: false
  });
  const [isAddressDialogOpen, setIsAddressDialogOpen] = useState(false);
  const [editingAddress, setEditingAddress] = useState<Address | null>(null);

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // Get user's orders
  const userOrders = user ? OrderService.getOrdersByUserId(user.id) : [];
  
  // Helper function to determine the correct product route
  const getProductRoute = (productId: string) => {
    // Check if it's a ProductService product
    const serviceProduct = ProductService.getProductById(productId);
    if (serviceProduct) {
      return `/product/${productId}`;
    }
    
    // Check if it's an ImageFolder product
    const imageFolders = loadAllImageFolders();
    const folderProduct = imageFolders.find(f => f.id === productId);
    if (folderProduct) {
      return `/folder/${productId}`;
    }
    
    // Default fallback
    return `/product/${productId}`;
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'delivered':
        return 'bg-green-100 text-green-800';
      case 'shipped':
        return 'bg-blue-100 text-blue-800';
      case 'processing':
        return 'bg-yellow-100 text-yellow-800';
      case 'pending':
        return 'bg-orange-100 text-orange-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const handleProfileSave = () => {
    // Simulate API call
    setTimeout(() => {
      toast({
        title: "Profile Updated",
        description: "Your profile information has been saved successfully.",
      });
    }, 500);
  };

  const handlePasswordChange = () => {
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      toast({
        title: "Error",
        description: "New passwords don't match.",
        variant: "destructive"
      });
      return;
    }
    
    if (passwordData.newPassword.length < 6) {
      toast({
        title: "Error",
        description: "Password must be at least 6 characters long.",
        variant: "destructive"
      });
      return;
    }

    // Simulate API call
    setTimeout(() => {
      toast({
        title: "Password Changed",
        description: "Your password has been updated successfully.",
      });
      setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
      setIsPasswordDialogOpen(false);
    }, 500);
  };

  const handleMeasurementsSave = () => {
    // Simulate API call
    setTimeout(() => {
      toast({
        title: "Measurements Saved",
        description: "Your measurements have been updated successfully.",
      });
      setIsEditing(false);
    }, 500);
  };

  const handleAddressAdd = () => {
    if (!newAddress.name || !newAddress.address || !newAddress.city || !newAddress.state || !newAddress.zip) {
      toast({
        title: "Error",
        description: "Please fill in all required fields.",
        variant: "destructive"
      });
      return;
    }

    const address: Address = {
      ...newAddress,
      id: Date.now().toString()
    };

    setAddresses(prev => [...prev, address]);
    setNewAddress({ name: '', address: '', city: '', state: '', zip: '', isDefault: false });
    setIsAddressDialogOpen(false);
    
    toast({
      title: "Address Added",
      description: "New address has been added successfully.",
    });
  };

  const handleAddressEdit = (address: Address) => {
    setEditingAddress(address);
    setNewAddress(address);
    setIsAddressDialogOpen(true);
  };

  const handleAddressUpdate = () => {
    if (!editingAddress) return;
    
    setAddresses(prev => prev.map(addr => 
      addr.id === editingAddress.id ? { ...newAddress, id: editingAddress.id } : addr
    ));
    
    setEditingAddress(null);
    setNewAddress({ name: '', address: '', city: '', state: '', zip: '', isDefault: false });
    setIsAddressDialogOpen(false);
    
    toast({
      title: "Address Updated",
      description: "Address has been updated successfully.",
    });
  };

  const handleAddressRemove = (addressId: string) => {
    setAddresses(prev => prev.filter(addr => addr.id !== addressId));
    toast({
      title: "Address Removed",
      description: "Address has been removed successfully.",
    });
  };

  const handleViewOrderDetails = (order: Order) => {
    setSelectedOrder(order);
    setIsOrderDetailsOpen(true);
  };

  const handleRemoveFromWishlist = (productId: string) => {
    removeFromWishlist(productId);
    toast({
      title: "Removed from wishlist",
      description: "Item has been removed from your wishlist.",
    });
  };

  return (
    <Layout>
      <div className="bg-cream py-12 lg:py-16">
        <div className="container mx-auto px-6 lg:px-12">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="font-serif text-3xl lg:text-4xl text-center text-foreground"
          >
            My Account
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-center text-muted-foreground mt-2"
          >
            Welcome back, {user?.name}
          </motion.p>
        </div>
      </div>

      <div className="container mx-auto px-6 lg:px-12 py-8 lg:py-12">
        <div className="lg:grid lg:grid-cols-[240px_1fr] lg:gap-12">
          {/* Sidebar */}
          <aside className="mb-8 lg:mb-0">
            <nav className="space-y-1">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={cn(
                    'w-full flex items-center gap-3 px-4 py-3 text-sm transition-colors rounded-sm',
                    activeTab === tab.id
                      ? 'bg-secondary text-foreground'
                      : 'text-muted-foreground hover:text-foreground hover:bg-secondary/50'
                  )}
                >
                  <tab.icon size={18} />
                  {tab.label}
                </button>
              ))}
              <button
                onClick={logout}
                className="w-full flex items-center gap-3 px-4 py-3 text-sm text-muted-foreground hover:text-foreground transition-colors rounded-sm mt-4 border-t border-border pt-4"
              >
                <LogOut size={18} />
                Sign Out
              </button>
            </nav>
          </aside>

          {/* Content */}
          <div>
            {/* Orders Tab */}
            {activeTab === 'orders' && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
              >
                <h2 className="font-serif text-xl mb-6">Order History</h2>
                
                {userOrders.length > 0 ? (
                  <div className="space-y-4">
                    {userOrders.map((order) => (
                      <div
                        key={order.id}
                        className="border border-border p-6 hover:border-primary/50 transition-colors"
                      >
                        <div className="flex flex-wrap items-center justify-between gap-4 mb-4">
                          <div>
                            <p className="font-medium text-foreground">{order.id}</p>
                            <p className="text-sm text-muted-foreground">
                              {new Date(order.createdAt).toLocaleDateString()}
                            </p>
                          </div>
                          <div className="text-right">
                            <span
                              className={cn(
                                'inline-block px-2.5 py-1 text-xs tracking-wider uppercase rounded-sm',
                                getStatusColor(order.status)
                              )}
                            >
                              {order.status}
                            </span>
                            <p className="text-sm text-foreground mt-1">{formatCurrency(order.total)}</p>
                          </div>
                        </div>

                        <div className="space-y-2">
                          {order.items.map((item, index) => (
                            <div key={index} className="flex justify-between text-sm">
                              <span>{item.productName}</span>
                              <span>Qty: {item.quantity} - {formatCurrency(item.price * item.quantity)}</span>
                            </div>
                          ))}
                        </div>

                        <button 
                          onClick={() => handleViewOrderDetails(order)}
                          className="mt-4 text-sm text-primary hover:underline flex items-center gap-1"
                        >
                          View Details <ChevronRight size={14} />
                        </button>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12 bg-cream">
                    <Package size={48} className="mx-auto text-muted-foreground mb-4" />
                    <p className="text-muted-foreground mb-4">No orders yet</p>
                    <Link to="/shop" className="text-primary hover:underline">
                      Start shopping
                    </Link>
                  </div>
                )}
              </motion.div>
            )}

            {/* Measurements Tab */}
            {activeTab === 'measurements' && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
              >
                <div className="flex items-center justify-between mb-6">
                  <h2 className="font-serif text-xl">My Measurements</h2>
                  <Button
                    onClick={() => isEditing ? handleMeasurementsSave() : setIsEditing(true)}
                    variant={isEditing ? "default" : "outline"}
                  >
                    {isEditing ? 'Save Changes' : 'Edit'}
                  </Button>
                </div>

                <div className="bg-cream p-6 lg:p-8">
                  <p className="text-sm text-muted-foreground mb-6">
                    Your saved measurements for custom-sized orders. All values in inches.
                  </p>

                  <div className="grid grid-cols-2 lg:grid-cols-3 gap-6">
                    {Object.entries(measurements).map(([key, value]) => (
                      <div key={key}>
                        <Label className="text-xs tracking-wider uppercase text-taupe block mb-2">
                          {key.charAt(0).toUpperCase() + key.slice(1)}
                        </Label>
                        {isEditing ? (
                          <Input
                            type="text"
                            value={value}
                            onChange={(e) => setMeasurements(prev => ({ ...prev, [key]: e.target.value }))}
                            className="w-full"
                          />
                        ) : (
                          <p className="text-foreground">{value}"</p>
                        )}
                      </div>
                    ))}
                  </div>

                  <p className="text-xs text-muted-foreground mt-6 italic">
                    These measurements will be auto-filled when you select "Custom Size" on any product.
                  </p>
                </div>
              </motion.div>
            )}

            {/* Wishlist Tab */}
            {activeTab === 'wishlist' && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
              >
                <h2 className="font-serif text-xl mb-6">Wishlist</h2>

                {wishlistItems.length > 0 ? (
                  <div className="grid grid-cols-2 lg:grid-cols-3 gap-6">
                    {wishlistItems.map((item) => (
                      <div key={item.productId} className="group relative">
                        <Link to={getProductRoute(item.productId)}>
                          <div className="aspect-[3/4] overflow-hidden bg-cream mb-4">
                            <img
                              src={item.productImage}
                              alt={item.productName}
                              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                            />
                          </div>
                        </Link>
                        
                        {/* Remove button */}
                        <button
                          onClick={() => handleRemoveFromWishlist(item.productId)}
                          className="absolute top-2 right-2 p-1.5 bg-white/80 hover:bg-white rounded-full shadow-sm opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          <Heart size={16} className="fill-red-500 text-red-500" />
                        </button>
                        
                        <h3 className="font-serif text-foreground">{item.productName}</h3>
                        <p className="text-sm text-muted-foreground">{formatCurrency(item.productPrice)}</p>
                        <Link 
                          to={getProductRoute(item.productId)}
                          className="mt-2 text-xs text-primary hover:underline block"
                        >
                          View Product
                        </Link>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12 bg-cream">
                    <Heart size={48} className="mx-auto text-muted-foreground mb-4" />
                    <p className="text-muted-foreground mb-4">Your wishlist is empty</p>
                    <Link to="/shop" className="text-primary hover:underline">
                      Discover our collection
                    </Link>
                  </div>
                )}
              </motion.div>
            )}

            {/* Addresses Tab */}
            {activeTab === 'addresses' && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
              >
                <div className="flex items-center justify-between mb-6">
                  <h2 className="font-serif text-xl">Saved Addresses</h2>
                  <Button onClick={() => setIsAddressDialogOpen(true)}>
                    <Plus className="h-4 w-4 mr-2" />
                    Add New
                  </Button>
                </div>

                <div className="grid lg:grid-cols-2 gap-4">
                  {addresses.map((address) => (
                    <div
                      key={address.id}
                      className={cn(
                        'border p-6 relative',
                        address.isDefault ? 'border-primary' : 'border-border'
                      )}
                    >
                      {address.isDefault && (
                        <span className="absolute top-3 right-3 text-xs text-primary">
                          Default
                        </span>
                      )}
                      <p className="font-medium text-foreground mb-2">{address.name}</p>
                      <p className="text-sm text-muted-foreground">
                        {address.address}<br />
                        {address.city}, {address.state} {address.zip}
                      </p>
                      <div className="flex gap-4 mt-4">
                        <button 
                          onClick={() => handleAddressEdit(address)}
                          className="text-xs text-muted-foreground hover:text-foreground flex items-center gap-1"
                        >
                          <Edit2 size={12} /> Edit
                        </button>
                        <button 
                          onClick={() => handleAddressRemove(address.id)}
                          className="text-xs text-muted-foreground hover:text-destructive flex items-center gap-1"
                        >
                          <Trash2 size={12} /> Remove
                        </button>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Address Dialog */}
                <Dialog open={isAddressDialogOpen} onOpenChange={setIsAddressDialogOpen}>
                  <DialogContent className="modal-mobile-fix">
                    <DialogHeader>
                      <DialogTitle>{editingAddress ? 'Edit Address' : 'Add New Address'}</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4">
                      <div>
                        <Label htmlFor="addressName">Address Name *</Label>
                        <Input
                          id="addressName"
                          value={newAddress.name}
                          onChange={(e) => setNewAddress(prev => ({ ...prev, name: e.target.value }))}
                          placeholder="Home, Office, etc."
                        />
                      </div>
                      <div>
                        <Label htmlFor="addressLine">Address *</Label>
                        <Input
                          id="addressLine"
                          value={newAddress.address}
                          onChange={(e) => setNewAddress(prev => ({ ...prev, address: e.target.value }))}
                          placeholder="Street address"
                        />
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="city">City *</Label>
                          <Input
                            id="city"
                            value={newAddress.city}
                            onChange={(e) => setNewAddress(prev => ({ ...prev, city: e.target.value }))}
                            placeholder="City"
                          />
                        </div>
                        <div>
                          <Label htmlFor="state">State *</Label>
                          <Input
                            id="state"
                            value={newAddress.state}
                            onChange={(e) => setNewAddress(prev => ({ ...prev, state: e.target.value }))}
                            placeholder="State"
                          />
                        </div>
                      </div>
                      <div>
                        <Label htmlFor="zip">PIN Code *</Label>
                        <Input
                          id="zip"
                          value={newAddress.zip}
                          onChange={(e) => setNewAddress(prev => ({ ...prev, zip: e.target.value }))}
                          placeholder="PIN Code"
                        />
                      </div>
                      <div className="flex justify-end gap-2">
                        <Button variant="outline" onClick={() => {
                          setIsAddressDialogOpen(false);
                          setEditingAddress(null);
                          setNewAddress({ name: '', address: '', city: '', state: '', zip: '', isDefault: false });
                        }}>
                          Cancel
                        </Button>
                        <Button onClick={editingAddress ? handleAddressUpdate : handleAddressAdd}>
                          {editingAddress ? 'Update' : 'Add'} Address
                        </Button>
                      </div>
                    </div>
                  </DialogContent>
                </Dialog>
              </motion.div>
            )}

            {/* Profile Tab */}
            {activeTab === 'profile' && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
              >
                <h2 className="font-serif text-xl mb-6">Profile Details</h2>

                <div className="max-w-md space-y-6">
                  <div>
                    <Label htmlFor="profileName">Full Name</Label>
                    <Input
                      id="profileName"
                      value={profileData.name}
                      onChange={(e) => setProfileData(prev => ({ ...prev, name: e.target.value }))}
                    />
                  </div>

                  <div>
                    <Label htmlFor="profileEmail">Email</Label>
                    <Input
                      id="profileEmail"
                      type="email"
                      value={profileData.email}
                      onChange={(e) => setProfileData(prev => ({ ...prev, email: e.target.value }))}
                    />
                  </div>

                  <div>
                    <Label htmlFor="profilePhone">Phone</Label>
                    <Input
                      id="profilePhone"
                      type="tel"
                      value={profileData.phone}
                      onChange={(e) => setProfileData(prev => ({ ...prev, phone: e.target.value }))}
                    />
                  </div>

                  <div className="pt-4">
                    <Button onClick={handleProfileSave}>
                      Save Changes
                    </Button>
                  </div>

                  <div className="pt-6 border-t border-border">
                    <Dialog open={isPasswordDialogOpen} onOpenChange={setIsPasswordDialogOpen}>
                      <DialogTrigger asChild>
                        <Button variant="outline">
                          Change Password
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="modal-mobile-fix">
                        <DialogHeader>
                          <DialogTitle>Change Password</DialogTitle>
                        </DialogHeader>
                        <div className="space-y-4">
                          <div>
                            <Label htmlFor="currentPassword">Current Password</Label>
                            <Input
                              id="currentPassword"
                              type="password"
                              value={passwordData.currentPassword}
                              onChange={(e) => setPasswordData(prev => ({ ...prev, currentPassword: e.target.value }))}
                            />
                          </div>
                          <div>
                            <Label htmlFor="newPassword">New Password</Label>
                            <Input
                              id="newPassword"
                              type="password"
                              value={passwordData.newPassword}
                              onChange={(e) => setPasswordData(prev => ({ ...prev, newPassword: e.target.value }))}
                            />
                          </div>
                          <div>
                            <Label htmlFor="confirmPassword">Confirm New Password</Label>
                            <Input
                              id="confirmPassword"
                              type="password"
                              value={passwordData.confirmPassword}
                              onChange={(e) => setPasswordData(prev => ({ ...prev, confirmPassword: e.target.value }))}
                            />
                          </div>
                          <div className="flex justify-end gap-2">
                            <Button variant="outline" onClick={() => setIsPasswordDialogOpen(false)}>
                              Cancel
                            </Button>
                            <Button onClick={handlePasswordChange}>
                              Change Password
                            </Button>
                          </div>
                        </div>
                      </DialogContent>
                    </Dialog>
                  </div>
                </div>
              </motion.div>
            )}
          </div>
        </div>
      </div>

      {/* Order Details Dialog */}
      <Dialog open={isOrderDetailsOpen} onOpenChange={setIsOrderDetailsOpen}>
        <DialogContent className="max-w-2xl modal-mobile-fix overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="font-serif text-xl">
              Order Details - {selectedOrder?.id}
            </DialogTitle>
          </DialogHeader>
          
          {selectedOrder && (
            <div className="space-y-6">
              {/* Order Info */}
              <div className="grid grid-cols-2 gap-4 p-4 bg-cream rounded">
                <div>
                  <p className="text-sm text-muted-foreground">Order Date</p>
                  <p className="font-medium">{new Date(selectedOrder.createdAt).toLocaleDateString()}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Status</p>
                  <span
                    className={cn(
                      'inline-block px-2.5 py-1 text-xs tracking-wider uppercase rounded-sm',
                      getStatusColor(selectedOrder.status)
                    )}
                  >
                    {selectedOrder.status}
                  </span>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Total Amount</p>
                  <p className="font-medium text-lg">{formatCurrency(selectedOrder.total)}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Payment Method</p>
                  <p className="font-medium">{selectedOrder.paymentMethod}</p>
                </div>
              </div>

              {/* Shipping Address */}
              <div>
                <h3 className="font-medium mb-2">Shipping Address</h3>
                <div className="p-4 border border-border rounded">
                  <p className="font-medium">{selectedOrder.shippingAddress.fullName}</p>
                  <p className="text-sm text-muted-foreground">
                    {selectedOrder.shippingAddress.address}<br />
                    {selectedOrder.shippingAddress.city}, {selectedOrder.shippingAddress.state} {selectedOrder.shippingAddress.zipCode}<br />
                    {selectedOrder.shippingAddress.country}<br />
                    Phone: {selectedOrder.shippingAddress.phone}
                  </p>
                </div>
              </div>

              {/* Order Items */}
              <div>
                <h3 className="font-medium mb-2">Items Ordered</h3>
                <div className="space-y-3">
                  {selectedOrder.items.map((item, index) => (
                    <div key={index} className="flex justify-between items-center p-3 border border-border rounded">
                      <div>
                        <p className="font-medium">{item.productName}</p>
                        <p className="text-sm text-muted-foreground">
                          Size: {item.size} | Quantity: {item.quantity}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="font-medium">{formatCurrency(item.price * item.quantity)}</p>
                        <p className="text-sm text-muted-foreground">{formatCurrency(item.price)} each</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </Layout>
  );
};

export default Account;
