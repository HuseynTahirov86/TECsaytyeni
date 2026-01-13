
"use client";

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { CheckCircle, XCircle, Loader2 } from 'lucide-react';
import type { Training } from '@/app/ndutecnaxcivan19692025tec/trainings/training-form';

type Question = Training['quiz'][0];

interface QuizProps {
  questions: Question[];
  onQuizComplete?: (answers: Record<number, number>, score: number, total: number) => void;
  isCompleting: boolean;
  initialAnswers?: Record<number, number>;
}

export function Quiz({ questions, onQuizComplete, isCompleting, initialAnswers }: QuizProps) {
  const [answers, setAnswers] = useState<Record<number, number>>(initialAnswers || {});
  const [submitted, setSubmitted] = useState(!!initialAnswers);

  useEffect(() => {
    if (initialAnswers) {
      setAnswers(initialAnswers);
      setSubmitted(true);
    } else {
        setAnswers({});
        setSubmitted(false);
    }
  }, [initialAnswers]);


  const handleAnswerChange = (questionIndex: number, optionIndex: number) => {
    setAnswers(prev => ({ ...prev, [questionIndex]: optionIndex }));
  };

  const handleSubmit = () => {
    // Check if all questions are answered
    if (Object.keys(answers).length !== questions.length) {
      alert("Zəhmət olmasa, bütün sualları cavablandırın.");
      return;
    }
    setSubmitted(true); 

    let correctAnswers = 0;
    questions.forEach((q, index) => {
        if(answers[index] === q.correctAnswer) {
            correctAnswers++;
        }
    });
    
    if (onQuizComplete) {
      onQuizComplete(answers, correctAnswers, questions.length);
    }
  };

  if (submitted) {
    let correctAnswers = 0;
    questions.forEach((q, index) => {
        if(answers[index] === q.correctAnswer) {
            correctAnswers++;
        }
    });
    const percentage = Math.round((correctAnswers / questions.length) * 100);

    return (
        <Card>
            <CardHeader>
                <CardTitle>Test Nəticələri</CardTitle>
                <CardDescription>
                    Nəticə: {questions.length} sualdan {correctAnswers} düzgün cavab ({percentage}%).
                </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
                {questions.map((q, index) => (
                    <div key={index} className="p-4 border rounded-md">
                        <p className="font-semibold">{index + 1}. {q.question}</p>
                        <ul className="mt-2 space-y-2 text-sm">
                            {q.options.map((option, optIndex) => {
                                const isCorrect = optIndex === q.correctAnswer;
                                const isSelected = optIndex === answers[index];
                                return (
                                    <li key={optIndex} className={`flex items-start gap-2 p-2 rounded-md
                                        ${isCorrect ? 'bg-green-100 dark:bg-green-900/50' : ''}
                                        ${isSelected && !isCorrect ? 'bg-red-100 dark:bg-red-900/50' : ''}
                                    `}>
                                        {isCorrect ? <CheckCircle className="h-5 w-5 text-green-600 mt-0.5 shrink-0" /> : (isSelected ? <XCircle className="h-5 w-5 text-red-600 mt-0.5 shrink-0" /> : <div className="h-5 w-5 shrink-0" />) }
                                        <span>{String.fromCharCode(65 + optIndex)}) {option}</span>
                                    </li>
                                );
                            })}
                        </ul>
                    </div>
                ))}
            </CardContent>
        </Card>
    );
  }


  return (
    <Card>
        <CardHeader>
            <CardTitle>Qiymətləndirmə Testi</CardTitle>
            <CardDescription>
                Modulları nə dərəcədə mənimsədiyinizi yoxlamaq üçün aşağıdakı sualları cavablandırın. 
                Sertifikat əldə etmək üçün sualların ən azı 80%-nə düzgün cavab verməlisiniz.
            </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
            {questions.map((q, index) => (
                <div key={index}>
                    <p className="font-semibold mb-2">{index + 1}. {q.question}</p>
                    <RadioGroup onValueChange={(value) => handleAnswerChange(index, parseInt(value))}>
                        {q.options.map((option, optIndex) => (
                            <div key={optIndex} className="flex items-center space-x-2">
                                <RadioGroupItem value={optIndex.toString()} id={`q${index}-o${optIndex}`} />
                                <Label htmlFor={`q${index}-o${optIndex}`} className="font-normal">{option}</Label>
                            </div>
                        ))}
                    </RadioGroup>
                </div>
            ))}
            <Button onClick={handleSubmit} className="w-full" size="lg" disabled={isCompleting}>
                {isCompleting ? (
                    <>
                        <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                        Nəticə göndərilir...
                    </>
                ) : "Testi Bitir və Nəticəyə Bax"
                }
            </Button>
        </CardContent>
    </Card>
  );
}
