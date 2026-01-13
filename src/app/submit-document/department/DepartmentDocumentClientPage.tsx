
"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { DepartmentProtocolForm } from "./protocol-form";
import { DepartmentStatisticsForm } from "./statistics-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Terminal } from "lucide-react";
import { motion } from "framer-motion";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";

const passwordSchema = z.object({
  password: z.string().min(1, { message: "Şifrə daxil edilməlidir." }),
});

type PasswordFormValues = z.infer<typeof passwordSchema>;

export default function DepartmentDocumentClientPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [documentType, setDocumentType] = useState<"statistics" | "protocol" | "other">("statistics");

  const form = useForm<PasswordFormValues>({
    resolver: zodResolver(passwordSchema),
    defaultValues: { password: "" },
  });

  const checkPassword = (data: PasswordFormValues) => {
    if (data.password === "ndutec1969") {
      setIsAuthenticated(true);
      setError(null);
    } else {
      setError("Şifrə yanlışdır.");
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="flex min-h-[calc(100vh-10rem)] w-full items-center justify-center bg-muted p-4">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl font-bold">Kafedra Bölməsi</CardTitle>
            <CardDescription>Davam etmək üçün şifrəni daxil edin.</CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(checkPassword)} className="space-y-4">
                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Şifrə</FormLabel>
                      <FormControl>
                        <Input type="password" placeholder="********" {...field} autoComplete="current-password" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                {error && (
                  <Alert variant="destructive">
                      <Terminal className="h-4 w-4" />
                      <AlertTitle>Xəta</AlertTitle>
                      <AlertDescription>{error}</AlertDescription>
                  </Alert>
                )}
                <Button type="submit" className="w-full">
                  Daxil Ol
                </Button>
              </form>
            </Form>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.8 }}
      className="container mx-auto max-w-4xl px-4 py-12"
    >
      <header className="text-center mb-8">
        <h1 className="text-3xl font-extrabold tracking-tight text-primary lg:text-4xl">
          Kafedra üzrə Sənəd Təqdim Et
        </h1>
        <p className="mt-4 max-w-2xl mx-auto text-lg text-muted-foreground">
          Zəhmət olmasa, təqdim etmək istədiyiniz sənəd növünü seçin və formu doldurun.
        </p>
      </header>
       <Card className="mb-8">
        <CardContent className="pt-6">
            <RadioGroup
            defaultValue={documentType}
            onValueChange={(value: "statistics" | "protocol" | "other") => setDocumentType(value)}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"
            >
                <Label htmlFor="statistics" className="flex-1">
                    <Card className={`cursor-pointer transition-all h-full ${documentType === 'statistics' ? 'border-primary ring-2 ring-primary' : 'hover:border-muted-foreground/50'}`}>
                        <CardHeader className="flex flex-row items-center gap-4">
                             <RadioGroupItem value="statistics" id="statistics" className="sr-only" />
                             <div>
                                <CardTitle>TETİ Məlumatları</CardTitle>
                                <CardDescription>TETİ götürən tələbələr haqqında statistik məlumat və siyahı.</CardDescription>
                             </div>
                        </CardHeader>
                    </Card>
                </Label>
                 <Label htmlFor="protocol" className="flex-1">
                    <Card className={`cursor-pointer transition-all h-full ${documentType === 'protocol' ? 'border-primary ring-2 ring-primary' : 'hover:border-muted-foreground/50'}`}>
                        <CardHeader className="flex flex-row items-center gap-4">
                             <RadioGroupItem value="protocol" id="protocol" className="sr-only" />
                             <div>
                                <CardTitle>Kafedra İclas Protokolu</CardTitle>
                                <CardDescription>TETİ nəticələri ilə bağlı kafedra iclasının protokolundan çıxarış.</CardDescription>
                             </div>
                        </CardHeader>
                    </Card>
                 </Label>
                  <Label htmlFor="other" className="flex-1">
                    <Card className={`cursor-pointer transition-all h-full ${documentType === 'other' ? 'border-primary ring-2 ring-primary' : 'hover:border-muted-foreground/50'}`}>
                        <CardHeader className="flex flex-row items-center gap-4">
                             <RadioGroupItem value="other" id="other" className="sr-only" />
                             <div>
                                <CardTitle>Müxtəlif Təyinatlı Sənəd</CardTitle>
                                <CardDescription>Digər növ sənədlərinizi buradan təqdim edə bilərsiniz.</CardDescription>
                             </div>
                        </CardHeader>
                    </Card>
                 </Label>
            </RadioGroup>
        </CardContent>
       </Card>

      <div className="p-4 sm:p-8 border rounded-lg bg-card text-card-foreground shadow-lg">
        {documentType === 'statistics' && <DepartmentStatisticsForm />}
        {(documentType === 'protocol' || documentType === 'other') && <DepartmentProtocolForm documentType={documentType} />}
      </div>
    </motion.div>
  );
}
