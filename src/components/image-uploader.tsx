
"use client";

import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { FileUp, XCircle } from "lucide-react";
import { Label } from "./ui/label";
import { useToast } from "@/hooks/use-toast";

interface ImageUploaderProps {
  id: string;
  onFileSelect: (file: File | null) => void;
  onRemove?: () => void;
  previewUrl?: string | null;
  maxSizeKB?: number;
}

export function ImageUploader({ 
  id, 
  onFileSelect, 
  onRemove, 
  previewUrl,
  maxSizeKB = 20480, // 20MB default
}: ImageUploaderProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const validateFileSize = (file: File): boolean => {
    const fileSizeKB = file.size / 1024;
    if (fileSizeKB > maxSizeKB) {
      toast({
        title: "Xəta",
        description: `Fayl ölçüsü çox böyükdür. Maksimum ${Math.round(maxSizeKB / 1024)}MB olmalıdır.`,
        variant: "destructive"
      });
      return false;
    }
    return true;
  };

  const validateFileType = (file: File): boolean => {
    const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
    if (!allowedTypes.includes(file.type)) {
      toast({
        title: "Xəta", 
        description: "Yalnız JPEG, PNG, GIF və WebP formatları dəstəklənir.",
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
    
    onFileSelect(file);
  };

  const handleRemoveImage = () => {
    onFileSelect(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
    if (onRemove) {
      onRemove();
    }
  };

  return (
    <div className="space-y-4 p-4 border-2 border-dashed rounded-lg hover:border-primary/50 transition-colors">
      
      {!previewUrl && (
        <Label htmlFor={id} className="cursor-pointer">
          <div className="flex flex-col items-center justify-center gap-2 text-center text-muted-foreground p-6 rounded-md hover:bg-accent/50 transition-colors">
            <FileUp className="h-8 w-8" />
            <span className="font-semibold">Şəkil Seçin və ya Buraya Sürüşdürün</span>
            <span className="text-xs">PNG, JPG, GIF, WEBP (maks. ${Math.round(maxSizeKB/1024)}MB)</span>
          </div>
          <Input
            ref={fileInputRef}
            id={id}
            name={id}
            type="file"
            accept="image/png, image/jpeg, image/gif, image/webp"
            onChange={handleFileChange}
            className="sr-only"
          />
        </Label>
      )}

      {previewUrl && (
        <div className="relative group w-fit mx-auto">
          <img
            src={previewUrl}
            alt="Şəkil önizləməsi"
            className="mt-2 rounded-md object-contain max-h-48"
          />
          <Button 
            type="button"
            variant="destructive"
            size="icon" 
            className="absolute -top-3 -right-3 h-7 w-7 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
            onClick={handleRemoveImage}
          >
            <XCircle className="h-5 w-5" />
             <span className="sr-only">Şəkli sil</span>
          </Button>
        </div>
      )}

    </div>
  );
}
