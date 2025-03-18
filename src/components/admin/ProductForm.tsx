import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

const ProductForm = ({ product, onSave, onCancel }) => {
  const isNew = !product;
  const [formData, setFormData] = useState(
    product || {
      id: '',
      name: '',
      price: '',
      categoryId: '',
      discount: '0',
      stock: '',
      image: '',
    }
  );

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.name || !formData.price || !formData.categoryId || !formData.stock) {
      alert('Please fill in all required fields.');
      return;
    }
    onSave(formData, isNew);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-lg">
        <h3 className="text-lg font-semibold mb-4">{isNew ? 'Add New Product' : 'Edit Product'}</h3>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="name">Product Name <span className="text-red-500">*</span></Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="Enter product name"
              required
            />
          </div>
          <div>
            <Label htmlFor="price">Price <span className="text-red-500">*</span></Label>
            <Input
              id="price"
              type="number"
              step="0.01"
              value={formData.price}
              onChange={(e) => setFormData({ ...formData, price: e.target.value })}
              placeholder="Enter price (e.g., 99.99)"
              required
            />
          </div>
          <div>
            <Label htmlFor="categoryId">Category ID <span className="text-red-500">*</span></Label>
            <Input
              id="categoryId"
              value={formData.categoryId}
              onChange={(e) => setFormData({ ...formData, categoryId: e.target.value })}
              placeholder="Enter category ID"
              required
            />
          </div>
          <div>
            <Label htmlFor="discount">Discount (%)</Label>
            <Input
              id="discount"
              type="number"
              value={formData.discount}
              onChange={(e) => setFormData({ ...formData, discount: e.target.value })}
              placeholder="Enter discount (e.g., 10)"
            />
          </div>
          <div>
            <Label htmlFor="stock">Stock <span className="text-red-500">*</span></Label>
            <Input
              id="stock"
              type="number"
              value={formData.stock}
              onChange={(e) => setFormData({ ...formData, stock: e.target.value })}
              placeholder="Enter stock quantity"
              required
            />
          </div>
          <div>
            <Label htmlFor="image">Image URL</Label>
            <Input
              id="image"
              value={formData.image}
              onChange={(e) => setFormData({ ...formData, image: e.target.value })}
              placeholder="Enter image URL (optional)"
            />
          </div>
          <div className="flex justify-end gap-2">
            <Button type="submit" className="bg-primary text-white">
              {isNew ? 'Add Product' : 'Save Changes'}
            </Button>
            <Button variant="outline" onClick={onCancel}>
              Cancel
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ProductForm;