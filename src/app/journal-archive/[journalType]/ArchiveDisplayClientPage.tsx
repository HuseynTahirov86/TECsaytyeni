
"use client";

import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Download, BookOpen } from "lucide-react";
import { motion } from 'framer-motion';
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { type JournalArchive } from '@/app/ndutecnaxcivan19692025tec/journal-archive/archive-form';


interface ArchiveDisplayClientPageProps {
  archives: JournalArchive[];
  title: string;
}

export default function ArchiveDisplayClientPage({ archives, title }: ArchiveDisplayClientPageProps) {

  const FADE_IN_ANIMATION_SETTINGS = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.8, ease: "easeInOut" },
  };

  return (
    <motion.div 
      className="container mx-auto px-4 py-12"
      initial="initial"
      animate="animate"
      variants={{
        initial: { opacity: 0 },
        animate: { opacity: 1, transition: { staggerChildren: 0.2, duration: 0.8 } },
      }}
    >
      <motion.header 
        className="text-center mb-12"
        variants={FADE_IN_ANIMATION_SETTINGS}
      >
        <h1 className="text-4xl font-extrabold tracking-tight text-primary lg:text-5xl">
          {title}
        </h1>
        <p className="mt-4 max-w-2xl mx-auto text-lg text-muted-foreground">
          Jurnalımızın bütün dərc olunmuş buraxılışları.
        </p>
      </motion.header>
      
      <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {archives.length > 0 ? (
          archives.map((item) => (
            <motion.div key={item.id} variants={FADE_IN_ANIMATION_SETTINGS}>
                <Card className="flex flex-col h-full overflow-hidden transition-all duration-300 hover:shadow-xl hover:border-primary/30">
                    <CardHeader className="p-0">
                        <img
                          src={item.imageUrl || "https://placehold.co/300x400.png"}
                          alt={item.title}
                          className="w-full object-cover aspect-[3/4]"
                          data-ai-hint="journal cover"
                        />
                    </CardHeader>
                    <CardContent className="p-4 flex-grow">
                      <CardTitle className="text-lg font-bold line-clamp-2">{item.title}</CardTitle>
                    </CardContent>
                  <CardFooter className="p-4 pt-0 mt-auto">
                      <Button asChild className="w-full" variant="secondary">
                        <Link href={item.fileUrl} target="_blank" rel="noopener noreferrer">
                          <Download className="mr-2 h-4 w-4" /> Yüklə
                        </Link>
                      </Button>
                  </CardFooter>
                </Card>
            </motion.div>
          ))
        ) : (
          <div className="md:col-span-2 lg:col-span-3 xl:col-span-4 text-center text-muted-foreground mt-8 p-8 border-dashed border-2 rounded-lg">
            <BookOpen className="mx-auto h-12 w-12 mb-4"/>
            <h3 className="text-xl font-semibold">Arxiv Boşdur</h3>
            <p>Bu jurnal üçün hələ heç bir buraxılış əlavə edilməyib.</p>
          </div>
        )}
      </div>
    </motion.div>
  );
}
