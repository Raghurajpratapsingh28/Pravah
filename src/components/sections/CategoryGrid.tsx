
import { useState } from 'react';
import CategorySection from '@/components/ui-custom/CategorySection';
import { Category } from '@/lib/data';

interface CategoryGridProps {
  title: string;
  subtitle?: string;
  categories: Category[];
}

export default function CategoryGrid({ title, subtitle, categories }: CategoryGridProps) {
  return (
    <section className="py-12">
      <div className="text-center mb-10">
        <h2 className="text-2xl md:text-3xl font-bold">{title}</h2>
        {subtitle && <p className="mt-2 text-muted-foreground">{subtitle}</p>}
      </div>
      
      <CategorySection categories={categories} />
    </section>
  );
}
