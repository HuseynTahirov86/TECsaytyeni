
"use client";

import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { FileUp, XCircle, Download, FileText, File as FileIcon } from "lucide-react";
import { Label } from "./ui/label";
import { useToast } from "@/hooks/use-toast";

interface FileUploaderProps {
  id: string;
  onFileSelect: (file: File | null) => void;
  initialUrl?: string | null;
  maxSizeMB?: number;
  acceptedTypes?: string[];
}

export function FileUploader({ 
  id, 
  onFileSelect, 
  initialUrl,
  maxSizeMB = 20,
  acceptedTypes = ['.doc', '.docx', '.pdf']
}: FileUploaderProps) {
  const [fileName, setFileName] = useState<string | null>(
    initialUrl ? initialUrl.split('/').pop()?.split('_').slice(1).join('_') || "Yüklənmiş Fayl" : null
  );
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();
  
  const validateFileSize = (file: File): boolean => {
    const fileSizeMB = file.size / (1024 * 1024);
    if (fileSizeMB > maxSizeMB) {
      toast({
        title: "Xəta",
        description: `Fayl ölçüsü çox böyükdür. Maksimum ${maxSizeMB}MB olmalıdır.`,
        variant: "destructive"
      });
      return false;
    }
    return true;
  };

  const validateFileType = (file: File): boolean => {
    const fileExtension = '.' + file.name.split('.').pop()?.toLowerCase();
    
    if (!acceptedTypes.includes(fileExtension)) {
      toast({
        title: "Xəta", 
        description: `Yalnız ${acceptedTypes.join(', ')} formatları dəstəklənir.`,
        variant: "destructive"
      });
      return false;
    }
    return true;
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!validateFileType(file) || !validateFileSize(file)) {
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
      return;
    }

    setSelectedFile(file);
    setFileName(file.name);
    onFileSelect(file);
  };
  
  const handleRemoveFile = () => {
    setFileName(null);
    setSelectedFile(null);
    onFileSelect(null);
    
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const getFileIcon = (fileName: string) => {
    const extension = fileName.split('.').pop()?.toLowerCase();
    switch (extension) {
      case 'pdf':
        return <FileText className="h-4 w-4 text-red-500" />;
      case 'doc':
      case 'docx':
        return <FileIcon className="h-4 w-4 text-blue-500" />;
      default:
        return <FileIcon className="h-4 w-4 text-gray-500" />;
    }
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const acceptString = acceptedTypes.join(',');

  return (
    <div className="space-y-4 p-4 border-2 border-dashed rounded-lg hover:border-primary/50 transition-colors">
      <div className="flex items-center gap-4">
        <Label htmlFor={id} className="flex-grow cursor-pointer">
          <div className="flex h-10 w-full items-center justify-start rounded-md border border-input bg-background px-3 py-2 text-sm text-muted-foreground ring-offset-background hover:bg-accent transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50">
            <FileUp className="mr-2 h-4 w-4" />
            {fileName || "Fayl Seçin"}
          </div>
        </Label>
        <Input
          ref={fileInputRef}
          id={id}
          name={id}
          type="file"
          accept={acceptString}
          onChange={handleFileChange}
          className="sr-only"
        />
        
        {fileName && (
            <Button 
              type="button"
              variant="ghost" 
              size="icon" 
              onClick={handleRemoveFile}
            >
              <XCircle className="h-5 w-5 text-destructive" />
            </Button>
          )}
      </div>

      {selectedFile && (
        <div className="flex items-center justify-between p-3 bg-accent/50 rounded-md">
          <div className="flex items-center gap-3">
            {getFileIcon(selectedFile.name)}
            <div>
              <p className="text-sm font-medium">{selectedFile.name}</p>
              <p className="text-xs text-muted-foreground">
                {formatFileSize(selectedFile.size)}
              </p>
            </div>
          </div>
        </div>
      )}

      {initialUrl && !selectedFile && (
        <div className="flex items-center justify-between p-3 bg-green-50 dark:bg-green-900/20 rounded-md">
          <div className="flex items-center gap-3">
            {getFileIcon(initialUrl)}
            <div>
              <p className="text-sm font-medium text-green-700 dark:text-green-300">
                Mövcud fayl: {initialUrl.split('/').pop()?.split('_').slice(1).join('_')}
              </p>
            </div>
          </div>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => window.open(initialUrl, '_blank')}
          >
            <Download className="h-4 w-4 mr-1" />
            Yüklə
          </Button>
        </div>
      )}

      <div className="text-xs text-muted-foreground">
        Dəstəklənən formatlar: {acceptedTypes.join(', ')} (maksimum {maxSizeMB}MB)
      </div>
    </div>
  );
}
