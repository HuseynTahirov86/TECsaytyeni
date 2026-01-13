
"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { registerForTraining } from "@/lib/actions";
import { Loader2 } from "lucide-react";

interface TrainingRegistrationButtonProps {
    trainingId: string;
    trainingTitle: string;
    trainingSlug: string;
    userId: string;
    onSuccess: () => void;
}

export function TrainingRegistrationButton({ trainingId, trainingTitle, trainingSlug, userId, onSuccess }: TrainingRegistrationButtonProps) {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleRegister() {
    setIsSubmitting(true);
    try {
      const result = await registerForTraining({ trainingId, trainingTitle, trainingSlug, userId });
      
      if (result.success) {
        toast({
          title: "Qeydiyyat Tamamlandı!",
          description: `"${trainingTitle}" təliminə uğurla qeydiyyatdan keçdiniz.`,
        });
        onSuccess();
      } else {
         toast({
            title: "Xəta!",
            description: result.message || "Qeydiyyat zamanı bir problem yarandı.",
            variant: "destructive",
        });
      }

    } catch (error) {
      console.error("Error sending registration: ", error);
      toast({
        title: "Xəta!",
        description: "Qeydiyyat zamanı bir problem yarandı. Zəhmət olmasa, sonra yenidən cəhd edin.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <Button onClick={handleRegister} size="lg" className="w-full" disabled={isSubmitting}>
        {isSubmitting ? (
            <>
                <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                Qeydiyyatdan keçirilir...
            </>
        ) : (
            "İndi Qeydiyyatdan Keçin"
        )}
    </Button>
  );
}
