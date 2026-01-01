import { useState, useEffect } from 'react';
import { ColorVariant, Product, ProductFormData, Collection, CATEGORIES, SIZES, MATERIALS } from '@/types/product';
import { ProductService } from '@/services/productService';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { X, Upload, Plus, Trash2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface ProductFormProps {
  product?: Product | null;
  collections: Collection[];
  onSave: () => void;
  onCancel: () => void;
}

export const ProductForm = ({ product, collections, onSave, onCancel }: ProductFormProps) => {
  const { toast } = useToast();
  const [formData, setFormData] = useState<ProductFormData>({
    name: '',
    price: 1234,
    originalPrice: 0,
    description: 'A beautifully crafted piece designed with attention to detail and premium quality materials. Perfect for any occasion.',
    category: 'Dresses',
    collection: '',
    sizes: ['S', 'M', 'L'],
    colors: ['Ivory'],
    materials: ['Silk'],
    care: ['Dry clean only', 'Store on padded hanger'],
    features: ['Premium quality', 'Handcrafted', 'Made to order'],
    isNew: false,
    isBestSeller: false,
    isOnSale: false,
    inStock: true,
    stockCount: 10,
    colorVariants: [{
      color: 'Ivory',
      images: [],
      stockCount: 10,
      inStock: true,
      headAlignment: 20
    }],
    serialNumber: undefined
  });

  const [priceInput, setPriceInput] = useState<string>('1234');
  const [originalPriceInput, setOriginalPriceInput] = useState<string>('');

  const [activeColorTab, setActiveColorTab] = useState<string>('');
  const [newColor, setNewColor] = useState('');
  const [newCareInstruction, setNewCareInstruction] = useState('');
  const [newFeature, setNewFeature] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (product) {
      const variants = product.colorVariants || [];
      setPriceInput(product.price.toString());
      setOriginalPriceInput(product.originalPrice ? product.originalPrice.toString() : '');
      if (product.images && product.images.length > 0 && variants.length === 0) {
        const defaultVariant: ColorVariant = {
          color: product.colors[0] || 'Default',
          images: product.images,
          stockCount: product.stockCount,
          inStock: product.inStock,
          headAlignment: 20
        };
        setFormData({
          name: product.name,
          price: product.price,
          originalPrice: product.originalPrice || 0,
          description: product.description,
          category: product.category,
          collection: product.collection,
          sizes: product.sizes,
          colors: product.colors.length > 0 ? product.colors : ['Default'],
          materials: product.materials,
          care: product.care,
          features: product.features,
          isNew: product.isNew || false,
          isBestSeller: product.isBestSeller || false,
          isOnSale: product.isOnSale || false,
          inStock: product.inStock,
          stockCount: product.stockCount,
          colorVariants: [defaultVariant],
          serialNumber: product.serialNumber
        });
      } else {
        setFormData({
          name: product.name,
          price: product.price,
          originalPrice: product.originalPrice || 0,
          description: product.description,
          category: product.category,
          collection: product.collection,
          sizes: product.sizes,
          colors: product.colors,
          materials: product.materials,
          care: product.care,
          features: product.features,
          isNew: product.isNew || false,
          isBestSeller: product.isBestSeller || false,
          isOnSale: product.isOnSale || false,
          inStock: product.inStock,
          stockCount: product.stockCount,
          colorVariants: variants,
          serialNumber: product.serialNumber
        });
      }
      if (product.colors.length > 0) {
        setActiveColorTab(product.colors[0]);
      } else if (variants.length > 0) {
        setActiveColorTab(variants[0].color);
      }
    } else {
      setPriceInput('1234');
      setOriginalPriceInput('');
      if (formData.colors.length > 0 && (!formData.colorVariants || formData.colorVariants.length === 0)) {
        const defaultVariant: ColorVariant = {
          color: formData.colors[0],
          images: [],
          stockCount: formData.stockCount,
          inStock: formData.inStock,
          headAlignment: 20
        };
        setFormData(prev => ({
          ...prev,
          colorVariants: [defaultVariant]
        }));
      }
      if (formData.colors.length > 0) {
        setActiveColorTab(formData.colors[0]);
      }
    }
  }, [product]);

  const handleVariantChange = (color: string, field: keyof ColorVariant, value: any) => {
    setFormData(prev => {
      const variants = [...(prev.colorVariants || [])];
      const index = variants.findIndex(v => v.color === color);
      
      if (index !== -1) {
        variants[index] = { ...variants[index], [field]: value };
      } else {
        // Create new variant if it doesn't exist
        const newVariant: ColorVariant = {
          color,
          images: [],
          stockCount: 0,
          inStock: true,
          headAlignment: 20,
          [field]: value
        };
        variants.push(newVariant);
      }
      
      return { ...prev, colorVariants: variants };
    });
  };

  const handleVariantImageAdd = (color: string, url: string) => {
    const variants = [...(formData.colorVariants || [])];
    const index = variants.findIndex(v => v.color === color);
    
    if (index !== -1) {
      if (!variants[index].images.includes(url)) {
        variants[index].images.push(url);
        handleInputChange('colorVariants', variants);
      }
    } else {
      const newVariant: ColorVariant = {
        color,
        images: [url],
        stockCount: 0,
        inStock: true,
        headAlignment: 20
      };
      handleInputChange('colorVariants', [...variants, newVariant]);
    }
  };

  const handleInputChange = (field: keyof ProductFormData, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const handleArrayAdd = (field: 'sizes' | 'colors' | 'materials' | 'care' | 'features', value: string) => {
    if (value && !formData[field].includes(value)) {
      setFormData(prev => ({
        ...prev,
        [field]: [...prev[field], value]
      }));
    }
  };

  const handleArrayRemove = (field: 'sizes' | 'colors' | 'materials' | 'care' | 'features', value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: prev[field].filter(item => item !== value)
    }));
  };


  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.name || !formData.name.trim()) {
      newErrors.name = 'Product name is required';
    }
    if (!formData.price || formData.price <= 0) {
      newErrors.price = 'Price must be greater than 0';
    }
    if (!formData.description || !formData.description.trim()) {
      newErrors.description = 'Description is required';
    }
    
    if (!formData.collection || !formData.collection.trim()) {
      if (collections && collections.length > 0) {
        newErrors.collection = 'Collection is required';
      }
    }
    
    const hasVariantImages = formData.colorVariants?.some(v => v.images && v.images.length > 0);
    if (!hasVariantImages) {
      console.warn('No images provided, but allowing product creation for demo');
    }
    
    if (formData.stockCount < 0) {
      newErrors.stockCount = 'Stock count cannot be negative';
    }
    if (!formData.sizes || formData.sizes.length === 0) {
      newErrors.sizes = 'At least one size must be selected';
    }
    if (!formData.colors || formData.colors.length === 0) {
      newErrors.colors = 'At least one color must be added';
    }
    if (!formData.materials || formData.materials.length === 0) {
      newErrors.materials = 'At least one material must be selected';
    }

    if (formData.originalPrice > 0 && formData.originalPrice <= formData.price) {
      newErrors.originalPrice = 'Original price must be higher than current price';
    }

    setErrors(newErrors);
    const isValid = Object.keys(newErrors).length === 0;
    
    if (!isValid) {
      console.error('Validation errors:', newErrors);
      console.error('Current form data:', {
        name: formData.name,
        price: formData.price,
        description: formData.description?.substring(0, 50),
        collection: formData.collection,
        sizes: formData.sizes,
        colors: formData.colors,
        materials: formData.materials,
        stockCount: formData.stockCount
      });
    }
    
    return isValid;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    let productData = { ...formData };
    if (!productData.collection || !productData.collection.trim()) {
      productData.collection = collections && collections.length > 0 ? collections[0].id : 'uncategorized';
      setFormData(productData);
    }
    
    const isValid = validateForm();
    
    if (!isValid) {
      const errorFields = Object.keys(errors);
      if (errorFields.length > 0) {
        const errorMessages = errorFields.map(field => {
          const fieldName = field.charAt(0).toUpperCase() + field.slice(1).replace(/([A-Z])/g, ' $1');
          return `${fieldName}: ${errors[field]}`;
        }).join(', ');
        toast({
          title: 'Validation Error',
          description: `Please fix: ${errorMessages}`,
          variant: 'destructive',
        });
      } else {
        toast({
          title: 'Validation Error',
          description: 'Please fix the errors in the form before submitting.',
          variant: 'destructive',
        });
      }
      return;
    }

    try {
      
      const defaultImages = productData.colorVariants?.[0]?.images || [];
      console.log('Creating product with data:', { 
        name: productData.name,
        price: productData.price,
        collection: productData.collection,
        category: productData.category,
        colorVariantsCount: productData.colorVariants?.length || 0,
        imagesCount: defaultImages.length
      });
      
      if (product) {
        console.log('Updating existing product:', product.id);
        const updated = ProductService.updateProduct(product.id, productData, defaultImages);
        if (updated) {
          toast({
            title: 'Product Updated',
            description: `${formData.name} has been updated successfully.`,
          });
          onSave();
        } else {
          throw new Error('Failed to update product');
        }
      } else {
        console.log('Creating new product...');
        const newProduct = ProductService.createProduct(productData, defaultImages);
        console.log('Product created successfully:', newProduct.id, newProduct.name);
        
        const verify = ProductService.getProductById(newProduct.id);
        if (verify) {
          console.log('Product verified immediately:', verify.name);
        } else {
          console.warn('Product not found immediately after creation, will retry...');
        }
        
        toast({
          title: 'Product Created',
          description: `${formData.name} has been created successfully.`,
        });
        
        onSave();
      }
    } catch (error) {
      console.error('Error saving product:', error);
      const errorMessage = error instanceof Error ? error.message : 'Failed to save product. Please try again.';
      console.error('Error message:', errorMessage);
      
      if (errorMessage.includes('quota') || errorMessage.includes('QuotaExceededError')) {
        toast({
          title: 'Storage Full',
          description: 'LocalStorage is full. Please clear old products using the "Clear Storage" button.',
          variant: 'destructive',
        });
      } else {
        toast({
          title: 'Error',
          description: errorMessage,
          variant: 'destructive',
        });
      }
    }
  };

  return (
      <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6 overflow-x-hidden">
      <Tabs defaultValue="basic" className="w-full">
        <TabsList className="grid w-full grid-cols-2 sm:grid-cols-4 gap-1 sm:gap-0 h-auto">
          <TabsTrigger value="basic" className="text-xs sm:text-sm px-2 sm:px-4 py-2 sm:py-1.5">Basic Info</TabsTrigger>
          <TabsTrigger value="variants" className="text-xs sm:text-sm px-2 sm:px-4 py-2 sm:py-1.5">Variants</TabsTrigger>
          <TabsTrigger value="details" className="text-xs sm:text-sm px-2 sm:px-4 py-2 sm:py-1.5">Details</TabsTrigger>
          <TabsTrigger value="inventory" className="text-xs sm:text-sm px-2 sm:px-4 py-2 sm:py-1.5">Inventory</TabsTrigger>
        </TabsList>

        <TabsContent value="basic" className="space-y-4 mt-4 sm:mt-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name">Product Name *</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => handleInputChange('name', e.target.value)}
                placeholder="Enter product name"
              />
              {errors.name && <p className="text-sm text-red-500">{errors.name}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="category">Category *</Label>
              <Select value={formData.category} onValueChange={(value) => handleInputChange('category', value)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {CATEGORIES.map(category => (
                    <SelectItem key={category} value={category}>{category}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="collection">Collection *</Label>
              <Select value={formData.collection} onValueChange={(value) => handleInputChange('collection', value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select collection" />
                </SelectTrigger>
                <SelectContent>
                  {collections.map(collection => (
                    <SelectItem key={collection.id} value={collection.id}>
                      {collection.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.collection && <p className="text-sm text-red-500">{errors.collection}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="price">Price *</Label>
              <Input
                id="price"
                type="text"
                inputMode="decimal"
                value={priceInput}
                onChange={(e) => {
                  const value = e.target.value;
                  setPriceInput(value);
                  const numValue = parseFloat(value);
                  if (!isNaN(numValue) && numValue >= 0) {
                    handleInputChange('price', numValue);
                  }
                }}
                onBlur={(e) => {
                  const numValue = parseFloat(e.target.value);
                  if (isNaN(numValue) || numValue < 0) {
                    setPriceInput('1234');
                    handleInputChange('price', 1234);
                  } else {
                    setPriceInput(numValue.toString());
                  }
                }}
                placeholder="1234.22"
                className="touch-manipulation min-h-[44px]"
              />
              {errors.price && <p className="text-sm text-red-500">{errors.price}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="originalPrice">Original Price (if on sale)</Label>
              <Input
                id="originalPrice"
                type="text"
                inputMode="decimal"
                value={originalPriceInput}
                onChange={(e) => {
                  const value = e.target.value;
                  setOriginalPriceInput(value);
                  const numValue = parseFloat(value);
                  if (!isNaN(numValue) && numValue >= 0) {
                    handleInputChange('originalPrice', numValue);
                  } else if (value === '') {
                    handleInputChange('originalPrice', 0);
                  }
                }}
                onBlur={(e) => {
                  const numValue = parseFloat(e.target.value);
                  if (e.target.value === '') {
                    setOriginalPriceInput('');
                    handleInputChange('originalPrice', 0);
                  } else if (isNaN(numValue) || numValue < 0) {
                    setOriginalPriceInput('');
                    handleInputChange('originalPrice', 0);
                  } else {
                    setOriginalPriceInput(numValue.toString());
                  }
                }}
                placeholder="0.00"
                className="touch-manipulation min-h-[44px]"
              />
              {errors.originalPrice && <p className="text-sm text-red-500">{errors.originalPrice}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="serialNumber">Display Order</Label>
              <Input
                id="serialNumber"
                type="number"
                value={formData.serialNumber ?? ''}
                onChange={(e) => handleInputChange('serialNumber', e.target.value ? parseInt(e.target.value) : undefined)}
                placeholder="Leave empty for default order"
                className="touch-manipulation min-h-[44px]"
              />
              <p className="text-xs text-muted-foreground">Lower numbers appear first. Products without a number appear last.</p>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description *</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => handleInputChange('description', e.target.value)}
              placeholder="Enter product description"
              rows={4}
              className="min-h-[100px] sm:min-h-[120px] touch-manipulation"
            />
            {errors.description && <p className="text-sm text-red-500">{errors.description}</p>}
          </div>

          <div className="flex flex-wrap gap-3 sm:gap-4">
            <div className="flex items-center space-x-2">
              <Checkbox
                id="isNew"
                checked={formData.isNew}
                onCheckedChange={(checked) => handleInputChange('isNew', checked)}
              />
              <Label htmlFor="isNew">New Product</Label>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox
                id="isBestSeller"
                checked={formData.isBestSeller}
                onCheckedChange={(checked) => handleInputChange('isBestSeller', checked)}
              />
              <Label htmlFor="isBestSeller">Best Seller</Label>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox
                id="isOnSale"
                checked={formData.isOnSale}
                onCheckedChange={(checked) => handleInputChange('isOnSale', checked)}
              />
              <Label htmlFor="isOnSale">On Sale</Label>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="variants" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Color-Specific Assets & Settings</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex gap-2 mb-4">
                <Input
                  placeholder="Add new color"
                  value={newColor}
                  onChange={(e) => setNewColor(e.target.value)}
                />
                <Button 
                  type="button" 
                  onClick={() => {
                    if (newColor && !formData.colors.includes(newColor)) {
                      handleArrayAdd('colors', newColor);
                      setActiveColorTab(newColor);
                      setNewColor('');
                    }
                  }}
                >
                  Add Color
                </Button>
              </div>

              {formData.colors.length > 0 ? (
                <Tabs value={activeColorTab} onValueChange={setActiveColorTab}>
                  <TabsList className="flex flex-wrap h-auto">
                    {formData.colors.map(color => (
                      <TabsTrigger key={color} value={color}>{color}</TabsTrigger>
                    ))}
                  </TabsList>

                  {formData.colors.map(color => {
                    const variant = formData.colorVariants?.find(v => v.color === color) || {
                      color,
                      images: [],
                      stockCount: 0,
                      inStock: true,
                      headAlignment: 20
                    };

                    return (
                      <TabsContent key={color} value={color} className="space-y-4 sm:space-y-6 pt-4">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label>Stock Count for {color}</Label>
                            <Input 
                              type="number" 
                              value={variant.stockCount} 
                              onChange={(e) => handleVariantChange(color, 'stockCount', parseInt(e.target.value) || 0)}
                              className="touch-manipulation min-h-[44px]"
                            />
                          </div>
                          <div className="space-y-2">
                            <Label>Head Position Alignment (%)</Label>
                            <Input 
                              type="number" 
                              min="0" 
                              max="100" 
                              value={variant.headAlignment || 20} 
                              onChange={(e) => handleVariantChange(color, 'headAlignment', parseInt(e.target.value) || 0)}
                              className="touch-manipulation min-h-[44px]"
                            />
                            <p className="text-xs text-muted-foreground">Alignment from top for all images of this color</p>
                          </div>
                        </div>

                        <div className="space-y-2">
                          <Label>Upload Images for {color}</Label>
                          <div 
                            className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-4 text-center hover:border-primary/50 cursor-pointer"
                            onClick={() => document.getElementById(`file-upload-${color}`)?.click()}
                          >
                            <Upload className="h-6 w-6 mx-auto mb-2 text-muted-foreground" />
                            <p className="text-sm">Click to upload color-specific images</p>
                            <input
                              id={`file-upload-${color}`}
                              type="file"
                              multiple
                              className="hidden"
                              onChange={(e) => {
                                const files = Array.from(e.target.files || []);
                                files.forEach(file => {
                                  const reader = new FileReader();
                                  reader.onload = (ev) => handleVariantImageAdd(color, ev.target?.result as string);
                                  reader.readAsDataURL(file);
                                });
                              }}
                            />
                          </div>
                        </div>

                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                          {variant.images.map((img, i) => (
                            <div key={i} className="relative aspect-square border rounded overflow-hidden group">
                              <img 
                                src={img} 
                                className="w-full h-full object-cover" 
                                style={{ objectPosition: `center ${variant.headAlignment || 20}%` }}
                              />
                              <Button
                                size="icon"
                                variant="destructive"
                                className="absolute top-1 right-1 h-8 w-8 sm:h-6 sm:w-6 opacity-100 sm:opacity-0 sm:group-hover:opacity-100 touch-manipulation"
                                onClick={() => {
                                  const newImgs = variant.images.filter((_, idx) => idx !== i);
                                  handleVariantChange(color, 'images', newImgs);
                                }}
                              >
                                <X className="h-4 w-4 sm:h-3 sm:w-3" />
                              </Button>
                            </div>
                          ))}
                        </div>
                        
                        <Button 
                          variant="destructive" 
                          size="sm"
                          onClick={() => {
                            handleArrayRemove('colors', color);
                            const newVariants = formData.colorVariants?.filter(v => v.color !== color) || [];
                            handleInputChange('colorVariants', newVariants);
                            if (formData.colors.length > 1) {
                              setActiveColorTab(formData.colors[0] === color ? formData.colors[1] : formData.colors[0]);
                            }
                          }}
                        >
                          Remove Color {color}
                        </Button>
                      </TabsContent>
                    );
                  })}
                </Tabs>
              ) : (
                <div className="text-center py-8 text-muted-foreground italic">
                  Add colors to configure variant images and stock.
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="details" className="space-y-4">
          {/* Sizes */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Available Sizes</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2 mb-4">
                {SIZES.map(size => (
                  <Button
                    key={size}
                    type="button"
                    variant={formData.sizes.includes(size) ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => {
                      if (formData.sizes.includes(size)) {
                        handleArrayRemove('sizes', size);
                      } else {
                        handleArrayAdd('sizes', size);
                      }
                    }}
                  >
                    {size}
                  </Button>
                ))}
              </div>
              {errors.sizes && <p className="text-sm text-red-500">{errors.sizes}</p>}
            </CardContent>
          </Card>

          {/* Colors */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Available Colors</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex gap-2 mb-4">
                <Input
                  placeholder="Add color"
                  value={newColor}
                  onChange={(e) => setNewColor(e.target.value)}
                  onKeyPress={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      handleArrayAdd('colors', newColor);
                      setNewColor('');
                    }
                  }}
                />
                <Button
                  type="button"
                  onClick={() => {
                    handleArrayAdd('colors', newColor);
                    setNewColor('');
                  }}
                >
                  Add
                </Button>
              </div>
              <div className="flex flex-wrap gap-2">
                {formData.colors.map(color => (
                  <Badge key={color} variant="secondary" className="flex items-center gap-1">
                    {color}
                    <X
                      className="h-3 w-3 cursor-pointer"
                      onClick={() => handleArrayRemove('colors', color)}
                    />
                  </Badge>
                ))}
              </div>
              {errors.colors && <p className="text-sm text-red-500">{errors.colors}</p>}
            </CardContent>
          </Card>

          {/* Materials */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Materials</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2 mb-4">
                {MATERIALS.map(material => (
                  <Button
                    key={material}
                    type="button"
                    variant={formData.materials.includes(material) ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => {
                      if (formData.materials.includes(material)) {
                        handleArrayRemove('materials', material);
                      } else {
                        handleArrayAdd('materials', material);
                      }
                    }}
                  >
                    {material}
                  </Button>
                ))}
              </div>
              {errors.materials && <p className="text-sm text-red-500">{errors.materials}</p>}
            </CardContent>
          </Card>

          {/* Care Instructions */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Care Instructions</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex gap-2 mb-4">
                <Input
                  placeholder="Add care instruction"
                  value={newCareInstruction}
                  onChange={(e) => setNewCareInstruction(e.target.value)}
                  onKeyPress={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      handleArrayAdd('care', newCareInstruction);
                      setNewCareInstruction('');
                    }
                  }}
                />
                <Button
                  type="button"
                  onClick={() => {
                    handleArrayAdd('care', newCareInstruction);
                    setNewCareInstruction('');
                  }}
                >
                  Add
                </Button>
              </div>
              <div className="space-y-2">
                {formData.care.map(instruction => (
                  <div key={instruction} className="flex items-center justify-between p-2 bg-muted rounded">
                    <span>{instruction}</span>
                    <X
                      className="h-4 w-4 cursor-pointer"
                      onClick={() => handleArrayRemove('care', instruction)}
                    />
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Features */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Features</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex gap-2 mb-4">
                <Input
                  placeholder="Add feature"
                  value={newFeature}
                  onChange={(e) => setNewFeature(e.target.value)}
                  onKeyPress={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      handleArrayAdd('features', newFeature);
                      setNewFeature('');
                    }
                  }}
                />
                <Button
                  type="button"
                  onClick={() => {
                    handleArrayAdd('features', newFeature);
                    setNewFeature('');
                  }}
                >
                  Add
                </Button>
              </div>
              <div className="space-y-2">
                {formData.features.map(feature => (
                  <div key={feature} className="flex items-center justify-between p-2 bg-muted rounded">
                    <span>{feature}</span>
                    <X
                      className="h-4 w-4 cursor-pointer"
                      onClick={() => handleArrayRemove('features', feature)}
                    />
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="inventory" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="stockCount">Stock Count *</Label>
              <Input
                id="stockCount"
                type="number"
                value={formData.stockCount}
                onChange={(e) => handleInputChange('stockCount', parseInt(e.target.value) || 0)}
                placeholder="0"
              />
              {errors.stockCount && <p className="text-sm text-red-500">{errors.stockCount}</p>}
            </div>

            <div className="flex items-center space-x-2">
              <Checkbox
                id="inStock"
                checked={formData.inStock}
                onCheckedChange={(checked) => handleInputChange('inStock', checked)}
              />
              <Label htmlFor="inStock">In Stock</Label>
            </div>
          </div>
        </TabsContent>
      </Tabs>

      <div className="flex flex-col sm:flex-row justify-end gap-3 sm:gap-2 pt-4 border-t">
        <Button type="button" variant="outline" onClick={onCancel} className="w-full sm:w-auto touch-manipulation min-h-[44px]">
          Cancel
        </Button>
        <Button type="submit" className="w-full sm:w-auto touch-manipulation min-h-[44px]">
          {product ? 'Update Product' : 'Create Product'}
        </Button>
      </div>
    </form>
  );
};