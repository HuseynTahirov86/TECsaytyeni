
import type { Metadata, ResolvingMetadata } from 'next';
import { collection, query, where, getDocs, Timestamp } from "firebase/firestore";
import { db } from "@/lib/firebase";
import React from 'react';
import ArticleClientPage from './ArticleClientPage';
import type { NewsArticle } from '../../../../ndutecnaxcivan19692025tec/news/news-form';


type Props = {
  params: { slug: string }
}

async function getArticle(slug: string): Promise<NewsArticle | null> {
    const q = query(collection(db, "secNews"), where("slug", "==", slug));
    const querySnapshot = await getDocs(q);

    if (querySnapshot.empty) {
        return null;
    }
    const docSnap = querySnapshot.docs[0];
    const data = docSnap.data();
    return {
        id: docSnap.id,
        ...data,
        date: data.date instanceof Timestamp ? data.date.toDate().toISOString().split('T')[0] : data.date,
    } as NewsArticle;
}

export async function generateMetadata(
  { params }: Props,
  parent: ResolvingMetadata
): Promise<Metadata> {
  const slug = params.slug;
  const article = await getArticle(slug);

  if (!article) {
    return {
      title: 'Məqalə Tapılmadı',
    }
  }

  const previousImages = (await parent).openGraph?.images || []

  return {
    title: article.title,
    description: article.description,
    openGraph: {
      title: article.title,
      description: article.description,
      type: 'article',
      publishedTime: new Date(article.date).toISOString(),
      authors: ['NDU Gimnaziya Şagird Elmi Cəmiyyəti'],
      images: [
        {
          url: article.imageUrl,
          width: 1200,
          height: 630,
          alt: article.title,
        },
        ...previousImages,
      ],
    },
  }
}

export default async function ArticleDetailPage({ params }: { params: { slug: string } }) {
  const article = await getArticle(params.slug);

  if (!article) {
    return (
      <div className="container mx-auto max-w-4xl px-4 py-12 text-center">
        <h1 className="text-2xl font-bold">Məqalə Tapılmadı</h1>
        <p className="text-muted-foreground mt-2">Bu məqalə mövcud deyil və ya silinib.</p>
      </div>
    );
  }

  return (
      <ArticleClientPage article={article} />
  );
}
