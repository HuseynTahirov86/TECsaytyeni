
"use client";

import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { ArrowRight, Calendar, Users } from 'lucide-react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { collection, getDocs, limit, orderBy, query, Timestamp } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { Skeleton } from '@/components/ui/skeleton';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from '@/components/ui/carousel';
import { formatDate } from '@/lib/utils';
import type { SecNewsArticle } from '../../ndutecnaxcivan19692025tec/sec-blog/form';
import type { ProjectArticle } from '../../ndutecnaxcivan19692025tec/projects/project-form';

export default function GymnasiumSECPage() {
    const [newsItems, setNewsItems] = useState<SecNewsArticle[]>([]);
    const [projects, setProjects] = useState<ProjectArticle[]>([]);
    const [isLoadingNews, setIsLoadingNews] = useState(true);
    const [isLoadingProjects, setIsLoadingProjects] = useState(true);

    useEffect(() => {
        const fetchData = async (collectionName: string, setter: Function, setLoading: Function, limitCount: number) => {
            setLoading(true);
            try {
                let q = query(collection(db, collectionName), orderBy("date", "desc"), limit(limitCount));
                const querySnapshot = await getDocs(q);
                let itemList = querySnapshot.docs.map(doc => {
                    const data = doc.data();
                    return {
                        id: doc.id,
                        ...data,
                        date: data.date instanceof Timestamp ? data.date.toDate().toISOString().split('T')[0] : data.date
                    }
                });
                setter(itemList);
            } catch (error) {
                console.error(`Error fetching ${collectionName}:`, error);
            } finally {
                setLoading(false);
            }
        };

        fetchData("secNews", setNewsItems, setIsLoadingNews, 6);
        fetchData("secProjects", setProjects, setIsLoadingProjects, 3);
    }, []);

    const motionProps = {
        initial: { opacity: 0, y: 20 },
        whileInView: { opacity: 1, y: 0 },
        viewport: { once: true },
        transition: { duration: 0.8 }
    };

    return (
        <motion.div 
            className="flex flex-col"
            initial="initial"
            animate="animate"
            variants={{
                initial: { opacity: 0 },
                animate: { opacity: 1, transition: { staggerChildren: 0.1 } },
            }}
        >
            <section className="relative flex h-[60vh] items-center justify-center bg-gray-100 dark:bg-gray-800">
                <div className="absolute inset-0 bg-cover bg-center opacity-20" style={{ backgroundImage: "url('/tecson2.png')" }}></div>
                <div className="relative z-10 text-center">
                    <motion.h1 {...motionProps} className="text-4xl font-extrabold tracking-tight text-primary lg:text-6xl">
                        NDU Gimnaziya Şagird Elmi Cəmiyyəti
                    </motion.h1>
                    <motion.p {...motionProps} transition={{delay: 0.2}} className="mt-4 max-w-2xl mx-auto text-lg text-muted-foreground">
                        Gənc tədqiqatçıların elmə atdığı ilk addımlar.
                    </motion.p>
                    <motion.div {...motionProps} transition={{delay: 0.4}} className="mt-8 flex justify-center gap-4">
                        <Button asChild size="lg">
                            <Link href="/affiliated-bodies/gymnasium-sec/about">
                                Daha Çox Öyrən <ArrowRight className="ml-2 h-4 w-4" />
                            </Link>
                        </Button>
                        <Button asChild size="lg" variant="outline">
                            <Link href="/affiliated-bodies/gymnasium-sec/projects">Layihələrimiz</Link>
                        </Button>
                    </motion.div>
                </div>
            </section>

            <section className="py-16 md:py-24 bg-white">
                <div className="container mx-auto px-4">
                    <motion.div className="text-center mb-12" {...motionProps}>
                        <h2 className="text-3xl font-bold tracking-tight text-primary sm:text-4xl">Son Xəbərlər</h2>
                        <p className="mt-3 max-w-2xl mx-auto text-lg text-muted-foreground">Cəmiyyətimizdə baş verən ən son hadisələr və yeniliklər.</p>
                    </motion.div>
                    <motion.div {...motionProps}>
                        <Carousel opts={{ align: "start" }} className="w-full">
                            <CarouselContent>
                                {isLoadingNews ? (
                                    Array.from({ length: 3 }).map((_, index) => (
                                        <CarouselItem key={index} className="md:basis-1/2 lg:basis-1/3">
                                            <div className="p-2 h-full"><Skeleton className="w-full h-96 rounded-lg"/></div>
                                        </CarouselItem>
                                    ))
                                ) : newsItems.length > 0 ? (
                                     newsItems.map((item) => (
                                    <CarouselItem key={item.id} className="md:basis-1/2 lg:basis-1/3">
                                        <div className="p-2 h-full">
                                            <Link href={`/affiliated-bodies/gymnasium-sec/blog/${item.slug}`} className="block h-full group">
                                                <Card className="h-full overflow-hidden transition-all duration-300 group-hover:shadow-xl group-hover:border-primary/30">
                                                    <CardHeader className="p-0">
                                                        <img src={item.imageUrl || "https://placehold.co/600x400.png"} alt={item.title} className="w-full object-cover aspect-[3/2]"/>
                                                    </CardHeader>
                                                    <CardContent className="p-6">
                                                        <p className="text-sm text-muted-foreground">{formatDate(item.date)} • <span className="text-accent font-semibold">{item.category}</span></p>
                                                        <CardTitle className="mt-2 text-xl font-semibold leading-snug group-hover:text-primary transition-colors">{item.title}</CardTitle>
                                                    </CardContent>
                                                </Card>
                                            </Link>
                                        </div>
                                    </CarouselItem>
                                    ))
                                ) : (
                                    <div className="w-full text-center text-muted-foreground py-8">
                                        <p>Heç bir xəbər tapılmadı.</p>
                                    </div>
                                )}
                            </CarouselContent>
                            <CarouselPrevious className="ml-12 hidden sm:flex" />
                            <CarouselNext className="mr-12 hidden sm:flex" />
                        </Carousel>
                    </motion.div>
                </div>
            </section>

             <section className="bg-muted/40 py-16 md:py-24">
                <div className="container mx-auto px-4">
                  <motion.div className="text-center mb-12" {...motionProps}>
                    <h2 className="text-3xl font-bold tracking-tight text-primary sm:text-4xl">Layihələrimiz</h2>
                    <p className="mt-3 max-w-2xl mx-auto text-lg text-muted-foreground">Şagirdlərimizin elmi yaradıcılığının məhsulu olan tədqiqatlar.</p>
                  </motion.div>
                   <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
                    {isLoadingProjects ? (
                      Array.from({length: 3}).map((_, index) => (
                        <motion.div {...motionProps} key={index}>
                            <Skeleton className="w-full h-96 rounded-lg"/>
                        </motion.div>
                      ))
                    ) : projects.length > 0 ? (
                        projects.map((project, index) => (
                      <motion.div
                        key={project.id}
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8, delay: index * 0.1 }}
                      >
                        <Link href={`/affiliated-bodies/gymnasium-sec/projects/${project.slug}`} className="block h-full group">
                            <Card className="flex flex-col h-full overflow-hidden transition-transform duration-300 group-hover:-translate-y-2 group-hover:shadow-xl">
                                <CardHeader className="p-0">
                                    <img src={project.imageUrl || "https://placehold.co/600x400.png"} alt={project.title} className="w-full object-cover aspect-[3/2]" />
                                </CardHeader>
                                <CardContent className="p-6 flex-grow">
                                <CardTitle className="text-xl font-bold group-hover:text-primary transition-colors">{project.title}</CardTitle>
                                <CardDescription className="mt-2 text-base line-clamp-3">{project.description}</CardDescription>
                                </CardContent>
                                <CardFooter className="p-6 pt-0 flex justify-between items-center text-sm text-muted-foreground">
                                    <div className="flex items-center gap-2">
                                        <Users className="h-4 w-4 text-accent" />
                                        <span className="truncate">{project.team.join(', ')}</span>
                                    </div>
                                    {project.date && (
                                        <div className="flex items-center gap-2">
                                            <Calendar className="h-4 w-4 text-accent" />
                                            <span>{formatDate(project.date)}</span>
                                        </div>
                                    )}
                                </CardFooter>
                            </Card>
                        </Link>
                      </motion.div>
                        ))
                    ) : (
                         <div className="md:col-span-3 text-center text-muted-foreground py-8">
                            <p>Heç bir layihə tapılmadı.</p>
                        </div>
                    )}
                  </div>
                </div>
              </section>
        </motion.div>
    );
}
