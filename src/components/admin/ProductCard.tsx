import { Product } from '@/types/product';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Edit, Trash2, Copy, MoreHorizontal, Eye } from 'lucide-react';
import { formatCurrency } from '@/utils/currency';

interface ProductCardProps {
  product: Product;
  isSelected: boolean;
  onSelect: () => void;
  onEdit: () => void;
  onDelete: () => void;
  onDuplicate: () => void;
}

export const ProductCard = ({
  product,
  isSelected,
  onSelect,
  onEdit,
  onDelete,
  onDuplicate
}: ProductCardProps) => {
  return (
    <Card className={`relative transition-all ${isSelected ? 'ring-2 ring-primary' : ''}`}>
      <div className="absolute top-2 left-2 z-10">
        <Checkbox
          checked={isSelected}
          onCheckedChange={onSelect}
          className="bg-background"
        />
      </div>
      
      <div className="absolute top-2 right-2 z-10">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="sm" className="h-8 w-8 p-0 bg-background">
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={onEdit}>
              <Edit className="h-4 w-4 mr-2" />
              Edit
            </DropdownMenuItem>
            <DropdownMenuItem onClick={onDuplicate}>
              <Copy className="h-4 w-4 mr-2" />
              Duplicate
            </DropdownMenuItem>
            <DropdownMenuItem onClick={onDelete} className="text-red-600">
              <Trash2 className="h-4 w-4 mr-2" />
              Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <CardContent className="p-0">
        <div className="aspect-square overflow-hidden">
          {(() => {
            const firstColor = product.colors.length > 0 ? product.colors[0] : '';
            const firstVariant = product.colorVariants?.find(v => v.color === firstColor);
            const displayImage = firstVariant?.images?.[0] || product.images[0] || '';
            const headPos = firstVariant?.headAlignment ?? 20;
            return (
              <img
                src={displayImage}
            alt={product.name}
            className="w-full h-full object-cover transition-transform hover:scale-105"
                style={{ objectPosition: `center ${headPos}%` }}
          />
            );
          })()}
        </div>
        
        <div className="p-4 space-y-2">
          <div className="flex items-start justify-between">
            <h3 className="font-medium text-sm line-clamp-2 flex-1">
              {product.name}
            </h3>
          </div>
          
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="font-bold">{formatCurrency(product.price)}</span>
              {product.originalPrice && product.originalPrice > product.price && (
                <span className="text-sm text-muted-foreground line-through">
                  {formatCurrency(product.originalPrice)}
                </span>
              )}
            </div>
            <Badge variant={product.inStock ? 'default' : 'destructive'} className="text-xs">
              {product.inStock ? `${product.stockCount}` : 'Out'}
            </Badge>
          </div>

          <div className="text-xs text-muted-foreground">
            {product.category} • {product.collection}
          </div>

          <div className="flex flex-wrap gap-1">
            {product.isNew && (
              <Badge variant="secondary" className="text-xs">New</Badge>
            )}
            {product.isBestSeller && (
              <Badge variant="secondary" className="text-xs">Best Seller</Badge>
            )}
            {product.isOnSale && (
              <Badge variant="secondary" className="text-xs">Sale</Badge>
            )}
          </div>

          <div className="text-xs text-muted-foreground">
            {(() => {
              const totalImages = product.colorVariants?.reduce((sum, v) => sum + v.images.length, 0) || product.images.length;
              return `${totalImages} image${totalImages !== 1 ? 's' : ''}`;
            })()}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};