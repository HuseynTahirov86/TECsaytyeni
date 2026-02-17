
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Menu, Home, Info, Briefcase, Newspaper, Mail, ChevronDown, MessageSquare, BookOpen, GraduationCap, Building } from "lucide-react";
import { cn } from "@/lib/utils";
import Image from "next/image";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, DropdownMenuSeparator } from "@/components/ui/dropdown-menu";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Footer as RootFooter } from '@/components/footer';
import { Toaster } from "@/components/ui/toaster";
import * as React from "react";

const navLinks = [
  { href: "/projects", label: "Layihələr", icon: Briefcase },
  { href: "/trainings", label: "Təlimlər", icon: GraduationCap },
  { href: "/blog", label: "Bloq", icon: Newspaper },
  { href: "/library", label: "Kitabxana", icon: BookOpen },
  { href: "/appeal-to-chairman", label: "Sədrə Müraciət", icon: MessageSquare },
  { href: "/contact", label: "Əlaqə", icon: Mail },
];

const aboutLinks = [
    { href: "/about/leadership", label: "Rəhbərlik" },
    { href: "/about/board-members", label: "İdarə Heyəti" },
    { href: "/about", label: "Tariximiz" },
    { href: "/about/documents", label: "Sənədlər" },
    { href: "/about/vision", label: "Vizyonumuz" },
    { href: "/about/main-activities", label: "Əsas Fəaliyyət İstiqamətlərimiz" },
    { href: "/about/values-and-principles", label: "Dəyər Prinsiplərimiz" },
    { href: "/about/strategic-goals", label: "Strateji Məqsədlərimiz" },
    { href: "/about/former-chairmen", label: "Sabiq Sədrlər" },
];


export function Header() {
  const pathname = usePathname();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = React.useState(false);

  const NavLinksContent = ({ isMobile = false, onLinkClick }: { isMobile?: boolean, onLinkClick?: () => void }) => (
    <>
      {navLinks.map((link) => (
        <Link
          key={link.href}
          href={link.href}
          onClick={onLinkClick}
          className={cn(
            "flex items-center gap-2 transition-colors hover:text-accent whitespace-nowrap",
            pathname === link.href ? "text-accent font-semibold" : "text-primary-foreground",
            isMobile ? "px-2 py-2 text-lg" : "px-2 py-2 text-sm font-medium"
          )}
        >
          <link.icon className="h-4 w-4" />
          <span>{link.label}</span>
        </Link>
      ))}
    </>
  );

  return (
    <header className="sticky top-0 z-50 w-full border-b border-primary/20 bg-primary text-primary-foreground shadow-md">
      <div className="container mx-auto px-4 flex h-20 items-center max-w-full">
        <div className="flex items-center flex-shrink-0 min-w-0">
          <Link href="/" className="flex items-center space-x-3">
             <Image src="/logo1.png" alt="TEC Təhlilləri Loqosu" width={60} height={60} className="object-contain flex-shrink-0" />
            <div className="hidden sm:flex flex-col text-sm font-semibold leading-tight">
              <span>Naxçıvan Dövlət Universiteti</span>
              <span className="text-sm font-medium">Tələbə Elmi Cəmiyyəti</span>
            </div>
          </Link>
        </div>
        
        <nav className="hidden items-center space-x-1 xl:flex flex-1 justify-center mx-4 overflow-hidden">
          <div className="flex items-center space-x-1 overflow-x-auto scrollbar-hide">
            
            <Link
              href="/"
              className={cn(
                "flex items-center gap-2 transition-colors hover:text-accent whitespace-nowrap px-2 py-2 text-sm font-medium",
                pathname === "/" ? "text-accent font-semibold" : "text-primary-foreground"
              )}
            >
              <Home className="h-4 w-4" />
              <span>Ana Səhifə</span>
            </Link>
            
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className={cn("flex items-center gap-2 transition-colors hover:text-accent whitespace-nowrap px-2 py-2 text-sm font-medium text-primary-foreground hover:bg-transparent", pathname.startsWith('/about') ? "text-accent font-semibold" : "")}>
                        <Info className="h-4 w-4" />
                        Haqqımızda
                        <ChevronDown className="h-4 w-4" />
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="center" className="w-64">
                    {aboutLinks.map(link => (
                        <DropdownMenuItem asChild key={link.href}>
                            <Link href={link.href} className="text-sm">{link.label}</Link>
                        </DropdownMenuItem>
                    ))}
                </DropdownMenuContent>
            </DropdownMenu>
            
            <NavLinksContent />

             <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="flex items-center gap-2 transition-colors hover:text-accent whitespace-nowrap px-2 py-2 text-sm font-medium text-primary-foreground hover:bg-transparent">
                        <Building className="h-4 w-4" />
                        Tabe Qurumlar
                        <ChevronDown className="h-4 w-4" />
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="center" className="w-56">
                    <DropdownMenuItem asChild>
                        <Link href="/sec" className="text-sm">Şagird Elmi Cəmiyyəti</Link>
                    </DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </nav>
        
        <div className="flex items-center justify-end gap-1 sm:gap-2 flex-shrink-0 ml-auto">
           <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant="destructive" size="sm" className="text-xs sm:text-sm px-2 sm:px-4">
                    TETİ
                    <ChevronDown className="ml-1 sm:ml-2 h-3 w-3 sm:h-4 sm:w-4" />
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuItem asChild>
                    <Link href="/teti-login" className="text-sm">Tələbənin Şəxsi Kabineti</Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                    <Link href="/submit-document" className="text-sm">Sənəd Təqdim Et</Link>
                </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant="destructive" size="sm" className="text-xs sm:text-sm px-2 sm:px-4">
                    Məqalə
                    <ChevronDown className="ml-1 sm:ml-2 h-3 w-3 sm:h-4 sm:w-4" />
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuItem asChild>
                    <Link href="/submit-article/science" className="text-sm">Tələbə Elmi Jurnalı</Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                    <Link href="/submit-article/law" className="text-sm">Tələbə Hüquq Jurnalı</Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                 <DropdownMenuItem asChild>
                    <Link href="/journal-archive" className="text-sm">Jurnal Arxivi</Link>
                </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
            
          <div className="xl:hidden">
            <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="sm" className="text-primary-foreground hover:bg-primary-foreground/10 p-2">
                  <Menu className="h-5 w-5" />
                  <span className="sr-only">Menyunu Aç/Bağla</span>
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="bg-primary text-primary-foreground border-primary/20 w-full sm:max-w-sm flex flex-col">
                <SheetHeader>
                   <SheetTitle className="sr-only">Menyu</SheetTitle>
                </SheetHeader>
                 <Link href="/" className="mb-8 flex items-center space-x-3" onClick={() => setIsMobileMenuOpen(false)}>
                   <Image src="/logo1.png" alt="TEC Təhlilləri Loqosu" width={50} height={50} className="object-contain" />
                   <div className="flex flex-col text-base font-semibold leading-tight">
                    <span className="whitespace-nowrap">Naxçıvan Dövlət Universiteti</span>
                    <span className="text-sm font-medium">Tələbə Elmi Cəmiyyəti</span>
                  </div>
                </Link>
                <nav className="flex-1 flex flex-col space-y-1 overflow-y-auto">
                   <Link
                      href="/"
                      onClick={() => setIsMobileMenuOpen(false)}
                      className={cn(
                        "flex items-center gap-2 transition-colors hover:text-accent whitespace-nowrap px-2 py-2 text-lg",
                        pathname === "/" ? "text-accent font-semibold" : "text-primary-foreground"
                      )}
                    >
                      <Home className="h-4 w-4" />
                      <span>Ana Səhifə</span>
                    </Link>

                    <Accordion type="single" collapsible className="w-full">
                        <AccordionItem value="about-us" className="border-b-0">
                            <AccordionTrigger className={cn("flex items-center gap-2 transition-colors hover:text-accent whitespace-nowrap px-2 py-2 text-lg hover:no-underline [&_svg]:h-5 [&_svg]:w-5", pathname.startsWith('/about') ? "text-accent font-semibold" : "text-primary-foreground")}>
                                <Info className="h-4 w-4" />
                                <span>Haqqımızda</span>
                            </AccordionTrigger>
                            <AccordionContent className="pl-8 flex flex-col space-y-2 py-2">
                                {aboutLinks.map(link => (
                                    <Link key={link.href} href={link.href} onClick={() => setIsMobileMenuOpen(false)} className={cn("text-primary-foreground/80 hover:text-accent text-base", pathname === link.href ? "text-accent font-semibold" : "")}>{link.label}</Link>
                                ))}
                            </AccordionContent>
                        </AccordionItem>
                    </Accordion>
                    
                    <NavLinksContent isMobile={true} onLinkClick={() => setIsMobileMenuOpen(false)} />
                  
                    <Accordion type="single" collapsible className="w-full">
                        <AccordionItem value="related-orgs" className="border-b-0">
                            <AccordionTrigger className={cn("flex items-center gap-2 transition-colors hover:text-accent whitespace-nowrap px-2 py-2 text-lg hover:no-underline [&_svg]:h-5 [&_svg]:w-5", pathname.startsWith('/sec') ? "text-accent font-semibold" : "text-primary-foreground")}>
                                <Building className="h-4 w-4" />
                                <span>Tabe Qurumlar</span>
                            </AccordionTrigger>
                            <AccordionContent className="pl-8 py-2">
                                 <Link href="/sec" onClick={() => setIsMobileMenuOpen(false)} className={cn("text-primary-foreground/80 hover:text-accent text-base", pathname === "/sec" ? "text-accent font-semibold" : "")}>Şagird Elmi Cəmiyyəti</Link>
                            </AccordionContent>
                        </AccordionItem>
                    </Accordion>
                </nav>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </header>
  );
}

export function LayoutWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="relative flex min-h-dvh flex-col bg-background">
      <Header />
      <main className="flex-1">{children}</main>
      <RootFooter />
      <Toaster />
    </div>
  );
}
