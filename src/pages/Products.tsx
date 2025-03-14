
import React from 'react';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { Button } from '@/components/ui/button';
import { products } from '@/lib/data';
import ProductCard from '@/components/ui-custom/ProductCard';
import { useCart } from '@/context/CartContext';

export default function ProductsPage() {
  const { addItem } = useCart();

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      
      <main className="flex-grow pt-24 pb-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col lg:flex-row gap-8">
            {/* Filters Sidebar */}
            <aside className="w-full lg:w-64 space-y-6">
              <div className="bg-background border border-border rounded-lg p-4">
                <h3 className="text-lg font-semibold mb-3">Categories</h3>
                <div className="space-y-2">
                  <Button variant="ghost" className="justify-start w-full">All Products</Button>
                  <Button variant="ghost" className="justify-start w-full">Electronics</Button>
                  <Button variant="ghost" className="justify-start w-full">Clothing</Button>
                  <Button variant="ghost" className="justify-start w-full">Home & Kitchen</Button>
                  <Button variant="ghost" className="justify-start w-full">Beauty</Button>
                </div>
              </div>
              
              <div className="bg-background border border-border rounded-lg p-4">
                <h3 className="text-lg font-semibold mb-3">Price Range</h3>
                <div className="space-y-2">
                  <Button variant="ghost" className="justify-start w-full">Under $50</Button>
                  <Button variant="ghost" className="justify-start w-full">$50 - $100</Button>
                  <Button variant="ghost" className="justify-start w-full">$100 - $200</Button>
                  <Button variant="ghost" className="justify-start w-full">$200 and Above</Button>
                </div>
              </div>
            </aside>
            
            {/* Products Grid */}
            <div className="flex-1">
              <div className="flex items-center justify-between mb-6">
                <h1 className="text-2xl font-bold">All Products</h1>
                <div className="flex items-center space-x-2">
                  <span className="text-sm text-muted-foreground">Sort by:</span>
                  <select className="text-sm border border-input rounded-md px-2 py-1">
                    <option>Latest</option>
                    <option>Price: Low to High</option>
                    <option>Price: High to Low</option>
                    <option>Most Popular</option>
                  </select>
                </div>
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {products.map((product) => (
                  <ProductCard 
                    key={product.id} 
                    product={product} 
                    onAddToCart={() => addItem(product)}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
}
