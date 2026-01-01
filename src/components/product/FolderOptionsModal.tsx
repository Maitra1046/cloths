import { useState } from 'react';
import { Minus, Plus, Check } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { useCart } from '@/context/CartContext';
import { cn } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';
import { useViewportHeight } from '@/hooks/useViewportHeight';
import { ImageFolder } from '@/data/imageFolders';
import { formatCurrency } from '@/utils/currency';

interface FolderOptionsModalProps {
  folder: ImageFolder | null;
  isOpen: boolean;
  onClose: () => void;
}

interface CustomMeasurements {
  bust: string;
  waist: string;
  hip: string;
  shoulder: string;
  sleeve: string;
  length: string;
}



export const FolderOptionsModal = ({ folder, isOpen, onClose }: FolderOptionsModalProps) => {
  const { addToCart } = useCart();
  const { toast } = useToast();
  useViewportHeight(); // Handle mobile viewport height issues
  const [quantity, setQuantity] = useState(1);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [customMeasurements, setCustomMeasurements] = useState<CustomMeasurements>({
    bust: '',
    waist: '',
    hip: '',
    shoulder: '',
    sleeve: '',
    length: '',
  });

  const handleMeasurementChange = (field: keyof CustomMeasurements, value: string) => {
    const sanitized = value.replace(/[^0-9.]/g, '');
    setCustomMeasurements((prev) => ({ ...prev, [field]: sanitized }));
  };

  const handleAddToCart = () => {
    if (!folder) return;

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
      folder.images[selectedImageIndex],
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

    // Reset form
    setQuantity(1);
    setSelectedImageIndex(0);
    setCustomMeasurements({
      bust: '',
      waist: '',
      hip: '',
      shoulder: '',
      sleeve: '',
      length: '',
    });

    onClose();
  };

  if (!folder) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl w-[98vw] sm:w-[95vw] max-h-[95vh] modal-mobile-fix p-0">
        <div className="flex flex-col h-full max-h-[90vh] p-4 sm:p-6">
          {/* Header */}
          <DialogHeader className="flex-shrink-0 pb-4">
            <DialogTitle className="font-serif text-xl sm:text-2xl lg:text-3xl">{folder.name}</DialogTitle>
            <p className="text-lg sm:text-xl font-medium text-foreground">{formatCurrency(folder.price)}</p>
          </DialogHeader>

          {/* Scrollable Content */}
          <div className="flex-1 overflow-y-auto space-y-4">
            {/* Image Gallery */}
            <div className="space-y-3">
              {/* Main Image */}
              <div className="aspect-[3/4] max-h-[70vh] sm:max-h-[60vh] lg:max-h-[55vh] xl:max-h-[60vh] overflow-hidden bg-cream w-full mx-auto">
                <img
                  src={folder.images[selectedImageIndex]}
                  alt={folder.name}
                  className="w-full h-full object-cover"
                />
              </div>
              
              {/* Thumbnail Gallery */}
              {folder.images.length > 1 && (
                <div className="flex gap-2 overflow-x-auto pb-2">
                  {folder.images.map((image, index) => (
                    <button
                      key={index}
                      onClick={() => setSelectedImageIndex(index)}
                      className={cn(
                        "flex-shrink-0 w-16 h-20 overflow-hidden border-2 transition-colors",
                        selectedImageIndex === index 
                          ? "border-primary" 
                          : "border-border hover:border-primary"
                      )}
                    >
                      <img
                        src={image}
                        alt={`${folder.name} view ${index + 1}`}
                        className="w-full h-full object-cover"
                      />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Custom Measurements */}
            <div className="space-y-3">
              <div className="flex items-center justify-between mb-4">
                <span className="text-base font-medium text-foreground">Custom Measurements</span>
                <button className="text-sm text-muted-foreground hover:text-foreground underline">
                  Size Guide
                </button>
              </div>

              <div className="space-y-4">
                <p className="text-sm text-muted-foreground">
                  Enter your measurements in inches for a perfect fit.
                </p>
                <div className="grid grid-cols-2 gap-3">
                  {[
                    { key: 'bust', label: 'Bust', placeholder: '36' },
                    { key: 'waist', label: 'Waist', placeholder: '28' },
                    { key: 'hip', label: 'Hip', placeholder: '38' },
                    { key: 'shoulder', label: 'Shoulder Width', placeholder: '15' },
                    { key: 'sleeve', label: 'Sleeve Length', placeholder: '24' },
                    { key: 'length', label: 'Dress Length', placeholder: '45' },
                  ].map((field) => (
                    <div key={field.key}>
                      <label className="text-xs text-muted-foreground block mb-1">
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
                          className="w-full px-3 py-2 bg-background border border-border text-sm focus:outline-none focus:ring-1 focus:ring-primary"
                        />
                        <span className="absolute right-2 top-1/2 -translate-y-1/2 text-xs text-muted-foreground">
                          in
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Quantity */}
            <div className="flex items-center gap-4">
              <span className="text-sm font-medium text-foreground">Quantity</span>
              <div className="flex items-center border border-border">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="p-2 hover:bg-secondary transition-colors"
                >
                  <Minus size={16} />
                </button>
                <span className="w-12 text-center text-sm">{quantity}</span>
                <button
                  onClick={() => setQuantity(quantity + 1)}
                  className="p-2 hover:bg-secondary transition-colors"
                >
                  <Plus size={16} />
                </button>
              </div>
            </div>

            {/* Trust Notes */}
            <div className="space-y-2 pt-3 border-t border-border pb-3">
              {[
                { icon: Check, text: 'Made specially for you' },
                { icon: Check, text: 'Free shipping on orders over ₹250' },
                { icon: Check, text: 'Custom items are final sale' },
              ].map((item, index) => (
                <div key={index} className="flex items-center gap-2">
                  <item.icon size={16} className="text-taupe" />
                  <span className="text-xs text-muted-foreground">{item.text}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Add to Cart Button - Always visible at bottom */}
          <div className="flex-shrink-0 pt-4 mt-4 border-t border-border bg-background">
            <button
              onClick={handleAddToCart}
              className="w-full py-4 bg-primary text-primary-foreground text-sm tracking-wider hover:bg-brown/90 transition-all duration-300 font-medium"
            >
              Add to Cart
            </button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};