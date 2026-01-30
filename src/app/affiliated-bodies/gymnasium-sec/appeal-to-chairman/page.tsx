import type { Metadata } from 'next';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';

export const metadata: Metadata = {
  title: 'Sədrə Müraciət',
};

export default function AppealPage() {
  return (
    <div className="container mx-auto px-4 py-12 max-w-3xl">
      <header className="text-center mb-12">
        <h1 className="text-4xl font-extrabold tracking-tight text-primary lg:text-5xl">
          ŞEC Sədrinə Müraciət
        </h1>
         <p className="mt-4 max-w-2xl mx-auto text-lg text-muted-foreground">
            Fikirləriniz, suallarınız və təklifləriniz bizim üçün dəyərlidir.
        </p>
      </header>
       <Card>
        <CardHeader>
            <CardTitle>Müraciət Formu</CardTitle>
            <CardDescription>Aşağıdakı formu dolduraraq birbaşa ŞEC sədrinə müraciət edə bilərsiniz.</CardDescription>
        </CardHeader>
        <CardContent>
            <form className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-2">
                        <Label htmlFor="name">Ad və Soyad</Label>
                        <Input id="name" placeholder="Adınız və Soyadınız" />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="class">Sinif</Label>
                        <Input id="class" placeholder="Məs: 8a" />
                    </div>
                </div>
                 <div className="space-y-2">
                    <Label htmlFor="subject">Mövzu</Label>
                    <Input id="subject" placeholder="Müraciətin mövzusu" />
                </div>
                 <div className="space-y-2">
                    <Label htmlFor="message">Mesajınız</Label>
                    <Textarea id="message" placeholder="Mesajınızı bura yazın..." rows={6}/>
                </div>
                 <Button type="submit" disabled>Göndər (Tezliklə aktiv olacaq)</Button>
            </form>
        </CardContent>
       </Card>
    </div>
  );
}
