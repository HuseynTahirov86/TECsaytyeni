
"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { FacultyDocumentForm } from "./faculty-document-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Terminal } from "lucide-react";
import { motion } from "framer-motion";

const passwordSchema = z.object({
  password: z.string().min(1, { message: "Şifrə daxil edilməlidir." }),
});

type PasswordFormValues = z.infer<typeof passwordSchema>;

export default function FacultyDocumentClientPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [error, setError] = useState<string | null>(null);

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
            <CardTitle className="text-2xl font-bold">Fakültə Bölməsi</CardTitle>
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
          Fakültə üzrə Sənəd Təqdim Et
        </h1>
        <p className="mt-4 max-w-2xl mx-auto text-lg text-muted-foreground">
          Zəhmət olmasa, formu tam doldurun və müvafiq faylı yükləyin.
        </p>
      </header>
      <div className="p-4 sm:p-8 border rounded-lg bg-card text-card-foreground shadow-lg">
        <FacultyDocumentForm />
      </div>
    </motion.div>
  );
}
