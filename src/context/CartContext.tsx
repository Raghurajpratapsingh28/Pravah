import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { Product } from '@/lib/data';
import { useToast } from "@/hooks/use-toast";
import { useAuth } from '@/context/AuthContext';
import debounce from 'lodash/debounce'; // Add this for debouncing

interface CartItem extends Product {
  quantity: number;
  productId: string; // Made required for backend consistency
}

interface CartContextType {
  items: CartItem[];
  addItem: (product: Product, quantity?: number) => void;
  removeItem: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  totalItems: number;
  subtotal: number;
  isLoading: boolean;
  error: string | null;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [items, setItems] = useState<CartItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();
  const { user, token, isAuthenticated } = useAuth();

  // Fetch cart from backend
  const fetchCart = useCallback(async () => {
    if (!isAuthenticated || !user?.id || !token) {
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
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to fetch cart');
      }
      const data = await response.json();
      const backendItems = (data.items || []).map(item => ({
        ...item.product,
        quantity: item.quantity,
        productId: item.productId,
      }));
      setItems(backendItems);
      localStorage.setItem('cart', JSON.stringify(backendItems)); // Sync localStorage as backup
    } catch (err) {
      setError(err.message);
      toast({ title: 'Error', description: 'Failed to load cart', variant: 'destructive' });
    } finally {
      setIsLoading(false);
    }
  }, [isAuthenticated, user?.id, token, toast]);

  // Debounced sync with backend
  const syncCartWithBackend = useCallback(
    debounce(async (productId: string, action: 'add' | 'update' | 'remove', quantity?: number) => {
      if (!isAuthenticated || !user?.id || !token) return;

      try {
        if (action === 'add' || action === 'update') {
          // Validate stock before syncing
          const product = items.find(item => item.productId === productId);
          if (product && quantity && quantity > product.stock) {
            toast({
              title: 'Stock Limit',
              description: `Only ${product.stock} items available`,
              variant: 'destructive',
            });
            return;
          }
          const response = await fetch(`http://localhost:3000/cart/${user.id}`, {
            method: 'POST',
            headers: {
              'Authorization': `Bearer ${token}`,
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ productId, quantity }),
          });
          if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error || `Failed to ${action} item`);
          }
        } else if (action === 'remove') {
          const response = await fetch(`http://localhost:3000/cart/${user.id}`, {
            method: 'DELETE',
            headers: {
              'Authorization': `Bearer ${token}`,
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ productId }),
          });
          if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error || 'Failed to remove item');
          }
        }
        await fetchCart(); // Refresh cart after sync
      } catch (err) {
        toast({
          title: 'Error',
          description: `Failed to ${action} item: ${err.message}`,
          variant: 'destructive',
        });
        fetchCart(); // Re-fetch to ensure consistency on error
      }
    }, 500), // 500ms debounce
    [isAuthenticated, user?.id, token, items, fetchCart, toast]
  );

  // Load cart on mount or when auth changes
  useEffect(() => {
    fetchCart();
  }, [fetchCart]);

  // Sync localStorage for unauthenticated users
  useEffect(() => {
    if (!isAuthenticated) {
      localStorage.setItem('cart', JSON.stringify(items));
    }
  }, [items, isAuthenticated]);

  const addItem = (product: Product, quantity = 1) => {
    setItems(prevItems => {
      const existingItem = prevItems.find(item => item.id === product.id);
      let updatedItems;

      if (existingItem) {
        const newQuantity = existingItem.quantity + quantity;
        if (newQuantity > product.stock) {
          toast({
            title: 'Stock Limit',
            description: `Only ${product.stock} items available`,
            variant: 'destructive',
          });
          return prevItems; // No update if over stock
        }
        updatedItems = prevItems.map(item =>
          item.id === product.id ? { ...item, quantity: newQuantity } : item
        );
      } else {
        if (quantity > product.stock) {
          toast({
            title: 'Stock Limit',
            description: `Only ${product.stock} items available`,
            variant: 'destructive',
          });
          return prevItems;
        }
        updatedItems = [...prevItems, { ...product, quantity, productId: product.id }];
      }

      if (isAuthenticated && token) {
        syncCartWithBackend(product.id, 'add', quantity);
      }
      toast({ title: 'Added to Cart', description: `${product.name} added to your cart` });
      return updatedItems;
    });
  };

  const removeItem = (productId: string) => {
    setItems(prevItems => {
      const updatedItems = prevItems.filter(item => item.productId !== productId);
      if (isAuthenticated && token) {
        syncCartWithBackend(productId, 'remove');
      }
      toast({ title: 'Item Removed', description: 'Item removed from your cart' });
      return updatedItems;
    });
  };

  const updateQuantity = (productId: string, quantity: number) => {
    if (quantity <= 0) {
      removeItem(productId);
      return;
    }

    setItems(prevItems => {
      const item = prevItems.find(i => i.productId === productId);
      if (!item) return prevItems;
      if (quantity > item.stock) {
        toast({
          title: 'Stock Limit',
          description: `Only ${item.stock} items available`,
          variant: 'destructive',
        });
        return prevItems;
      }

      const updatedItems = prevItems.map(i =>
        i.productId === productId ? { ...i, quantity } : i
      );
      if (isAuthenticated && token) {
        syncCartWithBackend(productId, 'update', quantity);
      }
      return updatedItems;
    });
  };

  const clearCart = async () => {
    if (isAuthenticated && user?.id && token) {
      setIsLoading(true);
      try {
        const response = await fetch(`http://localhost:3000/cart/${user.id}/clear`, {
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });
        if (!response.ok) throw new Error('Failed to clear cart');
        setItems([]);
        toast({ title: 'Cart Cleared', description: 'All items removed from your cart' });
      } catch (err) {
        setError(err.message);
        toast({ title: 'Error', description: 'Failed to clear cart', variant: 'destructive' });
        fetchCart(); // Re-fetch to ensure consistency
      } finally {
        setIsLoading(false);
      }
    } else {
      setItems([]);
      localStorage.setItem('cart', JSON.stringify([]));
      toast({ title: 'Cart Cleared', description: 'All items removed from your cart' });
    }
  };

  const totalItems = items.reduce((total, item) => total + item.quantity, 0);

  const subtotal = items.reduce((total, item) => {
    const price = item.discount > 0
      ? Number(item.price) * (1 - item.discount / 100)
      : Number(item.price);
    return total + price * item.quantity;
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