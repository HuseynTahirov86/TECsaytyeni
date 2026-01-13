
'use client'

import { useActionState } from 'react'
import { useFormStatus } from 'react-dom'
import { registerUser } from '@/lib/actions'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert'
import { Terminal } from 'lucide-react'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'

function RegisterButton() {
  const { pending } = useFormStatus()
  return (
    <Button className="w-full" aria-disabled={pending}>
      {pending ? "Hesab yaradılır..." : "Hesab Yarat"}
    </Button>
  )
}

export function RegisterForm() {
  const initialState = { message: null, errors: {} };
  const [state, dispatch] = useActionState(registerUser, initialState)

  return (
    <form action={dispatch} className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="firstName">Ad</Label>
          <Input id="firstName" name="firstName" placeholder="Əli" required />
          {state.errors?.firstName &&
              state.errors.firstName.map((error: string) => (
                <p className="text-sm font-medium text-destructive" key={error}>
                  {error}
                </p>
          ))}
        </div>
        <div className="space-y-2">
          <Label htmlFor="lastName">Soyad</Label>
          <Input id="lastName" name="lastName" placeholder="Əliyev" required />
           {state.errors?.lastName &&
              state.errors.lastName.map((error: string) => (
                <p className="text-sm font-medium text-destructive" key={error}>
                  {error}
                </p>
          ))}
        </div>
      </div>
       <div className="space-y-2">
        <Label htmlFor="designation">Təyinat</Label>
         <Select name="designation" required>
            <SelectTrigger>
                <SelectValue placeholder="Təyinatınızı seçin" />
            </SelectTrigger>
            <SelectContent>
                <SelectItem value="tələbə">Tələbə</SelectItem>
                <SelectItem value="magistr">Magistr</SelectItem>
                <SelectItem value="doktorant">Doktorant</SelectItem>
                <SelectItem value="müəllim">Müəllim</SelectItem>
                <SelectItem value="digər">Digər</SelectItem>
            </SelectContent>
        </Select>
        {state.errors?.designation &&
            state.errors.designation.map((error: string) => (
              <p className="text-sm font-medium text-destructive" key={error}>
                {error}
              </p>
        ))}
       </div>
       <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
            <Label htmlFor="specialization">İxtisas</Label>
            <Input id="specialization" name="specialization" placeholder="Tarix müəllimliyi" required />
             {state.errors?.specialization &&
                state.errors.specialization.map((error: string) => (
                  <p className="text-sm font-medium text-destructive" key={error}>
                    {error}
                  </p>
            ))}
        </div>
         <div className="space-y-2">
            <Label htmlFor="course">Kurs</Label>
            <Input id="course" name="course" placeholder="3" required />
             {state.errors?.course &&
                state.errors.course.map((error: string) => (
                  <p className="text-sm font-medium text-destructive" key={error}>
                    {error}
                  </p>
            ))}
        </div>
       </div>
      <div className="space-y-2">
        <Label htmlFor="email">E-poçt</Label>
        <Input
          id="email"
          type="email"
          name="email"
          placeholder="e-poct@numune.com"
          required
        />
         {state.errors?.email &&
            state.errors.email.map((error: string) => (
              <p className="text-sm font-medium text-destructive" key={error}>
                {error}
              </p>
         ))}
      </div>
      <div className="space-y-2">
        <Label htmlFor="password">Şifrə</Label>
        <Input id="password" type="password" name="password" required />
         {state.errors?.password &&
            state.errors.password.map((error: string) => (
              <p className="text-sm font-medium text-destructive" key={error}>
                {error}
              </p>
         ))}
      </div>
      <RegisterButton />
      {state.message && (
        <Alert variant="destructive">
            <Terminal className="h-4 w-4" />
            <AlertTitle>Qeydiyyat Xətası</AlertTitle>
            <AlertDescription>{state.message}</AlertDescription>
        </Alert>
      )}
    </form>
  )
}
