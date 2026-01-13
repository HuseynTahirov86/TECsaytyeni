
"use client";

import { useState, useMemo, useEffect } from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { libraryCategories } from "@/lib/placeholder-data";
import { Search, Download } from "lucide-react";
import { collection, getDocs, orderBy, query } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { Skeleton } from "@/components/ui/skeleton";
import Link from "next/link";
import { LibraryEntry } from "../ndutecnaxcivan19692025tec/library/library-form";
import { motion } from 'framer-motion';
import { Button } from "@/components/ui/button";

export default function LibraryClientPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("Bütün");
  const [entries, setEntries] = useState<LibraryEntry[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const FADE_IN_ANIMATION_SETTINGS = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.8, ease: "easeInOut" },
  };

  useEffect(() => {
    const fetchLibraryEntries = async () => {
      setIsLoading(true);
      try {
        const q = query(collection(db, "library"), orderBy("title"));
        const querySnapshot = await getDocs(q);
        const entryList = querySnapshot.docs.map(doc => {
          const data = doc.data();
          return {
            id: doc.id,
            ...data,
          } as LibraryEntry;
        });
        setEntries(entryList);
      } catch (error) {
        console.error("Error fetching library entries:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchLibraryEntries();
  }, []);

  const filteredEntries = useMemo(() => {
    return entries.filter((item) => {
      const matchesSearch = item.title.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory = selectedCategory === "Bütün" || item.category === selectedCategory;
      return matchesSearch && matchesCategory;
    });
  }, [searchQuery, selectedCategory, entries]);

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
          Elektron Kitabxana
        </h1>
        <p className="mt-4 max-w-2xl mx-auto text-lg text-muted-foreground">
          Elmi məqalələr, jurnallar və kitablar toplusunu kəşf edin.
        </p>
      </motion.header>
      
      <motion.div 
        className="flex flex-col md:flex-row gap-4 mb-8"
        variants={FADE_IN_ANIMATION_SETTINGS}
      >
        <div className="relative flex-grow">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
          <Input 
            type="search"
            placeholder="Başlığa görə axtar..."
            className="pl-10"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <Select value={selectedCategory} onValueChange={setSelectedCategory}>
          <SelectTrigger className="w-full md:w-[200px]">
            <SelectValue placeholder="Kateqoriyaya görə süzgəclə" />
          </SelectTrigger>
          <SelectContent>
            {libraryCategories.map(category => (
              <SelectItem key={category} value={category}>{category}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </motion.div>

      <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {isLoading ? (
          Array.from({ length: 8 }).map((_, i) => (
            <Card key={i} className="flex flex-col">
              <CardHeader className="p-0">
                <Skeleton className="w-full aspect-[3/4] rounded-t-lg" />
              </CardHeader>
              <CardContent className="p-4 flex-grow">
                <Skeleton className="h-5 w-3/4 mb-2" />
                <Skeleton className="h-4 w-1/2" />
              </CardContent>
              <CardFooter className="p-4 pt-0">
                <Skeleton className="h-9 w-full" />
              </CardFooter>
            </Card>
          ))
        ) : filteredEntries.length > 0 ? (
          filteredEntries.map((item) => (
            <motion.div key={item.id} variants={FADE_IN_ANIMATION_SETTINGS}>
                <Card className="flex flex-col h-full overflow-hidden transition-all duration-300 hover:shadow-xl hover:border-primary/30">
                  <Link href={`/library/${item.slug}`} className="group block">
                    <CardHeader className="p-0">
                        <img
                          src={item.imageUrl || "https://placehold.co/300x400.png"}
                          alt={item.title}
                          className="w-full object-cover aspect-[3/4] transition-transform duration-300 group-hover:scale-105"
                          data-ai-hint={item.imageHint}
                        />
                    </CardHeader>
                    <CardContent className="p-4 flex-grow">
                      <CardTitle className="text-lg font-bold group-hover:text-primary transition-colors line-clamp-2">{item.title}</CardTitle>
                      <CardDescription className="mt-1 text-sm">{item.category}</CardDescription>
                    </CardContent>
                  </Link>
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
            <h3 className="text-xl font-semibold">Material Tapılmadı</h3>
            <p>Axtarışınızı və ya filtrlərinizi dəyişməyə çalışın.</p>
          </div>
        )}
      </div>
    </motion.div>
  );
}
