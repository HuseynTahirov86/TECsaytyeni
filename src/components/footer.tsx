"use client";

import { Phone, Mail, MapPin, Instagram, Facebook } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { useEffect, useState } from "react";
import { doc, getDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { SocialLinks } from "@/app/ndutecnaxcivan19692025tec/socials/socials-form";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"


// Custom X/Twitter Icon
const XIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 512 512"
    fill="currentColor"
    {...props}
  >
    <path d="M389.2 48h70.6L305.6 224.2 487 464H345L233.7 318.6 106.5 464H35.8l164.9-199.9L26.8 48h145.6l100.5 132.3L389.2 48zm-24.9 393.1h39.7L159.3 74.9h-41.2l255.8 366.2z" />
  </svg>
);

// Custom TikTok Icon
const TikTokIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512" {...props}>
        <path fill="currentColor" d="M448 209.9a210.1 210.1 0 0 1 -122.8-39.25V349.38A162.6 162.6 0 1 1 185 188.31V278.2a74.62 74.62 0 1 0 52.23 71.18V0h88a121.18 121.18 0 0 0 122.77 122.77z"/>
    </svg>
);

// Custom WhatsApp Icon
const WhatsAppIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg xmlns="http://www.w3.org/2000/svg" shapeRendering="geometricPrecision" textRendering="geometricPrecision" imageRendering="optimizeQuality" fillRule="evenodd" clipRule="evenodd" viewBox="0 0 509 511.514" {...props}><path fill="currentColor" d="M434.762 74.334C387.553 26.81 323.245 0 256.236 0h-.768C115.795.001 2.121 113.696 2.121 253.456l.001.015a253.516 253.516 0 0033.942 126.671L0 511.514l134.373-35.269a253.416 253.416 0 00121.052 30.9h.003.053C395.472 507.145 509 393.616 509 253.626c0-67.225-26.742-131.727-74.252-179.237l.014-.055zM255.555 464.453c-37.753 0-74.861-10.22-107.293-29.479l-7.72-4.602-79.741 20.889 21.207-77.726-4.984-7.975c-21.147-33.606-32.415-72.584-32.415-112.308 0-116.371 94.372-210.743 210.741-210.743 56.011 0 109.758 22.307 149.277 61.98a210.93 210.93 0 0161.744 149.095c0 116.44-94.403 210.869-210.844 210.869h.028zm115.583-157.914c-6.363-3.202-37.474-18.472-43.243-20.593-5.769-2.121-10.01-3.202-14.315 3.203-4.305 6.404-16.373 20.593-20.063 24.855-3.69 4.263-7.401 4.815-13.679 1.612-6.278-3.202-26.786-9.883-50.899-31.472a192.748 192.748 0 01-35.411-43.867c-3.712-6.363-.404-9.777 2.82-12.873 3.224-3.096 6.363-7.381 9.48-11.092a41.58 41.58 0 006.357-10.597 11.678 11.678 0 00-.508-11.09c-1.718-3.18-14.444-34.357-19.534-47.06-5.09-12.703-10.37-10.603-14.272-10.901-3.902-.297-7.911-.19-12.089-.19a23.322 23.322 0 00-16.964 7.911c-5.707 6.298-22.1 21.673-22.1 52.849s22.671 61.249 25.852 65.532c3.182 4.284 44.663 68.227 108.288 95.649 15.099 6.489 26.891 10.392 36.053 13.403a87.504 87.504 0 0025.216 3.718c4.905 0 9.82-.416 14.65-1.237 12.174-1.782 37.453-15.291 42.776-30.073s5.303-27.57 3.711-30.093c-1.591-2.524-5.704-4.369-12.088-7.615l-.038.021z"/></svg>
);

export function Footer() {
  const [socials, setSocials] = useState<SocialLinks>({ x: '', whatsapp: '', instagram: '', facebook: '', tiktok: '' });

  useEffect(() => {
    const fetchSocials = async () => {
      try {
        const docRef = doc(db, "socials", "links");
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          setSocials(docSnap.data() as SocialLinks);
        }
      } catch (error) {
        console.error("Error fetching social links:", error);
      }
    };

    fetchSocials();
  }, []);

  return (
    <footer className="bg-primary text-primary-foreground">
      <div className="container mx-auto px-6 py-12">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-4">
          <div className="col-span-1 md:col-span-2 lg:col-span-1">
            <Link href="/" className="flex items-center space-x-3">
              <Image src="/logo1.png" alt="TEC Təhlilləri Loqosu" width={60} height={60} className="object-contain" />
              <div className="flex flex-col text-sm font-semibold leading-tight">
                <span>Naxçıvan Dövlət Universiteti</span>
                <span className="text-xs font-medium">Tələbə Elmi Cəmiyyəti</span>
              </div>
            </Link>
            <p className="mt-4 text-sm text-primary-foreground/80">
              Elm, Tədqiqat və Əməkdaşlıq Mərkəzi
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
              {socials.whatsapp && (
                <Link href={socials.whatsapp} aria-label="WhatsApp" className="transition-colors hover:text-accent" target="_blank" rel="noopener noreferrer">
                  <WhatsAppIcon className="h-6 w-6" />
                </Link>
              )}
               {socials.x && (
                <Link href={socials.x} aria-label="X" className="transition-colors hover:text-accent" target="_blank" rel="noopener noreferrer">
                  <XIcon className="h-5 w-5" />
                </Link>
              )}
              {socials.tiktok && (
                <Link href={socials.tiktok} aria-label="TikTok" className="transition-colors hover:text-accent" target="_blank" rel="noopener noreferrer">
                  <TikTokIcon className="h-5 w-5" />
                </Link>
              )}
            </div>
          </div>
          <div>
            <h3 className="font-semibold uppercase tracking-wider text-accent">Naviqasiya</h3>
            <div className="mt-4 flex flex-col space-y-2 text-sm">
              <Link href="/about" className="hover:text-accent hover:underline">Haqqımızda</Link>
              <Link href="/projects" className="hover:text-accent hover:underline">Layihələr</Link>
              <Link href="/blog" className="hover:text-accent hover:underline">Xəbərlər & Bloq</Link>
              <Link href="/submit-article" className="hover:text-accent hover:underline">Məqalə Göndər</Link>
              <Link href="/contact" className="hover:text-accent hover:underline">Bizimlə Əlaqə</Link>
              <Link href="/trainings" className="hover:text-accent hover:underline">Təlimlər</Link>
            </div>
          </div>
          <div>
            <h3 className="font-semibold uppercase tracking-wider text-accent">Faydalı Keçidlər</h3>
             <div className="mt-4 flex flex-col space-y-2 text-sm">
                <a href="https://ndu.edu.az/" target="_blank" rel="noopener noreferrer" className="hover:text-accent hover:underline">Naxçıvan Dövlət Universiteti</a>
                <a href="https://lib.ndu.edu.az/" target="_blank" rel="noopener noreferrer" className="hover:text-accent hover:underline">Naxçıvan Dövlət Universitetinin Elektron Kitabxanası</a>
                <a href="https://jurnal.ndu.edu.az/" target="_blank" rel="noopener noreferrer" className="hover:text-accent hover:underline">Naxçıvan Dövlət Universitetinin Elmi Əsərlər Jurnalı</a>
                <a href="https://www.ndu.edu.az/yenifikir" target="_blank" rel="noopener noreferrer" className="hover:text-accent hover:underline">Yeni Fikir qəzeti</a>
                 <Accordion type="single" collapsible className="w-full">
                    <AccordionItem value="item-1" className="border-b-0">
                        <AccordionTrigger className="p-0 hover:no-underline hover:text-accent text-sm font-normal justify-start gap-1">Qanunvericilik</AccordionTrigger>
                        <AccordionContent className="pt-2 pl-2 flex flex-col space-y-2">
                           <a href="https://e-qanun.az/framework/18343" target="_blank" rel="noopener noreferrer" className="hover:text-accent hover:underline">“Təhsil haqqında” Qanun</a>
                           <a href="https://e-qanun.az/framework/33488" target="_blank" rel="noopener noreferrer" className="hover:text-accent hover:underline">“Elm haqqında” Qanun</a>
                        </AccordionContent>
                    </AccordionItem>
                </Accordion>
            </div>
          </div>
           <div>
            <h3 className="font-semibold uppercase tracking-wider text-accent">Əlaqə</h3>
            <div className="mt-4 flex flex-col space-y-3 text-sm">
                <div className="flex items-start gap-3">
                    <MapPin className="h-5 w-5 mt-1 shrink-0 text-accent"/>
                    <span>Azərbaycan Respublikası, Naxçıvan şəhəri, Universitet şəhərciyi, AZ7012, Naxçıvan Dövlət Universiteti</span>
                </div>
                 <div className="flex items-start gap-3">
                    <Phone className="h-5 w-5 mt-1 shrink-0 text-accent"/>
                    <div>
                        <a href="tel:+994365440861" className="hover:text-accent hover:underline">+994 36 544 08 61</a>
                        <p className="text-primary-foreground/80 mt-1">Daxili telefon: 1412</p>
                    </div>
                </div>
                 <div className="flex items-center gap-3">
                    <Mail className="h-5 w-5 shrink-0 text-accent"/>
                    <a href="mailto:tecndu@ndu.edu.az" className="hover:text-accent hover:underline">tecndu@ndu.edu.az</a>
                </div>
            </div>
          </div>
        </div>
        <div className="mt-12 border-t border-primary-foreground/10 pt-6 text-center text-sm text-primary-foreground/60">
          <p>&copy; {new Date().getFullYear()} NDU Tələbə Elmi Cəmiyyəti. Bütün hüquqlar qorunur.</p>
        </div>
      </div>
    </footer>
  );
}
    