"use client";

import Link from "next/link";
import Image from "next/image";

export function Footer() {
  return (
    <footer className="bg-primary text-primary-foreground">
      <div className="container mx-auto px-6 py-8">
        <div className="flex flex-col items-center justify-between sm:flex-row">
            <Link href="/affiliated-bodies/gymnasium-sec" className="flex items-center space-x-2">
                <Image src="/logo1.png" alt="ŞEC Loqo" width={40} height={40} />
                <span className="font-semibold">NDU Gimnaziya ŞEC</span>
            </Link>
          <p className="mt-4 text-sm text-primary-foreground/80 sm:mt-0">
            &copy; {new Date().getFullYear()} NDU Gimnaziya Şagird Elmi Cəmiyyəti. Bütün hüquqlar qorunur.
          </p>
        </div>
      </div>
    </footer>
  );
}
