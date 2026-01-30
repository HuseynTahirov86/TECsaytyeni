
"use client";

import { useState, useEffect } from "react";
import { Calendar, Tag } from "lucide-react";
import { motion } from 'framer-motion';
import DOMPurify from 'dompurify';
import { formatDate } from "@/lib/utils";
import type { NewsArticle } from "../../../../ndutecnaxcivan19692025tec/news/news-form";


interface ArticleClientPageProps {
  article: NewsArticle;
}

export default function ArticleClientPage({ article }: ArticleClientPageProps) {
  const [sanitizedContent, setSanitizedContent] = useState('');

  const FADE_IN_ANIMATION_SETTINGS = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.8, ease: "easeInOut" },
  };

  useEffect(() => {
    if (typeof window !== 'undefined' && article.content) {
      setSanitizedContent(DOMPurify.sanitize(article.content));
    }
  }, [article.content]);
  
  return (
    <motion.div 
      className="container mx-auto max-w-4xl px-4 py-12"
      initial="initial"
      animate="animate"
      variants={{
        initial: { opacity: 0 },
        animate: { opacity: 1, transition: { staggerChildren: 0.2, duration: 0.8 } },
      }}
    >
      <motion.article variants={FADE_IN_ANIMATION_SETTINGS}>
        <header className="mb-8">
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-extrabold tracking-tight text-primary leading-tight">
            {article.title}
          </h1>
          <div className="flex items-center gap-6 mt-4 text-sm text-muted-foreground">
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              <span>{formatDate(article.date)}</span>
            </div>
            <div className="flex items-center gap-2">
                <Tag className="h-4 w-4" />
                <span className="font-medium text-accent">{article.category}</span>
            </div>
          </div>
        </header>
        
        {article.imageUrl && (
            <div className="mb-8">
                <img
                    src={article.imageUrl}
                    alt={article.title}
                    className="w-full h-auto max-h-[500px] object-cover rounded-lg shadow-lg"
                />
            </div>
        )}

        {sanitizedContent && <div 
            className="prose prose-lg max-w-none text-foreground/90 prose-headings:text-primary prose-a:text-primary prose-strong:text-foreground"
            dangerouslySetInnerHTML={{ __html: sanitizedContent }}
        />}
      </motion.article>
    </motion.div>
  );
}
