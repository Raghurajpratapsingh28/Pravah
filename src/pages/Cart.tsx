
import React from 'react';
import { Link } from 'react-router-dom';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { Button } from '@/components/ui/button';
import { Trash2, Plus, Minus, ArrowRight } from 'lucide-react';
import { useCart } from '@/context/CartContext';

export default function CartPage() {
  const { items, removeItem, updateQuantity, subtotal, totalItems } = useCart();

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      
      <main className="flex-grow pt-24 pb-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-2xl font-bold mb-8">Shopping Cart</h1>
          
          {items.length > 0 ? (
            <div className="grid md:grid-cols-3 gap-8">
              {/* Cart Items */}
              <div className="md:col-span-2 space-y-4">
                {items.map((item) => (
                  <div key={item.id} className="flex items-center border border-border rounded-lg p-4 bg-background">
                    {/* Product Image */}
                    <div className="w-20 h-20 rounded-md overflow-hidden flex-shrink-0 bg-secondary/30">
                      <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                    </div>
                    
                    {/* Product Details */}
                    <div className="ml-4 flex-grow">
                      <div className="flex justify-between">
                        <div>
                          <h3 className="font-medium text-foreground">{item.name}</h3>
                          <p className="text-sm text-muted-foreground">{item.category}</p>
                        </div>
                        <div className="text-right">
                          {item.discount > 0 ? (
                            <>
                              <p className="font-semibold">${(item.price * (1 - item.discount / 100)).toFixed(2)}</p>
                              <p className="text-sm text-muted-foreground line-through">${item.price.toFixed(2)}</p>
                            </>
                          ) : (
                            <p className="font-semibold">${item.price.toFixed(2)}</p>
                          )}
                        </div>
                      </div>
                      
                      {/* Quantity Controls */}
                      <div className="flex justify-between items-center mt-2">
                        <div className="flex items-center border border-input rounded-md">
                          <button 
                            onClick={() => updateQuantity(item.id, item.quantity - 1)}
                            className="w-8 h-8 flex items-center justify-center text-muted-foreground hover:text-foreground"
                            aria-label="Decrease quantity"
                          >
                            <Minus size={14} />
                          </button>
                          <span className="w-8 text-center">{item.quantity}</span>
                          <button
                            onClick={() => updateQuantity(item.id, item.quantity + 1)}
                            className="w-8 h-8 flex items-center justify-center text-muted-foreground hover:text-foreground"
                            aria-label="Increase quantity"
                          >
                            <Plus size={14} />
                          </button>
                        </div>
                        
                        <button
                          onClick={() => removeItem(item.id)}
                          className="text-muted-foreground hover:text-destructive transition-colors"
                          aria-label="Remove item"
                        >
                          <Trash2 size={18} />
                        </button>
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
                      <span className="text-muted-foreground">Subtotal ({totalItems} items)</span>
                      <span>${subtotal.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Shipping</span>
                      <span>Free</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Tax</span>
                      <span>${(subtotal * 0.1).toFixed(2)}</span>
                    </div>
                  </div>
                  
                  <div className="border-t border-border my-4 pt-4">
                    <div className="flex justify-between font-semibold">
                      <span>Total</span>
                      <span>${(subtotal + subtotal * 0.1).toFixed(2)}</span>
                    </div>
                  </div>
                  
                  <Button className="w-full mt-4 mb-2" size="lg">
                    Checkout <ArrowRight size={16} className="ml-2" />
                  </Button>
                  
                  <p className="text-xs text-center text-muted-foreground mt-4">
                    Shipping and taxes calculated at checkout.
                  </p>
                </div>
              </div>
            </div>
          ) : (
            <div className="text-center py-12 border border-border rounded-lg bg-background">
              <h2 className="text-xl font-semibold mb-2">Your cart is empty</h2>
              <p className="text-muted-foreground mb-6">Looks like you haven't added any products to your cart yet.</p>
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
