"use client";

import { Building, GraduationCap } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';

export default function SubmitDocumentClientPage() {
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
                <h1 className="text-4xl font-extrabold tracking-tight text-primary lg:text-5xl">
                    Sənəd Təqdim Et
                </h1>
                <p className="mt-4 max-w-2xl mx-auto text-lg text-muted-foreground">
                    Zəhmət olmasa, sənədi kimin adından təqdim etdiyinizi seçin.
                </p>
            </motion.header>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <motion.div variants={FADE_IN_ANIMATION_SETTINGS}>
                    <Card className="flex flex-col items-center justify-center p-8 text-center hover:shadow-lg transition-shadow h-full">
                        <CardHeader>
                            <div className="mx-auto bg-primary/10 p-3 rounded-full mb-3">
                                <GraduationCap className="h-8 w-8 text-primary"/>
                            </div>
                            <CardTitle>Fakültə üzrə</CardTitle>
                            <CardDescription>Fakültə Elmi Şurasının protokolundan çıxarışı təqdim edin.</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <Button asChild>
                                <Link href="/submit-document/faculty">Sənəd Göndər</Link>
                            </Button>
                        </CardContent>
                    </Card>
                </motion.div>
                <motion.div variants={FADE_IN_ANIMATION_SETTINGS}>
                    <Card className="flex flex-col items-center justify-center p-8 text-center hover:shadow-lg transition-shadow h-full">
                        <CardHeader>
                            <div className="mx-auto bg-primary/10 p-3 rounded-full mb-3">
                                <Building className="h-8 w-8 text-primary"/>
                            </div>
                            <CardTitle>Kafedra üzrə</CardTitle>
                            <CardDescription>Kafedra üzrə TETİ məlumatlarını və ya iclas protokolunu təqdim edin.</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <Button asChild>
                                <Link href="/submit-document/department">Sənəd Göndər</Link>
                            </Button>
                        </CardContent>
                    </Card>
                </motion.div>
            </div>
        </motion.div>
    );
}
