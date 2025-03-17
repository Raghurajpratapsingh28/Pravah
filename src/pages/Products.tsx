import React, { useEffect, useState, useCallback } from 'react';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { Button } from '@/components/ui/button';
import ProductCard from '@/components/ui-custom/ProductCard';
import { useCart } from '@/context/CartContext';
import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { motion } from 'framer-motion';
import { ChevronDown, ChevronUp } from 'lucide-react';

export default function ProductsPage() {
  const { addItem } = useCart();
  const { token } = useAuth();
  const { toast } = useToast();
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [filters, setFilters] = useState({
    category: 'all',
    priceRange: 'all',
  });
  const [sort, setSort] = useState('latest');
  const [isFiltersOpen, setIsFiltersOpen] = useState(false); // For mobile toggle

  // Fetch products with filters and sorting
  const fetchProducts = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const query = new URLSearchParams({
        ...(filters.category !== 'all' && { category: filters.category }),
        ...(filters.priceRange !== 'all' && { priceRange: filters.priceRange }),
        sort,
      }).toString();
      const response = await fetch(`http://localhost:3000/products?${query}`, {
        headers: {
          'Authorization': token ? `Bearer ${token}` : '',
          'Content-Type': 'application/json',
        },
      });
      if (!response.ok) throw new Error('Failed to fetch products');
      const data = await response.json();
      setProducts(data);
    } catch (err) {
      setError(err.message);
      toast({ title: 'Error', description: 'Failed to load products', variant: 'destructive' });
    } finally {
      setLoading(false);
    }
  }, [token, filters, sort, toast]);

  // Fetch categories for filter sidebar
  const fetchCategories = useCallback(async () => {
    try {
      const response = await fetch('http://localhost:3000/categories', {
        headers: { 'Authorization': token ? `Bearer ${token}` : '' },
      });
      if (!response.ok) throw new Error('Failed to fetch categories');
      const data = await response.json();
      setCategories(data);
    } catch (err) {
      console.error('Error fetching categories:', err);
    }
  }, [token]);

  useEffect(() => {
    fetchCategories();
    fetchProducts();
  }, [fetchCategories, fetchProducts]);

  const handleFilterChange = (type, value) => {
    setFilters(prev => ({ ...prev, [type]: value }));
  };

  const handleSortChange = (e) => {
    setSort(e.target.value);
  };

  const priceRanges = [
    { label: 'Under $50', value: '0-50' },
    { label: '$50 - $100', value: '50-100' },
    { label: '$100 - $200', value: '100-200' },
    { label: '$200 and Above', value: '200+' },
  ];

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
        <Button onClick={fetchProducts}>Retry</Button>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      
      <main className="flex-grow pt-24 pb-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col lg:flex-row gap-8">
            {/* Filters Sidebar */}
            <aside className="w-full lg:w-64 space-y-6">
              {/* Mobile Filter Toggle */}
              <div className="lg:hidden">
                <Button
                  variant="outline"
                  className="w-full flex justify-between"
                  onClick={() => setIsFiltersOpen(!isFiltersOpen)}
                >
                  Filters {isFiltersOpen ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                </Button>
              </div>
              
              <div className={`${isFiltersOpen ? 'block' : 'hidden'} lg:block space-y-6`}>
                {/* Categories Filter */}
                <div className="bg-background border border-border rounded-lg p-4">
                  <h3 className="text-lg font-semibold mb-3">Categories</h3>
                  <div className="space-y-2">
                    <Button
                      variant={filters.category === 'all' ? 'default' : 'ghost'}
                      className="justify-start w-full"
                      onClick={() => handleFilterChange('category', 'all')}
                    >
                      All Products
                    </Button>
                    {categories.map((cat) => (
                      <Button
                        key={cat.id}
                        variant={filters.category === cat.name ? 'default' : 'ghost'}
                        className="justify-start w-full"
                        onClick={() => handleFilterChange('category', cat.name)}
                      >
                        {cat.name}
                      </Button>
                    ))}
                  </div>
                </div>

                {/* Price Range Filter */}
                <div className="bg-background border border-border rounded-lg p-4">
                  <h3 className="text-lg font-semibold mb-3">Price Range</h3>
                  <div className="space-y-2">
                    <Button
                      variant={filters.priceRange === 'all' ? 'default' : 'ghost'}
                      className="justify-start w-full"
                      onClick={() => handleFilterChange('priceRange', 'all')}
                    >
                      All Prices
                    </Button>
                    {priceRanges.map((range) => (
                      <Button
                        key={range.value}
                        variant={filters.priceRange === range.value ? 'default' : 'ghost'}
                        className="justify-start w-full"
                        onClick={() => handleFilterChange('priceRange', range.value)}
                      >
                        {range.label}
                      </Button>
                    ))}
                  </div>
                </div>
              </div>
            </aside>
            
            {/* Products Grid */}
            <div className="flex-1">
              <div className="flex items-center justify-between mb-6">
                <h1 className="text-2xl font-bold">All Products ({products.length})</h1>
                <div className="flex items-center space-x-2">
                  <span className="text-sm text-muted-foreground">Sort by:</span>
                  <select
                    value={sort}
                    onChange={handleSortChange}
                    className="text-sm border border-input rounded-md px-2 py-1 bg-background"
                  >
                    <option value="latest">Latest</option>
                    <option value="priceLow">Price: Low to High</option>
                    <option value="priceHigh">Price: High to Low</option>
                    <option value="popular">Most Popular</option>
                  </select>
                </div>
              </div>
              
              <motion.div
                className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5 }}
              >
                {products.map((product) => (
                  <motion.div
                    key={product.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <ProductCard
                      product={{
                        id: product.id,
                        name: product.name,
                        price: Number(product.price),
                        discount: Number(product.discount) || 0,
                        imageUrl: product.imageUrl || '/placeholder.jpg',
                        rating: product.rating || 0,
                        reviewCount: product.reviewCount || 0,
                        category: product.category?.name || 'Uncategorized',
                      }}
                      onAddToCart={() => addItem(product)}
                    />
                  </motion.div>
                ))}
              </motion.div>

              {products.length === 0 && (
                <div className="text-center py-12">
                  <p className="text-lg text-muted-foreground">No products match your filters.</p>
                  <Button variant="outline" className="mt-4" onClick={() => setFilters({ category: 'all', priceRange: 'all' })}>
                    Reset Filters
                  </Button>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
}