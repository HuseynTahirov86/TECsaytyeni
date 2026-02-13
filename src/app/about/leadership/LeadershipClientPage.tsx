"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Linkedin } from "lucide-react";
import type { TeamMember } from '@/app/ndutecnaxcivan19692025tec/team/team-form';
import type { Chairman } from '@/app/ndutecnaxcivan19692025tec/chairman/form';
import Link from 'next/link';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogDescription as DialogDesc } from "@/components/ui/dialog";
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';
import { ScrollArea } from '@/components/ui/scroll-area';

interface LeadershipClientPageProps {
    chairman: Chairman | null;
    boardMembers: TeamMember[];
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
            </div>
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );

export function LeadershipClientPage({ chairman, boardMembers }: LeadershipClientPageProps) {
    const FADE_IN_ANIMATION_SETTINGS = {
        initial: { opacity: 0, y: 20 },
        animate: { opacity: 1, y: 0 },
        transition: { duration: 0.8, ease: "easeInOut" },
    };

    return (
        <div>
             <header className="mb-8">
                <h1 className="text-4xl font-extrabold tracking-tight text-primary lg:text-5xl">
                Rəhbərlik və Komanda
                </h1>
            </header>

            {/* Chairman section */}
            {chairman && (
                <motion.section id="chairman" variants={FADE_IN_ANIMATION_SETTINGS}>
                    <div className="text-center mb-8">
                        <h2 className="text-3xl font-bold tracking-tight text-primary">Sədr</h2>
                    </div>
                     <Card className="grid grid-cols-1 md:grid-cols-3 gap-8 p-8 items-center">
                        <div className="md:col-span-1">
                             <img
                                src={chairman.avatarUrl || "https://placehold.co/400x500.png"}
                                alt={chairman.name}
                                className="w-full aspect-[4/5] object-cover rounded-lg shadow-md"
                                data-ai-hint={chairman.avatarHint}
                            />
                        </div>
                        <div className="md:col-span-2">
                            <h3 className="text-3xl font-bold text-primary">{chairman.name}</h3>
                            <p className="text-lg text-accent font-semibold">{chairman.role}</p>
                            <p className="mt-4 text-muted-foreground whitespace-pre-wrap">{chairman.bio}</p>
                            {chairman.linkedinUrl && (
                                <Button asChild className="mt-4">
                                    <Link href={chairman.linkedinUrl} target="_blank" rel="noopener noreferrer">
                                        <Linkedin className="mr-2 h-4 w-4" />
                                        LinkedIn
                                    </Link>
                                </Button>
                            )}
                        </div>
                    </Card>
                </motion.section>
            )}

            {/* Board Members */}
            <motion.section id="idare-heyeti" className="mt-16" variants={FADE_IN_ANIMATION_SETTINGS}>
                <div className="text-center mb-8">
                <h2 className="text-3xl font-bold tracking-tight text-primary">İdarə Heyəti</h2>
                </div>
                <div className="mt-8 grid grid-cols-2 gap-8 sm:grid-cols-2 md:grid-cols-3">
                {boardMembers.map((member) => (
                    <TeamMemberCard key={member.id} member={member} />
                ))}
                </div>
            </motion.section>
        </div>
    )
}
