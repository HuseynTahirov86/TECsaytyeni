
"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Linkedin } from "lucide-react";
import type { TeamMember } from '@/app/ndutecnaxcivan19692025tec/team/team-form';
import Link from 'next/link';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogDescription as DialogDesc } from "@/components/ui/dialog";
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';
import { ScrollArea } from '@/components/ui/scroll-area';
import Image from 'next/image';

interface BoardMembersClientPageProps {
    boardMembers: TeamMember[];
}

const TeamMemberCard = ({ member }: { member: TeamMember }) => (
    <Dialog key={member.id}>
      <DialogTrigger asChild>
        <Card className="text-center overflow-hidden shadow-sm hover:shadow-lg transition-all cursor-pointer hover:scale-105">
            <div className="aspect-[4/5] relative w-full">
                <Image 
                  src={member.avatarUrl || "https://placehold.co/400x500.png"}
                  alt={member.name} 
                  fill
                  className="object-cover group-hover:scale-105 transition-transform"
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
                 <div className="w-32 h-32 rounded-full relative overflow-hidden mb-4">
                    <Image
                    src={member.avatarUrl || "https://placehold.co/128x128.png"}
                    alt={member.name}
                    fill
                    className="object-cover"
                    data-ai-hint={member.avatarHint}
                    />
                </div>
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

export function BoardMembersClientPage({ boardMembers }: BoardMembersClientPageProps) {
    const FADE_IN_ANIMATION_SETTINGS = {
        initial: { opacity: 0, y: 20 },
        animate: { opacity: 1, y: 0 },
        transition: { duration: 0.8, ease: "easeInOut" },
    };

    return (
        <div>
             <header className="mb-8">
                <h1 className="text-4xl font-extrabold tracking-tight text-primary lg:text-5xl">
                İdarə Heyəti
                </h1>
            </header>

            <motion.section id="idare-heyeti" className="mt-8" variants={FADE_IN_ANIMATION_SETTINGS}>
                <div className="mt-8 grid grid-cols-2 gap-8 sm:grid-cols-2 md:grid-cols-3">
                {boardMembers.map((member) => (
                    <TeamMemberCard key={member.id} member={member} />
                ))}
                </div>
            </motion.section>
        </div>
    )
}
