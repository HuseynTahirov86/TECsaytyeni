"use client";

import Link from "next/link";
import Image from "next/image";
import { Instagram, Facebook, Mail, MapPin, Phone } from "lucide-react";
import { useEffect, useState } from "react";
import { doc, getDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { type SecSocialLinks } from "@/app/ndutecnaxcivan19692025tec/sec-socials/form";

export function Footer() {
  const [socials, setSocials] = useState<SecSocialLinks>({ instagram: '', facebook: '' });

  useEffect(() => {
    const fetchSocials = async () => {
      try {
        const docRef = doc(db, "socials", "sec-links");
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          setSocials(docSnap.data() as SecSocialLinks);
        }
      } catch (error) {
        console.error("Error fetching ŞEC social links:", error);
      }
    };
    fetchSocials();
  }, []);

  return (
    <footer className="bg-primary text-primary-foreground">
      <div className="container mx-auto px-6 py-12">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-4">
          <div className="col-span-1 md:col-span-2 lg:col-span-1">
            <Link href="/affiliated-bodies/gymnasium-sec" className="flex items-center space-x-3">
              <Image src="/logo1.png" alt="ŞEC Loqo" width={60} height={60} className="object-contain" />
              <div className="flex flex-col text-sm font-semibold leading-tight">
                <span>NDU nəzdində Gimnaziya</span>
                <span className="text-xs font-medium">Şagird Elmi Cəmiyyəti</span>
              </div>
            </Link>
            <p className="mt-4 text-sm text-primary-foreground/80">
              Gələcəyin alimləri burada yetişir.
            </p>
             <div className="mt-6 flex items-center space-x-4">
              {socials.facebook && (
                <Link href={socials.facebook} aria-label="Facebook" className="transition-colors hover:text-accent" target="_blank" rel="noopener noreferrer">
                  <Facebook className="h-6 w-6" />
                </Link>
              )}
              {socials.instagram && (
                <Link href={socials.instagram} aria-label="Instagram" className="transition-colors hover:text-accent" target="_blank" rel="noopener noreferrer">
                  <Instagram className="h-6 w-6" />
                </Link>
              )}
            </div>
          </div>
          <div>
            <h3 className="font-semibold uppercase tracking-wider text-accent">Naviqasiya</h3>
            <div className="mt-4 flex flex-col space-y-2 text-sm">
              <Link href="/affiliated-bodies/gymnasium-sec" className="hover:text-accent hover:underline">Ana Səhifə</Link>
              <Link href="/affiliated-bodies/gymnasium-sec/about" className="hover:text-accent hover:underline">Haqqımızda</Link>
              <Link href="/affiliated-bodies/gymnasium-sec/projects" className="hover:text-accent hover:underline">Layihələr</Link>
              <Link href="/affiliated-bodies/gymnasium-sec/blog" className="hover:text-accent hover:underline">Bloq</Link>
              <Link href="/affiliated-bodies/gymnasium-sec/contact" className="hover:text-accent hover:underline">Əlaqə</Link>
            </div>
          </div>
           <div>
            <h3 className="font-semibold uppercase tracking-wider text-accent">Faydalı Keçidlər</h3>
             <div className="mt-4 flex flex-col space-y-2 text-sm">
                <Link href="/" className="hover:text-accent hover:underline">TEC Əsas Sayt</Link>
                <a href="https://ndu.edu.az/" target="_blank" rel="noopener noreferrer" className="hover:text-accent hover:underline">Naxçıvan Dövlət Universiteti</a>
                <a href="https://ndu.edu.az/gimnaziya" target="_blank" rel="noopener noreferrer" className="hover:text-accent hover:underline">NDU nəzdində Gimnaziya</a>
            </div>
          </div>
           <div>
            <h3 className="font-semibold uppercase tracking-wider text-accent">Əlaqə</h3>
            <div className="mt-4 flex flex-col space-y-3 text-sm">
                <div className="flex items-start gap-3">
                    <MapPin className="h-5 w-5 mt-1 shrink-0 text-accent"/>
                    <span>Naxçıvan şəhəri, Ə.Əliyev küçəsi, 4.</span>
                </div>
                <div className="flex items-center gap-3">
                    <Phone className="h-5 w-5 shrink-0 text-accent"/>
                    <a href="tel:+994771852466" className="hover:text-accent hover:underline">+994 77 185 24 66</a>
                </div>
                 <div className="flex items-center gap-3">
                    <Mail className="h-5 w-5 shrink-0 text-accent"/>
                    <a href="mailto:gimnaziyasec@ndu.edu.az" className="hover:text-accent hover:underline">gimnaziyasec@ndu.edu.az</a>
                </div>
            </div>
          </div>
        </div>
        <div className="mt-12 border-t border-primary-foreground/10 pt-6 text-center text-sm text-primary-foreground/60">
          <p>&copy; {new Date().getFullYear()} NDU nəzdində Gimnaziyanın Şagird Elmi Cəmiyyəti. Bütün hüquqlar qorunur.</p>
        </div>
      </div>
    </footer>
  );
}
