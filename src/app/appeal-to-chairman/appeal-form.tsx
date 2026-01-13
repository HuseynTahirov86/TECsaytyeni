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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

const appealSchema = z.object({
  fullName: z.string().min(5, "Soyad, Ad və Ata adı tam daxil edilməlidir."),
  faculty: z.string().min(3, "Fakültə adı daxil edilməlidir."),
  specialization: z.string().min(3, "İxtisas adı daxil edilməlidir."),
  course: z.string({ required_error: "Zəhmət olmasa, kursunuzu seçin." }),
  phone: z.string().min(10, "Düzgün əlaqə nömrəsi daxil edin."),
  email: z.string().email("Düzgün e-poçt ünvanı daxil edin."),
  subject: z.enum(["Sual", "Təklif", "Şikayət"], { required_error: "Müraciətin mövzusunu seçin." }),
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
      faculty: "",
      specialization: "",
      phone: "",
      email: "",
      message: "",
    },
  });

  async function onSubmit(values: AppealFormValues) {
    setIsSubmitting(true);
    try {
      await addDoc(collection(db, "chairmanAppeals"), {
        ...values,
        submittedAt: serverTimestamp(),
      });
      toast({
        title: "Müraciətiniz Göndərildi!",
        description: "Müraciətiniz uğurla TEC sədrinə ünvanlandı.",
      });
      form.reset();
    } catch (error) {
      console.error("Error sending appeal: ", error);
      toast({
        title: "Xəta!",
        description: "Müraciət göndərilərkən bir problem yarandı. Zəhmət olmasa, sonra yenidən cəhd edin.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <p className="text-sm text-destructive">* Zorunlu sahəni göstərir</p>
        <FormField
          control={form.control}
          name="fullName"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Soyad, Ad, Ata adınızı daxil edin*</FormLabel>
              <FormControl><Input placeholder="Məs: Əliyev Əli Vəli oğlu" {...field} /></FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <FormField
            control={form.control}
            name="faculty"
            render={({ field }) => (
                <FormItem>
                <FormLabel>Fakültə*</FormLabel>
                <FormControl><Input placeholder="Fakültənizin adı" {...field} /></FormControl>
                <FormMessage />
                </FormItem>
            )}
            />
            <FormField
            control={form.control}
            name="specialization"
            render={({ field }) => (
                <FormItem>
                <FormLabel>İxtisas*</FormLabel>
                <FormControl><Input placeholder="İxtisasınızın adı" {...field} /></FormControl>
                <FormMessage />
                </FormItem>
            )}
            />
            <FormField
            control={form.control}
            name="course"
            render={({ field }) => (
                <FormItem>
                <FormLabel>Kurs*</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                    <SelectTrigger>
                        <SelectValue placeholder="Kursunuzu seçin" />
                    </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                    <SelectItem value="1">1</SelectItem>
                    <SelectItem value="2">2</SelectItem>
                    <SelectItem value="3">3</SelectItem>
                    <SelectItem value="4">4</SelectItem>
                    <SelectItem value="5">5</SelectItem>
                    <SelectItem value="6">6</SelectItem>
                    <SelectItem value="Magistr">Magistr</SelectItem>
                    <SelectItem value="Doktorant">Doktorant</SelectItem>
                    </SelectContent>
                </Select>
                <FormMessage />
                </FormItem>
            )}
            />
        </div>
         <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FormField
                control={form.control}
                name="phone"
                render={({ field }) => (
                <FormItem>
                    <FormLabel>Əlaqə nömrəsi*</FormLabel>
                    <FormControl><Input type="tel" placeholder="+994 xx xxx xx xx" {...field} /></FormControl>
                    <FormMessage />
                </FormItem>
                )}
            />
            <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                <FormItem>
                    <FormLabel>Elektron poçt daxil edin*</FormLabel>
                    <FormControl><Input type="email" placeholder="nümunə@email.com" {...field} /></FormControl>
                    <FormMessage />
                </FormItem>
                )}
            />
        </div>
        <FormField
          control={form.control}
          name="subject"
          render={({ field }) => (
            <FormItem className="space-y-3">
              <FormLabel>Müraciətin mövzusu*</FormLabel>
              <FormControl>
                <RadioGroup
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                  className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-6"
                >
                  <FormItem className="flex items-center space-x-3 space-y-0">
                    <FormControl><RadioGroupItem value="Sual" /></FormControl>
                    <FormLabel className="font-normal">Sual</FormLabel>
                  </FormItem>
                  <FormItem className="flex items-center space-x-3 space-y-0">
                    <FormControl><RadioGroupItem value="Təklif" /></FormControl>
                    <FormLabel className="font-normal">Təklif</FormLabel>
                  </FormItem>
                  <FormItem className="flex items-center space-x-3 space-y-0">
                    <FormControl><RadioGroupItem value="Şikayət" /></FormControl>
                    <FormLabel className="font-normal">Şikayət</FormLabel>
                  </FormItem>
                </RadioGroup>
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
              <FormLabel>Müraciətinizin mətni*</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Müraciətinizi ətraflı şəkildə yazın..."
                  className="min-h-[150px]"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" size="lg" className="w-full md:w-auto" disabled={isSubmitting}>
          {isSubmitting ? "Göndərilir..." : "Müraciəti Göndər"}
        </Button>
      </form>
    </Form>
  );
}
