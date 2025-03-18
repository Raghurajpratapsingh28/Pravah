import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { PlusCircle, Pencil, Trash } from 'lucide-react';
import ProductForm from './ProductForm';
import { useToast } from '@/hooks/use-toast';

export default function AdminProductList() {
  const [productList, setProductList] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  // Fetch admin's products from backend
  const fetchProducts = async () => {
    setIsLoading(true);
    const token = localStorage.getItem('token');
    try {
      const response = await fetch('http://localhost:3000/admin/products', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to fetch products');
      }
      const data = await response.json();
      // Log raw data to debug
      console.log('Fetched products:', data);
      // Ensure price is a number
      const normalizedData = data.map(product => ({
        ...product,
        price: Number(product.price), // Convert price to number
        discount: Number(product.discount) || 0, // Ensure discount is a number
        stock: Number(product.stock), // Ensure stock is a number
      }));
      setProductList(normalizedData);
    } catch (err) {
      console.error('Fetch products failed:', err.message);
      toast({
        variant: 'destructive',
        title: 'Error',
        description: err.message,
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleAddNew = () => {
    setEditingProduct(null);
    setIsModalOpen(true);
  };

  const handleEdit = (product) => {
    setEditingProduct({
      id: product.id,
      name: product.name,
      price: product.price.toString(), // Convert back to string for form input
      categoryId: product.categoryId,
      discount: product.discount.toString(),
      stock: product.stock.toString(),
      image: product.imageUrl,
    });
    setIsModalOpen(true);
  };

  const handleDelete = async (productId) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      setIsLoading(true);
      const token = localStorage.getItem('token');
      try {
        const response = await fetch('http://localhost:3000/admin/products', {
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ id: productId }),
        });
        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || 'Failed to delete product');
        }
        setProductList(productList.filter((product) => product.id !== productId));
        toast({
          title: 'Product Deleted',
          description: 'The product has been successfully removed.',
        });
      } catch (err) {
        toast({
          variant: 'destructive',
          title: 'Error',
          description: err.message,
        });
      } finally {
        setIsLoading(false);
      }
    }
  };

  const handleSave = async (product, isNew) => {
    setIsLoading(true);
    const token = localStorage.getItem('token');
    const productData = {
      name: product.name,
      price: parseFloat(product.price),
      categoryId: product.categoryId,
      discount: parseInt(product.discount, 10) || 0,
      stock: parseInt(product.stock, 10),
      imageUrl: product.image || 'default-image.jpg',
    };

    try {
      let response;
      if (isNew) {
        response = await fetch('http://localhost:3000/admin/products', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(productData),
        });
      } else {
        response = await fetch(`http://localhost:3000/admin/products/${product.id}`, {
          method: 'PUT',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(productData),
        });
      }

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || `Failed to ${isNew ? 'add' : 'update'} product`);
      }

      const updatedProduct = await response.json();
      const normalizedProduct = {
        ...updatedProduct,
        price: Number(updatedProduct.price),
        discount: Number(updatedProduct.discount) || 0,
        stock: Number(updatedProduct.stock),
      };
      if (isNew) {
        setProductList([...productList, normalizedProduct]);
        toast({
          title: 'Product Added',
          description: 'The new product is now available.',
        });
      } else {
        setProductList(productList.map((p) => (p.id === product.id ? normalizedProduct : p)));
        toast({
          title: 'Product Updated',
          description: 'The product has been successfully updated.',
        });
      }
      setIsModalOpen(false);
    } catch (err) {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: err.message,
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-900">Your Products</h2>
        <Button onClick={handleAddNew} disabled={isLoading} className="flex items-center gap-2">
          <PlusCircle className="h-4 w-4" />
          Add New Product
        </Button>
      </div>

      <div className="rounded-md border bg-white shadow-sm">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[80px]">Image</TableHead>
              <TableHead className="w-[200px]">Product Name</TableHead>
              <TableHead>Category</TableHead>
              <TableHead>Price</TableHead>
              <TableHead>Discount</TableHead>
              <TableHead>Stock</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center py-4 text-gray-500">
                  Loading your products...
                </TableCell>
              </TableRow>
            ) : productList.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center py-4 text-gray-500">
                  No products found. Add one to get started!
                </TableCell>
              </TableRow>
            ) : (
              productList.map((product) => (
                <TableRow key={product.id}>
                  <TableCell>
                    <img
                      src={product.imageUrl || 'default-image.jpg'}
                      alt={product.name}
                      className="w-12 h-12 object-cover rounded-md"
                    />
                  </TableCell>
                  <TableCell className="font-medium">{product.name}</TableCell>
                  <TableCell>{product.category?.name || 'Uncategorized'}</TableCell>
                  <TableCell>${Number(product.price).toFixed(2)}</TableCell> {/* Ensure number */}
                  <TableCell>{product.discount}%</TableCell>
                  <TableCell>{product.stock}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleEdit(product)}
                        disabled={isLoading}
                      >
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleDelete(product.id)}
                        disabled={isLoading}
                      >
                        <Trash className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {isModalOpen && (
        <ProductForm
          product={editingProduct}
          onSave={handleSave}
          onCancel={() => setIsModalOpen(false)}
        />
      )}
    </div>
  );
}