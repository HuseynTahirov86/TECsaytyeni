import Link from 'next/link';
import { Card, CardContent } from '@/components/ui/card';
import type { Category } from '@/lib/data';

type CategoryCardProps = {
  category: Category;
};

export default function CategoryCard({ category }: CategoryCardProps) {
  const Icon = category.icon;
  return (
    <Link href={`/category/${category.slug}`} className="group">
      <Card className="overflow-hidden transition-all duration-300 hover:shadow-lg hover:-translate-y-1">
        <CardContent className="p-4 flex flex-col items-center justify-center gap-3">
          <div className="bg-primary/20 p-4 rounded-full">
            <Icon className="h-8 w-8 text-primary-foreground" />
          </div>
          <h3 className="text-base font-semibold text-center">{category.name}</h3>
        </CardContent>
      </Card>
    </Link>
  );
}
