"use client";

import { useEffect, useRef, useCallback } from 'react';
import 'quill/dist/quill.snow.css';
import { cn } from '@/lib/utils';
import type Quill from 'quill';
import { uploadFile } from '@/lib/utils';

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
      
      const imageHandler = () => {
        const input = document.createElement('input');
        input.setAttribute('type', 'file');
        input.setAttribute('accept', 'image/*');
        input.click();

        input.onchange = async () => {
            if (input.files && input.files[0]) {
                const file = input.files[0];
                const range = quill.getSelection(true);

                quill.insertText(range.index, ' [Şəkil yüklənir...] ', 'italic', true);

                try {
                    const imageUrl = await uploadFile(file, 'sekiller');
                    
                    quill.deleteText(range.index, ' [Şəkil yüklənir...] '.length);
                    quill.insertEmbed(range.index, 'image', imageUrl);
                    quill.setSelection(range.index + 1, 0);

                } catch (error) {
                    console.error("Image upload failed:", error);
                    quill.deleteText(range.index, ' [Şəkil yüklənir...] '.length);
                }
            }
        };
      }
      
      const quill = new Quill(editor, {
        theme: 'snow',
        placeholder,
        modules: {
          toolbar: {
              container: [
                [{ 'header': [1, 2, 3, false] }],
                ['bold', 'italic', 'underline', 'strike', 'blockquote'],
                [{'list': 'ordered'}, {'list': 'bullet'}, {'indent': '-1'}, {'indent': '+1'}],
                ['link', 'image'],
                ['clean']
              ],
              handlers: {
                  image: imageHandler,
              }
          }
        },
      });

      quillRef.current = quill;

      if (value) {
        quill.clipboard.dangerouslyPasteHTML(value);
      }

      quill.on('text-change', (delta, oldDelta, source) => {
          if (source === 'user') {
            onChange(quill.root.innerHTML);
          }
      });
    });
  }, [onChange, placeholder]);

  useEffect(() => {
    const quill = quillRef.current;
    if (quill && value !== quill.root.innerHTML) {
      const selection = quill.getSelection();
      quill.clipboard.dangerouslyPasteHTML(value);
      if (selection && quill.hasFocus()) {
         setTimeout(() => {
          if(quillRef.current) {
            quillRef.current.setSelection(selection.index, selection.length)
          }
         }, 0);
      }
    }
  }, [value]);


  return (
    <div className={cn("bg-background rounded-md border border-input", className)}>
        <div ref={wrapperRef} style={{ minHeight: '250px' }} />
    </div>
  );
}
