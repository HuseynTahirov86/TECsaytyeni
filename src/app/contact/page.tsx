import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

export default function ContactPage() {
  return (
    <div className="container mx-auto max-w-2xl py-12 px-4 md:px-6">
      <Card>
        <CardHeader className="text-center">
          <CardTitle className="text-3xl font-bold font-headline">Əlaqə</CardTitle>
          <CardDescription>
            Sualınız və ya təklifiniz var? Bizimlə əlaqə saxlayın.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="first-name">Ad</Label>
                <Input id="first-name" placeholder="Adınız" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="last-name">Soyad</Label>
                <Input id="last-name" placeholder="Soyadınız" />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">E-poçt</Label>
              <Input id="email" type="email" placeholder="E-poçt ünvanınız" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="subject">Mövzu</Label>
              <Input id="subject" placeholder="Müraciətin mövzusu" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="message">Mesajınız</Label>
              <Textarea id="message" placeholder="Mesajınızı buraya yazın" rows={5} />
            </div>
            <Button type="submit" className="w-full bg-accent hover:bg-accent/90">
              Göndər
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
