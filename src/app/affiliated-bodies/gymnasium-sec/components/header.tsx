"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Menu, Home, Info, Briefcase, Newspaper, Mail, MessageSquare, ArrowLeft } from "lucide-react";
import { usePathname } from 'next/navigation';
import { cn } from "@/lib/utils";
import Image from "next/image";

const navLinks = [
  { href: "/affiliated-bodies/gymnasium-sec", label: "Ana Səhifə", icon: Home },
  { href: "/affiliated-bodies/gymnasium-sec/about", label: "Haqqımızda", icon: Info },
  { href: "/affiliated-bodies/gymnasium-sec/projects", label: "Layihələr", icon: Briefcase },
  { href: "/affiliated-bodies/gymnasium-sec/blog", label: "Bloq", icon: Newspaper },
  { href: "/affiliated-bodies/gymnasium-sec/appeal-to-chairman", label: "Sədrə Müraciət", icon: MessageSquare },
  { href: "/affiliated-bodies/gymnasium-sec/contact", label: "Əlaqə", icon: Mail },
];

export function Header() {
  const pathname = usePathname();

  const NavLinksContent = ({ isMobile = false }) => (
    <>
      {navLinks.map((link) => (
        <Link
          key={link.href}
          href={link.href}
          className={cn(
            "flex items-center gap-2 transition-colors hover:text-accent",
            pathname === link.href ? "text-accent font-semibold" : "text-primary-foreground",
            isMobile ? "px-2 py-2 text-lg" : "text-sm font-medium"
          )}
        >
          <link.icon className="h-4 w-4" />
          <span>{link.label}</span>
        </Link>
      ))}
    </>
  );

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-primary text-primary-foreground shadow-md">
      <div className="container mx-auto flex h-20 items-center px-4">
        <Link href="/affiliated-bodies/gymnasium-sec" className="flex items-center space-x-3">
          <Image src="/logo1.png" alt="ŞEC Loqo" width={50} height={50} className="object-contain" />
          <div className="flex flex-col text-sm font-semibold leading-tight">
            <span>NDU nəzdində Gimnaziya</span>
            <span className="text-xs font-medium">Şagird Elmi Cəmiyyəti</span>
          </div>
        </Link>
        <nav className="ml-10 hidden items-center space-x-6 lg:flex">
          <NavLinksContent />
        </nav>
        <div className="ml-auto flex items-center gap-4">
            <Button asChild variant="secondary">
                <Link href="/">
                    <ArrowLeft className="mr-2 h-4 w-4" /> TEC Əsas Sayt
                </Link>
            </Button>
          <div className="lg:hidden">
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="text-primary-foreground hover:bg-primary-foreground/10">
                  <Menu className="h-6 w-6" />
                  <span className="sr-only">Menyunu aç</span>
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="bg-primary text-primary-foreground">
                <nav className="mt-8 flex flex-col space-y-4">
                  <NavLinksContent isMobile={true} />
                </nav>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </header>
  );
}
