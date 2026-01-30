"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { AppealForm } from './AppealForm';

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
            <AppealForm />
        </CardContent>
       </Card>
    </div>
  );
}
