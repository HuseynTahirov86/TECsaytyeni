import ArticleCard from "@/components/article-card";
import { getArticles } from "@/lib/data";
import { Bookmark } from "lucide-react";

export default function DashboardPage() {
  // Mock data for bookmarked articles
  const bookmarkedArticles = getArticles().slice(3, 6);

  return (
    <div className="container mx-auto max-w-7xl py-12 px-4 md:px-6">
      <div className="mb-12">
        <h1 className="text-4xl font-extrabold tracking-tight font-headline sm:text-5xl">
          İdarə Paneli
        </h1>
        <p className="mt-4 text-xl text-muted-foreground">
          Xoş gəlmisiniz! Saxlanılan məqalələrinizə buradan baxa bilərsiniz.
        </p>
      </div>

      <div>
        <h2 className="text-2xl font-bold mb-6 flex items-center gap-2 font-headline">
          <Bookmark className="h-6 w-6" />
          Saxlanılan Məqalələr
        </h2>
        {bookmarkedArticles.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {bookmarkedArticles.map((article) => (
              <ArticleCard key={article.slug} article={article} />
            ))}
          </div>
        ) : (
          <div className="text-center py-12 border-2 border-dashed rounded-lg">
            <p className="text-muted-foreground">Heç bir məqalə saxlamamısınız.</p>
          </div>
        )}
      </div>
    </div>
  );
}
