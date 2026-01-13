'use client';

import { useState } from 'react';
import { summarizeArticle } from '@/ai/flows/summarize-news-articles';
import { Button } from '@/components/ui/button';
import { Loader2, Sparkles, X } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible';

type ArticleSummarizerProps = {
  articleContent: string;
};

export default function ArticleSummarizer({ articleContent }: ArticleSummarizerProps) {
  const [summary, setSummary] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isOpen, setIsOpen] = useState(false);

  const handleSummarize = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const result = await summarizeArticle({ articleContent });
      setSummary(result.summary);
      setIsOpen(true);
    } catch (e) {
      setError('Xülasə yaradıla bilmədi. Zəhmət olmasa bir az sonra yenidən cəhd edin.');
      console.error(e);
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleOpenChange = (open: boolean) => {
    setIsOpen(open);
    if (!open) {
      // Optional: Clear summary when closed
      // setSummary(null);
    }
  }

  return (
    <div className="my-6">
      <Collapsible open={isOpen} onOpenChange={handleOpenChange}>
        <div className="flex items-center justify-start space-x-4">
          <Button onClick={handleSummarize} disabled={isLoading} variant="outline">
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Xülasələşdirilir...
              </>
            ) : (
              <>
                <Sparkles className="mr-2 h-4 w-4" />
                AI ilə xülasələşdir
              </>
            )}
          </Button>
          {summary && (
            <CollapsibleTrigger asChild>
                <Button variant="ghost" size="sm">
                {isOpen ? 'Gizlət' : 'Göstər'}
                </Button>
            </CollapsibleTrigger>
          )}
        </div>

        <CollapsibleContent className="mt-4">
          {summary && (
            <Alert variant="default" className="bg-primary/10 border-primary/30">
              <Sparkles className="h-4 w-4 text-primary-foreground" />
              <AlertTitle className="font-bold text-primary-foreground">Məqalə Xülasəsi</AlertTitle>
              <AlertDescription className="text-primary-foreground/90">{summary}</AlertDescription>
            </Alert>
          )}
        </CollapsibleContent>
      </Collapsible>
      {error && (
        <Alert variant="destructive" className="mt-4">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}
    </div>
  );
}
