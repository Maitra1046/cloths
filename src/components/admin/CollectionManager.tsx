import { useState } from 'react';
import { Collection } from '@/types/product';
import { ProductService } from '@/services/productService';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Plus, Edit, Trash2, Grid } from 'lucide-react';

interface CollectionManagerProps {
  collections: Collection[];
  onUpdate: () => void;
}

export const CollectionManager = ({ collections, onUpdate }: CollectionManagerProps) => {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingCollection, setEditingCollection] = useState<Collection | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    image: ''
  });

  const resetForm = () => {
    setFormData({ name: '', description: '', image: '' });
    setEditingCollection(null);
  };

  const handleEdit = (collection: Collection) => {
    setEditingCollection(collection);
    setFormData({
      name: collection.name,
      description: collection.description,
      image: collection.image || ''
    });
    setIsFormOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name.trim()) return;

    try {
      if (editingCollection) {
        ProductService.updateCollection(
          editingCollection.id,
          formData.name,
          formData.description,
          formData.image || undefined
        );
      } else {
        ProductService.createCollection(
          formData.name,
          formData.description,
          formData.image || undefined
        );
      }
      
      onUpdate();
      setIsFormOpen(false);
      resetForm();
    } catch (error) {
      console.error('Error saving collection:', error);
    }
  };

  const handleDelete = (collection: Collection) => {
    if (confirm(`Delete collection "${collection.name}"? Products in this collection will be moved to uncategorized.`)) {
      ProductService.deleteCollection(collection.id);
      onUpdate();
    }
  };

  const getProductCount = (collectionId: string) => {
    return ProductService.getProductsByCollection(collectionId).length;
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold">Collections ({collections.length})</h3>
        <Button onClick={() => setIsFormOpen(true)}>
          <Plus className="h-4 w-4 mr-2" />
          New Collection
        </Button>
      </div>

      <div className="grid gap-4 max-h-96 overflow-y-auto">
        {collections.map(collection => (
          <Card key={collection.id}>
            <CardContent className="p-4">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <h4 className="font-medium">{collection.name}</h4>
                    <span className="text-sm text-muted-foreground">
                      ({getProductCount(collection.id)} products)
                    </span>
                  </div>
                  <p className="text-sm text-muted-foreground mb-2">
                    {collection.description}
                  </p>
                  <div className="text-xs text-muted-foreground">
                    Created: {new Date(collection.createdAt).toLocaleDateString()}
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleEdit(collection)}
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleDelete(collection)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Collection Form Dialog */}
      <Dialog open={isFormOpen} onOpenChange={(open) => {
        setIsFormOpen(open);
        if (!open) resetForm();
      }}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {editingCollection ? 'Edit Collection' : 'Create New Collection'}
            </DialogTitle>
            <DialogDescription>
              {editingCollection 
                ? 'Update collection information'
                : 'Create a new collection to organize your products'
              }
            </DialogDescription>
          </DialogHeader>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="collectionName">Collection Name *</Label>
              <Input
                id="collectionName"
                value={formData.name}
                onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                placeholder="Enter collection name"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="collectionDescription">Description</Label>
              <Textarea
                id="collectionDescription"
                value={formData.description}
                onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                placeholder="Enter collection description"
                rows={3}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="collectionImage">Collection Image URL</Label>
              <Input
                id="collectionImage"
                value={formData.image}
                onChange={(e) => setFormData(prev => ({ ...prev, image: e.target.value }))}
                placeholder="Enter image URL (optional)"
              />
            </div>

            <div className="flex justify-end gap-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  setIsFormOpen(false);
                  resetForm();
                }}
              >
                Cancel
              </Button>
              <Button type="submit">
                {editingCollection ? 'Update' : 'Create'} Collection
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
};