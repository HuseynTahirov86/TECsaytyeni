
"use client";

import { useActionState } from "react";
import { useFormStatus } from "react-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Terminal } from "lucide-react";
import { authenticateAdmin } from "@/lib/actions";

const initialState = {
  message: null,
  success: false,
};

function LoginButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" className="w-full" disabled={pending}>
      {pending ? "Giriş edilir..." : "Daxil Ol"}
    </Button>
  );
}

export default function LoginPage() {
  const [state, formAction] = useActionState(authenticateAdmin, initialState);

  return (
    <div className="flex min-h-screen w-full items-center justify-center bg-muted p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold">Admin Girişi</CardTitle>
          <CardDescription>Admin panelə daxil olmaq üçün məlumatlarınızı daxil edin.</CardDescription>
        </CardHeader>
        <CardContent>
          <form action={formAction} className="space-y-4">
              <div className="space-y-2">
                  <Label htmlFor="email">E-poçt</Label>
                  <Input 
                    id="email"
                    name="email"
                    type="email" 
                    placeholder="admin@nümunə.com" 
                    autoComplete="email" 
                    required 
                  />
              </div>
              <div className="space-y-2">
                  <Label htmlFor="password">Şifrə</Label>
                  <Input 
                    id="password"
                    name="password"
                    type="password" 
                    placeholder="********" 
                    autoComplete="current-password" 
                    required 
                  />
              </div>
            
              {state.message && !state.success && (
                <Alert variant="destructive">
                    <Terminal className="h-4 w-4" />
                    <AlertTitle>Giriş Xətası</AlertTitle>
                    <AlertDescription>{state.message}</AlertDescription>
                </Alert>
              )}
              <LoginButton />
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
