import { Link } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';

interface Category {
  id: string;
  name: string;
  slug: string;
  imageUrl: string | null;
  bannerUrl: string | null;
  description: string | null;
  isFeatured: boolean;
  productCount: number;
}

interface CategorySectionProps {
  categories: Category[];
}

const categoryVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { 
    opacity: 1, 
    y: 0, 
    transition: { duration: 0.5, ease: 'easeOut' } 
  },
  hover: { 
    scale: 1.03, 
    transition: { duration: 0.3 } 
  },
};

export default function CategorySection({ categories }: CategorySectionProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      <AnimatePresence>
        {categories.map((category) => (
          <motion.div
            key={category.id}
            variants={categoryVariants}
            initial="hidden"
            animate="visible"
            whileHover="hover"
            exit="hidden"
            className="relative"
          >
            <Link
              to={`/categories/${category.slug}`} // Use slug instead of id
              className="group relative overflow-hidden rounded-lg aspect-[4/3] block shadow-md"
            >
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent z-10"></div>
              <img
                src={category.imageUrl || '/placeholder-category.jpg'}
                alt={category.name}
                className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                onError={(e) => (e.currentTarget.src = '/placeholder-category.jpg')}
              />
              <div className="absolute bottom-0 left-0 right-0 p-6 z-20 text-left">
                <h3 className="text-xl font-semibold text-white">{category.name}</h3>
                <p className="text-sm text-white/80 mt-1">
                  {category.productCount} {category.productCount === 1 ? 'product' : 'products'}
                </p>
                {category.description && (
                  <p className="text-sm text-white/70 mt-2 line-clamp-2">{category.description}</p>
                )}
                {category.isFeatured && (
                  <span className="absolute top-2 right-2 bg-yellow-400 text-black text-xs px-2 py-1 rounded-full">
                    Featured
                  </span>
                )}
              </div>
            </Link>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}