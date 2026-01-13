
"use client";

import { FileText, Landmark, BookOpen } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';

export default function ArchiveClientPage() {
    const FADE_IN_ANIMATION_SETTINGS = {
        initial: { opacity: 0, y: 20 },
        animate: { opacity: 1, y: 0 },
        transition: { duration: 0.8, ease: "easeInOut" },
    };

    return (
        <motion.div 
            className="container mx-auto max-w-3xl px-4 py-12"
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
                <div className="inline-block bg-primary/10 p-4 rounded-full mb-4">
                    <BookOpen className="h-10 w-10 text-primary" />
                </div>
                <h1 className="text-4xl font-extrabold tracking-tight text-primary lg:text-5xl">
                    Jurnal Arxivi
                </h1>
                <p className="mt-4 max-w-2xl mx-auto text-lg text-muted-foreground">
                    Dərc olunmuş jurnallarımızın buraxılışları ilə tanış olun.
                </p>
            </motion.header>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <motion.div variants={FADE_IN_ANIMATION_SETTINGS}>
                    <Card className="flex flex-col items-center justify-center p-8 text-center hover:shadow-lg transition-shadow h-full">
                        <CardHeader>
                            <div className="mx-auto bg-primary/10 p-3 rounded-full mb-3">
                                <FileText className="h-8 w-8 text-primary"/>
                            </div>
                            <CardTitle>Tələbə Elmi Jurnalı</CardTitle>
                            <CardDescription>Ümumi elmi və tədqiqat məqalələrinin arxivi.</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <Button asChild>
                                <Link href="/journal-archive/science">Arxivə Bax</Link>
                            </Button>
                        </CardContent>
                    </Card>
                </motion.div>
                <motion.div variants={FADE_IN_ANIMATION_SETTINGS}>
                    <Card className="flex flex-col items-center justify-center p-8 text-center hover:shadow-lg transition-shadow h-full">
                        <CardHeader>
                            <div className="mx-auto bg-primary/10 p-3 rounded-full mb-3">
                                <Landmark className="h-8 w-8 text-primary"/>
                            </div>
                            <CardTitle>Tələbə Hüquq Jurnalı</CardTitle>
                            <CardDescription>Hüquq sahəsinə aid tədqiqatların və məqalələrin arxivi.</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <Button asChild>
                                <Link href="/journal-archive/law">Arxivə Bax</Link>
                            </Button>
                        </CardContent>
                    </Card>
                </motion.div>
            </div>
        </motion.div>
    );
}
