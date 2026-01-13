
"use client";

import { AppealForm } from './appeal-form';
import { motion } from 'framer-motion';

export default function AppealClientPage() {
  const FADE_IN_ANIMATION_SETTINGS = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.8, ease: "easeInOut" },
  };

  return (
    <motion.div 
      className="relative min-h-screen bg-gray-100 flex items-center justify-center py-12 px-4"
      initial="initial"
      animate="animate"
      variants={{
        initial: { opacity: 0 },
        animate: { opacity: 1 },
      }}
      transition={{ duration: 0.8 }}
    >
        <div 
            className="absolute inset-0 bg-no-repeat bg-center opacity-10"
            style={{ backgroundImage: "url('/logo1.png')" }}
        ></div>
        <motion.div 
          className="relative w-full max-w-4xl"
          variants={FADE_IN_ANIMATION_SETTINGS}
        >
            <header className="text-center mb-8">
            <h1 className="text-3xl font-extrabold tracking-tight text-primary lg:text-4xl">
                Naxçıvan Dövlət Universiteti Tələbə Elmi Cəmiyyəti sədrinə elektron müraciət
            </h1>
            </header>
            <div className="p-4 sm:p-8 border rounded-lg bg-card/95 text-card-foreground shadow-lg backdrop-blur-sm">
            <AppealForm />
            </div>
      </motion.div>
    </motion.div>
  );
}
