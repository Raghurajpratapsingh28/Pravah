import React, { useEffect, useState, useCallback } from 'react';
import { useParams } from 'react-router-dom';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { useAuth } from '@/context/AuthContext';
import toast from 'react-hot-toast';
import { Button } from '@/components/ui/button';
import ProductCard from '@/components/ui-custom/ProductCard'; // Assuming you have this
import { useCart } from '@/context/CartContext';

export default function CategoryDetailPage() {
  const { slug } = useParams(); // Get slug from URL
  const [category, setCategory] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const { token } = useAuth();
  const { addItem } = useCart();

  const fetchCategory = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`http://localhost:3000/categories/${slug}`, {
        headers: {
          'Authorization': token ? `Bearer ${token}` : '',
          'Content-Type': 'application/json',
        },
      });
      if (!response.ok) {
        if (response.status === 404) throw new Error('Category not found');
        throw new Error('Failed to fetch category');
      }
      const data = await response.json();
      setCategory(data);
    } catch (err) {
      setError(err.message);
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  }, [slug, token]);

  useEffect(() => {
    fetchCategory();
  }, [fetchCategory]);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <p className="text-red-500 mb-4">{error}</p>
        <Button onClick={fetchCategory}>Retry</Button>
      </div>
    );
  }

  if (!category) {
    return null; // Shouldn't happen due to error state, but added for safety
  }

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      
      <main className="flex-grow pt-24 pb-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Category Header */}
          <div className="mb-10">
            {category.bannerUrl && (
              <img
                src={category.bannerUrl}
                alt={`${category.name} banner`}
                className="w-full h-64 object-cover rounded-lg mb-6"
              />
            )}
            <h1 className="text-3xl font-bold">{category.name}</h1>
            <p className="mt-2 text-muted-foreground">
              {category.description || `Explore ${category.productCount} products in this category`}
            </p>
          </div>

          {/* Products Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {category.products.length > 0 ? (
              category.products.map((product) => (
                <ProductCard
                  key={product.id}
                  product={{
                    ...product,
                    price: Number(product.price) || 0,
                    discount: Number(product.discount) || 0,
                  }}
                  onAddToCart={() => {
                    addItem(product);
                    toast.success(`${product.name} added to cart!`);
                  }}
                />
              ))
            ) : (
              <p className="text-center text-muted-foreground col-span-full">
                No products available in this category.
              </p>
            )}
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
}