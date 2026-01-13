"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useState, useEffect } from "react";
import { Instagram, Facebook } from "lucide-react";

// Custom X/Twitter Icon
const XIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 512 512"
    fill="currentColor"
    {...props}
  >
    <path d="M389.2 48h70.6L305.6 224.2 487 464H345L233.7 318.6 106.5 464H35.8l164.9-199.9L26.8 48h145.6l100.5 132.3L389.2 48zm-24.9 393.1h39.7L159.3 74.9h-41.2l255.8 366.2z" />
  </svg>
);

// Custom TikTok Icon
const TikTokIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512" {...props}>
        <path fill="currentColor" d="M448 209.9a210.1 210.1 0 0 1 -122.8-39.25V349.38A162.6 162.6 0 1 1 185 188.31V278.2a74.62 74.62 0 1 0 52.23 71.18V0h88a121.18 121.18 0 0 0 122.77 122.77z"/>
    </svg>
);

// Custom WhatsApp Icon
const WhatsAppIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg xmlns="http://www.w3.org/2000/svg" shapeRendering="geometricPrecision" textRendering="geometricPrecision" imageRendering="optimizeQuality" fillRule="evenodd" clipRule="evenodd" viewBox="0 0 509 511.514" {...props}><path fill="currentColor" d="M434.762 74.334C387.553 26.81 323.245 0 256.236 0h-.768C115.795.001 2.121 113.696 2.121 253.456l.001.015a253.516 253.516 0 0033.942 126.671L0 511.514l134.373-35.269a253.416 253.416 0 00121.052 30.9h.003.053C395.472 507.145 509 393.616 509 253.626c0-67.225-26.742-131.727-74.252-179.237l.014-.055zM255.555 464.453c-37.753 0-74.861-10.22-107.293-29.479l-7.72-4.602-79.741 20.889 21.207-77.726-4.984-7.975c-21.147-33.606-32.415-72.584-32.415-112.308 0-116.371 94.372-210.743 210.741-210.743 56.011 0 109.758 22.307 149.277 61.98a210.93 210.93 0 0161.744 149.095c0 116.44-94.403 210.869-210.844 210.869h.028zm115.583-157.914c-6.363-3.202-37.474-18.472-43.243-20.593-5.769-2.121-10.01-3.202-14.315 3.203-4.305 6.404-16.373 20.593-20.063 24.855-3.69 4.263-7.401 4.815-13.679 1.612-6.278-3.202-26.786-9.883-50.899-31.472a192.748 192.748 0 01-35.411-43.867c-3.712-6.363-.404-9.777 2.82-12.873 3.224-3.096 6.363-7.381 9.48-11.092a41.58 41.58 0 006.357-10.597 11.678 11.678 0 00-.508-11.09c-1.718-3.18-14.444-34.357-19.534-47.06-5.09-12.703-10.37-10.603-14.272-10.901-3.902-.297-7.911-.19-12.089-.19a23.322 23.322 0 00-16.964 7.911c-5.707 6.298-22.1 21.673-22.1 52.849s22.671 61.249 25.852 65.532c3.182 4.284 44.663 68.227 108.288 95.649 15.099 6.489 26.891 10.392 36.053 13.403a87.504 87.504 0 0025.216 3.718c4.905 0 9.82-.416 14.65-1.237 12.174-1.782 37.453-15.291 42.776-30.073s5.303-27.57 3.711-30.093c-1.591-2.524-5.704-4.369-12.088-7.615l-.038.021z"/></svg>
);


export interface SocialLinks {
  facebook: string;
  instagram: string;
  whatsapp: string;
  x: string;
  tiktok: string;
}

const formSchema = z.object({
  facebook: z.string().url({ message: "Zəhmət olmasa, düzgün bir Facebook URL daxil edin." }).or(z.literal('')),
  instagram: z.string().url({ message: "Zəhmət olmasa, düzgün bir Instagram URL daxil edin." }).or(z.literal('')),
  whatsapp: z.string().url({ message: "Zəhmət olmasa, düzgün bir WhatsApp URL daxil edin." }).or(z.literal('')),
  x: z.string().url({ message: "Zəhmət olmasa, düzgün bir X (Twitter) URL daxil edin." }).or(z.literal('')),
  tiktok: z.string().url({ message: "Zəhmət olmasa, düzgün bir TikTok URL daxil edin." }).or(z.literal('')),
});

type FormValues = z.infer<typeof formSchema>;

interface SocialsFormProps {
  onSubmit: (values: FormValues) => void;
  initialData: SocialLinks | null;
}

export function SocialsForm({ onSubmit, initialData }: SocialsFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      facebook: initialData?.facebook || "",
      instagram: initialData?.instagram || "",
      whatsapp: initialData?.whatsapp || "",
      x: initialData?.x || "",
      tiktok: initialData?.tiktok || "",
    },
  });

  useEffect(() => {
    if (initialData) {
      form.reset(initialData);
    }
  }, [initialData, form]);

  const handleSubmit = async (values: FormValues) => {
    setIsSubmitting(true);
    await onSubmit(values);
    setIsSubmitting(false);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="facebook"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="flex items-center"><Facebook className="h-4 w-4 mr-2" /> Facebook</FormLabel>
              <FormControl><Input placeholder="https://facebook.com/username" {...field} /></FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="instagram"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="flex items-center"><Instagram className="h-4 w-4 mr-2" /> Instagram</FormLabel>
              <FormControl><Input placeholder="https://instagram.com/username" {...field} /></FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="whatsapp"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="flex items-center"><WhatsAppIcon className="h-4 w-4 mr-2" /> WhatsApp</FormLabel>
              <FormControl><Input placeholder="https://wa.me/994..." {...field} /></FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="x"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="flex items-center"><XIcon className="h-4 w-4 mr-2" /> X (Twitter)</FormLabel>
              <FormControl><Input placeholder="https://x.com/username" {...field} /></FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="tiktok"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="flex items-center"><TikTokIcon className="h-4 w-4 mr-2" /> TikTok</FormLabel>
              <FormControl><Input placeholder="https://tiktok.com/@username" {...field} /></FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="flex justify-end pt-4">
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? 'Saxlanılır...' : 'Yadda Saxla'}
          </Button>
        </div>
      </form>
    </Form>
  );
}
