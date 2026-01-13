import Link from 'next/link';
import Image from 'next/image';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import type { Article } from '@/lib/data';
import { PlaceHolderImages } from '@/lib/placeholder-images';

type ArticleCardProps = {
  article: Article;
};

export default function ArticleCard({ article }: ArticleCardProps) {
  const image = PlaceHolderImages.find((img) => img.id === article.imageId);
  return (
    <Card className="flex flex-col overflow-hidden h-full">
      <Link href={`/articles/${article.slug}`} className="block">
        <div className="relative h-48 w-full">
          {image && (
            <Image
              src={image.imageUrl}
              alt={article.title}
              fill
              className="object-cover transition-transform duration-300 group-hover:scale-105"
              data-ai-hint={image.imageHint}
            />
          )}
        </div>
      </Link>
      <CardHeader>
        <div className="flex justify-between items-center mb-2">
            <Badge variant="secondary" className="capitalize">{article.category}</Badge>
            <p className="text-xs text-muted-foreground">{article.date}</p>
        </div>
        <CardTitle className="text-lg font-bold leading-tight">
          <Link href={`/articles/${article.slug}`} className="hover:text-primary transition-colors">
            {article.title}
          </Link>
        </CardTitle>
      </CardHeader>
      <CardContent className="flex-grow">
        <p className="text-sm text-muted-foreground">{article.excerpt}</p>
      </CardContent>
    </Card>
  );
}
