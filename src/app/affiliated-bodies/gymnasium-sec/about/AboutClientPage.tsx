
"use client";

import Image from "next/image";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, Eye, Target, Linkedin, Instagram, Facebook, Download, CheckCircle, ListOrdered, Goal, Scale, Handshake, Users2, ShieldCheck, GraduationCap } from "lucide-react";
import type { SecTeamMember } from '@/app/ndutecnaxcivan19692025tec/sec-team/form';
import Link from 'next/link';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogDescription as DialogDesc } from "@/components/ui/dialog";
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';
import { ScrollArea } from '@/components/ui/scroll-area';


interface AboutClientPageProps {
    teamMembers: SecTeamMember[];
}

export default function AboutClientPage({ teamMembers }: AboutClientPageProps) {

  const FADE_IN_ANIMATION_SETTINGS = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.8, ease: "easeInOut" },
  };

  const mainDirections = [
      {
        title: "Elmi Tədqiqat",
        description: "Şagirdləri maraqlandıqları sahələrdə kiçik həcmli elmi araşdırmalar aparmağa təşviq etmək.",
        icon: GraduationCap,
      },
      {
        title: "Konfrans və Seminarlar",
        description: "Şagirdlərin öz tədqiqatlarını təqdim edə biləcəyi məktəbdaxili konfrans və seminarlar təşkil etmək.",
        icon: Users2,
      },
       {
        title: "Elmi Populyarlıq",
        description: "Elmin maraqlı və əyləncəli tərəflərini təqdimatlar, təcrübələr və viktorinalar vasitəsilə tanıtmaq.",
        icon: CheckCircle,
      },
       {
        title: "Layihə Müsabiqələri",
        description: "Məktəblilər arasında kiçik elmi layihə müsabiqələri keçirərək yaradıcılığı stimullaşdırmaq.",
        icon: Goal,
      },
    ];

  return (
    <motion.div 
      className="container mx-auto max-w-5xl px-4 py-12"
      initial="initial"
      animate="animate"
      variants={{
        initial: { opacity: 0 },
        animate: { opacity: 1, transition: { staggerChildren: 0.2, duration: 0.8 } },
      }}
    >
      <motion.header className="text-center" variants={FADE_IN_ANIMATION_SETTINGS}>
        <h1 className="text-4xl font-extrabold tracking-tight text-primary lg:text-5xl">
          ŞEC Haqqında
        </h1>
      </motion.header>
        
      <motion.div className="my-12" variants={FADE_IN_ANIMATION_SETTINGS}>
        <Image
          src="https://picsum.photos/seed/gymnasium-team/1200/500"
          alt="ŞEC Komandası"
          width={1200}
          height={500}
          className="rounded-lg shadow-lg object-cover w-full"
          data-ai-hint="group young students science project"
        />
      </motion.div>

       <motion.section 
            className="mt-12 prose prose-lg max-w-none mx-auto text-justify text-foreground/90 prose-headings:text-primary prose-a:text-primary prose-strong:text-foreground"
            variants={FADE_IN_ANIMATION_SETTINGS}
        >
             <p>Naxçıvan Dövlət Universiteti nəzdindəki Gimnaziyanın Şagird Elmi Cəmiyyəti (ŞEC), istedadlı və elmə marağı olan şagirdləri bir araya gətirərək onların elmi-tədqiqat bacarıqlarını erkən yaşlardan inkişaf etdirmək məqsədi daşıyır. Biz, şagirdlərin akademik potensialını reallaşdırmaq, onlara tədqiqat aparmağın əsaslarını öyrətmək və elmi düşüncə tərzini aşılamaq üçün çalışırıq.</p>
            <p>ŞEC olaraq, gənc nəslin elmə olan həvəsini artırmaq, onları gələcəyin alimləri, mühəndisləri və ixtiraçıları olmağa ruhlandırmaq əsas hədəfimizdir. Bu yolda müxtəlif layihələr, seminarlar, müsabiqələr və ekskursiyalar təşkil edərək onların həm nəzəri biliklərini, həm də praktiki bacarıqlarını gücləndiririk.</p>
        </motion.section>

        <motion.section className="mt-16" variants={FADE_IN_ANIMATION_SETTINGS}>
            <div className="text-center">
                <h2 className="text-3xl font-bold tracking-tight text-primary">Fəaliyyət İstiqamətlərimiz</h2>
            </div>
            <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
                {mainDirections.map((item, index) => (
                    <Card key={index}>
                        <CardHeader className="flex flex-row items-center gap-4">
                            <div className="bg-primary/10 p-3 rounded-full">
                                <item.icon className="h-6 w-6 text-primary" />
                            </div>
                            <CardTitle className="text-xl">{item.title}</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p className="text-muted-foreground">{item.description}</p>
                        </CardContent>
                    </Card>
                ))}
            </div>
        </motion.section>

      <motion.section className="mt-16" variants={FADE_IN_ANIMATION_SETTINGS}>
        <div className="text-center">
          <h2 className="text-3xl font-bold tracking-tight text-primary">
            Komandamızla Tanış Olun
          </h2>
          <p className="mt-2 text-muted-foreground">Təşəbbüslərimizin arxasındakı güc.</p>
        </div>
        <div className="mt-8 grid grid-cols-2 gap-8 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {teamMembers.map((member) => (
            <Dialog key={member.id}>
              <DialogTrigger asChild>
                <Card className="text-center overflow-hidden shadow-sm hover:shadow-lg transition-all cursor-pointer hover:scale-105">
                    <div className="aspect-[4/5] relative w-full">
                       <img 
                          src={member.avatarUrl || "https://placehold.co/400x500.png"}
                          alt={member.name} 
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                          data-ai-hint={member.avatarHint}
                        />
                    </div>
                    <CardContent className="p-4">
                        <h3 className="font-semibold text-lg">{member.name}</h3>
                        <p className="text-sm text-accent">{member.role}</p>
                    </CardContent>
                </Card>
              </DialogTrigger>
              <DialogContent className="sm:max-w-md p-0">
                <ScrollArea className="max-h-[85vh]">
                  <div className="p-6">
                    <DialogHeader>
                      <div className="flex flex-col items-center text-center">
                        <img
                          src={member.avatarUrl || "https://placehold.co/128x128.png"}
                          alt={member.name}
                          className="w-32 h-32 rounded-full object-cover mb-4"
                          data-ai-hint={member.avatarHint}
                        />
                        <DialogTitle className="text-2xl">{member.name}</DialogTitle>
                        <DialogDesc className="text-accent text-base mt-1">{member.role}</DialogDesc>
                        <p className="text-sm text-muted-foreground mt-1">{member.faculty}</p>
                      </div>
                    </DialogHeader>
                    <div className="py-4 text-left">
                      <p className="text-muted-foreground whitespace-pre-wrap">{member.bio}</p>
                    </div>
                    <div className="flex justify-center gap-4 pt-4 border-t">
                        {member.linkedinUrl && (
                            <Button variant="ghost" size="icon" asChild>
                                <Link href={member.linkedinUrl} target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-primary">
                                    <Linkedin className="h-5 w-5" />
                                </Link>
                            </Button>
                        )}
                        {member.instagramUrl && (
                            <Button variant="ghost" size="icon" asChild>
                              <Link href={member.instagramUrl} target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-primary">
                                  <Instagram className="h-5 w-5" />
                              </Link>
                            </Button>
                        )}
                        {member.facebookUrl && (
                            <Button variant="ghost" size="icon" asChild>
                              <Link href={member.facebookUrl} target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-primary">
                                  <Facebook className="h-5 w-5" />
                              </Link>
                            </Button>
                        )}
                    </div>
                  </div>
                </ScrollArea>
              </DialogContent>
            </Dialog>
          ))}
        </div>
      </motion.section>
    </motion.div>
  );
}

