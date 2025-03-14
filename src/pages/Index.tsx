
import { useState, useEffect } from 'react';
import Navbar from '@/components/layout/Navbar';
import Hero from '@/components/ui-custom/Hero';
import FeaturedProducts from '@/components/sections/FeaturedProducts';
import CategoryGrid from '@/components/sections/CategoryGrid';
import Footer from '@/components/layout/Footer';
import { categories, getFeaturedProducts } from '@/lib/data';
import { useCart } from '@/context/CartContext';

const Index = () => {
  const { addItem } = useCart();
  const featuredProducts = getFeaturedProducts();
  
  useEffect(() => {
    // Scroll to top on page load
    window.scrollTo(0, 0);
  }, []);

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
