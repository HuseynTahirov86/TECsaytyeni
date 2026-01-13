
"use client"

import { useActionState } from 'react'
import { useFormStatus } from 'react-dom'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { Terminal } from 'lucide-react'
import { authenticateTetiUser } from '@/lib/actions'
import { useSearchParams } from 'next/navigation'

function LoginButton() {
  const { pending } = useFormStatus()
  return (
    <Button className="w-full" aria-disabled={pending}>
      {pending ? "Daxil olunur..." : "Daxil ol"}
    </Button>
  )
}

export function TetiLoginForm() {
  const [errorMessage, formAction] = useActionState(authenticateTetiUser, undefined);
  const searchParams = useSearchParams();
  const redirectTo = searchParams.get('redirectTo') || '/teti-account';

  return (
    <form action={formAction} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="email">E-poçt</Label>
        <Input
          id="email"
          type="email"
          name="email"
          placeholder="e-poct@numune.com"
          required
        />
      </div>
      <div className="space-y-2">
         <div className="flex items-center justify-between">
            <Label htmlFor="password">Şifrə</Label>
         </div>
        <Input id="password" type="password" name="password" required />
      </div>
      <input type="hidden" name="redirectTo" value={redirectTo} />
      <LoginButton />
      {errorMessage && (
        <Alert variant="destructive">
            <Terminal className="h-4 w-4" />
            <AlertTitle>Giriş Xətası</AlertTitle>
            <AlertDescription>{errorMessage}</AlertDescription>
        </Alert>
      )}
    </form>
  )
}

    