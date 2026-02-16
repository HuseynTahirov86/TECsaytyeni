
"use client";

import { Card, CardContent } from "@/components/ui/card";
import type { FormerChairman } from '@/app/ndutecnaxcivan19692025tec/formers/former-chairman-form';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogDescription as DialogDesc } from "@/components/ui/dialog";
import { ScrollArea } from '@/components/ui/scroll-area';
import Image from 'next/image';

export function FormerChairmenClientPage({ formerChairmen }: { formerChairmen: FormerChairman[] }) {
    return (
        <div>
             <header className="mb-8">
                <h1 className="text-4xl font-extrabold tracking-tight text-primary lg:text-5xl">
                    Sabiq TEC Sədrləri
                </h1>
                <p className="mt-4 max-w-2xl text-lg text-muted-foreground">
                    Təşkilatımızın inkişafına töhfə verən liderlər.
                </p>
            </header>
            <div className="mt-8 grid grid-cols-2 gap-8 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
            {formerChairmen.map((chairman) => (
                <Dialog key={chairman.id}>
                <DialogTrigger asChild>
                    <Card className="text-center overflow-hidden shadow-sm hover:shadow-lg transition-all cursor-pointer hover:scale-105">
                        <div className="aspect-[4/5] relative w-full">
                            <Image 
                            src={chairman.avatarUrl || "https://placehold.co/400x500.png"}
                            alt={chairman.name} 
                            fill
                            className="object-cover"
                            data-ai-hint={chairman.avatarHint}
                            />
                        </div>
                        <CardContent className="p-4">
                            <h3 className="font-semibold text-lg">{chairman.name}</h3>
                            <p className="text-sm text-accent">{chairman.period}</p>
                        </CardContent>
                    </Card>
                </DialogTrigger>
                <DialogContent className="sm:max-w-md p-0">
                    <ScrollArea className="max-h-[85vh]">
                    <div className="p-6">
                        <DialogHeader>
                        <div className="flex flex-col items-center text-center">
                            <div className="w-32 h-32 relative rounded-full overflow-hidden mb-4">
                                <Image
                                src={chairman.avatarUrl || "https://placehold.co/128x128.png"}
                                alt={chairman.name}
                                fill
                                className="object-cover"
                                data-ai-hint={chairman.avatarHint}
                                />
                            </div>
                            <DialogTitle className="text-2xl">{chairman.name}</DialogTitle>
                            <DialogDesc className="text-accent text-base mt-1">{chairman.period}</DialogDesc>
                        </div>
                        </DialogHeader>
                        <div className="py-4 text-left">
                        <p className="text-muted-foreground whitespace-pre-wrap">{chairman.bio}</p>
                        </div>
                    </div>
                    </ScrollArea>
                </DialogContent>
                </Dialog>
            ))}
            </div>
        </div>
    );
}
