import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { Product } from '@/lib/data';
import { useToast } from "@/hooks/use-toast";
import { useAuth } from '@/context/AuthContext'; // Assuming this exists for auth

interface CartItem extends Product {
  quantity: number;
  productId?: string; // Added for backend compatibility
}

interface CartContextType {
  items: CartItem[];
  addItem: (product: Product, quantity?: number) => void;
  removeItem: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  totalItems: number;
  subtotal: number;
  isLoading: boolean; // Added for loading state
  error: string | null; // Added for error state
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [items, setItems] = useState<CartItem[]>([]);
  const [isLoading, setIsLoading] = useState(false); // Loading state
  const [error, setError] = useState<string | null>(null); // Error state
  const { toast } = useToast();
  const { user, token } = useAuth(); // Get auth data

  // Fetch cart from backend
  const fetchCart = useCallback(async () => {
    if (!user?.id || !token) {
      // Fallback to localStorage if not authenticated
      const savedCart = localStorage.getItem('cart');
      if (savedCart) {
        try {
          setItems(JSON.parse(savedCart));
        } catch (err) {
          console.error('Failed to parse cart from localStorage:', err);
        }
      }
      return;
    }

    setIsLoading(true);
    setError(null);
    try {
      const response = await fetch(`http://localhost:3000/cart/${user.id}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });
      if (!response.ok) throw new Error('Failed to fetch cart');
      const data = await response.json();
      const backendItems = data.items.map(item => ({
        ...item.product,
        quantity: item.quantity,
        productId: item.productId, // Map backend structure to CartItem
      }));
      setItems(backendItems);
      localStorage.setItem('cart', JSON.stringify(backendItems)); // Sync localStorage
    } catch (err) {
      setError(err.message);
      toast({ title: "Error", description: "Failed to load cart", variant: "destructive" });
    } finally {
      setIsLoading(false);
    }
  }, [user?.id, token, toast]);

  // Sync cart changes with backend
  const syncCartWithBackend = useCallback(async (productId: string, action: 'add' | 'update' | 'remove', quantity?: number) => {
    if (!user?.id || !token) return; // Skip if not authenticated
    try {
      if (action === 'add' || action === 'update') {
        await fetch(`http://localhost:3000/cart/${user.id}`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ productId, quantity }),
        });
      } else if (action === 'remove') {
        await fetch(`http://localhost:3000/cart/${user.id}`, {
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ productId }),
        });
      }
      await fetchCart(); // Refresh cart after sync
    } catch (err) {
      toast({ title: "Error", description: "Failed to update cart", variant: "destructive" });
    }
  }, [user?.id, token, fetchCart, toast]);

  // Load cart on mount
  useEffect(() => {
    fetchCart();
  }, [fetchCart]);

  // Sync localStorage when items change (for unauthenticated users)
  useEffect(() => {
    if (!user?.id) {
      localStorage.setItem('cart', JSON.stringify(items));
    }
  }, [items, user?.id]);

  const addItem = (product: Product, quantity = 1) => {
    setItems(prevItems => {
      const existingItem = prevItems.find(item => item.id === product.id);
      let updatedItems;

      if (existingItem) {
        updatedItems = prevItems.map(item =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      } else {
        updatedItems = [...prevItems, { ...product, quantity, productId: product.id }];
      }

      if (user?.id && token) {
        syncCartWithBackend(product.id, 'add', quantity);
      }
      toast({ title: "Added to Cart", description: `${product.name} added to your cart` });
      return updatedItems;
    });
  };

  const removeItem = (productId: string) => {
    setItems(prevItems => {
      const updatedItems = prevItems.filter(item => item.id !== productId);
      if (user?.id && token) {
        syncCartWithBackend(productId, 'remove');
      }
      toast({ title: "Item Removed", description: "The item has been removed from your cart" });
      return updatedItems;
    });
  };

  const updateQuantity = (productId: string, quantity: number) => {
    if (quantity <= 0) {
      removeItem(productId);
      return;
    }

    setItems(prevItems => {
      const updatedItems = prevItems.map(item =>
        item.id === productId ? { ...item, quantity } : item
      );
      if (user?.id && token) {
        syncCartWithBackend(productId, 'update', quantity);
      }
      return updatedItems;
    });
  };

  const clearCart = () => {
    setItems([]);
    if (user?.id && token) {
      // Could add a DELETE /cart/:userId endpoint to clear all items
      items.forEach(item => syncCartWithBackend(item.id, 'remove'));
    }
    toast({ title: "Cart Cleared", description: "All items have been removed from your cart" });
  };

  const totalItems = items.reduce((total, item) => total + item.quantity, 0);

  const subtotal = items.reduce((total, item) => {
    const price = item.discount > 0
      ? Number(item.price) * (1 - item.discount / 100)
      : Number(item.price);
    return total + (price * item.quantity);
  }, 0);

  return (
    <CartContext.Provider
      value={{
        items,
        addItem,
        removeItem,
        updateQuantity,
        clearCart,
        totalItems,
        subtotal,
        isLoading,
        error,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};