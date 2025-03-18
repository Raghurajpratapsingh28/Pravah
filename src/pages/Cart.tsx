import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { Button } from '@/components/ui/button';
import { Trash2, Plus, Minus, ArrowRight } from 'lucide-react';
import { useCart } from '@/context/CartContext';
import { useToast } from '@/hooks/use-toast';

export default function CartPage() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const {
    items: cartItems,
    totalItems,
    subtotal,
    isLoading,
    error,
    updateQuantity,
    removeItem,
    clearCart,
  } = useCart();

  React.useEffect(() => {
    if (error && (error.includes('expired') || error.includes('not authenticated'))) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      navigate('/login');
      toast({
        title: 'Session Expired',
        description: 'Please log in to view your cart',
        variant: 'destructive',
      });
    }
  }, [error, navigate, toast]);

  const handleRemoveItem = (productId: string) => {
    removeItem(productId);
  };

  const handleUpdateQuantity = (productId: string, newQuantity: number) => {
    updateQuantity(productId, newQuantity);
  };

  const handleClearCart = async () => {
    try {
      await clearCart();
    } catch (err) {
      console.error('Clear cart error:', err);
    }
  };

  const taxRate = 0.1; // 10% tax
  const tax = subtotal * taxRate;
  const shipping = subtotal > 50 ? 0 : 5;
  const total = subtotal + tax + shipping;

  if (isLoading) {
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
        <Button onClick={() => window.location.reload()}>Retry</Button>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-grow pt-24 pb-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-2xl font-bold mb-8">Shopping Cart</h1>

          {cartItems.length > 0 ? (
            <div className="grid md:grid-cols-3 gap-8">
              {/* Cart Items */}
              <div className="md:col-span-2 space-y-4">
                {cartItems.map((item) => (
                  <div
                    key={item.productId}
                    className="flex items-center border border-border rounded-lg p-4 bg-background hover:shadow-md transition-shadow"
                  >
                    <div className="w-20 h-20 rounded-md overflow-hidden flex-shrink-0 bg-secondary/30">
                      <img
                        src={item.imageUrl || '/placeholder.jpg'}
                        alt={item.name}
                        className="w-full h-full object-cover"
                        onError={(e) => (e.currentTarget.src = '/placeholder.jpg')}
                      />
                    </div>
                    <div className="ml-4 flex-grow">
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="font-medium text-foreground">{item.name}</h3>
                          <p className="text-sm text-muted-foreground">
                            {item.category?.name || 'Uncategorized'}
                          </p>
                          {item.stock < 5 && (
                            <p className="text-xs text-red-500">Only {item.stock} left in stock</p>
                          )}
                        </div>
                        <div className="text-right">
                          {item.discount > 0 ? (
                            <>
                              <p className="font-semibold">
                                ${(item.price * (1 - item.discount / 100)).toFixed(2)}
                              </p>
                              <p className="text-sm text-muted-foreground line-through">
                                ${item.price.toFixed(2)}
                              </p>
                            </>
                          ) : (
                            <p className="font-semibold">${item.price.toFixed(2)}</p>
                          )}
                        </div>
                      </div>
                      <div className="flex justify-between items-center mt-2">
                        <div className="flex items-center border border-input rounded-md">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleUpdateQuantity(item.productId, item.quantity - 1)}
                            disabled={isLoading || item.quantity <= 1}
                            aria-label="Decrease quantity"
                          >
                            <Minus size={14} />
                          </Button>
                          <span className="w-8 text-center">{item.quantity}</span>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleUpdateQuantity(item.productId, item.quantity + 1)}
                            disabled={isLoading || item.quantity >= item.stock}
                            aria-label="Increase quantity"
                          >
                            <Plus size={14} />
                          </Button>
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleRemoveItem(item.productId)}
                          disabled={isLoading}
                          aria-label="Remove item"
                          className="text-muted-foreground hover:text-destructive"
                        >
                          <Trash2 size={18} />
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
                <Button
                  variant="outline"
                  onClick={handleClearCart}
                  disabled={isLoading}
                  className="mt-4"
                >
                  Clear Cart
                </Button>
              </div>

              {/* Order Summary */}
              <div className="md:col-span-1">
                <div className="bg-background border border-border rounded-lg p-6 sticky top-24">
                  <h2 className="text-lg font-semibold mb-4">Order Summary</h2>
                  <div className="space-y-2 mb-4">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Subtotal ({totalItems} items)</span>
                      <span>${subtotal.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Shipping</span>
                      <span>{shipping === 0 ? 'Free' : '$5.00'}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Tax (10%)</span>
                      <span>${tax.toFixed(2)}</span>
                    </div>
                  </div>
                  <div className="border-t border-border my-4 pt-4">
                    <div className="flex justify-between font-semibold">
                      <span>Total</span>
                      <span>${total.toFixed(2)}</span>
                    </div>
                  </div>
                  <Button
                    className="w-full mt-4 mb-2"
                    size="lg"
                    asChild
                    disabled={isLoading || cartItems.length === 0}
                  >
                    <Link to="/checkout">
                      Checkout <ArrowRight size={16} className="ml-2" />
                    </Link>
                  </Button>
                  <p className="text-xs text-center text-muted-foreground mt-4">
                    Free shipping on orders over $50. Final totals calculated at checkout.
                  </p>
                </div>
              </div>
            </div>
          ) : (
            <div className="text-center py-12 border border-border rounded-lg bg-background">
              <h2 className="text-xl font-semibold mb-2">Your cart is empty</h2>
              <p className="text-muted-foreground mb-6">
                Looks like you haven’t added any products yet.
              </p>
              <Link to="/products">
                <Button>Start Shopping</Button>
              </Link>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
}