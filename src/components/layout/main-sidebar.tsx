import Link from 'next/link';
import Image from 'next/image';
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
} from '@/components/ui/sidebar';
import { getArticles } from '@/lib/data';
import { PlaceHolderImages } from '@/lib/placeholder-images';

export default function MainSidebar() {
  const popularArticles = getArticles().slice(0, 5);

  return (
    <Sidebar collapsible="icon" className="hidden md:block">
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Populyar Məzmun</SidebarGroupLabel>
          <SidebarMenu>
            {popularArticles.map((article) => {
              const image = PlaceHolderImages.find((img) => img.id === article.imageId);
              return (
                <SidebarMenuItem key={article.slug}>
                  <SidebarMenuButton asChild variant="ghost" size="lg" className="h-auto p-2" tooltip={article.title}>
                    <Link href={`/articles/${article.slug}`} className="flex items-center gap-3">
                       {image && <Image
                        src={image.imageUrl}
                        alt={article.title}
                        width={40}
                        height={40}
                        className="rounded-md"
                        data-ai-hint={image.imageHint}
                      />}
                      <span className="truncate group-data-[collapsible=icon]:hidden">{article.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              );
            })}
          </SidebarMenu>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}
