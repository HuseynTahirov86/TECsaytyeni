
"use client";
import React from 'react';
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardTitle, CardHeader, CardFooter } from "@/components/ui/card";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious, type CarouselApi } from "@/components/ui/carousel";
import Link from "next/link";
import { Users, ArrowRight, BookOpen, FileText, Landmark, Image as ImageIcon, Calendar } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { collection, getDocs, limit, orderBy, query, Timestamp } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { NewsArticle } from './ndutecnaxcivan19692025tec/news/news-form';
import { Skeleton } from '@/components/ui/skeleton';
import { ProjectArticle } from './ndutecnaxcivan19692025tec/projects/project-form';
import type { LibraryEntry } from './ndutecnaxcivan19692025tec/library/library-form';
import type { Aphorism } from './ndutecnaxcivan19692025tec/aphorisms/aphorism-form';
import type { AcademicWritingRule } from './ndutecnaxcivan19692025tec/academic-writing/form';
import type { HeroSlide } from './ndutecnaxcivan19692025tec/hero-slides/slide-form';
import Autoplay from "embla-carousel-autoplay";
import { formatDate } from '@/lib/utils';

const dynamicTexts = [
    "56 ildir tələbələrlə...",
    "#TECləSivilizasiyaGəlir"
];

export default function Home() {
    const [isClient, setIsClient] = React.useState(false);
    const [newsItems, setNewsItems] = React.useState<NewsArticle[]>([]);
    const [projects, setProjects] = React.useState<ProjectArticle[]>([]);
    const [libraryEntries, setLibraryEntries] = React.useState<LibraryEntry[]>([]);
    const [aphorisms, setAphorisms] = React.useState<Aphorism[]>([]);
    const [academicWritingRules, setAcademicWritingRules] = React.useState<AcademicWritingRule[]>([]);
    const [heroSlides, setHeroSlides] = React.useState<HeroSlide[]>([]);

    const [isLoadingNews, setIsLoadingNews] = React.useState(true);
    const [isLoadingProjects, setIsLoadingProjects] = React.useState(true);
    const [isLoadingLibrary, setIsLoadingLibrary] = React.useState(true);
    const [isLoadingAphorisms, setIsLoadingAphorisms] = React.useState(true);
    const [isLoadingAcademicRules, setIsLoadingAcademicRules] = React.useState(true);
    const [isLoadingHero, setIsLoadingHero] = React.useState(true);
    
    const [dynamicTextIndex, setDynamicTextIndex] = React.useState(0);
    const [api, setApi] = React.useState<CarouselApi>()
    const [currentSlide, setCurrentSlide] = React.useState(0)

    const aphorismAutoplay = React.useRef(Autoplay({ delay: 5000, stopOnInteraction: false }));
    const rulesAutoplay = React.useRef(Autoplay({ delay: 4000, stopOnInteraction: true }));
    const heroAutoplay = React.useRef(Autoplay({ delay: 6000, stopOnInteraction: true }))


    React.useEffect(() => {
        if (!api) return;
        
        const onSelect = () => {
          setCurrentSlide(api.selectedScrollSnap())
        }
        
        api.on("select", onSelect)
        onSelect(); // Set initial slide

        return () => {
          api.off("select", onSelect)
        }
    }, [api])


    React.useEffect(() => {
        const interval = setInterval(() => {
            setDynamicTextIndex((prevIndex) => (prevIndex + 1) % dynamicTexts.length);
        }, 4000); // Change text every 4 seconds

        return () => clearInterval(interval);
    }, []);

    React.useEffect(() => {
        setIsClient(true);

        const fetchData = async (collectionName: string, setter: Function, setLoading: Function) => {
            setLoading(true);
            try {
                let q = query(collection(db, collectionName));
                const querySnapshot = await getDocs(q);
                let itemList = querySnapshot.docs.map(doc => {
                    const data = doc.data();
                    // Handle date conversion for specific collections
                    if ((collectionName === 'news' || collectionName === 'projects') && data.date instanceof Timestamp) {
                       return { id: doc.id, ...data, date: data.date.toDate().toISOString().split('T')[0] }
                    }
                    return { id: doc.id, ...data };
                });
                
                // Client-side sorting for projects and news by date
                if (collectionName === 'projects' || collectionName === 'news') {
                    itemList.sort((a, b) => {
                        const dateA = a.date ? new Date(a.date).getTime() : 0;
                        const dateB = b.date ? new Date(b.date).getTime() : 0;
                        if (dateB === dateA) {
                            return a.title?.localeCompare(b.title || '') || 0;
                        }
                        return dateB - dateA;
                    });
                }
                
                setter(itemList);
            } catch (error) {
                console.error(`Error fetching ${collectionName}:`, error);
            } finally {
                setLoading(false);
            }
        };

        const fetchOrderedData = async (collectionName: string, setter: Function, setLoading: Function, orderField: string, itemLimit?: number) => {
             setLoading(true);
             try {
                let q = query(collection(db, collectionName), orderBy(orderField, "asc"));
                if (itemLimit) {
                    q = query(collection(db, collectionName), orderBy(orderField, "asc"), limit(itemLimit));
                }
                const querySnapshot = await getDocs(q);
                const itemList = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
                setter(itemList);
             } catch (error) {
                console.error(`Error fetching ordered ${collectionName}:`, error);
             } finally {
                setLoading(false);
             }
        };
        
        fetchData("news", setNewsItems, setIsLoadingNews);
        fetchData("projects", setProjects, setIsLoadingProjects);
        fetchOrderedData("library", setLibraryEntries, setIsLoadingLibrary, "title", 4);
        fetchOrderedData("aphorisms", setAphorisms, setIsLoadingAphorisms, "order");
        fetchOrderedData("academicWritingRules", setAcademicWritingRules, setIsLoadingAcademicRules, "order");
        fetchOrderedData("heroSlides", setHeroSlides, setIsLoadingHero, "order");

    }, []);

    const motionProps = {
        initial: { opacity: 0, y: 20 },
        whileInView: { opacity: 1, y: 0 },
        viewport: { once: true },
        transition: { duration: 0.8 }
    };

    const textAnimation = {
        initial: { opacity: 0, y: -10 },
        animate: { opacity: 1, y: 0 },
        exit: { opacity: 0, y: 10 },
        transition: { duration: 0.5, ease: "easeInOut" }
    };
    
    const heroContainerVariants = {
        animate: {
            transition: {
                staggerChildren: 0.2,
            },
        },
    };

    const heroItemVariants = {
        initial: { opacity: 0, y: 20 },
        animate: { opacity: 1, y: 0, transition: { duration: 0.8, ease: "easeOut" } },
        exit: { opacity: 0, y: -20, transition: { duration: 0.3, ease: "easeIn" } },
    };

  return (
    <motion.div 
      className="flex flex-col bg-background overflow-x-hidden"
      initial="initial"
      animate="animate"
      variants={{
        initial: { opacity: 0 },
        animate: { opacity: 1, transition: { staggerChildren: 0.1, delayChildren: 0.2 } },
      }}
    >
        <section className="w-full relative h-[60vh] sm:h-[80vh] lg:h-auto">
             <Carousel 
                className="w-full h-full"
                plugins={[heroAutoplay.current]}
                setApi={setApi}
                opts={{ loop: true }}
              >
              <CarouselContent>
                {isLoadingHero ? (
                    <CarouselItem>
                        <Skeleton className="w-full h-[60vh] sm:h-[80vh] lg:h-full lg:aspect-[16/7]" />
                    </CarouselItem>
                ) : heroSlides.map((slide, index) => (
                    <CarouselItem key={slide.id}>
                        <div className="relative w-full h-[60vh] sm:h-[80vh] lg:h-full lg:aspect-[16/7]">
                            <Image
                                src={slide.imageUrl}
                                alt={slide.title || `Hero Slide ${index + 1}`}
                                fill
                                className="object-cover"
                                priority={index === 0}
                            />
                        </div>
                    </CarouselItem>
                ))}
              </CarouselContent>
              <div className="absolute inset-0 flex items-center justify-start text-left bg-gradient-to-r from-black/70 to-black/30">
                  <div className="container mx-auto px-4">
                      <AnimatePresence>
                        {heroSlides[currentSlide]?.type === 'main' && (
                            <motion.div 
                                variants={heroContainerVariants}
                                initial="initial"
                                animate="animate"
                                exit="exit"
                                className="relative z-10 max-w-md lg:max-w-2xl">
                                
                                <motion.h1 variants={heroItemVariants} className="text-3xl sm:text-4xl lg:text-6xl font-extrabold tracking-tight text-white drop-shadow-lg">
                                  <span className="block lg:whitespace-nowrap">Naxçıvan Dövlət Universiteti</span>
                                  <span className="block text-2xl sm:text-3xl lg:text-4xl mt-1 text-white">Tələbə Elmi Cəmiyyəti</span>
                                </motion.h1>
                                
                                <motion.div variants={heroItemVariants}>
                                    <AnimatePresence mode="wait">
                                    <motion.p
                                        key={dynamicTextIndex}
                                        initial={textAnimation.initial}
                                        animate={textAnimation.animate}
                                        exit={textAnimation.exit}
                                        transition={textAnimation.transition}
                                        className="mt-4 text-lg sm:text-xl font-normal italic text-white drop-shadow-md"
                                    >
                                        {dynamicTexts[dynamicTextIndex]}
                                    </motion.p>
                                    </AnimatePresence>
                                </motion.div>
                                <motion.div variants={heroItemVariants} className="mt-8 flex flex-col sm:flex-row gap-4">
                                    <Button size="lg" asChild>
                                        <Link href="/about">Daha çox <ArrowRight className="ml-2 h-5 w-5" /></Link>
                                    </Button>
                                    <Button size="lg" variant="secondary" asChild>
                                        <Link href="/projects">Layihələrimiz <ArrowRight className="ml-2 h-5 w-5" /></Link>
                                    </Button>
                                </motion.div>
                            </motion.div>
                        )}
                      </AnimatePresence>
                  </div>
              </div>
            </Carousel>
        </section>

      <section className="py-16 md:py-24 bg-primary/5">
        <div className="container mx-auto px-4">
          <motion.div 
            className="text-center mb-12"
            {...motionProps}
          >
            <h2 className="text-3xl font-bold tracking-tight text-primary sm:text-4xl">
              Elm və təhsil haqqında kəlamlar
            </h2>
             <p className="mt-3 max-w-2xl mx-auto text-lg text-muted-foreground">
              Böyük mütəfəkkirlərdən ilhamverici fikirlər.
            </p>
          </motion.div>
           <motion.div {...motionProps}>
            <Carousel 
                opts={{ align: "start", loop: true }} 
                plugins={[aphorismAutoplay.current]}
                className="w-full"
              >
                <CarouselContent>
                {isLoadingAphorisms ? (
                  Array.from({length: 4}).map((_, index) => (
                    <CarouselItem key={index} className="basis-1/2 md:basis-1/3 lg:basis-1/4">
                       <div className="p-1">
                          <Skeleton className="w-full aspect-square rounded-lg"/>
                       </div>
                    </CarouselItem>
                  ))
                ) : aphorisms.map((item) => (
                    <CarouselItem key={item.id} className="basis-1/2 md:basis-1/3 lg:basis-1/4">
                      <div className="p-1">
                          <img
                            src={item.imageUrl || "https://placehold.co/400x500.png"}
                            alt={`Aphorism ${item.id}`}
                            width="400"
                            height="500"
                            className="w-full object-cover aspect-square rounded-lg shadow-md"
                          />
                      </div>
                    </CarouselItem>
                ))}
                </CarouselContent>
            </Carousel>
          </motion.div>
        </div>
      </section>

      <section className="py-16 md:py-24 bg-background">
        <div className="container mx-auto px-4">
          <motion.div 
            className="text-center mb-12"
            {...motionProps}
          >
            <h2 className="text-3xl font-bold tracking-tight text-primary sm:text-4xl">
              Son Xəbərlər
            </h2>
             <p className="mt-3 max-w-2xl mx-auto text-lg text-muted-foreground">
              Klubumuzda baş verən ən son hadisələr və yeniliklər.
            </p>
          </motion.div>
          <motion.div {...motionProps}>
            <Carousel opts={{ align: "start" }} className="w-full">
                <CarouselContent>
                {isLoadingNews ? (
                  Array.from({length: 3}).map((_, index) => (
                    <CarouselItem key={index} className="md:basis-1/2 lg:basis-1/3">
                       <div className="p-2 h-full">
                        <Card className="h-full">
                            <CardHeader className="p-0"><Skeleton className="w-full aspect-[3/2] rounded-t-lg"/></CardHeader>
                            <CardContent className="p-6 space-y-3">
                                <Skeleton className="h-4 w-3/4"/>
                                <Skeleton className="h-6 w-full"/>
                                <Skeleton className="h-4 w-1/2"/>
                            </CardContent>
                        </Card>
                       </div>
                    </CarouselItem>
                  ))
                ) : newsItems.slice(0, 6).map((item) => (
                    <CarouselItem key={item.id} className="md:basis-1/2 lg:basis-1/3">
                      <div className="p-2 h-full">
                        <Link href={`/blog/${item.slug}`} className="block h-full group">
                            <Card className="h-full overflow-hidden transition-all duration-300 group-hover:shadow-xl group-hover:border-primary/30">
                            <CardHeader className="p-0">
                                <img
                                    src={item.imageUrl || "https://placehold.co/600x400.png"}
                                    alt={item.title}
                                    width="600"
                                    height="400"
                                    className="w-full object-cover aspect-[3/2]"
                                    data-ai-hint={item.imageHint}
                                />
                            </CardHeader>
                            <CardContent className="p-6">
                                <p className="text-sm text-muted-foreground">{isClient && item.date ? formatDate(item.date) : '...'} &bull; <span className="text-accent font-semibold">{item.category}</span></p>
                                <CardTitle className="mt-2 text-xl font-semibold leading-snug group-hover:text-primary transition-colors">{item.title}</CardTitle>
                                <p className="mt-4 text-primary inline-flex items-center">
                                    Ətraflı <ArrowRight className="ml-1 h-4 w-4" />
                                </p>
                            </CardContent>
                            </Card>
                        </Link>
                      </div>
                    </CarouselItem>
                ))}
                </CarouselContent>
                <CarouselPrevious className="ml-12 hidden sm:flex" />
                <CarouselNext className="mr-12 hidden sm:flex" />
            </Carousel>
          </motion.div>
        </div>
      </section>

      <section className="py-16 md:py-24 bg-primary/5">
        <div className="container mx-auto px-4">
            <motion.div 
                className="text-center mb-12"
                {...motionProps}
            >
                <h2 className="text-3xl font-bold tracking-tight text-primary sm:text-4xl">
                Akademik Yazının 10 Qızıl Qaydası
                </h2>
                <p className="mt-3 max-w-2xl mx-auto text-lg text-muted-foreground">
                Elmi işlərinizdə uğur qazanmaq üçün əsas prinsiplər.
                </p>
            </motion.div>
            <motion.div {...motionProps}>
                <Carousel 
                    opts={{ align: "start", loop: true }} 
                    plugins={[rulesAutoplay.current]}
                    className="w-full"
                >
                    <CarouselContent>
                        {isLoadingAcademicRules ? (
                          Array.from({length: 4}).map((_, index) => (
                            <CarouselItem key={index} className="md:basis-1/2">
                               <div className="p-1">
                                  <Skeleton className="w-full aspect-square rounded-lg"/>
                               </div>
                            </CarouselItem>
                          ))
                        ) : academicWritingRules.map((rule) => (
                            <CarouselItem key={rule.id} className="md:basis-1/2">
                                <div className="p-1">
                                    <img
                                        src={rule.imageUrl}
                                        alt={`Qayda ${rule.id}`}
                                        width="400"
                                        height="400"
                                        className="w-full object-cover aspect-square rounded-lg shadow-md"
                                    />
                                </div>
                            </CarouselItem>
                        ))}
                    </CarouselContent>
                     <CarouselPrevious className="ml-12 hidden sm:flex" />
                     <CarouselNext className="mr-12 hidden sm:flex" />
                </Carousel>
            </motion.div>
        </div>
    </section>

       <section className="bg-background py-16 md:py-24">
        <div className="container mx-auto px-4">
          <motion.div 
            className="text-center mb-12"
            {...motionProps}
          >
            <h2 className="text-3xl font-bold tracking-tight text-primary sm:text-4xl">
              Layihələrimiz
            </h2>
            <p className="mt-3 max-w-2xl mx-auto text-lg text-muted-foreground">
              Tələbələrimizin layihələri ilə tanış olun.
            </p>
          </motion.div>
           <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {isLoadingProjects ? (
              Array.from({length: 3}).map((_, index) => (
                <motion.div {...motionProps} key={index}>
                    <Card className="flex flex-col h-full">
                        <CardHeader className="p-0"><Skeleton className="w-full aspect-[3/2] rounded-t-lg"/></CardHeader>
                        <CardContent className="p-6 flex-grow space-y-3">
                            <Skeleton className="h-6 w-full"/>
                            <Skeleton className="h-4 w-5/6"/>
                        </CardContent>
                        <div className="p-6 pt-0">
                             <Skeleton className="h-4 w-1/2"/>
                        </div>
                    </Card>
                </motion.div>
              ))
            ) : projects.slice(0,3).map((project, index) => (
              <motion.div 
                key={project.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, delay: index * 0.1 }}
              >
                <Link href={`/projects/${project.slug}`} className="block h-full group">
                    <Card className="flex flex-col h-full overflow-hidden transition-transform duration-300 group-hover:-translate-y-2 group-hover:shadow-xl">
                        <CardHeader className="p-0">
                            <img
                                src={project.imageUrl || "https://placehold.co/600x400.png"}
                                alt={project.title}
                                width="600"
                                height="400"
                                className="w-full object-cover aspect-[3/2]"
                                data-ai-hint={project.imageHint}
                            />
                        </CardHeader>
                        <CardContent className="p-6 flex-grow">
                        <CardTitle className="text-xl font-bold group-hover:text-primary transition-colors">{project.title}</CardTitle>
                        <CardDescription className="mt-2 text-base">{project.description}</CardDescription>
                        </CardContent>
                        <div className="p-6 pt-0 flex justify-between items-center text-sm text-muted-foreground">
                            <div className="flex items-center gap-2">
                                <Users className="h-4 w-4 text-accent" />
                                <span className="truncate">{project.team.join(', ')}</span>
                            </div>
                            {isClient && project.date && (
                                <div className="flex items-center gap-2">
                                    <Calendar className="h-4 w-4 text-accent" />
                                    <span>{formatDate(project.date)}</span>
                                </div>
                            )}
                        </div>
                    </Card>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 md:py-24 bg-primary/5">
        <div className="container mx-auto px-4">
           <motion.div 
            className="text-center mb-12"
            {...motionProps}
            >
            <h2 className="text-3xl font-bold tracking-tight text-primary sm:text-4xl">
              Elektron Kitabxana
            </h2>
             <p className="mt-3 max-w-2xl mx-auto text-lg text-muted-foreground">
               Son əlavə edilən elmi resursları və kitabları kəşf edin.
            </p>
          </motion.div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {isLoadingLibrary ? (
              Array.from({length: 4}).map((_, index) => (
                <motion.div {...motionProps} key={index}>
                    <Card className="h-full">
                        <CardHeader className="p-0">
                          <Skeleton className="w-full aspect-[3/4] rounded-t-lg"/>
                        </CardHeader>
                        <CardContent className="p-4 space-y-2">
                           <Skeleton className="h-4 w-full"/>
                           <Skeleton className="h-3 w-1/2"/>
                        </CardContent>
                    </Card>
                </motion.div>
              ))
            ) : libraryEntries.map((entry, index) => (
              <motion.div
                key={entry.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, delay: index * 0.1 }}
              >
                  <Card className="flex flex-col h-full overflow-hidden transition-all duration-300 hover:shadow-xl hover:border-primary/30 group">
                    <Link href={`/library/${entry.slug}`} className="block">
                      <CardHeader className="p-0">
                          <img
                            src={entry.imageUrl || "https://placehold.co/300x400.png"}
                            alt={entry.title}
                            className="w-full object-cover aspect-[3/4] transition-transform duration-300 group-hover:scale-105"
                            data-ai-hint={entry.imageHint}
                          />
                      </CardHeader>
                      <CardContent className="p-4">
                        <CardTitle className="text-base font-bold group-hover:text-primary transition-colors line-clamp-2">{entry.title}</CardTitle>
                        <CardDescription className="mt-1 text-xs">{entry.category}</CardDescription>
                      </CardContent>
                    </Link>
                  </Card>
              </motion.div>
            ))}
          </div>
           <motion.div className="text-center mt-12" {...motionProps}>
              <Button size="lg" asChild>
                  <Link href="/library">Bütün Kitabxanaya Bax <ArrowRight className="ml-2 h-5 w-5"/></Link>
              </Button>
           </motion.div>
        </div>
      </section>

      <section className="py-16 md:py-24 bg-background">
        <div className="container mx-auto px-4">
          <motion.div 
            className="text-center mb-12"
            {...motionProps}
          >
            <h2 className="text-3xl font-bold tracking-tight text-primary sm:text-4xl">
              Elmə Töhfə Verin
            </h2>
            <p className="mt-3 max-w-2xl mx-auto text-lg text-muted-foreground">
              Elmi məqalələrinizi və tədqiqatlarınızı jurnallarımızda dərc etdirin.
            </p>
          </motion.div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
              <motion.div {...motionProps}>
                <Card className="h-full text-center p-8 transition-shadow hover:shadow-xl">
                  <CardHeader>
                    <div className="mx-auto bg-primary/10 text-primary p-4 rounded-full w-fit mb-4">
                      <FileText className="h-8 w-8" />
                    </div>
                    <CardTitle className="text-2xl">Tələbə Elmi Jurnalı</CardTitle>
                    <CardDescription className="text-base">
                      Ümumi elmi və fənlərarası tədqiqatlarınızı təqdim edin.
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Button asChild>
                      <Link href="/submit-article/science">İndi Göndər <ArrowRight className="ml-2 h-4 w-4" /></Link>
                    </Button>
                  </CardContent>
                </Card>
              </motion.div>
              <motion.div {...motionProps}>
                <Card className="h-full text-center p-8 transition-shadow hover:shadow-xl">
                    <CardHeader>
                       <div className="mx-auto bg-primary/10 text-primary p-4 rounded-full w-fit mb-4">
                        <Landmark className="h-8 w-8" />
                      </div>
                      <CardTitle className="text-2xl">Tələbə Hüquq Jurnalı</CardTitle>
                      <CardDescription className="text-base">
                        Hüquq elminə dair araşdırmalarınızı və məqalələrinizi bizimlə paylaşın.
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <Button asChild>
                        <Link href="/submit-article/law">İndi Göndər <ArrowRight className="ml-2 h-4 w-4" /></Link>
                      </Button>
                    </CardContent>
                </Card>
              </motion.div>
          </div>
        </div>
      </section>
    </motion.div>
  );
}
