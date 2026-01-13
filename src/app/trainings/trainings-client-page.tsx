
"use client";
import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar, ArrowRight, GraduationCap } from "lucide-react";
import { collection, getDocs, orderBy, query, Timestamp } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { Skeleton } from '@/components/ui/skeleton';
import { Training } from '../ndutecnaxcivan19692025tec/trainings/training-form';
import Link from 'next/link';
import { motion } from 'framer-motion';

const formatDate = (dateString: string) => {
    if (!dateString) return '';
    const date = new Date(dateString);
     if (isNaN(date.getTime())) return '';
    
    // Set time to UTC midnight to avoid timezone issues
    date.setUTCHours(0, 0, 0, 0);

    const options: Intl.DateTimeFormatOptions = {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        timeZone: 'UTC'
    };
    return new Intl.DateTimeFormat('az-AZ', options).format(date);
};

export function TrainingsClientPage() {
  const [trainings, setTrainings] = useState<Training[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isClient, setIsClient] = useState(false);

  const FADE_IN_ANIMATION_SETTINGS = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.8, ease: "easeInOut" },
  };

  useEffect(() => {
    setIsClient(true);
    const fetchTrainings = async () => {
      setIsLoading(true);
      try {
        const q = query(collection(db, "trainings"), orderBy("date", "desc"));
        const querySnapshot = await getDocs(q);
        if (!querySnapshot.empty) {
            const trainingList = querySnapshot.docs.map(doc => {
            const data = doc.data();
            return {
                id: doc.id,
                ...data,
                date: data.date instanceof Timestamp ? data.date.toDate().toISOString().split('T')[0] : data.date,
            } as Training;
            });
            setTrainings(trainingList);
        } else {
            setTrainings([]);
        }
      } catch (error) {
        console.error("Error fetching trainings:", error);
        setTrainings([]);
      } finally {
        setIsLoading(false);
      }
    };
    fetchTrainings();
  }, []);

  return (
    <motion.div 
      initial="initial"
      animate="animate"
      variants={{
        initial: { opacity: 0 },
        animate: { opacity: 1, transition: { staggerChildren: 0.2, duration: 0.8 } },
      }}
    >
        <h1 className="text-3xl font-bold mb-6">Bütün Təlimlər</h1>
        <div className="grid md:grid-cols-2 gap-6">
            {isLoading ? (
            Array.from({ length: 4 }).map((_, i) => (
                <Card key={i} className="w-full">
                    <Skeleton className="w-full aspect-video rounded-t-lg" />
                    <CardHeader>
                        <Skeleton className="h-7 w-3/4 mb-2" />
                    </CardHeader>
                    <CardContent>
                        <Skeleton className="h-4 w-full" />
                        <Skeleton className="h-4 w-5/6 mt-2" />
                    </CardContent>
                </Card>
            ))
            ) : trainings.length > 0 ? (
            trainings.map((training) => (
                <motion.div key={training.id} variants={FADE_IN_ANIMATION_SETTINGS}>
                <Link href={`/trainings/${training.slug}`} className="group block h-full">
                    <Card className="w-full transition-shadow group-hover:shadow-lg h-full flex flex-col">
                        <div className="overflow-hidden rounded-t-lg">
                           <img
                                src={training.imageUrl || 'https://placehold.co/600x400.png'}
                                alt={training.title}
                                className="w-full aspect-video object-cover transition-transform duration-300 group-hover:scale-105"
                                data-ai-hint={training.imageHint}
                           />
                        </div>
                        <CardHeader>
                            <CardTitle className="text-xl group-hover:text-primary transition-colors">{training.title}</CardTitle>
                        </CardHeader>
                        <CardContent className="flex-grow">
                            <p className="text-sm text-muted-foreground line-clamp-3">{training.description}</p>
                        </CardContent>
                        <div className="p-6 pt-0 flex justify-between items-center text-sm text-muted-foreground">
                            <div className="flex items-center gap-2">
                                <Calendar className="h-4 w-4 text-accent"/>
                                <span>{isClient ? formatDate(training.date) : '...'}</span>
                            </div>
                            <p className="text-primary font-semibold inline-flex items-center">
                                Daha çox
                                <ArrowRight className="ml-1 h-4 w-4 transition-transform group-hover:translate-x-1" />
                            </p>
                        </div>
                    </Card>
                </Link>
                </motion.div>
            ))
            ) : (
            <div className="md:col-span-2 text-center text-muted-foreground mt-8 p-8 border-dashed border-2 rounded-lg flex flex-col items-center">
                <GraduationCap className="h-12 w-12 mb-4 text-muted-foreground"/>
                <h3 className="text-xl font-semibold">Aktiv Təlim Tapılmadı</h3>
                <p>Hal-hazırda aktiv təlim mövcud deyil. Tezliklə yenidən yoxlayın!</p>
            </div>
            )}
        </div>
    </motion.div>
  );
}
