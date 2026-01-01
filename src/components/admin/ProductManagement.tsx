import { useState, useEffect } from 'react';
import { ProductService } from '@/services/productService';
import { Product, Collection } from '@/types/product';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { 
  Plus, 
  Search, 
  Edit, 
  Trash2, 
  Copy, 
  Move, 
  Filter,
  Package,
  Grid,
  List,
  MoreHorizontal
} from 'lucide-react';
import { ProductForm } from './ProductForm';
import { CollectionManager } from './CollectionManager';
import { ProductCard } from './ProductCard';
import { BulkActions } from './BulkActions';
import { formatCurrency } from '@/utils/currency';

export const ProductManagement = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [collections, setCollections] = useState<Collection[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [selectedProducts, setSelectedProducts] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedCollection, setSelectedCollection] = useState<string>('all');
  const [viewMode, setViewMode] = useState<'grid' | 'table'>('grid');
  const [isProductFormOpen, setIsProductFormOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [isCollectionManagerOpen, setIsCollectionManagerOpen] = useState(false);

  useEffect(() => {
    const stored = ProductService.getAllProducts();
    setProducts(stored);
    setCollections(ProductService.getAllCollections());
  }, []);

  useEffect(() => {
    filterProducts();
  }, [products, searchQuery, selectedCategory, selectedCollection]);

  const loadData = () => {
    const stored = ProductService.getAllProducts();
    setProducts(stored);
    setCollections(ProductService.getAllCollections());
  };

  const filterProducts = (productsToFilter?: Product[]) => {
    const productsList = productsToFilter || products;
    let filtered = [...productsList];

    if (searchQuery) {
      filtered = ProductService.searchProducts(searchQuery);
    }

    if (selectedCategory !== 'all') {
      filtered = filtered.filter(p => p.category === selectedCategory);
    }

    if (selectedCollection !== 'all') {
      filtered = filtered.filter(p => p.collection === selectedCollection);
    }

    setFilteredProducts(filtered);
  };

  const handleProductSave = () => {
    setIsProductFormOpen(false);
    setEditingProduct(null);
    loadData();
  };

  const handleProductDelete = (productId: string) => {
    if (confirm('Are you sure you want to delete this product?')) {
      ProductService.deleteProduct(productId);
      loadData();
      setSelectedProducts(prev => prev.filter(id => id !== productId));
    }
  };

  const handleProductDuplicate = (productId: string) => {
    ProductService.duplicateProduct(productId);
    loadData();
  };

  const handleBulkAction = (action: string, data?: any) => {
    switch (action) {
      case 'delete':
        if (confirm(`Delete ${selectedProducts.length} products?`)) {
          ProductService.bulkDelete(selectedProducts);
          setSelectedProducts([]);
          loadData();
        }
        break;
      case 'move':
        if (data?.collectionId) {
          ProductService.bulkMoveToCollection(selectedProducts, data.collectionId);
          setSelectedProducts([]);
          loadData();
        }
        break;
      case 'update':
        if (data?.updates) {
          ProductService.bulkUpdateProducts(selectedProducts, data.updates);
          setSelectedProducts([]);
          loadData();
        }
        break;
    }
  };

  const toggleProductSelection = (productId: string) => {
    setSelectedProducts(prev =>
      prev.includes(productId)
        ? prev.filter(id => id !== productId)
        : [...prev, productId]
    );
  };

  const selectAllProducts = () => {
    setSelectedProducts(
      selectedProducts.length === filteredProducts.length
        ? []
        : filteredProducts.map(p => p.id)
    );
  };

  const stats = ProductService.getProductStats();

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold">Product Management</h2>
          <p className="text-muted-foreground">
            Manage your product catalog and collections
          </p>
        </div>
        <div className="flex gap-2">
          <Button
            onClick={() => setIsCollectionManagerOpen(true)}
            variant="outline"
          >
            <Grid className="h-4 w-4 mr-2" />
            Collections
          </Button>
          <Button onClick={() => setIsProductFormOpen(true)}>
            <Plus className="h-4 w-4 mr-2" />
            Add Product
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold">{stats.total}</div>
            <div className="text-sm text-muted-foreground">Total Products</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-green-600">{stats.inStock}</div>
            <div className="text-sm text-muted-foreground">In Stock</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-red-600">{stats.outOfStock}</div>
            <div className="text-sm text-muted-foreground">Out of Stock</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-blue-600">{stats.newProducts}</div>
            <div className="text-sm text-muted-foreground">New Products</div>
          </CardContent>
        </Card>
      </div>

      {/* Filters and Search */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search products..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <Select value={selectedCategory} onValueChange={setSelectedCategory}>
              <SelectTrigger className="w-40">
                <SelectValue placeholder="Category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                <SelectItem value="Dresses">Dresses</SelectItem>
                <SelectItem value="Tops">Tops</SelectItem>
                <SelectItem value="Blouses">Blouses</SelectItem>
                <SelectItem value="Skirts">Skirts</SelectItem>
                <SelectItem value="Pants">Pants</SelectItem>
                <SelectItem value="Outerwear">Outerwear</SelectItem>
              </SelectContent>
            </Select>
            <Select value={selectedCollection} onValueChange={setSelectedCollection}>
              <SelectTrigger className="w-40">
                <SelectValue placeholder="Collection" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Collections</SelectItem>
                {collections.map(collection => (
                  <SelectItem key={collection.id} value={collection.id}>
                    {collection.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <div className="flex gap-2">
              <Button
                variant={viewMode === 'grid' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setViewMode('grid')}
              >
                <Grid className="h-4 w-4" />
              </Button>
              <Button
                variant={viewMode === 'table' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setViewMode('table')}
              >
                <List className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Bulk Actions */}
      {selectedProducts.length > 0 && (
        <BulkActions
          selectedCount={selectedProducts.length}
          collections={collections}
          onAction={handleBulkAction}
          onClear={() => setSelectedProducts([])}
        />
      )}

      {/* Products Display */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>Products ({filteredProducts.length})</span>
            {viewMode === 'table' && (
              <Button
                variant="outline"
                size="sm"
                onClick={selectAllProducts}
              >
                {selectedProducts.length === filteredProducts.length ? 'Deselect All' : 'Select All'}
              </Button>
            )}
          </CardTitle>
        </CardHeader>
        <CardContent>
          {viewMode === 'grid' ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {filteredProducts.map(product => (
                <ProductCard
                  key={product.id}
                  product={product}
                  isSelected={selectedProducts.includes(product.id)}
                  onSelect={() => toggleProductSelection(product.id)}
                  onEdit={() => {
                    setEditingProduct(product);
                    setIsProductFormOpen(true);
                  }}
                  onDelete={() => handleProductDelete(product.id)}
                  onDuplicate={() => handleProductDuplicate(product.id)}
                />
              ))}
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-12">
                    <input
                      type="checkbox"
                      checked={selectedProducts.length === filteredProducts.length && filteredProducts.length > 0}
                      onChange={selectAllProducts}
                    />
                  </TableHead>
                  <TableHead>Product</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead>Collection</TableHead>
                  <TableHead>Price</TableHead>
                  <TableHead>Stock</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredProducts.map(product => (
                  <TableRow key={product.id}>
                    <TableCell>
                      <input
                        type="checkbox"
                        checked={selectedProducts.includes(product.id)}
                        onChange={() => toggleProductSelection(product.id)}
                      />
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        {(() => {
                          const firstColor = product.colors.length > 0 ? product.colors[0] : '';
                          const firstVariant = product.colorVariants?.find(v => v.color === firstColor);
                          const displayImage = firstVariant?.images?.[0] || product.images[0] || '';
                          const headPos = firstVariant?.headAlignment ?? 20;
                          return (
                            <img
                              src={displayImage}
                              alt={product.name}
                              className="w-10 h-10 object-cover rounded"
                              style={{ objectPosition: `center ${headPos}%` }}
                            />
                          );
                        })()}
                        <div>
                          <div className="font-medium">{product.name}</div>
                          <div className="text-sm text-muted-foreground">
                            ID: {product.id}
                          </div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>{product.category}</TableCell>
                    <TableCell>
                      {collections.find(c => c.id === product.collection)?.name || product.collection}
                    </TableCell>
                    <TableCell>{formatCurrency(product.price)}</TableCell>
                    <TableCell>
                      <Badge variant={product.inStock ? 'default' : 'destructive'}>
                        {product.inStock ? `${product.stockCount} in stock` : 'Out of stock'}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-1">
                        {product.isNew && <Badge variant="secondary">New</Badge>}
                        {product.isBestSeller && <Badge variant="secondary">Best Seller</Badge>}
                        {product.isOnSale && <Badge variant="secondary">On Sale</Badge>}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            setEditingProduct(product);
                            setIsProductFormOpen(true);
                          }}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleProductDuplicate(product.id)}
                        >
                          <Copy className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleProductDelete(product.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}

          {filteredProducts.length === 0 && (
            <div className="text-center py-12">
              <Package className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
              <p className="text-muted-foreground">No products found</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Product Form Dialog */}
      <Dialog open={isProductFormOpen} onOpenChange={setIsProductFormOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {editingProduct ? 'Edit Product' : 'Add New Product'}
            </DialogTitle>
            <DialogDescription>
              {editingProduct 
                ? 'Update product information and specifications'
                : 'Create a new product with images and specifications'
              }
            </DialogDescription>
          </DialogHeader>
          <ProductForm
            product={editingProduct}
            collections={collections}
            onSave={handleProductSave}
            onCancel={() => {
              setIsProductFormOpen(false);
              setEditingProduct(null);
            }}
          />
        </DialogContent>
      </Dialog>

      {/* Collection Manager Dialog */}
      <Dialog open={isCollectionManagerOpen} onOpenChange={setIsCollectionManagerOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Manage Collections</DialogTitle>
            <DialogDescription>
              Create, edit, and organize your product collections
            </DialogDescription>
          </DialogHeader>
          <CollectionManager
            collections={collections}
            onUpdate={loadData}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
};