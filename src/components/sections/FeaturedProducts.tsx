import { useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import ProductCard from '@/components/ui-custom/ProductCard';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';

interface FeaturedProductsProps {
  title: string;
  subtitle?: string;
  products: any[];
  onAddToCart?: (product: any) => void;
}

export default function FeaturedProducts({ title, subtitle, products, onAddToCart }: FeaturedProductsProps) {
  const [scrollPosition, setScrollPosition] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);

  const scroll = (direction: 'left' | 'right') => {
    const container = containerRef.current;
    if (!container) return;

    const scrollAmount = 320;
    const maxScroll = container.scrollWidth - container.clientWidth;

    const newPosition =
      direction === 'right'
        ? Math.min(scrollPosition + scrollAmount, maxScroll)
        : Math.max(scrollPosition - scrollAmount, 0);

    container.scrollTo({
      left: newPosition,
      behavior: 'smooth',
    });

    setScrollPosition(newPosition);
  };

  const canScrollLeft = scrollPosition > 0;
  const canScrollRight =
    containerRef.current &&
    scrollPosition < containerRef.current.scrollWidth - containerRef.current.clientWidth - 10;

  return (
    <section className="py-12">
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-8">
        <div className="text-left">
          <h2 className="text-2xl md:text-3xl font-bold">{title}</h2>
          {subtitle && <p className="mt-2 text-muted-foreground">{subtitle}</p>}
        </div>

        <div className="flex items-center space-x-2 mt-4 md:mt-0">
          <Button
            variant="outline"
            size="sm"
            onClick={() => scroll('left')}
            disabled={!canScrollLeft}
            aria-label="Scroll left"
          >
            <ArrowLeft size={18} />
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => scroll('right')}
            disabled={!canScrollRight}
            aria-label="Scroll right"
          >
            <ArrowRight size={18} />
          </Button>
          <Button variant="link" asChild>
            <Link to="/products" className="text-sm font-medium">
              View All
            </Link>
          </Button>
        </div>
      </div>

      <motion.div
        ref={containerRef}
        className="flex space-x-6 overflow-x-auto scrollbar-none pb-4 -mx-4 px-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        {products.map((product) => (
          <motion.div
            key={product.id}
            className="min-w-[280px] max-w-[280px]"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            <ProductCard product={product} onAddToCart={onAddToCart} />
          </motion.div>
        ))}
      </motion.div>

      {products.length === 0 && (
        <p className="text-center text-muted-foreground">No featured products available.</p>
      )}
    </section>
  );
}