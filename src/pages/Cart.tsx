import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { Button } from '@/components/ui/button';
import { Trash2, Plus, Minus, ArrowRight } from 'lucide-react';
import { useCart } from '@/context/CartContext';
import toast from 'react-hot-toast';

export default function CartPage() {
  const navigate = useNavigate();
  const { items: cartItems, removeItem, updateQuantity } = useCart();
  const [loading, setLoading] = useState(false);

  // Handlers
  const handleRemoveItem = (id) => {
    removeItem(id);
    toast.success('Item removed from cart');
  };

  const handleUpdateQuantity = (id, newQuantity) => {
    if (newQuantity < 1) {
      handleRemoveItem(id);
    } else {
      const item = cartItems.find(item => item.productId === id || item.id === id);
      if (newQuantity > item.stock) {
        toast.error(`Only ${item.stock} items in stock`);
        return;
      }
      updateQuantity(id, newQuantity);
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
  const shipping = cartSubtotal > 50 ? 0 : 5;
  const total = cartSubtotal + tax + shipping;
  const cartTotalItems = cartItems.reduce((sum, item) => sum + item.quantity, 0);

  // Handle Razorpay Checkout
  const handleCheckout = async () => {
    if (cartItems.length === 0) {
      toast.error('Your cart is empty');
      return;
    }

    setLoading(true);
    try {
      // Create order on backend without authentication
      const orderResponse = await fetch(`http://localhost:3000/orders/create`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId: 'guest', // Hardcoded guest user
          items: cartItems.map(item => ({
            productId: item.productId || item.id,
            quantity: item.quantity,
            price: item.discount > 0 ? item.price * (1 - item.discount / 100) : item.price,
          })),
          total: total,
          shippingAddress: {
            street: 'Default Street',
            city: 'Default City',
            state: 'Default State',
            postalCode: '12345',
            country: 'India',
          },
        }),
      });

      if (!orderResponse.ok) {
        const errorData = await orderResponse.json();
        throw new Error(errorData.error || 'Failed to create order');
      }

      const { orderId, amount } = await orderResponse.json();

      // Load Razorpay script
      const script = document.createElement('script');
      script.src = 'https://checkout.razorpay.com/v1/checkout.js';
      script.onload = () => {
        const options = {
          key: 'YOUR_RAZORPAY_KEY_ID', // Replace with your Razorpay Key ID
          amount: amount * 100, // Convert to paise
          currency: 'INR',
          name: 'Your Store Name',
          description: 'Order Payment',
          order_id: orderId,
          handler: async (response) => {
            // Verify payment on backend without authentication
            const verifyResponse = await fetch(`http://localhost:3000/orders/verify`, {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
              }),
            });

            if (verifyResponse.ok) {
              toast.success('Payment successful!');
              // Clear local cart
              cartItems.forEach(item => removeItem(item.productId || item.id));
              navigate('/order-success', { state: { orderId: response.razorpay_order_id } });
            } else {
              toast.error('Payment verification failed');
              navigate('/order-failure');
            }
          },
          prefill: {
            name: 'Guest',
            email: 'guest@example.com',
          },
          theme: { color: '#3399cc' },
        };

        const rzp = new window.Razorpay(options);
        rzp.open();
      };
      script.onerror = () => {
        toast.error('Failed to load Razorpay SDK');
        setLoading(false);
      };
      document.body.appendChild(script);
    } catch (err) {
      toast.error(err.message || 'Payment initiation failed');
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
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
                    key={item.productId || item.id}
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
                            onClick={() => handleUpdateQuantity(item.productId || item.id, item.quantity - 1)}
                            disabled={loading || item.quantity <= 1}
                            aria-label="Decrease quantity"
                          >
                            <Minus size={14} />
                          </Button>
                          <span className="w-8 text-center">{item.quantity}</span>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleUpdateQuantity(item.productId || item.id, item.quantity + 1)}
                            disabled={loading || item.quantity >= item.stock}
                            aria-label="Increase quantity"
                          >
                            <Plus size={14} />
                          </Button>
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleRemoveItem(item.productId || item.id)}
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
                    onClick={handleCheckout}
                    size="lg"
                    className="w-full mt-4 mb-2"
                    disabled={loading || cartItems.length === 0}
                  >
                    Checkout <ArrowRight size={16} className="ml-2" />
                  </Button>
                  <p className="text-xs text-center text-muted-foreground mt-4">
                    Free shipping on orders over $50.
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