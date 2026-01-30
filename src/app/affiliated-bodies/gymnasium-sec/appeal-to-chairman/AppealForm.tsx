"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useState } from "react";
import { db } from "@/lib/firebase";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";

const appealSchema = z.object({
  fullName: z.string().min(3, "Ad və Soyad daxil edilməlidir."),
  class: z.string().min(1, "Sinif daxil edilməlidir."),
  subject: z.string().min(3, "Mövzu daxil edilməlidir."),
  message: z.string().min(10, "Müraciət mətni ən azı 10 simvoldan ibarət olmalıdır."),
});

type AppealFormValues = z.infer<typeof appealSchema>;

export function AppealForm() {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<AppealFormValues>({
    resolver: zodResolver(appealSchema),
    defaultValues: {
      fullName: "",
      class: "",
      subject: "",
      message: "",
    },
  });

  async function onSubmit(values: AppealFormValues) {
    setIsSubmitting(true);
    try {
      await addDoc(collection(db, "secChairmanAppeals"), {
        ...values,
        submittedAt: serverTimestamp(),
      });
      toast({
        title: "Müraciətiniz Göndərildi!",
        description: "Müraciətiniz uğurla ŞEC sədrinə ünvanlandı.",
      });
      form.reset();
    } catch (error) {
      console.error("Error sending SEC appeal: ", error);
      toast({
        title: "Xəta!",
        description: "Müraciət göndərilərkən bir problem yarandı.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="fullName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Ad və Soyad</FormLabel>
                <FormControl><Input placeholder="Adınız və Soyadınız" {...field} /></FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="class"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Sinif</FormLabel>
                <FormControl><Input placeholder="Məs: 8a" {...field} /></FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <FormField
          control={form.control}
          name="subject"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Mövzu</FormLabel>
              <FormControl><Input placeholder="Müraciətin mövzusu" {...field} /></FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="message"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Mesajınız</FormLabel>
              <FormControl><Textarea placeholder="Mesajınızı bura yazın..." rows={6} {...field} /></FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? 'Göndərilir...' : 'Göndər'}
        </Button>
      </form>
    </Form>
  );
}
