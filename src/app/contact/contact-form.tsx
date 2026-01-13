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

const formSchema = z.object({
  name: z.string().min(2, {
    message: "Ad ən azı 2 simvoldan ibarət olmalıdır.",
  }),
  email: z.string().email({
    message: "Zəhmət olmasa, düzgün bir e-poçt ünvanı daxil edin.",
  }),
  subject: z.string().min(5, {
      message: "Mövzu ən azı 5 simvoldan ibarət olmalıdır."
  }),
  message: z.string().min(10, {
    message: "Mesaj ən azı 10 simvoldan ibarət olmalıdır.",
  }),
});

export function ContactForm() {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
      subject: "",
      message: "",
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsSubmitting(true);
    try {
        await addDoc(collection(db, "contacts"), {
            ...values,
            sentAt: serverTimestamp(),
        });
        toast({
            title: "Mesajınız Göndərildi!",
            description: "Tezliklə sizinlə əlaqə saxlayacağıq.",
        });
        form.reset();
    } catch (error) {
        console.error("Error sending message: ", error);
        toast({
            title: "Xəta!",
            description: "Mesaj göndərilərkən bir problem yarandı. Zəhmət olmasa, sonra yenidən cəhd edin.",
            variant: "destructive",
        });
    } finally {
        setIsSubmitting(false);
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
                <FormItem>
                <FormLabel>Adınız</FormLabel>
                <FormControl>
                    <Input placeholder="Ad və Soyad" {...field} />
                </FormControl>
                <FormMessage />
                </FormItem>
            )}
            />
            <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
                <FormItem>
                <FormLabel>E-poçt Ünvanı</FormLabel>
                <FormControl>
                    <Input placeholder="nümunə@email.com" {...field} />
                </FormControl>
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
              <FormControl>
                <Input placeholder="Mesajınızın mövzusu" {...field} />
              </FormControl>
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
              <FormControl>
                <Textarea
                  placeholder="Bizə nə demək istərdiniz?"
                  className="min-h-[150px]"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" size="lg" className="w-full" disabled={isSubmitting}>
            {isSubmitting ? "Göndərilir..." : "Mesajı Göndər"}
        </Button>
      </form>
    </Form>
  );
}
