
"use client";

import { useState, useEffect, Suspense } from "react";
import { db } from "@/lib/firebase";
import { collection, getDocs, deleteDoc, doc, Timestamp, orderBy, query, where, getDoc } from "firebase/firestore";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Trash2, Inbox, FileOutput, Search } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { Skeleton } from "@/components/ui/skeleton";
import { useSearchParams } from "next/navigation";
import { formatDate, exportToExcel } from "@/lib/utils";
import { type Training } from "../training-form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";

interface Registration {
    id: string;
    fullName: string;
    designation: string;
    institution: string;
    specialization: string;
    course: string;
    trainingId: string;
    trainingTitle: string;
    submittedAt: Timestamp;
}

function RegistrationsContent() {
  const [registrations, setRegistrations] = useState<Registration[]>([]);
  const [trainings, setTrainings] = useState<Training[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isClient, setIsClient] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedTraining, setSelectedTraining] = useState("all");
  const { toast } = useToast();

  const fetchRegistrations = async () => {
    setIsLoading(true);
    try {
      const q = query(collection(db, "trainingRegistrations"), orderBy("submittedAt", "desc"));
      const querySnapshot = await getDocs(q);
      const registrationList = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
      } as Registration));
      setRegistrations(registrationList);

    } catch (error) {
      console.error("Error fetching registrations: ", error);
      toast({ title: "Xəta", description: "Qeydiyyatları yükləyərkən problem yarandı.", variant: "destructive" });
    } finally {
      setIsLoading(false);
    }
  };
  
  const fetchTrainings = async () => {
     try {
      const q = query(collection(db, "trainings"), orderBy("date", "desc"));
      const querySnapshot = await getDocs(q);
      const trainingList = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
      } as Training));
      setTrainings(trainingList);
    } catch (error) {
      console.error("Error fetching trainings: ", error);
    }
  }

  useEffect(() => {
    setIsClient(true);
    fetchRegistrations();
    fetchTrainings();
  }, []);


  const handleDelete = async (id: string) => {
    try {
      await deleteDoc(doc(db, "trainingRegistrations", id));
      toast({ title: "Uğurlu", description: "Qeydiyyat silindi." });
      setRegistrations(registrations.filter(r => r.id !== id));
    } catch (error) {
      console.error("Error deleting registration: ", error);
      toast({ title: "Xəta", description: "Qeydiyyatı silərkən problem yarandı.", variant: "destructive" });
    }
  };

  const filteredRegistrations = registrations
    .filter(reg => selectedTraining === 'all' || reg.trainingId === selectedTraining)
    .filter(reg => reg.fullName.toLowerCase().includes(searchQuery.toLowerCase()));

  const handleExport = () => {
    const dataToExport = filteredRegistrations.map(reg => ({
      'Ad, Soyad': reg.fullName,
      'Təlim': reg.trainingTitle,
      'Təyinat': reg.designation,
      'Müəssisə': reg.institution,
      'İxtisas': reg.specialization,
      'Kurs': reg.course,
      'Qeydiyyat Tarixi': reg.submittedAt ? reg.submittedAt.toDate().toLocaleString('az-AZ') : 'Bilinmir',
    }));
    exportToExcel(dataToExport, "Təlim_Qeydiyyatları");
  };

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Təlim Qeydiyyatları</h1>
        <p className="text-muted-foreground">Təlimlərə olan bütün qeydiyyatlar.</p>
      </div>
      <Card>
        <CardHeader>
            <CardTitle>Qeydiyyat Siyahısı</CardTitle>
            <CardDescription>Burada təlimlərə qeydiyyatdan keçən iştirakçıları görə bilərsiniz.</CardDescription>
             <div className="flex flex-col md:flex-row gap-4 mt-4">
                <div className="relative flex-grow">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                  <Input 
                    type="search"
                    placeholder="İştirakçı axtar..."
                    className="pl-10"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
                <Select value={selectedTraining} onValueChange={setSelectedTraining}>
                  <SelectTrigger className="w-full md:w-[300px]">
                    <SelectValue placeholder="Təlimə görə süzgəclə" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Bütün Təlimlər</SelectItem>
                    {trainings.map(training => (
                      <SelectItem key={training.id} value={training.id}>{training.title}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                 <Button onClick={handleExport} disabled={isLoading || filteredRegistrations.length === 0} className="w-full md:w-auto">
                    <FileOutput className="mr-2 h-4 w-4" /> Excel-ə İxrac Et
                </Button>
            </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Ad, Soyad</TableHead>
                <TableHead>Təlim</TableHead>
                <TableHead>Təyinat</TableHead>
                <TableHead>Müəssisə</TableHead>
                <TableHead>Tarix</TableHead>
                <TableHead><span className="sr-only">Əməliyyatlar</span></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                Array.from({ length: 5 }).map((_, i) => (
                  <TableRow key={i}>
                    <TableCell><Skeleton className="h-4 w-32" /></TableCell>
                    <TableCell><Skeleton className="h-4 w-48" /></TableCell>
                    <TableCell><Skeleton className="h-4 w-24" /></TableCell>
                    <TableCell><Skeleton className="h-4 w-32" /></TableCell>
                    <TableCell><Skeleton className="h-4 w-24" /></TableCell>
                    <TableCell><Skeleton className="h-8 w-8" /></TableCell>
                  </TableRow>
                ))
              ) : filteredRegistrations.length > 0 ? (
                filteredRegistrations.map((reg) => (
                  <TableRow key={reg.id}>
                    <TableCell className="font-medium">{reg.fullName}</TableCell>
                    <TableCell className="text-muted-foreground">{reg.trainingTitle}</TableCell>
                    <TableCell>{reg.designation}</TableCell>
                    <TableCell>{reg.institution}</TableCell>
                    <TableCell>
                      {isClient && reg.submittedAt ? formatDate(reg.submittedAt.toDate()) : '...'}
                    </TableCell>
                    <TableCell>
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button variant="destructive" size="icon">
                            <Trash2 className="h-4 w-4" />
                            <span className="sr-only">Sil</span>
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>Əminsiniz?</AlertDialogTitle>
                            <AlertDialogDescription>
                              Bu əməliyyat geri qaytarıla bilməz. Bu, qeydiyyatı həmişəlik siləcək.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Ləğv et</AlertDialogCancel>
                            <AlertDialogAction onClick={() => handleDelete(reg.id)}>Davam et</AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={6} className="h-24 text-center">
                    <Inbox className="mx-auto h-8 w-8 text-muted-foreground mb-2" />
                    Heç bir qeydiyyat tapılmadı.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}


export default function RegistrationsPage() {
    return (
        <Suspense fallback={<div>Yüklənir...</div>}>
            <RegistrationsContent />
        </Suspense>
    )
}
