import React, { useEffect, useState, useCallback } from 'react';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import ProductCard from '@/components/ui-custom/ProductCard';
import { useCart } from '@/context/CartContext';
import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

export default function DealsPage() {
  const { addItem } = useCart();
  const { token } = useAuth();
  const { toast } = useToast();
  const [discountedProducts, setDiscountedProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Fetch discounted products from backend
  const fetchDeals = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch('http://localhost:3000/deals', {
        headers: {
          'Authorization': token ? `Bearer ${token}` : '',
          'Content-Type': 'application/json',
        },
      });
      if (!response.ok) throw new Error('Failed to fetch deals');
      const data = await response.json();
      setDiscountedProducts(data);
    } catch (err) {
      setError(err.message);
      toast({ title: 'Error', description: 'Failed to load deals', variant: 'destructive' });
    } finally {
      setLoading(false);
    }
  }, [token, toast]);

  useEffect(() => {
    fetchDeals();
  }, [fetchDeals]);

  const handleAddToCart = (product) => {
    addItem(product);
    // Toast is handled in ProductCard, no need to duplicate here
  };

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
        <Button onClick={fetchDeals}>Retry</Button>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      
      <main className="flex-grow pt-24 pb-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10">
            <h1 className="text-3xl font-bold">Special Deals & Offers</h1>
            <p className="mt-2 text-muted-foreground">Limited time offers on premium products</p>
          </div>
          
          <motion.div
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            {discountedProducts.map((product) => (
              <motion.div
                key={product.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
              >
                <ProductCard
                  product={{
                    id: product.id,
                    name: product.name,
                    description: product.description,
                    price: Number(product.price),
                    discount: Number(product.discount),
                    imageUrl: product.imageUrl || '/placeholder.jpg',
                    stock: product.stock,
                    rating: product.rating || 0,
                    reviewCount: product.reviewCount || 0,
                    category: product.category?.name || 'Uncategorized', // Pass as string
                  }}
                  onAddToCart={handleAddToCart}
                />
              </motion.div>
            ))}
          </motion.div>
          
          {discountedProducts.length === 0 && (
            <div className="text-center py-12">
              <p className="text-lg text-muted-foreground">No deals available at the moment. Check back soon!</p>
              <Button variant="outline" className="mt-4" asChild>
                <Link to="/products">Browse All Products</Link>
              </Button>
            </div>
          )}
        </div>
      </main>
      
      <Footer />
    </div>
  );
}