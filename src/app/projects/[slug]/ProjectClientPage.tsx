
"use client";

import { useState, useEffect } from "react";
import { ProjectArticle } from "@/app/ndutecnaxcivan19692025tec/projects/project-form";
import { Users } from "lucide-react";
import { motion } from 'framer-motion';
import DOMPurify from 'dompurify';

interface ProjectClientPageProps {
  project: ProjectArticle;
}

export default function ProjectClientPage({ project }: ProjectClientPageProps) {
  const [sanitizedContent, setSanitizedContent] = useState('');
  const [isClient, setIsClient] = useState(false);


  const FADE_IN_ANIMATION_SETTINGS = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.8, ease: "easeInOut" },
  };

  useEffect(() => {
    setIsClient(true);
    if (typeof window !== 'undefined' && project.content) {
        setSanitizedContent(DOMPurify.sanitize(project.content));
    }
  }, [project.content]);

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
            {project.title}
          </h1>
          <div className="flex items-center gap-6 mt-4 text-sm text-muted-foreground">
            <div className="flex items-center gap-2">
                <Users className="h-4 w-4 text-accent" />
                <span className="font-medium">{project.team.join(', ')}</span>
            </div>
          </div>
        </header>
        
        {project.imageUrl && (
            <div className="mb-8">
                <img
                    src={project.imageUrl}
                    alt={project.title}
                    className="w-full h-auto max-h-[500px] object-cover rounded-lg shadow-lg"
                />
            </div>
        )}

        {isClient && <div 
          className="prose prose-lg max-w-none text-foreground/90 prose-headings:text-primary prose-a:text-primary prose-strong:text-foreground"
          dangerouslySetInnerHTML={{ __html: sanitizedContent }}
        />}
      </motion.article>
    </motion.div>
  );
}
