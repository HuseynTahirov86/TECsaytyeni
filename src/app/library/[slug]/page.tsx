
import type { Metadata, ResolvingMetadata } from 'next';
import { collection, query, where, getDocs } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { LibraryEntry } from "@/app/ndutecnaxcivan19692025tec/library/library-form";
import LibraryClientPage from './LibraryClientPage';
import React from 'react';

type Props = {
  params: { slug: string }
}

async function getLibraryEntry(slug: string): Promise<LibraryEntry | null> {
    const q = query(collection(db, "library"), where("slug", "==", slug));
    const querySnapshot = await getDocs(q);

    if (querySnapshot.empty) {
        return null;
    }
    const docSnap = querySnapshot.docs[0];
    return { id: docSnap.id, ...docSnap.data() } as LibraryEntry;
}

export async function generateMetadata(
  { params }: Props,
  parent: ResolvingMetadata
): Promise<Metadata> {
  const slug = params.slug;
  const entry = await getLibraryEntry(slug);

  if (!entry) {
    return {
      title: 'Material Tapılmadı',
    }
  }

  return {
    title: entry.title,
    description: entry.description,
    openGraph: {
      title: entry.title,
      description: entry.description,
      images: [
        {
          url: entry.imageUrl,
          width: 300,
          height: 400,
          alt: entry.title,
        },
      ],
    },
  }
}

export default async function LibraryEntryDetailPage({ params }: { params: { slug: string } }) {
  const entry = await getLibraryEntry(params.slug);

  if (!entry) {
    return (
      <div className="container mx-auto max-w-4xl px-4 py-12 text-center">
        <h1 className="text-2xl font-bold">Material Tapılmadı</h1>
        <p className="text-muted-foreground mt-2">Bu material mövcud deyil və ya silinib.</p>
      </div>
    );
  }

  return <LibraryClientPage entry={entry} />;
}
