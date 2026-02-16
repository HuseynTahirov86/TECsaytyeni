import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import { v4 as uuidv4 } from 'uuid';
import * as XLSX from 'xlsx';


export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function generateSlug(text: string): string {
  if (!text) return "";
  
  const specialChars = 'àáâäæãåāăąçćčđďèéêëēėęěğǵḧîïíīįìłḿñńǹňôöòóœøōõőṕŕřßśšşșťțûüùúūǘůűųẃẍÿýžźż·/_,:;';
  const replacements = 'aaaaaaaaaacccddeeeeeeeegghiiiiiilmnnnnoooooooooprrsssssttuuuuuuuuuwxyyzzz------';
  const regex = new RegExp(specialChars.split('').join('|'), 'g');

  return text.toString().toLowerCase()
    .replace(/\s+/g, '-') // Replace spaces with -
    .replace(regex, c => replacements.charAt(specialChars.indexOf(c))) // Replace special characters
    .replace(/&/g, '-and-') // Replace & with 'and'
    .replace(/[^\w\-.]+/g, '') // Remove all non-word chars except dots
    .replace(/\-\-+/g, '-') // Replace multiple - with single -
    .replace(/^-+/, '') // Trim - from start of text
    .replace(/-+$/, '') // Trim - from end of text
}

export const formatDate = (dateSource: Date | string | undefined | null): string => {
    if (!dateSource) return '';
    
    try {
        let date = typeof dateSource === 'string' ? new Date(dateSource) : dateSource;
        
        // Check if date is valid
        if (isNaN(date.getTime())) {
            // Try to re-parse if it's just a date string without time
            date = new Date(`${dateSource}T00:00:00`);
            if (isNaN(date.getTime())) return '';
        }

        const day = date.getUTCDate();
        const monthIndex = date.getUTCMonth();
        const year = date.getUTCFullYear();

        const monthNames = [
            "Yanvar", "Fevral", "Mart", "Aprel", "May", "İyun",
            "İyul", "Avqust", "Sentyabr", "Oktyabr", "Noyabr", "Dekabr"
        ];

        return `${day} ${monthNames[monthIndex]} ${year}`;
    } catch (e) {
        console.error("Tarix formatı xətası:", e);
        return '';
    }
};

export async function uploadFile(file: File): Promise<string> {
    if (!file) {
        throw new Error('Fayl seçilməyib');
    }

    const fileType = file.type;
    let directory = 'documents'; // Default to documents

    if (fileType.startsWith('image/')) {
        directory = 'sekiller';
    } else {
        const extension = file.name.split('.').pop()?.toLowerCase();
        if (extension && ['jpg', 'jpeg', 'png', 'gif', 'webp'].includes(extension)) {
            directory = 'sekiller';
        }
    }

    const formData = new FormData();
    formData.append('file', file);
    formData.append('directory', directory);

    try {
        const response = await fetch('/api/upload', {
            method: 'POST',
            body: formData,
        });

        const result = await response.json();

        if (!response.ok || !result.success) {
            throw new Error(result.message || 'Fayl yüklənərkən xəta baş verdi.');
        }

        return result.url;
    } catch (error: any) {
        console.error("Fayl yükləmə xətası:", error);
        throw new Error(error.message || "Fayl yüklənərkən naməlum xəta baş verdi.");
    }
}

export const exportToExcel = (data: any[], fileName: string) => {
    const ws = XLSX.utils.json_to_sheet(data);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Sheet1");
    XLSX.writeFile(wb, `${fileName}.xlsx`);
};
