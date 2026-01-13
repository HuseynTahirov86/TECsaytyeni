import { notFound } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { getArticleBySlug, getArticles, getUserById } from '@/lib/data';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Share2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import ArticleCard from '@/components/article-card';
import CommentSection from '@/components/comment-section';
import ArticleSummarizer from '@/components/article-summarizer';

type ArticlePageProps = {
  params: {
    slug: string;
  };
};

export default function ArticlePage({ params }: ArticlePageProps) {
  const article = getArticleBySlug(params.slug);

  if (!article) {
    notFound();
  }

  const author = getUserById(article.authorId);
  const heroImage = PlaceHolderImages.find((img) => img.id === article.imageId);
  const authorAvatar = author ? PlaceHolderImages.find((img) => img.id === author.avatarId) : null;
  const relatedArticles = getArticles()
    .filter((a) => a.category === article.category && a.slug !== article.slug)
    .slice(0, 3);

  return (
    <div className="container mx-auto max-w-4xl py-8 px-4 md:py-12">
      <article>
        <header className="mb-8">
          <Badge variant="secondary" className="mb-2 capitalize">{article.category}</Badge>
          <h1 className="text-3xl md:text-5xl font-extrabold leading-tight tracking-tighter mb-4 font-headline">
            {article.title}
          </h1>
          <div className="flex items-center space-x-4 text-sm text-muted-foreground">
            <div className="flex items-center gap-2">
              <Avatar className="h-8 w-8">
                {authorAvatar && <AvatarImage src={authorAvatar.imageUrl} alt={author?.name} data-ai-hint={authorAvatar.imageHint}/>}
                <AvatarFallback>{author?.name.charAt(0)}</AvatarFallback>
              </Avatar>
              <span>{author?.name || 'Unknown Author'}</span>
            </div>
            <span>•</span>
            <time dateTime={article.date}>{article.date}</time>
          </div>
        </header>

        {heroImage && (
          <div className="relative w-full h-64 md:h-96 mb-8 rounded-lg overflow-hidden">
            <Image
              src={heroImage.imageUrl}
              alt={article.title}
              fill
              className="object-cover"
              priority
              data-ai-hint={heroImage.imageHint}
            />
          </div>
        )}

        <div className="prose prose-lg max-w-none dark:prose-invert">
          <ArticleSummarizer articleContent={article.content} />
          <p className="lead text-xl text-muted-foreground">{article.excerpt}</p>
          {article.content.split('\n\n').map((paragraph, index) => (
            <p key={index}>{paragraph}</p>
          ))}
        </div>

        <Separator className="my-8" />

        <div className="flex items-center justify-between">
          <span className="text-sm font-semibold">Məqaləni paylaş:</span>
          <div className="flex gap-2">
            <Button variant="outline" size="icon">
              <Share2 className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </article>

      <Separator className="my-12" />

      <CommentSection articleSlug={article.slug} />

      <Separator className="my-12" />

      <section>
        <h2 className="text-2xl font-bold mb-6 font-headline">Oxşar Məzmun</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {relatedArticles.map((relatedArticle) => (
            <ArticleCard key={relatedArticle.slug} article={relatedArticle} />
          ))}
        </div>
      </section>
    </div>
  );
}
