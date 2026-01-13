
"use client";
import React from 'react';
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardTitle, CardHeader, CardFooter } from "@/components/ui/card";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious, type CarouselApi } from "@/components/ui/carousel";
import Link from "next/link";
import { Users, ArrowRight, BookOpen, FileText, Landmark } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { collection, getDocs, limit, orderBy, query, Timestamp } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { NewsArticle } from './ndutecnaxcivan19692025tec/news/news-form';
import { Skeleton } from '@/components/ui/skeleton';
import { ProjectArticle } from './ndutecnaxcivan19692025tec/projects/project-form';
import type { LibraryEntry } from './ndutecnaxcivan19692025tec/library/library-form';
import type { Aphorism } from './ndutecnaxcivan19692025tec/aphorisms/aphorism-form';
import type { AcademicWritingRule } from './ndutecnaxcivan19692025tec/academic-writing/form';
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
    const [isLoadingNews, setIsLoadingNews] = React.useState(true);
    const [isLoadingProjects, setIsLoadingProjects] = React.useState(true);
    const [isLoadingLibrary, setIsLoadingLibrary] = React.useState(true);
    const [isLoadingAphorisms, setIsLoadingAphorisms] = React.useState(true);
    const [isLoadingAcademicRules, setIsLoadingAcademicRules] = React.useState(true);
    const [dynamicTextIndex, setDynamicTextIndex] = React.useState(0);

    const aphorismAutoplay = React.useRef(
      Autoplay({ delay: 5000, stopOnInteraction: false })
    );

     const rulesAutoplay = React.useRef(
      Autoplay({ delay: 4000, stopOnInteraction: true })
    );

    React.useEffect(() => {
        const interval = setInterval(() => {
            setDynamicTextIndex((prevIndex) => (prevIndex + 1) % dynamicTexts.length);
        }, 4000); // Change text every 4 seconds

        return () => clearInterval(interval);
    }, []);

    React.useEffect(() => {
        setIsClient(true);
        
        const fetchNews = async () => {
            setIsLoadingNews(true);
            try {
                const q = query(collection(db, "news"), orderBy("date", "desc"), limit(6));
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
                console.error("Error fetching news:", error);
            } finally {
                setIsLoadingNews(false);
            }
        };

        const fetchProjects = async () => {
            setIsLoadingProjects(true);
            try {
                const q = query(collection(db, "projects"), limit(3));
                const querySnapshot = await getDocs(q);
                const projectList = querySnapshot.docs.map(doc => {
                    const data = doc.data();
                    return {
                        id: doc.id,
                        ...data,
                    } as ProjectArticle;
                });
                setProjects(projectList);
            } catch (error) {
                console.error("Error fetching projects:", error);
            } finally {
                setIsLoadingProjects(false);
            }
        };

        const fetchLibraryEntries = async () => {
          setIsLoadingLibrary(true);
          try {
            const q = query(collection(db, "library"), orderBy("title"), limit(4));
            const querySnapshot = await getDocs(q);
            const entryList = querySnapshot.docs.map(doc => ({
              id: doc.id,
              ...doc.data(),
            } as LibraryEntry));
            setLibraryEntries(entryList);
          } catch (error) {
            console.error("Error fetching library entries:", error);
          } finally {
            setIsLoadingLibrary(false);
          }
        };

        const fetchAphorisms = async () => {
            setIsLoadingAphorisms(true);
            try {
                const q = query(collection(db, "aphorisms"), orderBy("order", "asc"));
                const querySnapshot = await getDocs(q);
                const aphorismList = querySnapshot.docs.map(doc => ({
                    id: doc.id,
                    ...doc.data(),
                }) as Aphorism);
                setAphorisms(aphorismList);
            } catch (error) {
                console.error("Error fetching aphorisms:", error);
            } finally {
                setIsLoadingAphorisms(false);
            }
        };
        
        const fetchAcademicWritingRules = async () => {
            setIsLoadingAcademicRules(true);
            try {
                const q = query(collection(db, "academicWritingRules"), orderBy("order", "asc"));
                const querySnapshot = await getDocs(q);
                const rulesList = querySnapshot.docs.map(doc => ({
                    id: doc.id,
                    ...doc.data(),
                }) as AcademicWritingRule);
                setAcademicWritingRules(rulesList);
            } catch (error) {
                console.error("Error fetching academic writing rules:", error);
            } finally {
                setIsLoadingAcademicRules(false);
            }
        };


        fetchNews();
        fetchProjects();
        fetchLibraryEntries();
        fetchAphorisms();
        fetchAcademicWritingRules();
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
    };


  return (
    <motion.div 
      className="flex flex-col bg-gray-50 overflow-x-hidden"
      initial="initial"
      animate="animate"
      variants={{
        initial: { opacity: 0 },
        animate: { opacity: 1, transition: { staggerChildren: 0.1, delayChildren: 0.2 } },
      }}
    >
      <section className="w-full">
        {/* Desktop View */}
        <div className="hidden sm:block relative w-full">
             <motion.div
                initial={{ scale: 1.05, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 1, ease: "easeOut" }}
             >
                <Image
                    src="/banner2.png"
                    alt="Tələbə Elmi Cəmiyyəti"
                    width={1920}
                    height={1080}
                    className="w-full h-auto"
                    priority
                />
             </motion.div>
            
            <div className="absolute inset-0 flex items-center justify-start text-left">
                <div className="container mx-auto px-4">
                <motion.div 
                    variants={heroContainerVariants}
                    initial="initial"
                    animate="animate"
                    className="relative z-10 max-w-2xl">
                    <div style={{ color: '#0b98b2' }}>
                        <motion.h1 variants={heroItemVariants} className="text-4xl lg:text-6xl font-extrabold tracking-tight whitespace-nowrap">
                            Naxçıvan Dövlət Universiteti
                        </motion.h1>
                        <motion.h1 variants={heroItemVariants} className="text-4xl lg:text-6xl font-extrabold tracking-tight">
                            Tələbə Elmi Cəmiyyəti
                        </motion.h1>
                    </div>
                    <motion.div variants={heroItemVariants}>
                        <AnimatePresence mode="wait">
                        <motion.p
                            key={dynamicTextIndex}
                            initial={textAnimation.initial}
                            animate={textAnimation.animate}
                            exit={textAnimation.exit}
                            transition={textAnimation.transition}
                            className="mt-4 text-xl font-normal italic"
                            style={{ color: '#0b98b2' }}
                        >
                            {dynamicTexts[dynamicTextIndex]}
                        </motion.p>
                        </AnimatePresence>
                    </motion.div>
                    <motion.div variants={heroItemVariants} className="mt-8 flex gap-4">
                        <Button size="lg" asChild>
                            <Link href="/about">Daha çox <ArrowRight className="ml-2 h-5 w-5" /></Link>
                        </Button>
                        <Button size="lg" asChild>
                            <Link href="/projects">Layihələrimiz <ArrowRight className="ml-2 h-5 w-5" /></Link>
                        </Button>
                    </motion.div>
                </motion.div>
                </div>
            </div>
        </div>

        {/* Mobile View: Image on top, content below */}
        <div className="sm:hidden flex flex-col">
          <motion.div {...motionProps}>
            <Image
              src="/tecson2.png"
              alt="Tələbə Elmi Cəmiyyəti"
              width={800}
              height={600}
              className="w-full h-auto object-cover"
              priority
            />
          </motion.div>
          <div className="container mx-auto px-4 py-8 text-center">
             <motion.div {...motionProps}>
                <h1 className="text-3xl font-extrabold tracking-tight" style={{ color: '#0b98b2' }}>
                Naxçıvan Dövlət Universiteti
                </h1>
                <h1 className="text-3xl font-extrabold tracking-tight" style={{ color: '#0b98b2' }}>
                    Tələbə Elmi Cəmiyyəti
                </h1>
                <AnimatePresence mode="wait">
                  <motion.p
                      key={dynamicTextIndex}
                      initial={textAnimation.initial}
                      animate={textAnimation.animate}
                      exit={textAnimation.exit}
                      transition={textAnimation.transition}
                      className="mt-3 text-lg font-normal italic"
                      style={{ color: '#0b98b2' }}
                  >
                      {dynamicTexts[dynamicTextIndex]}
                  </motion.p>
                </AnimatePresence>
                <div className="mt-6 flex flex-col gap-4 items-center">
                    <Button size="lg" className="w-full" asChild>
                        <Link href="/about">Daha çox <ArrowRight className="ml-2 h-5 w-5" /></Link>
                    </Button>
                    <Button size="lg" className="w-full" asChild>
                        <Link href="/projects">Layihələrimiz <ArrowRight className="ml-2 h-5 w-5" /></Link>
                    </Button>
                </div>
             </motion.div>
          </div>
        </div>
      </section>

      <section className="py-16 md:py-24">
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

      <section className="py-16 md:py-24 bg-white">
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
                ) : newsItems.map((item) => (
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
                                <p className="text-sm text-muted-foreground">{isClient ? formatDate(item.date) : '...'} &bull; <span className="text-accent font-semibold">{item.category}</span></p>
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

       <section className="bg-gray-50 py-16 md:py-24">
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
            ) : projects.map((project, index) => (
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
                        <div className="p-6 pt-0">
                            <div className="flex items-center text-sm text-muted-foreground">
                                <Users className="h-4 w-4 mr-2 text-accent" />
                                <span>{project.team.join(', ')}</span>
                            </div>
                        </div>
                    </Card>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 md:py-24 bg-white">
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

      <section className="py-16 md:py-24 bg-primary/5">
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
