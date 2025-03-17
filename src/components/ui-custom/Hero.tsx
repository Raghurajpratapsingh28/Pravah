import { ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { CustomButton } from './Button'; // Ensure this matches your actual Button component
import { motion } from 'framer-motion';

export default function Hero() {
  const heroVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: 'easeOut' } },
  };

  return (
    <div className="relative overflow-hidden bg-background">
      <div className="absolute inset-0 bg-gradient-radial from-secondary/50 to-transparent opacity-70"></div>
      
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-32 pb-24 md:pt-40 md:pb-32">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <motion.div
            className="text-left space-y-6"
            initial="hidden"
            animate="visible"
            variants={heroVariants}
          >
            <span className="inline-block px-3 py-1 rounded-full text-xs font-medium bg-secondary text-secondary-foreground">
              New Collection 2025
            </span>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight text-balance">
              Bringing Northeast India's Heritage to Your Home
            </h1>
            <p className="text-muted-foreground text-lg max-w-md">
              Explore the rich heritage of Northeast India through handcrafted arts and crafts. From exquisite silk weaving to intricate wood carvings, bring home a piece of tradition and culture today!
            </p>
            <div className="flex flex-col sm:flex-row gap-4 pt-2">
              <Link to="/products">
                <CustomButton
                  size="lg"
                  rightIcon={<ArrowRight size={18} />}
                >
                  Shop Collection
                </CustomButton>
              </Link>
              <Link to="/categories">
                <CustomButton variant="outline" size="lg">
                  Browse Categories
                </CustomButton>
              </Link>
            </div>
          </motion.div>
          
          <motion.div
            className="relative hidden md:block"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, ease: 'easeOut' }}
          >
            <div className="aspect-square max-w-lg">
              <img
                src="https://images.unsplash.com/photo-1579656592043-a20e25a4aa4b?ixlib=rb-4.0.3&auto=format&fit=crop&w=1974&q=80"
                alt="Northeast Indian handcrafted art"
                className="w-full h-full object-cover rounded-2xl shadow-lg"
                onError={(e) => (e.currentTarget.src = '/placeholder.jpg')}
              />
              <div className="absolute -bottom-6 -left-6 p-4 bg-white rounded-lg shadow-lg">
                <p className="text-sm font-medium">Premium Quality</p>
                <p className="text-xs text-muted-foreground">Authentic craftsmanship</p>
              </div>
              <div className="absolute -top-4 -right-4 p-4 bg-white rounded-lg shadow-lg">
                <p className="text-sm font-medium">Elegant Design</p>
                <p className="text-xs text-muted-foreground">Cultural aesthetics</p>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}