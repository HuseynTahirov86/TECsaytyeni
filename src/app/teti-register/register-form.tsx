'use client'

import { useActionState, useTransition } from 'react'
import { useForm, useFieldArray } from 'react-hook-form'
import { useFormStatus } from 'react-dom'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert'
import { Terminal, PlusCircle, Trash2 } from 'lucide-react'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { faculties } from '@/lib/placeholder-data'
import { registerTetiUser } from '@/lib/actions'
import { useEffect, useRef } from 'react'
import { useToast } from '@/hooks/use-toast'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'

function RegisterButton() {
  const { pending } = useFormStatus()
  return (
    <Button type="submit" className="w-full" disabled={pending}>
      {pending ? "Hesab yaradılır..." : "Hesab Yarat"}
    </Button>
  )
}

// Client-side schema for form handling only
const formSchema = z.object({
  fullName: z.string().min(5, { message: 'Ad, Soyad, Ata adı ən azı 5 simvoldan ibarət olmalıdır.' }),
  faculty: z.string().min(1, { message: 'Fakültə seçilməlidir.' }),
  specialization: z.string().min(3, { message: 'İxtisas ən azı 3 simvoldan ibarət olmalıdır.' }),
  studyLanguage: z.string().min(1, { message: 'Tədris dili daxil edilməlidir.' }),
  advisors: z.array(z.object({ value: z.string().min(1, 'Elmi rəhbər adı boş ola bilməz.') })).min(1, 'Ən azı bir elmi rəhbər əlavə edilməlidir.'),
  subjects: z.array(z.object({ value: z.string().min(1, 'Fənn adı boş ola bilməz.') })).min(1, 'Ən azı bir fənn əlavə edilməlidir.'),
  phone: z.string().min(10, { message: 'Əlaqə nömrəsi ən azı 10 simvoldan ibarət olmalıdır.' }),
  email: z.string().email({ message: 'Düzgün e-poçt ünvanı daxil edin.' }),
  password: z.string().min(6, { message: 'Şifrə ən azı 6 simvoldan ibarət olmalıdır.' }),
});

export function TetiRegisterForm() {
  const { toast } = useToast();
  const initialState = { message: null, errors: {}, success: false };
  const [state, formAction] = useActionState(registerTetiUser, initialState);
  const formRef = useRef<HTMLFormElement>(null);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      fullName: "",
      faculty: "",
      specialization: "",
      studyLanguage: "",
      advisors: [{ value: "" }],
      subjects: [{ value: "" }],
      phone: "",
      email: "",
      password: "",
    },
  });

  const { fields: advisorFields, append: appendAdvisor, remove: removeAdvisor } = useFieldArray({
    control: form.control,
    name: "advisors"
  });

  const { fields: subjectFields, append: appendSubject, remove: removeSubject } = useFieldArray({
    control: form.control,
    name: "subjects"
  });

  useEffect(() => {
    if (state?.success) {
      toast({
        title: "Qeydiyyat Uğurlu!",
        description: "Hesabınız uğurla yaradıldı.",
      });
      form.reset();
      formRef.current?.reset();
    }
  }, [state, toast, form]);

  const handleFormSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    
    // FormData yaratmaq
    const formData = new FormData(event.currentTarget);
    
    // Array məlumatlarını əlavə etmək
    const advisorValues = form.getValues('advisors');
    const subjectValues = form.getValues('subjects');
    
    // Mövcud advisors və subjects entry-lərini silmək
    formData.delete('advisors');
    formData.delete('subjects');
    
    // Yeni dəyərləri əlavə etmək
    advisorValues.forEach((advisor) => {
      if (advisor.value.trim()) {
        formData.append('advisors', advisor.value.trim());
      }
    });
    
    subjectValues.forEach((subject) => {
      if (subject.value.trim()) {
        formData.append('subjects', subject.value.trim());
      }
    });
    
    formAction(formData);
  };

  return (
    <Form {...form}>
      <form ref={formRef} onSubmit={handleFormSubmit} className="space-y-4">
        <FormField
          control={form.control}
          name="fullName"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Ad, Soyad, Ata adı</FormLabel>
              <FormControl>
                <Input placeholder="Ad, Soyad, Ata adı" {...field} name="fullName" required />
              </FormControl>
              <FormMessage />
              {state.errors?.fullName && (state.errors.fullName as string[]).map((error: string) => ( 
                <p className="text-sm font-medium text-destructive" key={error}>{error}</p>
              ))}
            </FormItem>
          )}
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="faculty"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Fakültə</FormLabel>
                <Select onValueChange={field.onChange} value={field.value} name="faculty">
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Fakültənizi seçin" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {faculties.map((faculty, index) => (
                      <SelectItem key={index} value={faculty}>{faculty}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
                {state.errors?.faculty && (state.errors.faculty as string[]).map((error: string) => ( 
                  <p className="text-sm font-medium text-destructive" key={error}>{error}</p>
                ))}
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="specialization"
            render={({ field }) => (
              <FormItem>
                <FormLabel>İxtisas</FormLabel>
                <FormControl>
                  <Input placeholder="İxtisasınızı daxil edin" {...field} name="specialization" required />
                </FormControl>
                <FormMessage />
                {state.errors?.specialization && (state.errors.specialization as string[]).map((error: string) => (
                  <p className="text-sm font-medium text-destructive" key={error}>{error}</p>
                ))}
              </FormItem>
            )}
          />
        </div>
        
        <FormField
          control={form.control}
          name="studyLanguage"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Tədris dili</FormLabel>
              <FormControl>
                <Input placeholder="Tədris dilini daxil edin" {...field} name="studyLanguage" required />
              </FormControl>
              <FormMessage />
              {state.errors?.studyLanguage && (state.errors.studyLanguage as string[]).map((error: string) => (
                <p className="text-sm font-medium text-destructive" key={error}>{error}</p>
              ))}
            </FormItem>
          )}
        />
       
        <div className="space-y-2">
          <FormLabel>Elmi rəhbərin adı və ya soyadı</FormLabel>
          {advisorFields.map((field, index) => (
            <FormField
              key={field.id}
              control={form.control}
              name={`advisors.${index}.value`}
              render={({ field: advisorField }) => (
                <div className="flex items-center gap-2">
                  <Input 
                    {...advisorField} 
                    placeholder={`${index + 1}. Elmi rəhbər`} 
                    required={index === 0} 
                  />
                  {index > 0 && (
                    <Button 
                      type="button" 
                      variant="ghost" 
                      size="icon" 
                      onClick={() => removeAdvisor(index)}
                    >
                      <Trash2 className="h-4 w-4 text-destructive"/>
                    </Button>
                  )}
                </div>
              )}
            />
          ))}
          <Button 
            type="button" 
            variant="outline" 
            size="sm" 
            onClick={() => appendAdvisor({ value: "" })}
          >
            <PlusCircle className="mr-2 h-4 w-4"/> Yeni rəhbər əlavə et
          </Button>
          {state.errors?.advisors && (state.errors.advisors as string[]).map((error: string) => (
            <p className="text-sm font-medium text-destructive" key={error}>{error}</p>
          ))}
        </div>
        
        <div className="space-y-2">
          <FormLabel>Elmi tədqiqat işi götürdüyü fənn</FormLabel>
          {subjectFields.map((field, index) => (
            <FormField
              key={field.id}
              control={form.control}
              name={`subjects.${index}.value`}
              render={({ field: subjectField }) => (
                <div className="flex items-center gap-2">
                  <Input 
                    {...subjectField} 
                    placeholder={`${index + 1}. Fənn adı`} 
                    required={index === 0} 
                  />
                  {index > 0 && (
                    <Button 
                      type="button" 
                      variant="ghost" 
                      size="icon" 
                      onClick={() => removeSubject(index)}
                    >
                      <Trash2 className="h-4 w-4 text-destructive"/>
                    </Button>
                  )}
                </div>
              )}
            />
          ))}
          <Button 
            type="button" 
            variant="outline" 
            size="sm" 
            onClick={() => appendSubject({ value: "" })}
          >
            <PlusCircle className="mr-2 h-4 w-4"/> Yeni fənn əlavə et
          </Button>
          {state.errors?.subjects && (state.errors.subjects as string[]).map((error: string) => (
            <p className="text-sm font-medium text-destructive" key={error}>{error}</p>
          ))}
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>E-poçt</FormLabel>
                <FormControl>
                  <Input type="email" placeholder="e-poct@numune.com" {...field} name="email" required />
                </FormControl>
                <FormMessage />
                {state.errors?.email && (state.errors.email as string[]).map((error: string) => (
                  <p className="text-sm font-medium text-destructive" key={error}>{error}</p>
                ))}
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="phone"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Əlaqə nömrəsi</FormLabel>
                <FormControl>
                  <Input placeholder="+994xxxxxxxx" {...field} name="phone" required />
                </FormControl>
                <FormMessage />
                {state.errors?.phone && (state.errors.phone as string[]).map((error: string) => (
                  <p className="text-sm font-medium text-destructive" key={error}>{error}</p>
                ))}
              </FormItem>
            )}
          />
        </div>
        
        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Şifrə</FormLabel>
              <FormControl>
                <Input type="password" {...field} name="password" required />
              </FormControl>
              <FormMessage />
              {state.errors?.password && (state.errors.password as string[]).map((error: string) => (
                <p className="text-sm font-medium text-destructive" key={error}>{error}</p>
              ))}
            </FormItem>
          )}
        />
       
        <RegisterButton />
        
        {state.message && !state.success && (
          <Alert variant="destructive">
            <Terminal className="h-4 w-4" />
            <AlertTitle>Qeydiyyat Xətası</AlertTitle>
            <AlertDescription>{state.message}</AlertDescription>
          </Alert>
        )}
      </form>
    </Form>
  )
}