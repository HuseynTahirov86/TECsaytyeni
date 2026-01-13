import Image from 'next/image';
import Link from 'next/link';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '@/components/ui/carousel';
import { Card, CardContent } from '@/components/ui/card';
import { getArticles, getCategories, getFeaturedArticles } from '@/lib/data';
import CategoryCard from '@/components/category-card';
import ArticleCard from '@/components/article-card';
import { PlaceHolderImages } from '@/lib/placeholder-images';

export default function Home() {
  const featuredArticles = getFeaturedArticles();
  const categories = getCategories();
  const latestArticles = getArticles().slice(0, 6);

  const findImage = (id: string) => PlaceHolderImages.find(img => img.id === id);

  return (
    <div className="flex flex-col">
      <section className="w-full py-6 md:py-12">
        <div className="container px-4 md:px-6">
          <Carousel
            opts={{
              loop: true,
            }}
            className="w-full"
          >
            <CarouselContent>
              {featuredArticles.map((article, index) => {
                const image = findImage(article.imageId);
                return (
                  <CarouselItem key={index}>
                    <div className="relative h-[300px] md:h-[500px] w-full">
                       {image && (
                         <Image
                           src={image.imageUrl}
                           alt={article.title}
                           fill
                           className="object-cover rounded-lg"
                           data-ai-hint={image.imageHint}
                         />
                       )}
                       <div className="absolute inset-0 bg-black/50 rounded-lg flex flex-col justify-end p-6 md:p-10">
                         <h1 className="text-2xl md:text-4xl font-bold text-white mb-2 font-headline">{article.title}</h1>
                         <p className="text-sm md:text-lg text-neutral-200 hidden md:block">{article.excerpt}</p>
                         <Link href={`/articles/${article.slug}`} className="text-accent hover:underline mt-2 font-semibold">
                           Read More
                         </Link>
                       </div>
                    </div>
                  </CarouselItem>
                )
              })}
            </CarouselContent>
            <CarouselPrevious className="absolute left-4 top-1/2 -translate-y-1/2" />
            <CarouselNext className="absolute right-4 top-1/2 -translate-y-1/2" />
          </Carousel>
        </div>
      </section>

      <section className="w-full py-6 md:py-12 bg-secondary">
        <div className="container px-4 md:px-6">
          <h2 className="text-2xl md:text-3xl font-bold mb-6 font-headline">Kateqoriyalar</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
            {categories.map((category) => (
              <CategoryCard key={category.slug} category={category} />
            ))}
          </div>
        </div>
      </section>

      <section className="w-full py-6 md:py-12">
        <div className="container px-4 md:px-6">
          <h2 className="text-2xl md:text-3xl font-bold mb-6 font-headline">Son Xəbərlər</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {latestArticles.map((article) => (
              <ArticleCard key={article.slug} article={article} />
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
