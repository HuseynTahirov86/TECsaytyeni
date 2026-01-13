
"use client";

import { useState, useEffect } from "react";
import { db } from "@/lib/firebase";
import { collection, getDocs, deleteDoc, doc, Timestamp, orderBy, query } from "firebase/firestore";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Trash2, Inbox, FileOutput } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { Skeleton } from "@/components/ui/skeleton";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Badge } from "@/components/ui/badge";
import { formatDate, exportToExcel } from "@/lib/utils";

interface Message {
    id: string;
    name: string;
    email: string;
    subject: string;
    message: string;
    sentAt: Timestamp;
}

export default function MessagesAdminPage() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isClient, setIsClient] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    setIsClient(true);
    const fetchMessages = async () => {
      setIsLoading(true);
      try {
        const q = query(collection(db, "contacts"), orderBy("sentAt", "desc"));
        const querySnapshot = await getDocs(q);
        const messageList = querySnapshot.docs.map(doc => {
          const data = doc.data();
          return {
            id: doc.id,
            ...data,
          } as Message;
        });
        setMessages(messageList);
      } catch (error) {
        console.error("Error fetching messages: ", error);
        toast({ title: "Xəta", description: "Mesajları yükləyərkən problem yarandı.", variant: "destructive" });
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchMessages();
  }, [toast]);

  const handleDelete = async (messageId: string) => {
    try {
      await deleteDoc(doc(db, "contacts", messageId));
      toast({ title: "Uğurlu", description: "Mesaj silindi." });
      setMessages(messages.filter(m => m.id !== messageId));
    } catch (error) {
      console.error("Error deleting message: ", error);
      toast({ title: "Xəta", description: "Mesajı silərkən problem yarandı.", variant: "destructive" });
    }
  };
  
  const handleExport = () => {
    const dataToExport = messages.map(msg => ({
      'Ad': msg.name,
      'Email': msg.email,
      'Mövzu': msg.subject,
      'Mesaj': msg.message,
      'Göndərilmə Tarixi': msg.sentAt ? msg.sentAt.toDate().toLocaleString('az-AZ') : 'Bilinmir',
    }));
    exportToExcel(dataToExport, "Gələn_Mesajlar");
  };

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Gələnlər Qutusu</h1>
        <p className="text-muted-foreground">Əlaqə forması vasitəsilə göndərilən mesajlar.</p>
      </div>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
            <div>
                <CardTitle>Mesajlar Siyahısı</CardTitle>
                <CardDescription>Burada saytınızdan göndərilən bütün müraciətləri görə bilərsiniz.</CardDescription>
            </div>
            <Button onClick={handleExport} disabled={isLoading || messages.length === 0}>
                <FileOutput className="mr-2 h-4 w-4" /> Excel-ə İxrac Et
            </Button>
        </CardHeader>
        <CardContent>
            {isLoading ? (
                <div className="space-y-4">
                    {[...Array(3)].map((_, i) => <Skeleton key={i} className="h-12 w-full" />)}
                </div>
            ) : messages.length > 0 ? (
                <Accordion type="multiple" className="w-full">
                {messages.map((message) => (
                    <AccordionItem value={message.id} key={message.id}>
                        <AccordionTrigger className="hover:no-underline">
                            <div className="flex items-center justify-between w-full pr-4">
                                <div className="flex items-center gap-4 text-left">
                                    <div className="font-medium w-48 truncate">{message.name}</div>
                                    <div className="text-muted-foreground w-64 truncate">{message.subject}</div>
                                </div>
                                <div className="flex items-center gap-4">
                                    <Badge variant="outline" className="hidden sm:inline-flex">
                                        {isClient && message.sentAt ? formatDate(message.sentAt.toDate()) : '...'}
                                    </Badge>
                                </div>
                            </div>
                        </AccordionTrigger>
                        <AccordionContent className="p-4 bg-muted/50 rounded-b-md">
                           <div className="space-y-4">
                             <div className="flex justify-between items-start">
                               <div className="space-y-2">
                                 <p><strong className="font-medium">E-poçt:</strong> <a href={`mailto:${message.email}`} className="text-primary hover:underline">{message.email}</a></p>
                                 <p><strong className="font-medium">Tarix:</strong> {isClient && message.sentAt ? message.sentAt.toDate().toLocaleString('az-AZ', { day: 'numeric', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit' }) : '...'}</p>
                               </div>
                             </div>
                             <p className="pt-4 border-t whitespace-pre-wrap"><strong className="font-medium">Mesaj:</strong><br />{message.message}</p>
                              <div className="pt-4 border-t flex justify-end">
                                <AlertDialog>
                                  <AlertDialogTrigger asChild>
                                      <Button variant="destructive" size="sm">
                                          <Trash2 className="mr-2 h-4 w-4" /> Sil
                                      </Button>
                                  </AlertDialogTrigger>
                                  <AlertDialogContent>
                                      <AlertDialogHeader>
                                      <AlertDialogTitle>Əminsiniz?</AlertDialogTitle>
                                      <AlertDialogDescription>
                                          Bu əməliyyat geri qaytarıla bilməz. Bu, mesajı serverlərimizdən həmişəlik siləcək.
                                      </AlertDialogDescription>
                                      </AlertDialogHeader>
                                      <AlertDialogFooter>
                                      <AlertDialogCancel>Ləğv et</AlertDialogCancel>
                                      <AlertDialogAction onClick={() => handleDelete(message.id)}>Davam et</AlertDialogAction>
                                      </AlertDialogFooter>
                                  </AlertDialogContent>
                                </AlertDialog>
                             </div>
                           </div>
                        </AccordionContent>
                    </AccordionItem>
                ))}
                </Accordion>
            ) : (
                <div className="flex flex-col items-center justify-center h-48 text-center text-muted-foreground border-2 border-dashed rounded-lg">
                    <Inbox className="h-10 w-10 mb-2"/>
                    <h3 className="text-xl font-semibold">Gələnlər qutusu boşdur</h3>
                    <p>Hələ heç bir mesaj göndərilməyib.</p>
                </div>
            )}
        </CardContent>
      </Card>
    </div>
  );
}
