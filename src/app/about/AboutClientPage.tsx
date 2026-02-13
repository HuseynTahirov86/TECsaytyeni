
"use client";

import Image from "next/image";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, Eye, Target, Linkedin, Instagram, Facebook, Download, CheckCircle, ListOrdered, Goal, Scale, Handshake, Users2, ShieldCheck, GraduationCap } from "lucide-react";
import type { TeamMember } from '../ndutecnaxcivan19692025tec/team/team-form';
import Link from 'next/link';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogDescription as DialogDesc } from "@/components/ui/dialog";
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';
import type { FormerChairman } from '../ndutecnaxcivan19692025tec/formers/former-chairman-form';
import { ScrollArea } from '@/components/ui/scroll-area';
import { type AboutContent } from '../ndutecnaxcivan19692025tec/about-content/form';
import { useState, useEffect } from 'react';
import DOMPurify from 'dompurify';

interface AboutClientPageProps {
    teamMembers: TeamMember[];
    formerChairmen: FormerChairman[];
    aboutContent: AboutContent | null;
}

const TeamMemberCard = ({ member }: { member: TeamMember }) => (
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
);


export default function AboutClientPage({ teamMembers, formerChairmen, aboutContent }: AboutClientPageProps) {
  const [sanitizedContent, setSanitizedContent] = useState('');

  useEffect(() => {
    if (aboutContent?.mainContent && typeof window !== 'undefined') {
      setSanitizedContent(DOMPurify.sanitize(aboutContent.mainContent));
    }
  }, [aboutContent]);

  const FADE_IN_ANIMATION_SETTINGS = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.8, ease: "easeInOut" },
  };

  const leadershipRoles = ["Sədr", "Sədr müavini", "Katib", "Koordinator"];
  const leadership = teamMembers.filter(member => leadershipRoles.some(role => member.role.includes(role)));
  const boardMembers = teamMembers.filter(member => !leadershipRoles.some(role => member.role.includes(role)));
  
  const mainDirections = [
      { title: "Elm və tədqiqat fəaliyyətləri", description: "Tələbələri müxtəlif sahələrdə elmi tədqiqatlarla məşğul olmağa təşviq edir.", icon: GraduationCap, },
      { title: "Konfrans və seminarlar", description: "Tələbələrin araşdırmalarını təqdim etmələri üçün elmi platformalar təşkil edir.", icon: Users2, },
      { title: "Elmin populyarlaşdırılması", description: "Elmi maarifləndirmə tədbirləri ilə cəmiyyətə fayda gətirir.", icon: CheckCircle, },
      { title: "Elmi yarışlar və layihələr", description: "Tələbələrin yaradıcı və elmi biliklərini inkişaf etdirən müsabiqələr təşkil edir.", icon: Goal, },
       { title: "Elmi nəşrlər", description: "Tələbələr üçün xüsusi elmi jurnallar nəşr edir və platformalar yaradır.", icon: CheckCircle, },
       { title: "Praktiki bacarıqlar", description: "Araşdırma metodologiyaları və təqdimat bacarıqlarını inkişaf etdirir.", icon: ListOrdered, },
      { title: "Əməkdaşlıq və şəbəkələşmə", description: "Müxtəlif təşkilatlarla əməkdaşlıq edərək tələbələrə yeni imkanlar yaradır.", icon: Handshake, },
    ];

    const values = [
        { title: "Elmilik", description: "Fəaliyyətimizdə elmi prinsiplərə, obyektivliyə və akademik dürüstlüyə sadiq qalırıq.", icon: ShieldCheck },
        { title: "Əməkdaşlıq", description: "Fakültələr, kafedralar və tələbələr arasında sağlam əməkdaşlıq mühiti yaradırıq.", icon: Handshake },
        { title: "İnnovativlik", description: "Yeni ideyaları, müasir tədqiqat metodlarını dəstəkləyir və tətbiq edirik.", icon: CheckCircle },
        { title: "Şəffaflıq", description: "Fəaliyyətimizdə və qərarlarımızda şəffaflığı təmin edirik.", icon: Scale },
    ];

    const strategicGoals = [
        { title: "Tədqiqat Mədəniyyətinin Gücləndirilməsi", description: "Tələbələri tədqiqat proseslərinə daha fəal cəlb etmək.", icon: Goal },
        { title: "Elmi Nəşrlərin Keyfiyyətinin Artırılması", description: "Məqalə və jurnalların beynəlxalq standartlara uyğunlaşdırılması.", icon: ListOrdered },
        { title: "Fakültə və Kafedra Fəaliyyətinin Əlaqələndirilməsi", description: "TEC-in struktur bölmələri arasında səmərəli kommunikasiya qurmaq.", icon: Users2 },
        { title: "Təlim və İnkişaf", description: "Tələbələrin elmi yazı və təqdimat bacarıqlarını artırmaq üçün təlimlər keçirmək.", icon: GraduationCap }
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
          TEC Haqqında
        </h1>
      </motion.header>
        
      <motion.div className="my-12" variants={FADE_IN_ANIMATION_SETTINGS}>
        <Image
          src="/tecson2.png"
          alt="TEC Komandası"
          width={1200}
          height={500}
          className="rounded-lg shadow-lg object-cover w-full"
          data-ai-hint="team meeting"
        />
      </motion.div>

      {/* Rəhbərlik */}
      <motion.section id="rehberlik" className="mt-16 scroll-mt-24" variants={FADE_IN_ANIMATION_SETTINGS}>
        <div className="text-center">
          <h2 className="text-3xl font-bold tracking-tight text-primary">Rəhbərlik</h2>
        </div>
        <div className="mt-8 grid grid-cols-2 gap-8 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 justify-center">
          {leadership.map((member) => (
            <TeamMemberCard key={member.id} member={member} />
          ))}
        </div>
      </motion.section>

      {/* İdarə Heyəti */}
      <motion.section id="idare-heyeti" className="mt-16 scroll-mt-24" variants={FADE_IN_ANIMATION_SETTINGS}>
        <div className="text-center">
          <h2 className="text-3xl font-bold tracking-tight text-primary">İdarə Heyətimiz</h2>
        </div>
        <div className="mt-8 grid grid-cols-2 gap-8 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {boardMembers.map((member) => (
            <TeamMemberCard key={member.id} member={member} />
          ))}
        </div>
      </motion.section>
      
      {/* Tariximiz */}
       <motion.section id="tariximiz" className="mt-16 scroll-mt-24" variants={FADE_IN_ANIMATION_SETTINGS}>
         <div className="text-center">
            <h2 className="text-3xl font-bold tracking-tight text-primary">Tariximiz</h2>
        </div>
        <div 
            className="mt-8 prose prose-lg max-w-none text-foreground/90 prose-headings:text-primary prose-a:text-primary prose-strong:text-foreground"
            dangerouslySetInnerHTML={{ __html: sanitizedContent }}
        />
      </motion.section>
      
      {/* Sənədlər */}
      <motion.section id="senedler" className="mt-16 scroll-mt-24" variants={FADE_IN_ANIMATION_SETTINGS}>
          <div className="text-center">
            <h2 className="text-3xl font-bold tracking-tight text-primary">Sənədlər</h2>
          </div>
          <div className="mt-8 flex flex-wrap justify-center items-center gap-4">
              <Button asChild size="lg">
                  <a href="/tecesasname.pdf" target="_blank" rel="noopener noreferrer" className="flex items-center">
                      <Download className="mr-2 h-5 w-5" />
                      TEC Əsasnaməsi
                  </a>
              </Button>
                <Button asChild size="lg" variant="secondary">
                  <a href="/tecetikcodex.docx" target="_blank" rel="noopener noreferrer" className="flex items-center">
                      <Download className="mr-2 h-5 w-5" />
                      Etik Davranış Kodeksi
                  </a>
              </Button>
              <Button asChild size="lg" variant="secondary">
                    <a href="/alitehsilesas.pdf" target="_blank" rel="noopener noreferrer" className="flex items-center text-center">
                      <Download className="mr-2 h-5 w-5 flex-shrink-0" />
                      <span className="whitespace-normal leading-tight text-center">Təhsilalanların Elmi Tədqiqat İşi Haqqında Əsasnamə</span>
                  </a>
              </Button>
          </div>
        </motion.section>
      
      {/* Əsas Fəaliyyət İstiqamətlərimiz */}
      <motion.section id="fealiyyet-istiqametleri" className="mt-16 scroll-mt-24" variants={FADE_IN_ANIMATION_SETTINGS}>
            <div className="text-center">
                <h2 className="text-3xl font-bold tracking-tight text-primary">Əsas Fəaliyyət İstiqamətlərimiz</h2>
            </div>
            <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
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

      {/* Dəyər Prinsiplərimiz */}
      <motion.section id="deyerlerimiz" className="mt-16 scroll-mt-24" variants={FADE_IN_ANIMATION_SETTINGS}>
            <div className="text-center">
                <h2 className="text-3xl font-bold tracking-tight text-primary">Dəyər və Prinsiplərimiz</h2>
            </div>
            <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
                {values.map((item, index) => (
                    <Card key={index} className="text-center p-4">
                        <div className="mx-auto bg-primary/10 p-3 rounded-full w-fit mb-3">
                            <item.icon className="h-8 w-8 text-primary" />
                        </div>
                        <CardHeader className="p-0">
                          <CardTitle className="text-xl">{item.title}</CardTitle>
                        </CardHeader>
                        <CardContent className="p-2 pt-2">
                            <p className="text-muted-foreground text-sm">{item.description}</p>
                        </CardContent>
                    </Card>
                ))}
            </div>
        </motion.section>
        
        {/* Vizyonumuz */}
        <motion.section id="vizyonumuz" className="mt-16 scroll-mt-24" variants={FADE_IN_ANIMATION_SETTINGS}>
          <Card className="bg-primary text-primary-foreground">
            <CardHeader className="flex flex-col items-center text-center">
              <div className="bg-primary-foreground/20 p-4 rounded-full mb-4">
                 <Eye className="h-10 w-10 text-primary-foreground" />
              </div>
              <CardTitle className="text-3xl">Vizyonumuz</CardTitle>
            </CardHeader>
            <CardContent className="text-center text-xl text-primary-foreground/90 max-w-3xl mx-auto">
              <p>Naxçıvan Dövlət Universitetində elmi fəaliyyəti tələbə mərkəzli, innovativ və beynəlxalq səviyyədə rəqabətədavamlı bir ekosistemə çevirmək.</p>
            </CardContent>
          </Card>
        </motion.section>
        
      {/* Strateji Məqsədlərimiz */}
       <motion.section id="meqsedlerimiz" className="mt-16 scroll-mt-24" variants={FADE_IN_ANIMATION_SETTINGS}>
            <div className="text-center">
                <h2 className="text-3xl font-bold tracking-tight text-primary">Strateji Məqsədlərimiz</h2>
            </div>
            <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
                {strategicGoals.map((item, index) => (
                    <Card key={index}>
                        <CardHeader className="items-center text-center">
                           <div className="bg-primary/10 p-3 rounded-full mb-2">
                                <item.icon className="h-6 w-6 text-primary" />
                            </div>
                            <CardTitle className="text-lg">{item.title}</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p className="text-muted-foreground text-sm text-center">{item.description}</p>
                        </CardContent>
                    </Card>
                ))}
            </div>
        </motion.section>

      {/* Sabiq TEC sədrləri */}
       <motion.section id="sabiq-sedrler" className="mt-16 scroll-mt-24" variants={FADE_IN_ANIMATION_SETTINGS}>
        <div className="text-center">
          <h2 className="text-3xl font-bold tracking-tight text-primary">
            Sabiq TEC Sədrləri
          </h2>
          <p className="mt-2 text-muted-foreground">Təşkilatımızın inkişafına töhfə verən liderlər.</p>
        </div>
        <div className="mt-8 grid grid-cols-2 gap-8 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {formerChairmen.map((chairman) => (
            <Dialog key={chairman.id}>
              <DialogTrigger asChild>
                 <Card className="text-center overflow-hidden shadow-sm hover:shadow-lg transition-all cursor-pointer hover:scale-105">
                    <div className="aspect-[4/5] relative w-full">
                        <img 
                          src={chairman.avatarUrl || "https://placehold.co/400x500.png"}
                          alt={chairman.name} 
                          className="w-full h-full object-cover"
                          data-ai-hint={chairman.avatarHint}
                        />
                    </div>
                    <CardContent className="p-4">
                        <h3 className="font-semibold text-lg">{chairman.name}</h3>
                        <p className="text-sm text-accent">{chairman.period}</p>
                    </CardContent>
                </Card>
              </DialogTrigger>
               <DialogContent className="sm:max-w-md p-0">
                <ScrollArea className="max-h-[85vh]">
                  <div className="p-6">
                    <DialogHeader>
                      <div className="flex flex-col items-center text-center">
                        <img
                          src={chairman.avatarUrl || "https://placehold.co/128x128.png"}
                          alt={chairman.name}
                          className="w-32 h-32 rounded-full object-cover mb-4"
                          data-ai-hint={chairman.avatarHint}
                        />
                        <DialogTitle className="text-2xl">{chairman.name}</DialogTitle>
                        <DialogDesc className="text-accent text-base mt-1">{chairman.period}</DialogDesc>
                      </div>
                    </DialogHeader>
                    <div className="py-4 text-left">
                      <p className="text-muted-foreground whitespace-pre-wrap">{chairman.bio}</p>
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

    