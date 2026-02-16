
"use client";

import { useState, useEffect } from "react";
import { LibraryEntry } from "@/app/ndutecnaxcivan19692025tec/library/library-form";
import { User, Tag, Download } from "lucide-react";
import { motion } from 'framer-motion';
import DOMPurify from 'dompurify';
import { Button } from "@/components/ui/button";
import Link from "next/link";
import Image from "next/image";

interface LibraryClientPageProps {
  entry: LibraryEntry;
}

export default function LibraryClientPage({ entry }: LibraryClientPageProps) {
  const [sanitizedDescription, setSanitizedDescription] = useState('');
  const [isClient, setIsClient] = useState(false);


  const FADE_IN_ANIMATION_SETTINGS = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.8, ease: "easeInOut" },
  };

  useEffect(() => {
    setIsClient(true);
    if (typeof window !== 'undefined' && entry.description) {
        setSanitizedDescription(DOMPurify.sanitize(entry.description));
    }
  }, [entry.description]);

  return (
    <motion.div 
      className="container mx-auto max-w-5xl px-4 py-12"
      initial="initial"
      animate="animate"
      variants={{
        initial: { opacity: 0 },
        animate: { opacity: 1, transition: { staggerChildren: 0.2, duration: 0.8 } },
      }}
    >
        <motion.div className="grid md:grid-cols-3 gap-8 lg:gap-12" variants={FADE_IN_ANIMATION_SETTINGS}>
            <div className="md:col-span-1">
                 <div className="relative w-full aspect-[3/4] rounded-lg shadow-lg overflow-hidden">
                    <Image
                        src={entry.imageUrl || "https://placehold.co/300x400.png"}
                        alt={entry.title}
                        fill
                        className="object-cover"
                        data-ai-hint={entry.imageHint}
                    />
                 </div>
            </div>
            <div className="md:col-span-2">
                <article>
                    <header className="mb-6">
                        <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight text-primary leading-tight">
                            {entry.title}
                        </h1>
                        <div className="flex flex-wrap items-center gap-x-6 gap-y-2 mt-4 text-sm text-muted-foreground">
                            <div className="flex items-center gap-2">
                                <Tag className="h-4 w-4 text-accent" />
                                <span className="font-medium text-accent">{entry.category}</span>
                            </div>
                        </div>
                    </header>
                    
                    {isClient && <div 
                        className="prose prose-lg max-w-none text-foreground/90 prose-headings:text-primary prose-a:text-primary prose-strong:text-foreground"
                        dangerouslySetInnerHTML={{ __html: sanitizedDescription }}
                    />}
                    
                    <div className="mt-8 pt-6 border-t">
                        <Button asChild size="lg">
                            <Link href={entry.fileUrl} target="_blank" rel="noopener noreferrer">
                                <Download className="mr-2 h-5 w-5" />
                                Yüklə
                            </Link>
                        </Button>
                    </div>
                </article>
            </div>
        </motion.div>
    </motion.div>
  );
}
