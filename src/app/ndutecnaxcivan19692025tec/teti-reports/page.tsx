
"use client";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import DepartmentDocumentsPage from '../department-documents/page';
import FacultyDocumentsPage from '../faculty-documents/page';

export default function TetiReportsPage() {
  return (
    <div>
        <div className="mb-8">
            <h1 className="text-3xl font-bold">TETİ Sənədləri</h1>
            <p className="text-muted-foreground">Fakültələr və kafedralar tərəfindən təqdim edilən sənədlər.</p>
        </div>
        <Tabs defaultValue="faculty" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="faculty">Fakültə Sənədləri</TabsTrigger>
                <TabsTrigger value="department">Kafedra Sənədləri</TabsTrigger>
            </TabsList>
            <TabsContent value="faculty">
                <FacultyDocumentsPage />
            </TabsContent>
            <TabsContent value="department">
                <DepartmentDocumentsPage />
            </TabsContent>
        </Tabs>
    </div>
  );
}
