
import React from 'react';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { useWishlist } from '@/context/WishlistContext';
import { useCart } from '@/context/CartContext';
import ProductCard from '@/components/ui-custom/ProductCard';
import { Button } from '@/components/ui/button';
import { ShoppingCart, Trash2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function WishlistPage() {
  const { items, removeItem, clearWishlist, totalItems } = useWishlist();
  const { addItem } = useCart();
  const navigate = useNavigate();

  const handleAddAllToCart = () => {
    items.forEach(item => {
      addItem(item);
    });
    navigate('/cart');
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      
      <main className="flex-grow pt-24 pb-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10">
            <div>
              <h1 className="text-3xl font-bold">My Wishlist</h1>
              <p className="mt-2 text-muted-foreground">
                {totalItems} {totalItems === 1 ? 'item' : 'items'} saved for later
              </p>
            </div>
            
            {totalItems > 0 && (
              <div className="flex flex-wrap gap-3 mt-4 md:mt-0">
                <Button 
                  variant="outline" 
                  onClick={clearWishlist}
                  className="flex items-center gap-2"
                >
                  <Trash2 size={16} />
                  Clear Wishlist
                </Button>
                <Button 
                  onClick={handleAddAllToCart}
                  className="flex items-center gap-2"
                >
                  <ShoppingCart size={16} />
                  Add All to Cart
                </Button>
              </div>
            )}
          </div>
          
          {totalItems > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {items.map((product) => (
                <ProductCard 
                  key={product.id} 
                  product={product} 
                  onAddToCart={() => addItem(product)}
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-16 bg-secondary/30 rounded-lg">
              <h2 className="text-2xl font-medium mb-2">Your wishlist is empty</h2>
              <p className="text-muted-foreground mb-6">Items added to your wishlist will appear here</p>
              <Button onClick={() => navigate('/products')}>
                Browse Products
              </Button>
            </div>
          )}
        </div>
      </main>
      
      <Footer />
    </div>
  );
}
