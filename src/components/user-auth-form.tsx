'use client';

import * as React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useRouter } from 'next/navigation';

import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { Loader2 } from 'lucide-react';

interface UserAuthFormProps extends React.HTMLAttributes<HTMLDivElement> {
  mode: 'login' | 'register';
}

const loginSchema = z.object({
  email: z.string().email({ message: 'Etibarlı e-poçt ünvanı daxil edin.' }),
  password: z.string().min(1, { message: 'Şifrə tələb olunur.' }),
});

const registerSchema = z.object({
  email: z.string().email({ message: 'Etibarlı e-poçt ünvanı daxil edin.' }),
  password: z.string().min(6, { message: 'Şifrə ən azı 6 simvoldan ibarət olmalıdır.' }),
});

type FormData = z.infer<typeof loginSchema> | z.infer<typeof registerSchema>;

export default function UserAuthForm({ className, mode, ...props }: UserAuthFormProps) {
  const router = useRouter();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = React.useState<boolean>(false);

  const schema = mode === 'login' ? loginSchema : registerSchema;

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
  });

  async function onSubmit(data: FormData) {
    setIsLoading(true);

    // Simulate API call
    setTimeout(() => {
      setIsLoading(false);
      toast({
        title: mode === 'login' ? 'Uğurlu Giriş' : 'Uğurlu Qeydiyyat',
        description: 'Ana səhifəyə yönləndirilirsiniz...',
      });
      // In a real app, you would handle auth state here.
      // For now, just redirect to home page.
      router.push('/');
    }, 1500);
  }

  return (
    <div className={cn('grid gap-6', className)} {...props}>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="grid gap-4">
          <div className="grid gap-2">
            <Label htmlFor="email">E-poçt</Label>
            <Input
              id="email"
              placeholder="ad@nümunə.com"
              type="email"
              autoCapitalize="none"
              autoComplete="email"
              autoCorrect="off"
              disabled={isLoading}
              {...register('email')}
            />
            {errors.email && <p className="px-1 text-xs text-destructive">{errors.email.message}</p>}
          </div>
          <div className="grid gap-2">
            <Label htmlFor="password">Şifrə</Label>
            <Input
              id="password"
              type="password"
              placeholder="********"
              disabled={isLoading}
              {...register('password')}
            />
            {errors.password && <p className="px-1 text-xs text-destructive">{errors.password.message}</p>}
          </div>
          <Button disabled={isLoading} type="submit" variant="default" className='bg-accent hover:bg-accent/90'>
            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {mode === 'login' ? 'Giriş et' : 'Qeydiyyatdan keç'}
          </Button>
        </div>
      </form>
    </div>
  );
}
