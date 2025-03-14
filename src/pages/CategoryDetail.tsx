
import React, { useMemo } from 'react';
import { useParams } from 'react-router-dom';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { products, categories } from '@/lib/data';
import ProductCard from '@/components/ui-custom/ProductCard';
import { useCart } from '@/context/CartContext';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function CategoryDetail() {
  const { categoryId } = useParams<{ categoryId: string }>();
  const { addItem } = useCart();
  const navigate = useNavigate();
  
  const category = useMemo(() => {
    return categories.find(c => c.id === categoryId);
  }, [categoryId]);
  
  const categoryProducts = useMemo(() => {
    return products.filter(product => product.category.toLowerCase() === category?.name.toLowerCase());
  }, [category]);

  if (!category) {
    return (
      <div className="flex flex-col min-h-screen">
        <Navbar />
        <main className="flex-grow pt-24 pb-12">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h1 className="text-3xl font-bold">Category Not Found</h1>
            <p className="mt-4">The category you're looking for doesn't exist.</p>
            <Button 
              onClick={() => navigate('/categories')} 
              className="mt-6"
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Categories
            </Button>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      
      <main className="flex-grow pt-24 pb-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-8">
            <Button 
              variant="outline" 
              onClick={() => navigate('/categories')}
              className="mb-4"
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Categories
            </Button>
            
            <div className="relative h-48 rounded-lg overflow-hidden mb-6">
              <img 
                src={category.image} 
                alt={category.name}
                className="w-full h-full object-cover" 
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent"></div>
              <div className="absolute bottom-0 left-0 right-0 p-6 text-left">
                <h1 className="text-3xl font-bold text-white">{category.name}</h1>
                <p className="text-white/80">{category.productCount} products</p>
              </div>
            </div>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {categoryProducts.length > 0 ? (
              categoryProducts.map((product) => (
                <ProductCard 
                  key={product.id} 
                  product={product} 
                  onAddToCart={() => addItem(product)}
                />
              ))
            ) : (
              <div className="col-span-full text-center py-12">
                <p className="text-lg text-muted-foreground">No products available in this category.</p>
              </div>
            )}
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
}
