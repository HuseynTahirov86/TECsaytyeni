import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";

export default function NotFound() {
  return (
    <div className="flex min-h-[calc(100vh-10rem)] flex-col items-center justify-center text-center px-4">
      <div className="max-w-md">
         <h1 className="text-8xl font-extrabold tracking-tighter text-primary">
            404
         </h1>
        <p className="mt-4 text-2xl font-semibold tracking-tight text-foreground">
          Səhifə Tapılmadı
        </p>
        <p className="mt-2 text-muted-foreground">
          Üzr istəyirik, axtardığınız səhifə mövcud deyil və ya başqa yerə köçürülüb.
        </p>
        <Button asChild className="mt-6">
          <Link href="/">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Ana Səhifəyə Qayıt
          </Link>
        </Button>
      </div>
    </div>
  )
}
