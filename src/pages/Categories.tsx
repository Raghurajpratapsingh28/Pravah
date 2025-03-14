
import React from 'react';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { categories } from '@/lib/data';
import CategorySection from '@/components/ui-custom/CategorySection';

export default function CategoriesPage() {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      
      <main className="flex-grow pt-24 pb-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10">
            <h1 className="text-3xl font-bold">Shop by Category</h1>
            <p className="mt-2 text-muted-foreground">Browse our wide selection of products by category</p>
          </div>
          
          <CategorySection categories={categories} />
        </div>
      </main>
      
      <Footer />
    </div>
  );
}
