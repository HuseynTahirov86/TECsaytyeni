"use client";

import type { Metadata } from 'next';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Mail, MapPin, Phone } from 'lucide-react';
import { ContactForm } from './ContactForm';
import { motion } from 'framer-motion';

export default function ContactPage() {
    const FADE_IN_ANIMATION_SETTINGS = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.8, ease: "easeInOut" },
  };

  return (
    <motion.div 
      className="container mx-auto max-w-6xl px-4 py-12"
      initial="initial"
      animate="animate"
      variants={{
        initial: { opacity: 0 },
        animate: { opacity: 1, transition: { staggerChildren: 0.2, duration: 0.8 } },
      }}
    >
      <motion.header className="text-center mb-12" variants={FADE_IN_ANIMATION_SETTINGS}>
        <h1 className="text-4xl font-extrabold tracking-tight text-primary lg:text-5xl">
          Bizimlə Əlaqə
        </h1>
        <p className="mt-4 max-w-2xl mx-auto text-lg text-muted-foreground">
          Suallarınız, təklifləriniz və ya əməkdaşlıq üçün bizə yazın. Sizdən xəbər gözləyirik!
        </p>
      </motion.header>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        <motion.div className="p-8 border rounded-lg bg-card text-card-foreground" variants={FADE_IN_ANIMATION_SETTINGS}>
            <h2 className="text-2xl font-bold mb-6">Mesaj Göndər</h2>
            <ContactForm />
        </motion.div>
        <motion.div className="space-y-8" variants={FADE_IN_ANIMATION_SETTINGS}>
            <h2 className="text-2xl font-bold">Əlaqə Məlumatları</h2>
            <div className="space-y-6">
                <div className="flex items-start gap-4 p-4 rounded-lg bg-muted/50">
                    <div className="flex-shrink-0 bg-primary/10 text-primary p-3 rounded-full">
                        <MapPin className="h-6 w-6" />
                    </div>
                    <div>
                        <h3 className="font-semibold text-lg">Ünvan</h3>
                        <p className="text-muted-foreground">
                         Naxçıvan şəhəri, Ə.Əliyev küçəsi, 4.
                        </p>
                    </div>
                </div>
                 <div className="flex items-start gap-4 p-4 rounded-lg bg-muted/50">
                    <div className="flex-shrink-0 bg-primary/10 text-primary p-3 rounded-full">
                        <Mail className="h-6 w-6" />
                    </div>
                    <div>
                        <h3 className="font-semibold text-lg">Email</h3>
                        <a href="mailto:gimnaziyasec@ndu.edu.az" className="text-muted-foreground hover:text-primary transition-colors">gimnaziyasec@ndu.edu.az</a>
                    </div>
                </div>
                 <div className="flex items-start gap-4 p-4 rounded-lg bg-muted/50">
                    <div className="flex-shrink-0 bg-primary/10 text-primary p-3 rounded-full">
                        <Phone className="h-6 w-6" />
                    </div>
                    <div>
                        <h3 className="font-semibold text-lg">Telefon</h3>
                        <a href="tel:+994771852466" className="text-muted-foreground hover:text-primary transition-colors">+994 77 185 24 66</a>
                    </div>
                </div>
            </div>
        </motion.div>
      </div>
    </motion.div>
  );
}
