"use client";

import { ContactForm } from './contact-form';
import { Mail, MapPin, Phone } from 'lucide-react';
import { motion } from 'framer-motion';

export default function ContactClientPage() {
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
                         Azərbaycan Respublikası, Naxçıvan şəhəri, Universitet şəhərciyi, AZ7012, Naxçıvan Dövlət Universiteti
                        </p>
                    </div>
                </div>
                 <div className="flex items-start gap-4 p-4 rounded-lg bg-muted/50">
                     <div className="flex-shrink-0 bg-primary/10 text-primary p-3 rounded-full">
                        <Phone className="h-6 w-6" />
                    </div>
                    <div>
                        <h3 className="font-semibold text-lg">Telefon</h3>
                        <a href="tel:+994365440861" className="text-muted-foreground hover:text-primary transition-colors">+994 36 544 08 61</a>
                        <p className="text-muted-foreground mt-1">Daxili telefon: 1412</p>
                    </div>
                </div>
                 <div className="flex items-start gap-4 p-4 rounded-lg bg-muted/50">
                    <div className="flex-shrink-0 bg-primary/10 text-primary p-3 rounded-full">
                        <Mail className="h-6 w-6" />
                    </div>
                    <div>
                        <h3 className="font-semibold text-lg">Email</h3>
                        <a href="mailto:tecndu@ndu.edu.az" className="text-muted-foreground hover:text-primary transition-colors">tecndu@ndu.edu.az</a>
                    </div>
                </div>
            </div>
             <div className="mt-8">
                 <iframe 
                    src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3118.014436997637!2d45.4093693153406!3d39.22108097952209!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x401180234123b379%3A0x868228308d79a7a9!2sNakhchivan%20State%20University!5e0!3m2!1sen!2s!4v1678886422935!5m2!1sen!2s" 
                    width="100%" 
                    height="300" 
                    style={{border:0}} 
                    allowFullScreen={true}
                    loading="lazy" 
                    referrerPolicy="no-referrer-when-downgrade"
                    className="rounded-lg shadow-md"
                    ></iframe>
            </div>
        </motion.div>
      </div>
    </motion.div>
  );
}
