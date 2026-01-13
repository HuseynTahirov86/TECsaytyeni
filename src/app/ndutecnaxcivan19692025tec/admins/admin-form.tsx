
"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { useState } from "react";

export interface Admin {
  id: string;
  email: string;
  password?: string;
}

const createSchema = z.object({
  email: z.string().email({ message: "Düzgün e-poçt ünvanı daxil edin." }),
  password: z.string().min(6, { message: "Şifrə ən azı 6 simvoldan ibarət olmalıdır." }),
});

const updateSchema = z.object({
  email: z.string().email({ message: "Düzgün e-poçt ünvanı daxil edin." }),
  password: z.string().min(6, { message: "Şifrə ən azı 6 simvoldan ibarət olmalıdır." }).optional().or(z.literal('')),
});


interface AdminFormProps {
  onSubmit: (values: Omit<Admin, 'id'>) => Promise<void>;
  initialData?: Admin | null;
  onClose: () => void;
}

export function AdminForm({ onSubmit, initialData, onClose }: AdminFormProps) {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const formSchema = initialData ? updateSchema : createSchema;
  type FormValues = z.infer<typeof formSchema>;

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: initialData?.email || "",
      password: "",
    },
  });

  const handleSubmit = async (values: FormValues) => {
    setIsSubmitting(true);
    try {
        await onSubmit(values);
        form.reset();
        onClose();

    } catch (error: any) {
        toast({
            title: "Xəta!",
            description: error.message || "Məlumatları saxlayarkən problem yarandı.",
            variant: "destructive",
        });
    } finally {
        setIsSubmitting(false);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>E-poçt</FormLabel>
              <FormControl><Input type="email" placeholder="admin@nümunə.com" {...field} /></FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Şifrə</FormLabel>
              <FormControl><Input type="password" placeholder={initialData ? "Dəyişdirmək üçün yeni şifrə daxil edin" : "********"} {...field} /></FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="flex justify-end gap-2 pt-4 border-t">
            <Button type="button" variant="outline" onClick={onClose} disabled={isSubmitting}>Ləğv Et</Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? 'Saxlanılır...' : (initialData ? 'Yenilə' : 'Əlavə Et')}
            </Button>
        </div>
      </form>
    </Form>
  );
}
