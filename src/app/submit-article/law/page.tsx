"use client";

import { ArticleForm } from '../article-form';
import { Landmark } from 'lucide-react';
import { motion } from 'framer-motion';

export default function SubmitLawArticlePage() {
    const FADE_IN_ANIMATION_SETTINGS = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.8, ease: "easeInOut" },
  };

  return (
    <motion.div 
      className="relative min-h-screen bg-cover bg-center bg-fixed" 
      style={{ backgroundImage: "url('/post4.png')" }}
      initial="initial"
      animate="animate"
      variants={{
        initial: { opacity: 0 },
        animate: { opacity: 1 },
      }}
      transition={{ duration: 0.8 }}
    >
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm"></div>
      <motion.div 
        className="relative container mx-auto max-w-4xl px-4 py-12 z-10"
        variants={FADE_IN_ANIMATION_SETTINGS}
        initial="initial"
        animate="animate"
        transition={{ staggerChildren: 0.2 }}
      >
        <header className="text-center mb-8 bg-black/20 p-6 rounded-lg">
          <h1 className="text-3xl font-extrabold tracking-tight text-white lg:text-4xl">
            TƏLƏBƏ HÜQUQ JURNALININ İLK BURAXILIŞINA MƏQALƏ QƏBULU
          </h1>
          <p className="mt-4 max-w-2xl mx-auto text-lg text-gray-200">
            Qeydiyyat üçün son tarix: 01.11.2025
          </p>
        </header>
        <div className="p-4 sm:p-8 border border-gray-700 rounded-lg bg-card/80 text-card-foreground shadow-lg backdrop-blur-md">
          <ArticleForm journalType="law" />
        </div>
      </motion.div>
    </motion.div>
  );
}
