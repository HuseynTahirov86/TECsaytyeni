"use client";

import { useEffect, useRef } from 'react';
import 'quill/dist/quill.snow.css'; // Stil faylını saxlayırıq
import { cn } from '@/lib/utils';

interface RichTextEditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
  rows?: number; // Not used by Quill but might be useful for styling
}

export function RichTextEditor({ value, onChange, placeholder, className }: RichTextEditorProps) {
  const editorRef = useRef<HTMLDivElement>(null);
  const quillRef = useRef<any>(null); // Use any to avoid type issues with dynamic import

  useEffect(() => {
    // Bu effektin yalnız brauzerdə işlədiyindən əmin oluruq
    if (typeof window !== 'undefined' && editorRef.current && !quillRef.current) {
      import('quill').then((QuillModule) => {
        const Quill = QuillModule.default;
        quillRef.current = new Quill(editorRef.current!, {
          theme: 'snow',
          placeholder,
          modules: {
            toolbar: [
              [{ 'header': [1, 2, 3, false] }],
              ['bold', 'italic', 'underline', 'strike', 'blockquote'],
              [{'list': 'ordered'}, {'list': 'bullet'}, {'indent': '-1'}, {'indent': '+1'}],
              ['link', 'image'],
              ['clean']
            ],
          }
        });

        const quill = quillRef.current;
        if (quill) {
          // Yalnız dəyər fərqlidirsə, HTML-i təyin et
          if (value !== quill.root.innerHTML) {
            quill.root.innerHTML = value;
          }

          quill.on('text-change', (delta, oldDelta, source) => {
            if (source === 'user') {
              onChange(quill.root.innerHTML);
            }
          });
        }
      });
    }

    // Cleanup function to avoid memory leaks
    return () => {
      if (quillRef.current) {
        quillRef.current.off('text-change');
        // The editor instance itself doesn't need to be destroyed here
        // as the component might remount.
      }
    };
  }, []); // Removed dependencies to prevent re-initialization

   useEffect(() => {
    // Update Quill content if the value prop changes from outside
    if (quillRef.current && value !== quillRef.current.root.innerHTML) {
      quillRef.current.root.innerHTML = value;
    }
  }, [value]);


  return (
    <div className={cn("bg-background rounded-md border border-input", className)}>
        <div ref={editorRef} style={{ minHeight: '250px' }} />
    </div>
  );
}
