
"use client";

import Link from "next/link";
import { usePathname, useRouter } from 'next/navigation';
import { Button } from "@/components/ui/button";
import { 
    Home, Newspaper, Briefcase, LogOut, Share2, Users, MessageSquare, 
    BookText, Landmark, MailCheck, UserCheck, Library, GraduationCap, 
    ClipboardList, Quote, Building, Archive, Shield, Image as ImageIcon, 
    Info, Menu, UserCog, FileText, Eye, ListOrdered, Goal, Scale 
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";
import { logoutAdmin } from '@/lib/actions';
import { Sheet, SheetContent, SheetTrigger, SheetHeader, SheetTitle } from "@/components/ui/sheet";

const navGroups = [
  {
    title: "Ümumi İdarəetmə",
    links: [
      { href: "/ndutecnaxcivan19692025tec/dashboard", label: "Əsas Panel", icon: Home },
      { href: "/ndutecnaxcivan19692025tec/admins", label: "Admin Hesabları", icon: Shield },
      { href: "/ndutecnaxcivan19692025tec/socials", label: "Sosial Hesablar", icon: Share2 },
    ]
  },
  {
    title: "Haqqımızda Bölməsi",
    links: [
      { href: "/ndutecnaxcivan19692025tec/chairman", label: "Rəhbərlik", icon: UserCog },
      { href: "/ndutecnaxcivan19692025tec/team", label: "İdarə Heyəti", icon: Users },
      { href: "/ndutecnaxcivan19692025tec/history", label: "Tariximiz", icon: Info },
      { href: "/ndutecnaxcivan19692025tec/documents", label: "Rəsmi Sənədlər", icon: FileText },
      { href: "/ndutecnaxcivan19692025tec/main-activities", label: "Fəaliyyət İstiqamətləri", icon: ListOrdered },
      { href: "/ndutecnaxcivan19692025tec/values-and-principles", label: "Dəyər və Prinsiplər", icon: Scale },
      { href: "/ndutecnaxcivan19692025tec/vision", label: "Vizyonumuz", icon: Eye },
      { href: "/ndutecnaxcivan19692025tec/strategic-goals", label: "Strateji Məqsədlər", icon: Goal },
      { href: "/ndutecnaxcivan19692025tec/formers", label: "Sabiq Sədrlər", icon: UserCheck },
    ]
  },
  {
    title: "Sayt Məzmunu",
    links: [
      { href: "/ndutecnaxcivan19692025tec/hero-slides", label: "Ana Səhifə Slayderi", icon: ImageIcon },
      { href: "/ndutecnaxcivan19692025tec/news", label: "Xəbərlər və Bloq", icon: Newspaper },
      { href: "/ndutecnaxcivan19692025tec/projects", label: "Layihələr", icon: Briefcase },
      { href: "/ndutecnaxcivan19692025tec/aphorisms", label: "Aforizm Karuseli", icon: Quote },
      { href: "/ndutecnaxcivan19692025tec/academic-writing", label: "Akademik Yazı Qaydaları", icon: BookText },
    ]
  },
  {
    title: "ŞEC Bölməsi",
    links: [
        { href: "/ndutecnaxcivan19692025tec/sec-about-content", label: "ŞEC Məzmunu", icon: Info },
        { href: "/ndutecnaxcivan19692025tec/sec-team", label: "ŞEC Komandası", icon: Users },
    ]
  },
  {
    title: "Kitabxana və Jurnallar",
    links: [
      { href: "/ndutecnaxcivan19692025tec/library", label: "Kitabxana", icon: Library },
      { href: "/ndutecnaxcivan19692025tec/journal-archive", label: "Jurnal Arxivi", icon: Archive },
      { href: "/ndutecnaxcivan19692025tec/science-journal", label: "Elmi Jurnal Məqalələri", icon: BookText },
      { href: "/ndutecnaxcivan19692025tec/law-journal", label: "Hüquq Jurnalı Məqalələri", icon: Landmark },
    ]
  },
  {
    title: "Müraciətlər",
    links: [
      { href: "/ndutecnaxcivan19692025tec/messages", label: "Əlaqə Mesajları", icon: MessageSquare },
      { href: "/ndutecnaxcivan19692025tec/appeals", label: "Sədrə Müraciətlər", icon: MailCheck },
    ]
  },
  {
    title: "TETİ Bölməsi",
    links: [
      { href: "/ndutecnaxcivan19692025tec/teti-users", label: "TETİ İstifadəçiləri", icon: Users },
      { href: "/ndutecnaxcivan19692025tec/teti-reports", label: "TETİ Sənədləri", icon: Building },
    ]
  },
  {
    title: "Təlim Sistemi",
    links: [
      { href: "/ndutecnaxcivan19692025tec/users", label: "Təlim İstifadəçiləri", icon: Users },
      { href: "/ndutecnaxcivan19692025tec/trainings", label: "Təlimlər", icon: GraduationCap },
      { href: "/ndutecnaxcivan19692025tec/trainings/registrations", label: "Təlim Qeydiyyatları", icon: ClipboardList },
    ]
  }
];


export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const { toast } = useToast();

  const handleLogout = async () => {
    await logoutAdmin();
    toast({
      title: "Uğurlu Çıxış",
      description: "Giriş səhifəsinə yönləndirilirsiniz...",
    });
    router.push("/admin/login");
    router.refresh();
  };

  const NavContent = () => (
    <>
      {navGroups.map((group, groupIndex) => (
        <div key={groupIndex} className={groupIndex > 0 ? "pt-4" : ""}>
          <h3 className="mb-2 px-3 text-xs font-semibold uppercase text-muted-foreground/70 tracking-wider">{group.title}</h3>
          <div className="space-y-1">
            {group.links.map((link) => {
              const isActive = pathname.startsWith(link.href) && 
              (pathname === link.href || (link.href !== "/ndutecnaxcivan19692025tec/dashboard" && pathname.startsWith(link.href + '/')));

              return (
                  <Link
                  key={link.href}
                  href={link.href}
                  className={cn(
                      "flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary",
                       isActive ? "bg-muted text-primary font-medium" : ""
                  )}
                  >
                  <link.icon className="h-4 w-4" />
                  {link.label}
                  </Link>
              )
            })}
          </div>
        </div>
      ))}
    </>
  );

  return (
    <div className="flex min-h-screen bg-muted/40">
      <aside className="hidden w-72 flex-col border-r bg-background sm:flex">
        <div className="border-b p-4 h-16 flex items-center">
          <Link href="/ndutecnaxcivan19692025tec/dashboard" className="flex items-center gap-2 font-semibold">
            <span className="text-xl">Admin Panel</span>
          </Link>
        </div>
        <nav className="flex-1 p-4 overflow-y-auto">
          <NavContent />
        </nav>
        <div className="mt-auto p-4 border-t">
          <Button variant="ghost" className="w-full justify-start gap-3" onClick={handleLogout}>
            <LogOut className="h-4 w-4" />
            Çıxış
          </Button>
        </div>
      </aside>
      <div className="flex flex-1 flex-col">
        <header className="flex h-16 items-center gap-4 border-b bg-background px-6">
           <div className="sm:hidden">
              <Sheet>
                <SheetTrigger asChild>
                  <Button variant="outline" size="icon">
                    <Menu className="h-6 w-6" />
                    <span className="sr-only">Menyunu aç</span>
                  </Button>
                </SheetTrigger>
                <SheetContent side="left" className="flex flex-col p-0">
                    <SheetHeader className="p-4 border-b h-16 flex items-center">
                        <SheetTitle>
                           <Link href="/ndutecnaxcivan19692025tec/dashboard" className="flex items-center gap-2 font-semibold">
                              <span>Admin Panel</span>
                           </Link>
                        </SheetTitle>
                    </SheetHeader>
                    <nav className="flex-1 p-4 text-base font-medium overflow-y-auto">
                        <NavContent />
                    </nav>
                     <div className="mt-auto p-4 border-t">
                        <Button variant="ghost" className="w-full justify-start gap-3" onClick={handleLogout}>
                            <LogOut className="h-4 w-4" />
                            Çıxış
                        </Button>
                    </div>
                </SheetContent>
              </Sheet>
           </div>
           <div className="flex-1 sm:hidden">
              <h1 className="font-semibold text-lg">
                 {navGroups.flatMap(g => g.links).find(link => pathname === link.href)?.label || "Admin Panel"}
              </h1>
           </div>
        </header>
        <main className="flex-1 p-4 sm:p-6">{children}</main>
      </div>
    </div>
  );
}

    

    