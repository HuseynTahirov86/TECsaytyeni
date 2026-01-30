
"use client";

import { useState, useMemo, useEffect } from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { blogCategories } from "@/lib/placeholder-data";
import { Search } from "lucide-react";
import { collection, getDocs, Timestamp, orderBy, query } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { Skeleton } from "@/components/ui/skeleton";
import Link from "next/link";
import { motion } from 'framer-motion';
import { formatDate } from "@/lib/utils";

// Using the main NewsArticle interface, can be specified if needed
import type { NewsArticle } from "../../../ndutecnaxcivan19692025tec/news/news-form";

export default function BlogClientPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("Bütün");
  const [newsItems, setNewsItems] = useState<NewsArticle[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const FADE_IN_ANIMATION_SETTINGS = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.8, ease: "easeInOut" },
  };

  useEffect(() => {
    const fetchNews = async () => {
      setIsLoading(true);
      try {
        const q = query(collection(db, "secNews"), orderBy("date", "desc"));
        const querySnapshot = await getDocs(q);
        const newsList = querySnapshot.docs.map(doc => {
          const data = doc.data();
          return {
            id: doc.id,
            ...data,
            date: data.date instanceof Timestamp ? data.date.toDate().toISOString().split('T')[0] : data.date,
          } as NewsArticle;
        });
        setNewsItems(newsList);
      } catch (error) {
        console.error("Error fetching SEC news:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchNews();
  }, []);

  const filteredNews = useMemo(() => {
    return newsItems.filter((item) => {
      const matchesSearch = item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                            item.description.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory = selectedCategory === "Bütün" || item.category === selectedCategory;
      return matchesSearch && matchesCategory;
    });
  }, [searchQuery, selectedCategory, newsItems]);

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
          Xəbərlər & Bloq
        </h1>
        <p className="mt-4 max-w-2xl mx-auto text-lg text-muted-foreground">
          Şagird Elmi Cəmiyyətinin fəaliyyəti, tədbirləri və uğurları.
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
            placeholder="Məqalələri axtar..."
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
            {blogCategories.map(category => (
              <SelectItem key={category} value={category}>{category}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </motion.div>

      <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
        {isLoading ? (
          Array.from({ length: 3 }).map((_, i) => (
            <Card key={i} className="flex flex-col">
              <CardHeader className="p-0">
                <Skeleton className="w-full aspect-[3/2] rounded-t-lg" />
              </CardHeader>
              <CardContent className="p-6 flex-grow">
                <Skeleton className="h-6 w-3/4 mb-2" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-5/6 mt-2" />
              </CardContent>
              <CardFooter className="p-6 pt-0">
                <Skeleton className="h-4 w-1/4" />
              </CardFooter>
            </Card>
          ))
        ) : filteredNews.length > 0 ? (
          filteredNews.map((item) => (
            <motion.div key={item.id} variants={FADE_IN_ANIMATION_SETTINGS}>
              <Link href={`/affiliated-bodies/gymnasium-sec/blog/${item.slug}`} className="group">
                <Card className="flex flex-col h-full overflow-hidden transition-all duration-300 group-hover:shadow-xl group-hover:border-primary/30">
                  <CardHeader className="p-0">
                      <img
                        src={item.imageUrl || "https://placehold.co/600x400.png"}
                        alt={item.title}
                        className="w-full object-cover aspect-[3/2] transition-transform duration-300 group-hover:scale-105"
                      />
                  </CardHeader>
                  <CardContent className="p-6 flex-grow">
                    <CardTitle className="text-xl font-bold group-hover:text-primary transition-colors">{item.title}</CardTitle>
                    <CardDescription className="mt-2 text-base line-clamp-3">{item.description}</CardDescription>
                  </CardContent>
                  <CardFooter className="p-6 pt-0 flex justify-between items-center">
                      <p className="text-sm font-medium text-accent">{item.category}</p>
                      <p className="text-sm text-muted-foreground">{formatDate(item.date)}</p>
                  </CardFooter>
                </Card>
              </Link>
            </motion.div>
          ))
        ) : (
          <div className="md:col-span-2 lg:col-span-3 text-center text-muted-foreground mt-8 p-8 border-dashed border-2 rounded-lg">
            <h3 className="text-xl font-semibold">Məqalə Tapılmadı</h3>
            <p>Bu bölmə üçün hələ heç bir xəbər əlavə edilməyib.</p>
          </div>
        )}
      </div>
    </motion.div>
  );
}
