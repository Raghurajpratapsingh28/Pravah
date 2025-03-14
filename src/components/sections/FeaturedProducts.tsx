
import { useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import ProductCard from '@/components/ui-custom/ProductCard';
import { Product } from '@/lib/data';

interface FeaturedProductsProps {
  title: string;
  subtitle?: string;
  products: Product[];
  onAddToCart?: (product: Product) => void;
}

export default function FeaturedProducts({ 
  title, 
  subtitle, 
  products, 
  onAddToCart 
}: FeaturedProductsProps) {
  const [scrollPosition, setScrollPosition] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);
  
  const scroll = (direction: 'left' | 'right') => {
    const container = containerRef.current;
    if (!container) return;
    
    const scrollAmount = 320; // approximate width of a product card + gap
    const maxScroll = container.scrollWidth - container.clientWidth;
    
    let newPosition = direction === 'right' 
      ? Math.min(scrollPosition + scrollAmount, maxScroll)
      : Math.max(scrollPosition - scrollAmount, 0);
    
    container.scrollTo({
      left: newPosition,
      behavior: 'smooth'
    });
    
    setScrollPosition(newPosition);
  };
  
  const canScrollLeft = scrollPosition > 0;
  const canScrollRight = containerRef.current
    ? scrollPosition < containerRef.current.scrollWidth - containerRef.current.clientWidth - 10
    : false;

  return (
    <section className="py-12">
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-8">
        <div className="text-left">
          <h2 className="text-2xl md:text-3xl font-bold">{title}</h2>
          {subtitle && <p className="mt-2 text-muted-foreground">{subtitle}</p>}
        </div>
        
        <div className="flex items-center space-x-2 mt-4 md:mt-0">
          <button
            onClick={() => scroll('left')}
            disabled={!canScrollLeft}
            className="p-2 rounded-full border border-border bg-background text-foreground hover:bg-secondary disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
            aria-label="Scroll left"
          >
            <ArrowLeft size={18} />
          </button>
          <button
            onClick={() => scroll('right')}
            disabled={!canScrollRight}
            className="p-2 rounded-full border border-border bg-background text-foreground hover:bg-secondary disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
            aria-label="Scroll right"
          >
            <ArrowRight size={18} />
          </button>
          
          <Link 
            to="/products" 
            className="ml-4 text-sm font-medium hover:text-primary transition-colors"
          >
            View All
          </Link>
        </div>
      </div>
      
      <div 
        ref={containerRef} 
        className="flex space-x-6 overflow-x-auto scrollbar-none pb-4 -mx-4 px-4"
        style={{ scrollBehavior: 'smooth' }}
      >
        {products.map((product) => (
          <div key={product.id} className="min-w-[280px] max-w-[280px]">
            <ProductCard product={product} onAddToCart={onAddToCart} />
          </div>
        ))}
      </div>
    </section>
  );
}
