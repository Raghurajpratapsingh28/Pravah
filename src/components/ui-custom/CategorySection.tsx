
import { Link } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';

interface Category {
  id: string;
  name: string;
  image: string;
  productCount: number;
}

interface CategorySectionProps {
  categories: Category[];
}

export default function CategorySection({ categories }: CategorySectionProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {categories.map((category) => (
        <Link
          key={category.id}
          to={`/categories/${category.id}`}
          className="group relative overflow-hidden rounded-lg aspect-[4/3]"
        >
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent z-10"></div>
          <img
            src={category.image}
            alt={category.name}
            className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
          />
          <div className="absolute bottom-0 left-0 right-0 p-6 z-20 text-left">
            <h3 className="text-xl font-semibold text-white">{category.name}</h3>
            <p className="text-sm text-white/80 mt-1">{category.productCount} products</p>
          </div>
        </Link>
      ))}
    </div>
  );
}
