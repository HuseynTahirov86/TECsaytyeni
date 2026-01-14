
"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, Calendar } from "lucide-react";
import { collection, getDocs, orderBy, query, Timestamp } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { Skeleton } from "@/components/ui/skeleton";
import { ProjectArticle } from "../ndutecnaxcivan19692025tec/projects/project-form";
import Link from "next/link";
import { motion } from 'framer-motion';
import { formatDate } from "@/lib/utils";

export default function ProjectsClientPage() {
  const [projects, setProjects] = useState<ProjectArticle[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isClient, setIsClient] = useState(false);

  const FADE_IN_ANIMATION_SETTINGS = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.8, ease: "easeInOut" },
  };


  useEffect(() => {
    setIsClient(true);
    const fetchProjects = async () => {
      setIsLoading(true);
      try {
        const q = query(collection(db, "projects"), orderBy("date", "desc"));
        const querySnapshot = await getDocs(q);
        const projectList = querySnapshot.docs.map(doc => {
          const data = doc.data();
          return {
            id: doc.id,
            ...data,
            date: data.date instanceof Timestamp ? data.date.toDate().toISOString().split('T')[0] : data.date,
          } as ProjectArticle;
        });
        setProjects(projectList);
      } catch (error) {
        console.error("Error fetching projects:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchProjects();
  }, []);

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
          Layihələr & Tədqiqat
        </h1>
        <p className="mt-4 max-w-2xl mx-auto text-lg text-muted-foreground">
          İstedadlı tələbələrimiz və tədqiqatçılarımızın gördüyü yenilikçi işləri kəşf edin.
        </p>
      </motion.header>
      
      <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
        {isLoading ? (
          Array.from({ length: 6 }).map((_, i) => (
            <Card key={i} className="flex flex-col">
              <CardHeader className="p-0">
                <Skeleton className="w-full aspect-[3/2] rounded-t-lg" />
              </CardHeader>
              <CardContent className="p-6 flex-grow space-y-3">
                <Skeleton className="h-6 w-full" />
                <Skeleton className="h-4 w-5/6" />
                <Skeleton className="h-4 w-full mt-1" />
              </CardContent>
              <CardFooter className="p-6 pt-0">
                <Skeleton className="h-4 w-1/2" />
              </CardFooter>
            </Card>
          ))
        ) : projects.length > 0 ? (
          projects.map((project) => (
            <motion.div key={project.id} variants={FADE_IN_ANIMATION_SETTINGS}>
              <Link href={`/projects/${project.slug}`} className="group">
                <Card className="flex flex-col h-full overflow-hidden transition-all duration-300 group-hover:scale-105 group-hover:shadow-xl">
                  <CardHeader className="p-0">
                      <img
                        src={project.imageUrl || "https://placehold.co/600x400.png"}
                        alt={project.title}
                        className="w-full object-cover aspect-[3/2] transition-transform duration-300 group-hover:scale-105"
                      />
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
                      {isClient && project.date && (
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
           <div className="md:col-span-2 lg:col-span-3 text-center text-muted-foreground mt-8 p-8 border-dashed border-2 rounded-lg">
            <h3 className="text-xl font-semibold">Layihə Tapılmadı</h3>
            <p>Hələ heç bir layihə əlavə edilməyib.</p>
          </div>
        )}
      </div>
    </motion.div>
  );
}
