
import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Search, ShoppingCart, User, Menu, X, Heart } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useIsMobile } from '@/hooks/use-mobile';
import { useToast } from "@/hooks/use-toast";
import { useCart } from '@/context/CartContext';
import { useWishlist } from '@/context/WishlistContext';

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const isMobile = useIsMobile();
  const location = useLocation();
  const { toast } = useToast();
  const { totalItems: cartItems } = useCart();
  const { totalItems: wishlistItems } = useWishlist();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    setIsMenuOpen(false);
  }, [location]);

  const navItems = [
    { name: 'All Products', path: '/products' },
    { name: 'Categories', path: '/categories' },
    { name: 'Deals', path: '/deals' },
    { name: 'About', path: '/about' },
  ];

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      toast({
        title: "Search",
        description: `Searching for: ${searchQuery}`,
      });
      // This would normally navigate to search results
    }
  };

  return (
    <nav 
      className={`fixed w-full z-50 transition-all duration-300 ease-in-out ${
        isScrolled ? 'bg-white/80 backdrop-blur-md shadow-sm py-2' : 'bg-transparent py-4'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <span className="font-bold text-xl tracking-tight bg-black text-white px-2 py-1 rounded">ArtisanNE </span>
          </Link>

          {/* Desktop Navigation */}
          {!isMobile && (
            <div className="hidden md:flex items-center space-x-8">
              {navItems.map((item) => (
                <Link
                  key={item.name}
                  to={item.path}
                  className="text-sm font-medium hover:text-primary transition-colors relative group"
                >
                  {item.name}
                  <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-primary transition-all duration-300 group-hover:w-full"></span>
                </Link>
              ))}
            </div>
          )}

          {/* Search, Cart, Account */}
          <div className="flex items-center space-x-4">
            <form onSubmit={handleSearch} className="hidden md:flex items-center relative">
              <input
                type="text"
                placeholder="Search..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-48 pl-3 pr-10 py-1.5 rounded-full bg-secondary text-sm focus:outline-none focus:ring-1 focus:ring-primary transition-all duration-300"
              />
              <button type="submit" className="absolute right-3 text-gray-500 hover:text-primary">
                <Search size={16} />
              </button>
            </form>
            
            {/* Wishlist */}
            <Link to="/wishlist" className="relative group">
              <Heart 
                size={20} 
                className="text-gray-700 hover:text-primary transition-colors"
              />
              {wishlistItems > 0 && (
                <span className="absolute -top-2 -right-2 w-5 h-5 rounded-full bg-primary text-white text-xs flex items-center justify-center animate-fade-in">
                  {wishlistItems}
                </span>
              )}
            </Link>
            
            <Link to="/cart" className="relative group">
              <ShoppingCart 
                size={20} 
                className="text-gray-700 hover:text-primary transition-colors"
              />
              {cartItems > 0 && (
                <span className="absolute -top-2 -right-2 w-5 h-5 rounded-full bg-primary text-white text-xs flex items-center justify-center animate-fade-in">
                  {cartItems}
                </span>
              )}
            </Link>
            
            <Link to="/profile">
              <User 
                size={20}
                className="text-gray-700 hover:text-primary transition-colors" 
              />
            </Link>

            {/* Mobile menu button */}
            {isMobile && (
              <Button 
                variant="ghost" 
                size="icon"
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="md:hidden"
                aria-label="Menu"
              >
                {isMenuOpen ? <X size={20} /> : <Menu size={20} />}
              </Button>
            )}
          </div>
        </div>

        {/* Mobile menu */}
        {isMobile && isMenuOpen && (
          <div className="md:hidden absolute top-full left-0 right-0 bg-white/95 backdrop-blur-md shadow-lg p-4 animate-slide-down">
            <form onSubmit={handleSearch} className="mb-4 flex items-center relative">
              <input
                type="text"
                placeholder="Search..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-3 pr-10 py-2 rounded-full bg-secondary text-sm focus:outline-none focus:ring-1 focus:ring-primary transition-all"
              />
              <button type="submit" className="absolute right-3 text-gray-500 hover:text-primary">
                <Search size={16} />
              </button>
            </form>
            <div className="flex flex-col space-y-3">
              {navItems.map((item) => (
                <Link
                  key={item.name}
                  to={item.path}
                  className="text-sm font-medium p-2 hover:bg-secondary rounded-md transition-colors"
                >
                  {item.name}
                </Link>
              ))}
              <Link
                to="/wishlist"
                className="text-sm font-medium p-2 hover:bg-secondary rounded-md transition-colors flex items-center"
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
