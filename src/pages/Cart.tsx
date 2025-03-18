import React, { useEffect, useState, useCallback } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { Button } from '@/components/ui/button';
import { Trash2, Plus, Minus, ArrowRight } from 'lucide-react';
import toast from 'react-hot-toast';

export default function CartPage() {
  const navigate = useNavigate();
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Fetch cart from backend
  const fetchCart = useCallback(async () => {
    const token = localStorage.getItem('token');
    const user = JSON.parse(localStorage.getItem('user') || 'null');

    if (!token || !user || !user.id) {
      setError('Please log in to view your cart');
      navigate('/login');
      toast.error('Please log in');
      return;
    }

    setLoading(true);
    setError(null);
    try {
      console.log('Fetching cart for user:', user.id, 'with token:', token.substring(0, 10) + '...');
      const response = await fetch(`http://localhost:3000/cart/${user.id}`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      const responseText = await response.text(); // Get raw response for debugging
      console.log('Cart response status:', response.status, 'body:', responseText);

      if (!response.ok) {
        let errorData;
        try {
          errorData = JSON.parse(responseText);
        } catch {
          errorData = { error: 'Unknown error' };
        }
        if (response.status === 401) throw new Error('Session expired or invalid token');
        throw new Error(errorData.error || `Failed to fetch cart (Status: ${response.status})`);
      }

      const data = JSON.parse(responseText);
      console.log('Cart data received:', data);

      const syncedItems = data.items.map(item => ({
        ...item.product,
        productId: item.productId,
        quantity: item.quantity,
      }));
      setCartItems(syncedItems);
    } catch (err) {
      setError(err.message);
      toast.error(err.message);
      console.error('Fetch cart error:', err);
      if (err.message.includes('expired') || err.message.includes('invalid token')) {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        navigate('/login');
      }
    } finally {
      setLoading(false);
    }
  }, [navigate]);

  // Sync cart changes with backend
  const syncCartWithBackend = useCallback(async (productId, action, quantity) => {
    const token = localStorage.getItem('token');
    const user = JSON.parse(localStorage.getItem('user') || 'null');

    if (!token || !user || !user.id) return;

    setLoading(true);
    try {
      console.log(`Syncing cart - Action: ${action}, Product ID: ${productId}, Quantity: ${quantity}`);
      let response;
      if (action === 'remove') {
        response = await fetch(`http://localhost:3000/cart/${user.id}`, {
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ productId }),
        });
      } else if (action === 'update') {
        const product = cartItems.find(item => item.productId === productId);
        if (quantity > product.stock) {
          toast.error(`Only ${product.stock} items in stock`);
          setLoading(false);
          return;
        }
        response = await fetch(`http://localhost:3000/cart/${user.id}`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ productId, quantity }),
        });
      }

      const responseText = await response.text();
      console.log(`${action} response status:`, response.status, 'body:', responseText);

      if (!response.ok) {
        const errorData = JSON.parse(responseText);
        throw new Error(errorData.error || `Failed to ${action} item (Status: ${response.status})`);
      }

      await fetchCart(); // Refresh cart after update
      toast.success(action === 'remove' ? 'Item removed' : 'Quantity updated');
    } catch (err) {
      toast.error(`Failed to ${action} item: ${err.message}`);
      console.error(`Sync error (${action}):`, err);
    } finally {
      setLoading(false);
    }
  }, [cartItems, fetchCart]);

  useEffect(() => {
    fetchCart();
  }, [fetchCart]);

  // Handlers
  const handleRemoveItem = (id) => {
    syncCartWithBackend(id, 'remove');
  };

  const handleUpdateQuantity = (id, newQuantity) => {
    if (newQuantity < 1) {
      handleRemoveItem(id);
    } else {
      syncCartWithBackend(id, 'update', newQuantity);
    }
  };

  // Calculate totals
  const calculateItemPrice = (item) => {
    const price = item.discount > 0
      ? Number(item.price) * (1 - item.discount / 100)
      : Number(item.price);
    return price * item.quantity;
  };

  const cartSubtotal = cartItems.reduce((sum, item) => sum + calculateItemPrice(item), 0);
  const taxRate = 0.1; // 10% tax
  const tax = cartSubtotal * taxRate;
  const cartTotalItems = cartItems.reduce((sum, item) => sum + item.quantity, 0);

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
        <Button onClick={fetchCart}>Retry</Button>
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
                                ${(calculateItemPrice(item) / item.quantity).toFixed(2)}
                              </p>
                              <p className="text-sm text-muted-foreground line-through">
                                ${Number(item.price).toFixed(2)}
                              </p>
                            </>
                          ) : (
                            <p className="font-semibold">${Number(item.price).toFixed(2)}</p>
                          )}
                        </div>
                      </div>
                      <div className="flex justify-between items-center mt-2">
                        <div className="flex items-center border border-input rounded-md">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleUpdateQuantity(item.productId, item.quantity - 1)}
                            disabled={loading || item.quantity <= 1}
                            aria-label="Decrease quantity"
                          >
                            <Minus size={14} />
                          </Button>
                          <span className="w-8 text-center">{item.quantity}</span>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleUpdateQuantity(item.productId, item.quantity + 1)}
                            disabled={loading || item.quantity >= item.stock}
                            aria-label="Increase quantity"
                          >
                            <Plus size={14} />
                          </Button>
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleRemoveItem(item.productId)}
                          disabled={loading}
                          aria-label="Remove item"
                          className="text-muted-foreground hover:text-destructive"
                        >
                          <Trash2 size={18} />
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              {/* Order Summary */}
              <div className="md:col-span-1">
                <div className="bg-background border border-border rounded-lg p-6 sticky top-24">
                  <h2 className="text-lg font-semibold mb-4">Order Summary</h2>
                  <div className="space-y-2 mb-4">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Subtotal ({cartTotalItems} items)</span>
                      <span>${cartSubtotal.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Shipping</span>
                      <span>{cartSubtotal > 50 ? 'Free' : '$5.00'}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Tax (10%)</span>
                      <span>${tax.toFixed(2)}</span>
                    </div>
                  </div>
                  <div className="border-t border-border my-4 pt-4">
                    <div className="flex justify-between font-semibold">
                      <span>Total</span>
                      <span>
                        ${(cartSubtotal + tax + (cartSubtotal > 50 ? 0 : 5)).toFixed(2)}
                      </span>
                    </div>
                  </div>
                  <Button className="w-full mt-4 mb-2" size="lg" asChild disabled={loading}>
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
              <p className="text-muted-foreground mb-6">Looks like you haven't added any products yet.</p>
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