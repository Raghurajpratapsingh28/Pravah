import { useState, useEffect, useRef } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Search, ShoppingCart, User, Menu, X, Heart } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useIsMobile } from '@/hooks/use-mobile';
import { useToast } from '@/hooks/use-toast';
import { useCart } from '@/context/CartContext';
import { useWishlist } from '@/context/WishlistContext';
import { Input } from '@/components/ui/input';
import debounce from 'lodash/debounce'; // Install lodash if not already: npm i lodash

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const isMobile = useIsMobile();
  const location = useLocation();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { totalItems: cartItems } = useCart();
  const { totalItems: wishlistItems } = useWishlist();
  const searchRef = useRef(null); // Ref for click outside detection

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close mobile menu on route change
  useEffect(() => {
    setIsMenuOpen(false);
    setIsSearchOpen(false);
  }, [location]);

  // Close search dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setIsSearchOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Debounced search function
  const fetchProducts = debounce(async (query) => {
    if (!query.trim()) {
      setSearchResults([]);
      setIsSearchOpen(false);
      return;
    }
    try {
      const response = await fetch('http://localhost:3000/products');
      if (!response.ok) throw new Error('Failed to fetch products');
      const products = await response.json();
      const filtered = products
        .filter((product) =>
          product.name.toLowerCase().includes(query.toLowerCase())
        )
        .slice(0, 5); // Limit to top 5 results
      setSearchResults(filtered);
      setIsSearchOpen(true);
    } catch (error) {
      toast({
        variant: 'destructive',
        title: 'Search Error',
        description: 'Failed to fetch products. Please try again.',
      });
      setSearchResults([]);
      setIsSearchOpen(false);
    }
  }, 300);

  const handleSearchInput = (e) => {
    const query = e.target.value;
    setSearchQuery(query);
    fetchProducts(query);
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/products?search=${encodeURIComponent(searchQuery)}`);
      setSearchQuery('');
      setIsSearchOpen(false);
      toast({
        title: 'Search',
        description: `Searching for: ${searchQuery}`,
      });
    }
  };

  const handleResultClick = (productId) => {
    navigate(`/products/${productId}`);
    setSearchQuery('');
    setIsSearchOpen(false);
  };

  const navItems = [
    { name: 'All Products', path: '/products' },
    { name: 'Categories', path: '/categories' },
    { name: 'Deals', path: '/deals' },
    { name: 'About', path: '/about' },
  ];

  return (
    <nav
      className={`fixed w-full z-50 transition-all duration-300 ease-in-out ${
        isScrolled ? 'bg-white/90 backdrop-blur-md shadow-md py-2' : 'bg-transparent py-4'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <span className="font-bold text-xl tracking-tight bg-black text-white px-3 py-1 rounded">
              ArtisanNE
            </span>
          </Link>

          {/* Desktop Navigation */}
          {!isMobile && (
            <div className="hidden md:flex items-center space-x-8">
              {navItems.map((item) => (
                <Link
                  key={item.name}
                  to={item.path}
                  className="text-sm font-medium text-gray-700 hover:text-primary transition-colors relative group"
                >
                  {item.name}
                  <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-primary transition-all duration-300 group-hover:w-full" />
                </Link>
              ))}
            </div>
          )}

          {/* Search, Cart, Account */}
          <div className="flex items-center space-x-4">
            {/* Search Bar */}
            <div className="relative" ref={searchRef}>
              <form onSubmit={handleSearchSubmit} className="flex items-center">
                <Input
                  type="text"
                  placeholder="Search products..."
                  value={searchQuery}
                  onChange={handleSearchInput}
                  onFocus={() => searchResults.length > 0 && setIsSearchOpen(true)}
                  className="w-40 md:w-56 pl-4 pr-10 py-1.5 rounded-full bg-gray-100 text-sm focus:outline-none focus:ring-2 focus:ring-primary transition-all duration-300"
                />
                <button
                  type="submit"
                  className="absolute right-3 text-gray-500 hover:text-primary"
                >
                  <Search size={16} />
                </button>
              </form>

              {/* Search Results Dropdown */}
              {isSearchOpen && searchQuery.trim() && (
                <div className="absolute top-full left-0 mt-2 w-full bg-white shadow-lg rounded-md border z-50 max-h-60 overflow-y-auto">
                  {searchResults.length === 0 ? (
                    <div className="p-3 text-sm text-gray-500">No results found</div>
                  ) : (
                    searchResults.map((product) => (
                      <div
                        key={product.id}
                        onClick={() => handleResultClick(product.id)}
                        className="flex items-center p-3 hover:bg-gray-100 cursor-pointer transition-colors"
                      >
                        <img
                          src={product.imageUrl || 'default-image.jpg'}
                          alt={product.name}
                          className="w-10 h-10 object-cover rounded mr-3"
                        />
                        <div>
                          <p className="text-sm font-medium">{product.name}</p>
                          <p className="text-xs text-gray-500">${Number(product.price).toFixed(2)}</p>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              )}
            </div>

            {/* Wishlist */}
            <Link to="/wishlist" className="relative group">
              <Heart
                size={20}
                className="text-gray-700 hover:text-primary transition-colors"
              />
              {wishlistItems > 0 && (
                <span className="absolute -top-2 -right-2 w-5 h-5 rounded-full bg-primary text-white text-xs flex items-center justify-center">
                  {wishlistItems}
                </span>
              )}
            </Link>

            {/* Cart */}
            <Link to="/cart" className="relative group">
              <ShoppingCart
                size={20}
                className="text-gray-700 hover:text-primary transition-colors"
              />
              {cartItems > 0 && (
                <span className="absolute -top-2 -right-2 w-5 h-5 rounded-full bg-primary text-white text-xs flex items-center justify-center">
                  {cartItems}
                </span>
              )}
            </Link>

            {/* Profile */}
            <Link to="/profile">
              <User
                size={20}
                className="text-gray-700 hover:text-primary transition-colors"
              />
            </Link>

            {/* Mobile Menu Button */}
            {isMobile && (
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="md:hidden"
                aria-label="Toggle menu"
              >
                {isMenuOpen ? <X size={20} /> : <Menu size={20} />}
              </Button>
            )}
          </div>
        </div>

        {/* Mobile Menu */}
        {isMobile && isMenuOpen && (
          <div className="md:hidden absolute top-full left-0 right-0 bg-white/95 backdrop-blur-md shadow-lg p-4 animate-slide-down">
            <div className="flex flex-col space-y-3">
              {navItems.map((item) => (
                <Link
                  key={item.name}
                  to={item.path}
                  className="text-sm font-medium p-2 hover:bg-gray-100 rounded-md transition-colors"
                >
                  {item.name}
                </Link>
              ))}
              <Link
                to="/wishlist"
                className="text-sm font-medium p-2 hover:bg-gray-100 rounded-md transition-colors flex items-center"
              >
                <Heart size={16} className="mr-2" />
                Wishlist
                {wishlistItems > 0 && (
                  <span className="ml-2 w-5 h-5 rounded-full bg-primary text-white text-xs flex items-center justify-center">
                    {wishlistItems}
                  </span>
                )}
              </Link>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}