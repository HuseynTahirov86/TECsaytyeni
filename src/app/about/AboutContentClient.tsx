"use client";

import { useState, useEffect } from 'react';
import DOMPurify from 'dompurify';

export function AboutContentClient({ content }: { content: string }) {
    const [sanitizedContent, setSanitizedContent] = useState('');

    useEffect(() => {
        if (content && typeof window !== 'undefined') {
            setSanitizedContent(DOMPurify.sanitize(content));
        }
    }, [content]);

    return (
         <div 
            className="prose prose-lg max-w-none text-foreground/90 prose-headings:text-primary prose-a:text-primary prose-strong:text-foreground"
            dangerouslySetInnerHTML={{ __html: sanitizedContent }}
        />
    );
}
