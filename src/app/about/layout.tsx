"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

const aboutNavLinks = [
  { href: "/about", label: "Tariximiz" },
  { href: "/about/leadership", label: "Rəhbərlik və Komanda" },
  { href: "/about/mission", label: "Missiya və Dəyərlər" },
  { href: "/about/documents", label: "Sənədlər" },
  { href: "/about/former-chairmen", label: "Sabiq Sədrlər" },
];

export default function AboutLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="grid md:grid-cols-4 gap-12">
        <aside className="md:col-span-1">
          <nav className="sticky top-24 flex flex-col gap-2">
             <h2 className="text-lg font-semibold tracking-tight mb-2">Haqqımızda</h2>
            {aboutNavLinks.map((link) => {
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={cn(
                    "rounded-md px-3 py-2 text-sm font-medium transition-colors hover:bg-muted",
                    isActive ? "bg-muted font-semibold text-primary" : "text-muted-foreground"
                  )}
                >
                  {link.label}
                </Link>
              );
            })}
          </nav>
        </aside>
        <main className="md:col-span-3">
            {children}
        </main>
      </div>
    </div>
  );
}
