
import React from 'react';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { products } from '@/lib/data';
import ProductCard from '@/components/ui-custom/ProductCard';
import { useCart } from '@/context/CartContext';

export default function DealsPage() {
  const { addItem } = useCart();
  
  // Filter products with a discount
  const discountedProducts = products.filter(product => product.discount > 0);

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      
      <main className="flex-grow pt-24 pb-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10">
            <h1 className="text-3xl font-bold">Special Deals & Offers</h1>
            <p className="mt-2 text-muted-foreground">Limited time offers on premium products</p>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {discountedProducts.map((product) => (
              <ProductCard 
                key={product.id} 
                product={product} 
                onAddToCart={() => addItem(product)}
              />
            ))}
          </div>
          
          {discountedProducts.length === 0 && (
            <div className="text-center py-12">
              <p className="text-lg text-muted-foreground">No deals available at the moment. Check back soon!</p>
            </div>
          )}
        </div>
      </main>
      
      <Footer />
    </div>
  );
}
