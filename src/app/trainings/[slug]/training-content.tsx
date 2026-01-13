
"use client";

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Training } from '@/app/ndutecnaxcivan19692025tec/trainings/training-form';
import { Quiz } from './quiz';
import { CertificateGenerator } from './certificate-generator';
import { ArrowRight, CheckCircle, Trophy, XCircle, Loader2, RefreshCw } from 'lucide-react';
import { markTrainingAsCompleted, saveQuizResult } from '@/lib/actions';
import { useToast } from '@/hooks/use-toast';
import type { User } from '@/lib/definitions';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import type { TrainingRegistration } from '@/lib/data';
import DOMPurify from 'dompurify';


interface TrainingContentProps {
  training: Training;
  registration: TrainingRegistration | null;
  user: User;
  onComplete: () => void;
}

export function TrainingContent({ training, registration, user, onComplete }: TrainingContentProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [quizResult, setQuizResult] = useState(registration?.quizResult || null);
  const [isCompleting, setIsCompleting] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    // If quiz is already completed, move to the last step to show result
    if (registration?.quizResult) {
       setQuizResult(registration.quizResult);
       setCurrentStep(training.modules.length + 1);
    }
  }, [registration, training.modules.length]);


  const totalModules = training.modules.length;
  const hasQuiz = training.quiz && training.quiz.length > 0;
  const isQuizCompleted = quizResult !== null;

  const handleNextStep = () => {
    if (currentStep < totalModules) {
        setCurrentStep(prev => prev + 1);
    } else if (hasQuiz && !isQuizCompleted) {
        setCurrentStep(prev => prev + 1);
    }
  };
  
  const handleQuizCompletion = async (answers: Record<number, number>, score: number, total: number) => {
    const resultToSave = { answers, score, total };
    setQuizResult(resultToSave);

    if (!registration?.id) {
        toast({ title: "Xəta", description: "Qeydiyyat məlumatı tapılmadı.", variant: "destructive" });
        return;
    }

    setIsCompleting(true);
    try {
        await saveQuizResult(registration.id, resultToSave);
        const hasPassed = (score / total) >= 0.8;
        
        const completionResult = await markTrainingAsCompleted(registration.id, score, total);

        if(completionResult.success) {
            onComplete(); // Refresh parent component's data
            if(hasPassed && completionResult.certificateId){
                toast({ title: "Təbriklər!", description: "Siz təlimi uğurla tamamladınız.", });
            } else if (hasPassed && !completionResult.certificateId) {
                toast({ title: "Təbriklər!", description: "Təlimi tamamladınız! Bu təlim üçün sertifikat nəzərdə tutulmayıb.", });
            } else {
                 toast({
                    title: "Nəticəniz Qeydə Alındı",
                    description: `Sizin nəticəniz: ${Math.round((score/total) * 100)}%. Sertifikat üçün nəticəniz 80% və ya daha çox olmalıdır.`,
                    variant: "destructive",
                    duration: 7000,
                });
            }
        } else {
             toast({ title: "Xəta", description: completionResult.message || "Təlim tamamlanarkən xəta baş verdi.", variant: "destructive" });
        }
    } catch (error) {
        toast({ title: "Xəta", description: "Serverlə əlaqə qurularkən xəta baş verdi.", variant: "destructive" });
    } finally {
        setIsCompleting(false);
    }
  };

  const handleRetakeQuiz = () => {
    setQuizResult(null);
  };
  
  return (
    <div className="space-y-6 pt-6 border-t">
        <h2 className="text-2xl font-bold text-primary">Təlim Modulları</h2>
        
        {/* Modules */}
        {training.modules.map((module, index) => {
            const isUnlocked = index <= currentStep;
            const isCompleted = index < currentStep;

            if (isUnlocked) {
                const sanitizedContent = DOMPurify.sanitize(module.content);
                return (
                    <div key={index} className={`p-4 border rounded-lg bg-card animate-in fade-in-50 ${isCompleted ? 'border-green-500' : ''}`}>
                         <div className="flex justify-between items-center mb-4">
                            <h3 className="text-xl font-semibold">{index + 1}. {module.title}</h3>
                            {isCompleted && <CheckCircle className="h-6 w-6 text-green-500" />}
                        </div>
                        {module.imageUrl && (
                          <div className="my-4 rounded-lg overflow-hidden">
                             <img
                                src={module.imageUrl}
                                alt={module.title}
                                className="w-full h-auto max-h-[300px] object-cover"
                                data-ai-hint={module.imageHint}
                              />
                          </div>
                        )}
                        <div className="prose max-w-none" dangerouslySetInnerHTML={{ __html: sanitizedContent }} />
                    </div>
                )
            }
            return null;
        })}
        
        {/* Navigation / Quiz / Certificate */}
        <div className="mt-8">
            {currentStep < totalModules && (
                <Button onClick={handleNextStep}>
                    Növbəti Modul <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
            )}

            {currentStep === totalModules && hasQuiz && !isQuizCompleted && (
                 <Button onClick={handleNextStep}>
                    Testə Başla <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
            )}

            {currentStep > totalModules && hasQuiz && !isQuizCompleted && (
                <Quiz 
                  questions={training.quiz} 
                  onQuizComplete={handleQuizCompletion} 
                  isCompleting={isCompleting}
                />
            )}

            {isQuizCompleted && (
              <div className="space-y-6 pt-8 mt-8 border-t-2 border-dashed">
                { registration?.status === 'tamamlandı' && training.hasCertificate && registration?.certificateId ? (
                   <>
                      <h2 className="text-2xl font-bold text-primary text-center flex items-center justify-center gap-2"><Trophy className="h-6 w-6"/> Təlimi Uğurla Tamamladınız!</h2>
                      <CertificateGenerator 
                          trainingTitle={training.title} 
                          userName={user.name} 
                          certificateId={registration.certificateId}
                      />
                   </>
                ) : quizResult.score / quizResult.total >= 0.8 && registration?.status === 'tamamlandı' ? (
                      <Alert variant="default" className="bg-green-50 border-green-200">
                          <CheckCircle className="h-5 w-5 text-green-600" />
                          <AlertTitle className="text-green-800">Təbriklər!</AlertTitle>
                          <AlertDescription className="text-green-700">
                              Siz təlimi uğurla tamamladınız. Bu təlim üçün sertifikat nəzərdə tutulmadığından, sertifikat verilmədi. Qazandığınız biliklərin fəaliyyətinizdə uğurlar gətirməsini arzu edirik!
                          </AlertDescription>
                      </Alert>
                   ) : (
                      <Alert variant="destructive">
                          <XCircle className="h-5 w-5" />
                          <AlertTitle>Nəticəniz Qeydə Alındı</AlertTitle>
                          <AlertDescription>
                              Nəticəniz {Math.round((quizResult.score/quizResult.total) * 100)}% təşkil etdi. Sertifikat əldə etmək üçün nəticəniz 80% və ya daha yuxarı olmalıdır. Testi yenidən işləyərək nəticənizi yaxşılaşdıra bilərsiniz.
                          </AlertDescription>
                      </Alert>
                   )
                }
                 <Quiz 
                    questions={training.quiz} 
                    isCompleting={isCompleting}
                    initialAnswers={quizResult.answers}
                  />
                  <Button variant="outline" onClick={handleRetakeQuiz}>
                    <RefreshCw className="mr-2 h-4 w-4" /> Testi Yenidən İşlə
                  </Button>
              </div>
            )}
        </div>
    </div>
  );
}
