
import { NextRequest, NextResponse } from 'next/server';
import { writeFile, stat, mkdir } from 'fs/promises';
import { join } from 'path';
import { v4 as uuidv4 } from 'uuid';

const UPLOADS_ROOT = join(process.cwd(), 'uploads');

const ALLOWED_DIRECTORIES = [
    'fakultecixaris',
    'kafedraciaris',
    'kitablar',
    'sekiller',
    'telebeelmijurnali',
    'telebehuquqjurnali',
    'tetimelumat',
    'documents',
    'sec-images'
];

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File | null;
    const directory = formData.get('directory') as string | null;

    if (!file) {
      return NextResponse.json({ success: false, message: 'Fayl tapılmadı.' }, { status: 400 });
    }
    
    if (!directory || !ALLOWED_DIRECTORIES.includes(directory)) {
        return NextResponse.json({ success: false, message: 'Yanlış və ya icazə verilməyən qovluq adı.' }, { status: 400 });
    }
    
    const destinationPath = join(UPLOADS_ROOT, directory);

    try {
        await stat(destinationPath);
    } catch (error: any) {
        if (error.code === 'ENOENT') {
            await mkdir(destinationPath, { recursive: true });
        } else {
            throw error;
        }
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    const fileExtension = file.name.split('.').pop() || 'tmp';
    const uniqueSuffix = `${Date.now()}-${uuidv4().substring(0, 8)}`;
    const filename = `${uniqueSuffix}.${fileExtension}`;
    
    const filePath = join(destinationPath, filename);

    await writeFile(filePath, buffer);

    const urlPath = `/api/files/${directory}/${filename}`;
    
    return NextResponse.json({ success: true, url: urlPath });

  } catch (e) {
    console.error("Fayl yükləmə zamanı API xətası:", e);
    return NextResponse.json({ success: false, message: 'Server xətası baş verdi.' }, { status: 500 });
  }
}
