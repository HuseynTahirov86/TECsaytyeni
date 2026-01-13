'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Menu, Newspaper, Search, User } from 'lucide-react';
import { getCategories } from '@/lib/data';
import { SidebarTrigger } from '../ui/sidebar';
import { useState } from 'react';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import Image from 'next/image';

const NavLink = ({ href, children }: { href: string; children: React.ReactNode }) => (
  <Link href={href} className="text-sm font-medium text-foreground/70 transition-colors hover:text-foreground">
    {children}
  </Link>
);

export default function Header() {
  // Mock authentication state
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const categories = getCategories();
  const userAvatar = PlaceHolderImages.find(img => img.id === 'user-avatar-4');

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-card shadow-sm">
      <div className="container flex h-16 items-center justify-between px-4 md:px-6">
        <div className="flex items-center gap-4">
           <div className="md:hidden">
            <SidebarTrigger />
           </div>
          <Link href="/" className="flex items-center gap-2 font-bold text-lg font-headline">
            <Newspaper className="h-6 w-6 text-primary-foreground" style={{backgroundColor: 'hsl(var(--primary))', padding: '2px', borderRadius: '4px' }}/>
            AzerNews Hub
          </Link>
        </div>

        <nav className="hidden md:flex items-center gap-6">
          <NavLink href="/">Ana Səhifə</NavLink>
          {categories.map((category) => (
            <NavLink key={category.slug} href={`/category/${category.slug}`}>
              {category.name}
            </NavLink>
          ))}
        </nav>

        <div className="flex items-center gap-4">
          <div className="relative hidden sm:block">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input type="search" placeholder="Axtar..." className="pl-8 sm:w-[200px] lg:w-[300px]" />
          </div>
          
          {isAuthenticated ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                  <Avatar className="h-8 w-8">
                    {userAvatar && <AvatarImage src={userAvatar.imageUrl} alt="User Avatar" data-ai-hint={userAvatar.imageHint}/>}
                    <AvatarFallback>NU</AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56" align="end" forceMount>
                <DropdownMenuLabel className="font-normal">
                  <div className="flex flex-col space-y-1">
                    <p className="text-sm font-medium leading-none">New User</p>
                    <p className="text-xs leading-none text-muted-foreground">new@example.com</p>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild><Link href="/profile">Profil</Link></DropdownMenuItem>
                <DropdownMenuItem asChild><Link href="/dashboard">Dashboard</Link></DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => setIsAuthenticated(false)}>Çıxış</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <div className='hidden md:flex gap-2'>
              <Button variant="outline" asChild>
                <Link href="/login">Giriş</Link>
              </Button>
              <Button asChild>
                <Link href="/register">Qeydiyyat</Link>
              </Button>
            </div>
          )}

          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="md:hidden">
                <Menu className="h-6 w-6" />
                <span className="sr-only">Toggle navigation menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="right">
              <div className="flex flex-col gap-6 p-6">
                <Link href="/" className="flex items-center gap-2 font-bold text-lg font-headline">
                  <Newspaper className="h-6 w-6 text-primary-foreground" style={{backgroundColor: 'hsl(var(--primary))', padding: '2px', borderRadius: '4px' }}/>
                  AzerNews Hub
                </Link>
                <nav className="flex flex-col gap-4">
                  <NavLink href="/">Ana Səhifə</NavLink>
                  {categories.map((category) => (
                    <NavLink key={category.slug} href={`/category/${category.slug}`}>
                      {category.name}
                    </NavLink>
                  ))}
                </nav>
                 <div className="flex flex-col gap-2">
                    <Button variant="outline" asChild>
                      <Link href="/login">Giriş</Link>
                    </Button>
                    <Button asChild>
                      <Link href="/register">Qeydiyyat</Link>
                    </Button>
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
