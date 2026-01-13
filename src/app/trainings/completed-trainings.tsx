
"use client";

import { useEffect, useState } from "react";
import { getCompletedRegistrations } from "@/lib/data";
import type { TrainingRegistration } from "@/lib/data";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { BookCheck, Calendar, Percent } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { formatDate } from "@/lib/utils";

export function CompletedTrainings({ userId }: { userId: string }) {
    const [trainings, setTrainings] = useState<TrainingRegistration[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        async function fetchTrainings() {
            setIsLoading(true);
            const data = await getCompletedRegistrations(userId);
            setTrainings(data);
            setIsLoading(false);
        }

        fetchTrainings();
    }, [userId]);


    if (isLoading) {
        return (
             <Card>
                <CardHeader>
                    <Skeleton className="h-8 w-3/4" />
                    <Skeleton className="h-4 w-full mt-2" />
                </CardHeader>
                <CardContent className="space-y-4">
                    <Skeleton className="h-24 w-full" />
                    <Skeleton className="h-24 w-full" />
                </CardContent>
            </Card>
        )
    }

    return (
        <Card>
            <CardHeader>
                <CardTitle>Tamamladığım Təlimlər</CardTitle>
                <CardDescription>Burada uğurla bitirdiyiniz bütün təlimlərin siyahısı göstərilir.</CardDescription>
            </CardHeader>
            <CardContent>
                {trainings.length > 0 ? (
                    <ul className="space-y-4">
                        {trainings.map(training => (
                            <li key={training.id} className="p-4 border rounded-lg flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                               <div className="flex items-start gap-4">
                                <div className="p-3 bg-green-100 rounded-full">
                                    <BookCheck className="h-6 w-6 text-green-600" />
                                </div>
                                <div>
                                    <h3 className="font-semibold text-lg">{training.trainingTitle}</h3>
                                    <p className="text-sm text-muted-foreground flex items-center gap-2 mt-1">
                                        <Calendar className="h-4 w-4" />
                                        Tamamlanma tarixi: {formatDate(training.completionDate?.toDate())}
                                    </p>
                                     {training.quizResult && (
                                        <p className="text-sm text-muted-foreground flex items-center gap-2 mt-1 font-medium">
                                            <Percent className="h-4 w-4 text-primary" />
                                            Nəticə: {training.quizResult.score}/{training.quizResult.total} ({Math.round((training.quizResult.score / training.quizResult.total) * 100)}%)
                                        </p>
                                     )}
                               </div>
                               </div>
                               <Button asChild variant="outline" size="sm" className="w-full sm:w-auto mt-2 sm:mt-0">
                                <Link href={`/trainings/${training.trainingSlug}`}>Təlimə Bax</Link>
                               </Button>
                            </li>
                        ))}
                    </ul>
                ) : (
                    <div className="flex flex-col items-center justify-center h-48 text-center text-muted-foreground border-2 border-dashed rounded-lg">
                        <BookCheck className="h-10 w-10 mb-2"/>
                        <h3 className="text-xl font-semibold">Hələki tamamlanmış təliminiz yoxdur</h3>
                        <p>Bir təlimi tamamladıqdan sonra burada görünəcək.</p>
                    </div>
                )}
            </CardContent>
        </Card>
    )
}
