import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { PlaceHolderImages } from "@/lib/placeholder-images";
import { getUserById } from "@/lib/data";
import { Separator } from "@/components/ui/separator";

export default function ProfilePage() {
  // Mock data for current user
  const user = getUserById("user-4");
  const userAvatar = user ? PlaceHolderImages.find((img) => img.id === user.avatarId) : null;

  if (!user) return null;

  return (
    <div className="container mx-auto max-w-4xl py-12 px-4 md:px-6">
      <div className="mb-12">
        <h1 className="text-4xl font-extrabold tracking-tight font-headline sm:text-5xl">
          Profil
        </h1>
        <p className="mt-4 text-xl text-muted-foreground">
          Hesab məlumatlarınızı idarə edin.
        </p>
      </div>

      <div className="grid gap-8 md:grid-cols-3">
        <div className="md:col-span-1">
          <Card>
            <CardHeader className="items-center">
              <Avatar className="h-24 w-24 mb-4">
                 {userAvatar && <AvatarImage src={userAvatar.imageUrl} alt={user.name} data-ai-hint={userAvatar.imageHint}/>}
                <AvatarFallback className="text-4xl">{user.name.charAt(0)}</AvatarFallback>
              </Avatar>
              <CardTitle>{user.name}</CardTitle>
              <CardDescription>{user.email}</CardDescription>
            </CardHeader>
            <CardContent>
              <Button variant="outline" className="w-full">
                Profili şəklini dəyiş
              </Button>
            </CardContent>
          </Card>
        </div>

        <div className="md:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Profil Məlumatları</CardTitle>
              <CardDescription>
                Şəxsi məlumatlarınızı yeniləyin.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Tam Ad</Label>
                  <Input id="name" defaultValue={user.name} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">E-poçt</Label>
                  <Input id="email" type="email" defaultValue={user.email} />
                </div>
                <Button type="submit" className="bg-accent hover:bg-accent/90">Yadda saxla</Button>
              </form>
            </CardContent>
          </Card>

          <Separator className="my-6" />

          <Card>
             <CardHeader>
              <CardTitle>Şifrəni Dəyiş</CardTitle>
              <CardDescription>
                Təhlükəsizlik üçün şifrənizi müntəzəm olaraq dəyişin.
              </CardDescription>
            </CardHeader>
            <CardContent>
               <form className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="current-password">Cari Şifrə</Label>
                  <Input id="current-password" type="password" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="new-password">Yeni Şifrə</Label>
                  <Input id="new-password" type="password" />
                </div>
                <Button type="submit" variant="destructive">Şifrəni yenilə</Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
