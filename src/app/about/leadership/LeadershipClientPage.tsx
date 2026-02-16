
"use client";

import { Card } from "@/components/ui/card";
import { Linkedin, Instagram, Facebook } from "lucide-react";
import type { Chairman } from '@/app/ndutecnaxcivan19692025tec/chairman/form';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';
import Image from 'next/image';

interface LeadershipClientPageProps {
    chairman: Chairman | null;
}

export function LeadershipClientPage({ chairman }: LeadershipClientPageProps) {
    const FADE_IN_ANIMATION_SETTINGS = {
        initial: { opacity: 0, y: 20 },
        animate: { opacity: 1, y: 0 },
        transition: { duration: 0.8, ease: "easeInOut" },
    };

    return (
        <div>
             <header className="mb-8">
                <h1 className="text-4xl font-extrabold tracking-tight text-primary lg:text-5xl">
                Rəhbərlik
                </h1>
            </header>

            {/* Chairman section */}
            {chairman ? (
                <motion.section id="chairman" variants={FADE_IN_ANIMATION_SETTINGS}>
                    <div className="text-center mb-8">
                        <h2 className="text-3xl font-bold tracking-tight text-primary">Sədr</h2>
                    </div>
                     <Card className="grid grid-cols-1 md:grid-cols-3 gap-8 p-8 items-center">
                        <div className="md:col-span-1">
                             <div className="relative w-full aspect-[4/5] rounded-lg shadow-md overflow-hidden">
                                <Image
                                    src={chairman.avatarUrl || "https://placehold.co/400x500.png"}
                                    alt={chairman.name}
                                    fill
                                    className="object-cover"
                                    data-ai-hint={chairman.avatarHint}
                                />
                             </div>
                        </div>
                        <div className="md:col-span-2">
                            <h3 className="text-3xl font-bold text-primary">{chairman.name}</h3>
                            <p className="text-lg text-accent font-semibold">{chairman.role}</p>
                            <p className="mt-4 text-muted-foreground whitespace-pre-wrap">{chairman.bio}</p>
                            <div className="mt-6 flex gap-2">
                                {chairman.linkedinUrl && (
                                    <Button asChild variant="outline" size="icon">
                                        <Link href={chairman.linkedinUrl} target="_blank" rel="noopener noreferrer" aria-label="LinkedIn">
                                            <Linkedin className="h-5 w-5" />
                                        </Link>
                                    </Button>
                                )}
                                {chairman.instagramUrl && (
                                    <Button asChild variant="outline" size="icon">
                                        <Link href={chairman.instagramUrl} target="_blank" rel="noopener noreferrer" aria-label="Instagram">
                                            <Instagram className="h-5 w-5" />
                                        </Link>
                                    </Button>
                                )}
                                {chairman.facebookUrl && (
                                    <Button asChild variant="outline" size="icon">
                                        <Link href={chairman.facebookUrl} target="_blank" rel="noopener noreferrer" aria-label="Facebook">
                                            <Facebook className="h-5 w-5" />
                                        </Link>
                                    </Button>
                                )}
                            </div>
                        </div>
                    </Card>
                </motion.section>
            ) : (
                <div className="text-center py-16 text-muted-foreground">
                    <p>Sədr haqqında məlumat tapılmadı.</p>
                </div>
            )}
        </div>
    )
}
