import { useState, useEffect } from 'react';
import Navbar from '@/components/layout/Navbar';
import Hero from '@/components/ui-custom/Hero';
import FeaturedProducts from '@/components/sections/FeaturedProducts';
import CategoryGrid from '@/components/sections/CategoryGrid';
import Footer from '@/components/layout/Footer';
import { useCart } from '@/context/CartContext';
import { useAuth } from '@/context/AuthContext';
import toast from 'react-hot-toast';

const Index = () => {
  const { addItem } = useCart();
  const { token } = useAuth();
  const [categories, setCategories] = useState([]);
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    window.scrollTo(0, 0);

    const fetchData = async () => {
      setLoading(true);
      setError(null);
      try {
        const catResponse = await fetch('http://localhost:3000/categories', {
          headers: { 'Authorization': token ? `Bearer ${token}` : '' },
        });
        if (!catResponse.ok) throw new Error('Failed to fetch categories');
        const catData = await catResponse.json();
        setCategories(catData);

        const prodResponse = await fetch('http://localhost:3000/products/featured', {
          headers: { 'Authorization': token ? `Bearer ${token}` : '' },
        });
        if (!prodResponse.ok) throw new Error('Failed to fetch featured products');
        const prodData = await prodResponse.json();
        setFeaturedProducts(prodData);
      } catch (err) {
        setError(err.message);
        toast.error('Failed to load data');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [token]);

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
        <button onClick={() => window.location.reload()} className="px-4 py-2 bg-primary text-white rounded-md">
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <main>
        <Hero />
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <FeaturedProducts
            title="Featured Products"
            subtitle="Discover our handpicked selection of premium items."
            products={featuredProducts}
            onAddToCart={addItem}
          />
          
          <CategoryGrid
            title="Shop By Category"
            subtitle="Explore our curated collections of premium products."
            categories={categories}
          />
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default Index;