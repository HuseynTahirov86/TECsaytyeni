
"use client";

import Image from "next/image";
import { Card, CardContent } from "@/components/ui/card";
import { Linkedin, Instagram, Facebook } from "lucide-react";
import type { SecTeamMember } from '@/app/ndutecnaxcivan19692025tec/sec-team/form';
import Link from 'next/link';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogDescription as DialogDesc } from "@/components/ui/dialog";
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';
import { ScrollArea } from '@/components/ui/scroll-area';
import type { SecAboutContent } from '@/app/ndutecnaxcivan19692025tec/sec-about-content/form';
import { useState, useEffect } from 'react';
import DOMPurify from 'dompurify';


interface SecAboutClientPageProps {
    teamMembers: SecTeamMember[];
    aboutContent: SecAboutContent | null;
}

const TeamMemberCard = ({ member }: { member: SecTeamMember }) => (
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
            {member.bio && (
                <div className="py-4 text-left">
                  <p className="text-muted-foreground whitespace-pre-wrap">{member.bio}</p>
                </div>
            )}
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


export default function SecAboutClientPage({ teamMembers, aboutContent }: SecAboutClientPageProps) {
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

  const leadershipRoles = ['Sədr', 'Sədr müavini', 'Katib'];
  const leadership = teamMembers.filter(member => leadershipRoles.includes(member.role));
  const boardMembers = teamMembers.filter(member => !leadershipRoles.includes(member.role));

  return (
    <motion.div 
      className="container mx-auto max-w-5xl px-4 py-12 space-y-16"
      initial="initial"
      animate="animate"
      variants={{
        initial: { opacity: 0 },
        animate: { opacity: 1, transition: { staggerChildren: 0.2, duration: 0.8 } },
      }}
    >
      <motion.header className="text-center" variants={FADE_IN_ANIMATION_SETTINGS}>
        <h1 className="text-4xl font-extrabold tracking-tight text-primary lg:text-5xl">
          {aboutContent?.title || "Şagird Elmi Cəmiyyəti"}
        </h1>
      </motion.header>
        
      <motion.div variants={FADE_IN_ANIMATION_SETTINGS}>
        <Image
          src={aboutContent?.bannerImageUrl || "/secbanner.png"}
          alt={aboutContent?.title || "ŞEC"}
          width={1200}
          height={500}
          className="rounded-lg shadow-lg object-cover w-full"
          data-ai-hint={aboutContent?.bannerImageHint}
        />
      </motion.div>

       <motion.section 
            variants={FADE_IN_ANIMATION_SETTINGS}
        >
            <div className="text-center mb-8">
                <h2 className="text-3xl font-bold tracking-tight text-primary">Tariximiz</h2>
            </div>
            <div 
              className="prose prose-lg max-w-none text-foreground/90 prose-headings:text-primary prose-a:text-primary prose-strong:text-foreground"
              dangerouslySetInnerHTML={{ __html: sanitizedContent }}
             />
        </motion.section>
      
      {leadership.length > 0 && (
          <motion.section variants={FADE_IN_ANIMATION_SETTINGS}>
            <div className="text-center">
              <h2 className="text-3xl font-bold tracking-tight text-primary">
                Rəhbərlik
              </h2>
            </div>
            <div className="mt-8 grid grid-cols-2 gap-8 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
              {leadership.map((member) => (
                <TeamMemberCard key={member.id} member={member} />
              ))}
            </div>
          </motion.section>
      )}

      {boardMembers.length > 0 && (
        <motion.section variants={FADE_IN_ANIMATION_SETTINGS}>
          <div className="text-center">
            <h2 className="text-3xl font-bold tracking-tight text-primary">
              İdarə Heyəti
            </h2>
          </div>
          <div className="mt-8 grid grid-cols-2 gap-8 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
            {boardMembers.map((member) => (
              <TeamMemberCard key={member.id} member={member} />
            ))}
          </div>
        </motion.section>
      )}
    </motion.div>
  );
}
