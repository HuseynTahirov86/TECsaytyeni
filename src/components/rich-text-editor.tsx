"use client";

import { useEffect, useRef, useCallback } from 'react';
import 'quill/dist/quill.snow.css';
import { cn } from '@/lib/utils';
import type Quill from 'quill';

interface RichTextEditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
}

export function RichTextEditor({ value, onChange, placeholder, className }: RichTextEditorProps) {
  const quillRef = useRef<Quill | null>(null);

  const wrapperRef = useCallback((wrapper: HTMLDivElement | null) => {
    if (wrapper === null) return;

    wrapper.innerHTML = '';
    const editor = document.createElement('div');
    wrapper.append(editor);
    
    import('quill').then((QuillModule) => {
      const Quill = QuillModule.default;
      const quill = new Quill(editor, {
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
        },
      });

      quillRef.current = quill;

      if (value) {
        quill.clipboard.dangerouslyPasteHTML(value);
      }

      quill.on('text-change', () => {
        onChange(quill.root.innerHTML);
      });
    });
  }, [onChange, placeholder]);

  useEffect(() => {
    const quill = quillRef.current;
    if (quill && value !== quill.root.innerHTML) {
      // Use dangerouslyPasteHTML to set content and prevent infinite loops
      // by not triggering text-change for this programmatic change.
      const selection = quill.getSelection();
      quill.clipboard.dangerouslyPasteHTML(value);
      if (selection) {
         // Restore cursor position after pasting
        setTimeout(() => quill.setSelection(selection.index, selection.length), 0);
      }
    }
  }, [value]);


  return (
    <div className={cn("bg-background rounded-md border border-input", className)}>
        <div ref={wrapperRef} style={{ minHeight: '250px' }} />
    </div>
  );
}
