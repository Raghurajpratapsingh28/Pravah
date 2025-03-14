
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Heart, ShoppingCart } from 'lucide-react';
import { Product } from '@/lib/data';
import { useToast } from "@/hooks/use-toast";
import { useWishlist } from '@/context/WishlistContext';

interface ProductCardProps {
  product: Product;
  onAddToCart?: (product: Product) => void;
}

export default function ProductCard({ product, onAddToCart }: ProductCardProps) {
  const [isHovered, setIsHovered] = useState(false);
  const { toast } = useToast();
  const { toggleItem, isInWishlist } = useWishlist();
  const isLiked = isInWishlist(product.id);

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    onAddToCart?.(product);
    
    toast({
      title: "Added to cart",
      description: `${product.name} has been added to your cart`,
    });
  };
  
  const handleLike = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    toggleItem(product);
  };

  return (
    <Link
      to={`/products/${product.id}`}
      className="group"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="relative overflow-hidden rounded-lg bg-background border border-border transition-all duration-300 hover:shadow-md">
        {/* Discount Tag */}
        {product.discount > 0 && (
          <div className="absolute top-2 left-2 z-10 bg-primary text-primary-foreground text-xs font-medium px-2 py-1 rounded-md">
            {product.discount}% OFF
          </div>
        )}
        
        {/* Wishlist */}
        <button
          className="absolute top-2 right-2 z-10 p-1.5 rounded-full bg-white/80 backdrop-blur-sm text-gray-500 hover:text-red-500 transition-colors"
          onClick={handleLike}
          aria-label={isLiked ? "Remove from wishlist" : "Add to wishlist"}
        >
          <Heart size={16} className={isLiked ? "fill-red-500 text-red-500" : ""} />
        </button>
        
        {/* Product Image */}
        <div className="aspect-square overflow-hidden bg-secondary/30">
          <img
            src={product.image}
            alt={product.name}
            className="w-full h-full object-cover transition-transform duration-500 ease-out group-hover:scale-105"
            loading="lazy"
          />
        </div>
        
        {/* Quick Add to Cart - Appears on hover */}
        <div className={`absolute bottom-0 left-0 right-0 bg-white/90 backdrop-blur-sm p-3 transform transition-transform duration-300 ${isHovered ? 'translate-y-0' : 'translate-y-full'}`}>
          <button
            onClick={handleAddToCart}
            className="w-full flex items-center justify-center gap-2 py-1.5 px-3 bg-primary text-primary-foreground rounded-md text-sm font-medium transition-colors hover:bg-primary/90"
          >
            <ShoppingCart size={14} />
            Add to Cart
          </button>
        </div>
        
        {/* Product Info */}
        <div className="p-4">
          <p className="text-sm text-muted-foreground">{product.category}</p>
          <h3 className="mt-1 text-base font-medium text-foreground text-left">
            {product.name}
          </h3>
          <div className="mt-1.5 flex items-center">
            {product.discount > 0 ? (
              <>
                <p className="text-base font-semibold text-foreground">${(product.price * (1 - product.discount / 100)).toFixed(2)}</p>
                <p className="ml-2 text-sm text-muted-foreground line-through">${product.price.toFixed(2)}</p>
              </>
            ) : (
              <p className="text-base font-semibold text-foreground">${product.price.toFixed(2)}</p>
            )}
          </div>
          
          {/* Rating */}
          <div className="mt-2 flex items-center">
            <div className="flex">
              {[...Array(5)].map((_, i) => (
                <svg
                  key={i}
                  className={`w-3.5 h-3.5 ${i < product.rating ? 'text-yellow-400' : 'text-gray-300'}`}
                  aria-hidden="true"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="currentColor"
                  viewBox="0 0 22 20"
                >
                  <path d="M20.924 7.625a1.523 1.523 0 0 0-1.238-1.044l-5.051-.734-2.259-4.577a1.534 1.534 0 0 0-2.752 0L7.365 5.847l-5.051.734A1.535 1.535 0 0 0 1.463 9.2l3.656 3.563-.863 5.031a1.532 1.532 0 0 0 2.226 1.616L11 17.033l4.518 2.375a1.534 1.534 0 0 0 2.226-1.617l-.863-5.03L20.537 9.2a1.523 1.523 0 0 0 .387-1.575Z"/>
                </svg>
              ))}
            </div>
            <p className="ml-1 text-xs text-muted-foreground">({product.reviewCount})</p>
          </div>
        </div>
      </div>
    </Link>
  );
}
