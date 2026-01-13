
"use client";

import * as React from "react";
import { useState, useEffect } from "react";
import { db } from "@/lib/firebase";
import { collection, getDocs, addDoc, updateDoc, deleteDoc, doc, orderBy, query } from "firebase/firestore";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { PlusCircle, Edit, Trash2, Briefcase, Search } from "lucide-react";
import { ProjectForm, ProjectArticle } from "./project-form";
import { useToast } from "@/hooks/use-toast";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription as AlertDialogDesc, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { Skeleton } from "@/components/ui/skeleton";
import { uploadFile, generateSlug } from "@/lib/utils";
import { Input } from "@/components/ui/input";

export default function ProjectsAdminPage() {
  const [projects, setProjects] = useState<ProjectArticle[]>([]);
  const [editingProject, setEditingProject] = useState<ProjectArticle | 'new' | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const { toast } = useToast();

  const fetchProjects = async () => {
    setIsLoading(true);
    try {
      const q = query(collection(db, "projects"), orderBy("title", "asc"));
      const querySnapshot = await getDocs(q);
      const projectList = querySnapshot.docs.map(doc => {
        const data = doc.data();
        return {
          id: doc.id,
          ...data,
        } as ProjectArticle;
      });
      setProjects(projectList);
    } catch (error) {
      console.error("Error fetching projects: ", error);
      toast({ title: "Xəta", description: "Layihələri yükləyərkən problem yarandı.", variant: "destructive" });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  const handleFormSubmit = async (values: Omit<ProjectArticle, "id">, imageFile: File | null) => {
    try {
      let imageUrl = values.imageUrl;
      if (imageFile) {
        imageUrl = await uploadFile(imageFile, 'sekiller');
      }
      
      const slug = generateSlug(values.title);
      const dataToSave = { ...values, slug, imageUrl };

      if (editingProject && editingProject !== 'new') {
        const projectRef = doc(db, "projects", editingProject.id);
        await updateDoc(projectRef, dataToSave);
        toast({ title: "Uğurlu", description: "Layihə yeniləndi." });
      } else {
        await addDoc(collection(db, "projects"), dataToSave);
        toast({ title: "Uğurlu", description: "Yeni layihə əlavə edildi." });
      }
      
      fetchProjects();
      setEditingProject(null);
    } catch (error) {
      console.error("Error saving project: ", error);
      toast({ title: "Xəta", description: "Məlumatları saxlayarkən problem yarandı.", variant: "destructive" });
    }
  };

  const handleDelete = async (projectId: string) => {
    try {
      await deleteDoc(doc(db, "projects", projectId));
      toast({ title: "Uğurlu", description: "Layihə silindi." });
      fetchProjects();
    } catch (error) {
      console.error("Error deleting project: ", error);
      toast({ title: "Xəta", description: "Layihəni silərkən problem yarandı.", variant: "destructive" });
    }
  };

  const filteredProjects = projects.filter(project =>
    project.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold">Layihələri İdarə Et</h1>
          <p className="text-muted-foreground">Yeni layihələr əlavə edin, redaktə edin və ya silin.</p>
        </div>
        <Button onClick={() => setEditingProject(editingProject === 'new' ? null : 'new')}>
          <PlusCircle className="mr-2 h-4 w-4" />
          {editingProject === 'new' ? "Formu Bağla" : "Yeni Layihə Əlavə Et"}
        </Button>
      </div>

       {editingProject && (
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>{editingProject === 'new' ? "Yeni Layihə Yarat" : "Layihəni Redaktə Et"}</CardTitle>
            <CardDescription>
                Layihənin məlumatlarını daxil edin və ya yeniləyin.
            </CardDescription>
          </CardHeader>
          <CardContent>
             <ProjectForm 
              key={editingProject === 'new' ? 'new-project' : editingProject.id}
              onSubmit={handleFormSubmit} 
              initialData={editingProject === 'new' ? null : editingProject} 
              onClose={() => setEditingProject(null)} 
            />
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader>
          <CardTitle>Layihələr Siyahısı</CardTitle>
           <div className="relative mt-2">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
            <Input 
              type="search"
              placeholder="Layihələri axtar..."
              className="pl-10"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </CardHeader>
        <CardContent>
           {isLoading ? (
             <div className="space-y-2">
                {[...Array(3)].map((_, i) => <Skeleton key={i} className="h-14 w-full" />)}
            </div>
           ) : filteredProjects.length > 0 ? (
             <Accordion type="single" collapsible className="w-full">
                {filteredProjects.map((project) => (
                    <AccordionItem value={project.id} key={project.id}>
                        <AccordionTrigger>
                           <div className="flex items-center justify-between w-full pr-4">
                               <div className="flex items-center gap-4 text-left">
                                     <img
                                        alt={project.title}
                                        className="aspect-square rounded-md object-cover"
                                        height="40"
                                        src={project.imageUrl || "https://placehold.co/40x40.png"}
                                        width="40"
                                      />
                                    <p className="font-medium">{project.title}</p>
                               </div>
                                <span className="text-sm text-muted-foreground hidden md:inline-block max-w-xs truncate">{project.team.join(', ')}</span>
                           </div>
                        </AccordionTrigger>
                        <AccordionContent>
                           <div className="p-4 bg-muted/50 rounded-b-md flex items-center gap-2">
                                <Button size="sm" onClick={() => setEditingProject(project)}>
                                    <Edit className="mr-2 h-4 w-4" /> Redaktə Et
                                </Button>
                                <AlertDialog>
                                    <AlertDialogTrigger asChild>
                                        <Button variant="destructive" size="sm">
                                            <Trash2 className="mr-2 h-4 w-4" /> Sil
                                        </Button>
                                    </AlertDialogTrigger>
                                    <AlertDialogContent>
                                        <AlertDialogHeader>
                                        <AlertDialogTitle>Əminsiniz?</AlertDialogTitle>
                                        <AlertDialogDesc>
                                            Bu əməliyyat geri qaytarıla bilməz. Bu, layihəni serverlərimizdən həmişəlik siləcək.
                                        </AlertDialogDesc>
                                        </AlertDialogHeader>
                                        <AlertDialogFooter>
                                        <AlertDialogCancel>Ləğv et</AlertDialogCancel>
                                        <AlertDialogAction onClick={() => handleDelete(project.id)}>Davam et</AlertDialogAction>
                                        </AlertDialogFooter>
                                    </AlertDialogContent>
                                </AlertDialog>
                           </div>
                        </AccordionContent>
                    </AccordionItem>
                ))}
             </Accordion>
           ) : (
            <div className="flex flex-col items-center justify-center h-48 text-center text-muted-foreground border-2 border-dashed rounded-lg">
                <Briefcase className="h-10 w-10 mb-2"/>
                <h3 className="text-xl font-semibold">Heç bir layihə tapılmadı.</h3>
            </div>
           )}
        </CardContent>
      </Card>
    </div>
  );
}
