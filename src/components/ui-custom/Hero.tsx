
import { ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { CustomButton } from './Button';

export default function Hero() {
  return (
    <div className="relative overflow-hidden bg-background">
      {/* Background pattern or gradient */}
      <div className="absolute inset-0 bg-gradient-radial from-secondary/50 to-transparent opacity-70"></div>
      
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-32 pb-24 md:pt-40 md:pb-32">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          {/* Text content */}
          <div className="text-left space-y-6 animate-fade-in">
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
              <CustomButton 
                size="lg" 
                rightIcon={<ArrowRight size={18} />}
                onClick={() => window.location.href = '/products'}
              >
                Shop Collection
              </CustomButton>
              <CustomButton 
                variant="outline" 
                size="lg"
                onClick={() => window.location.href = '/categories'}
              >
                Browse Categories
              </CustomButton>
            </div>
          </div>
          
          {/* Image */}
          <div className="relative hidden md:block animate-float">
            <div className="aspect-square max-w-lg">
              <img 
                src="https://images.unsplash.com/photo-1579656592043-a20e25a4aa4b?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1974&q=80" 
                alt="Premium headphones on a minimal background" 
                className="w-full h-full object-cover rounded-2xl shadow-lg"
              />
              <div className="absolute -bottom-6 -left-6 p-4 bg-white rounded-lg shadow-lg">
                <p className="text-sm font-medium">Premium Quality</p>
                <p className="text-xs text-muted-foreground">Experience clarity</p>
              </div>
              <div className="absolute -top-4 -right-4 p-4 bg-white rounded-lg shadow-lg">
                <p className="text-sm font-medium">Elegant Design</p>
                <p className="text-xs text-muted-foreground">Timeless aesthetics</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
