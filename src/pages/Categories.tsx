import React, { useEffect, useState, useCallback } from 'react';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import CategorySection from '@/components/ui-custom/CategorySection';
import { useAuth } from '@/context/AuthContext';
import toast from 'react-hot-toast';
import { Button } from '@/components/ui/button';

export default function CategoriesPage() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [filter, setFilter] = useState('all'); // 'all' or 'featured'
  const { token } = useAuth();

  const fetchCategories = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const url = filter === 'featured'
        ? 'http://localhost:3000/categories?featured=true'
        : 'http://localhost:3000/categories';
      const response = await fetch(url, {
        headers: {
          'Authorization': token ? `Bearer ${token}` : '',
          'Content-Type': 'application/json',
        },
      });
      if (!response.ok) throw new Error('Failed to fetch categories');
      const data = await response.json();
      setCategories(data);
    } catch (err) {
      setError(err.message);
      toast.error('Failed to load categories');
    } finally {
      setLoading(false);
    }
  }, [token, filter]);

  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

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
        <Button onClick={fetchCategories}>Retry</Button>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      
      <main className="flex-grow pt-24 pb-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10">
            <h1 className="text-3xl font-bold">Shop by Category</h1>
            <p className="mt-2 text-muted-foreground">Browse our wide selection of products by category</p>
            <div className="mt-4 flex justify-center gap-4">
              <Button
                variant={filter === 'all' ? 'default' : 'outline'}
                onClick={() => setFilter('all')}
              >
                All Categories
              </Button>
              <Button
                variant={filter === 'featured' ? 'default' : 'outline'}
                onClick={() => setFilter('featured')}
              >
                Featured Categories
              </Button>
            </div>
          </div>
          
          <CategorySection categories={categories} />
        </div>
      </main>
      
      <Footer />
    </div>
  );
}