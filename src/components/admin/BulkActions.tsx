import { useState } from 'react';
import { Collection } from '@/types/product';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Trash2, Move, Edit, X } from 'lucide-react';

interface BulkActionsProps {
  selectedCount: number;
  collections: Collection[];
  onAction: (action: string, data?: any) => void;
  onClear: () => void;
}

export const BulkActions = ({ selectedCount, collections, onAction, onClear }: BulkActionsProps) => {
  const [isMoveDialogOpen, setIsMoveDialogOpen] = useState(false);
  const [isUpdateDialogOpen, setIsUpdateDialogOpen] = useState(false);
  const [selectedCollection, setSelectedCollection] = useState('');
  const [bulkUpdates, setBulkUpdates] = useState({
    isNew: false,
    isBestSeller: false,
    isOnSale: false,
    inStock: true
  });

  const handleMove = () => {
    if (selectedCollection) {
      onAction('move', { collectionId: selectedCollection });
      setIsMoveDialogOpen(false);
      setSelectedCollection('');
    }
  };

  const handleBulkUpdate = () => {
    onAction('update', { updates: bulkUpdates });
    setIsUpdateDialogOpen(false);
  };

  return (
    <Card className="border-primary/20 bg-primary/5">
      <CardContent className="p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <span className="font-medium">
              {selectedCount} product{selectedCount !== 1 ? 's' : ''} selected
            </span>
            <Button variant="outline" size="sm" onClick={onClear}>
              <X className="h-4 w-4 mr-2" />
              Clear
            </Button>
          </div>
          
          <div className="flex gap-2">
            <Dialog open={isMoveDialogOpen} onOpenChange={setIsMoveDialogOpen}>
              <DialogTrigger asChild>
                <Button variant="outline" size="sm">
                  <Move className="h-4 w-4 mr-2" />
                  Move to Collection
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Move Products to Collection</DialogTitle>
                  <DialogDescription>
                    Move {selectedCount} selected product{selectedCount !== 1 ? 's' : ''} to a different collection
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label>Select Collection</Label>
                    <Select value={selectedCollection} onValueChange={setSelectedCollection}>
                      <SelectTrigger>
                        <SelectValue placeholder="Choose collection" />
                      </SelectTrigger>
                      <SelectContent>
                        {collections.map(collection => (
                          <SelectItem key={collection.id} value={collection.id}>
                            {collection.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="flex justify-end gap-2">
                    <Button variant="outline" onClick={() => setIsMoveDialogOpen(false)}>
                      Cancel
                    </Button>
                    <Button onClick={handleMove} disabled={!selectedCollection}>
                      Move Products
                    </Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>

            <Dialog open={isUpdateDialogOpen} onOpenChange={setIsUpdateDialogOpen}>
              <DialogTrigger asChild>
                <Button variant="outline" size="sm">
                  <Edit className="h-4 w-4 mr-2" />
                  Bulk Update
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Bulk Update Products</DialogTitle>
                  <DialogDescription>
                    Update properties for {selectedCount} selected product{selectedCount !== 1 ? 's' : ''}
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-4">
                  <div className="space-y-3">
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="bulkNew"
                        checked={bulkUpdates.isNew}
                        onCheckedChange={(checked) => 
                          setBulkUpdates(prev => ({ ...prev, isNew: !!checked }))
                        }
                      />
                      <Label htmlFor="bulkNew">Mark as New</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="bulkBestSeller"
                        checked={bulkUpdates.isBestSeller}
                        onCheckedChange={(checked) => 
                          setBulkUpdates(prev => ({ ...prev, isBestSeller: !!checked }))
                        }
                      />
                      <Label htmlFor="bulkBestSeller">Mark as Best Seller</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="bulkOnSale"
                        checked={bulkUpdates.isOnSale}
                        onCheckedChange={(checked) => 
                          setBulkUpdates(prev => ({ ...prev, isOnSale: !!checked }))
                        }
                      />
                      <Label htmlFor="bulkOnSale">Mark as On Sale</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="bulkInStock"
                        checked={bulkUpdates.inStock}
                        onCheckedChange={(checked) => 
                          setBulkUpdates(prev => ({ ...prev, inStock: !!checked }))
                        }
                      />
                      <Label htmlFor="bulkInStock">Mark as In Stock</Label>
                    </div>
                  </div>
                  <div className="flex justify-end gap-2">
                    <Button variant="outline" onClick={() => setIsUpdateDialogOpen(false)}>
                      Cancel
                    </Button>
                    <Button onClick={handleBulkUpdate}>
                      Update Products
                    </Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>

            <Button
              variant="destructive"
              size="sm"
              onClick={() => onAction('delete')}
            >
              <Trash2 className="h-4 w-4 mr-2" />
              Delete Selected
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};