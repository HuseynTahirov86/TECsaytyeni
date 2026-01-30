
import { NextRequest, NextResponse } from 'next/server';
import { readFile } from 'fs/promises';
import { join } from 'path';
import mime from 'mime-types';

const UPLOADS_ROOT = join(process.cwd(), 'uploads');

const ALLOWED_DIRECTORIES = [
    'fakultecixaris',
    'kafedraciaris',
    'kitablar',
    'sekiller',
    'telebeelmijurnali',
    'telebehuquqjurnali',
    'tetimelumat',
    'sec-images'
];


export async function GET(request: NextRequest, { params }: { params: { slug: string[] } }) {
    try {
        const [directory, filename] = params.slug;

        if (!directory || !filename || !ALLOWED_DIRECTORIES.includes(directory)) {
            return new NextResponse('Yanlış sorğu', { status: 400 });
        }

        const filePath = join(UPLOADS_ROOT, directory, filename);

        const fileBuffer = await readFile(filePath);
        
        const contentType = mime.lookup(filePath) || 'application/octet-stream';

        return new NextResponse(fileBuffer, {
            status: 200,
            headers: {
                'Content-Type': contentType,
                'Content-Length': fileBuffer.length.toString(),
            },
        });

    } catch (error: any) {
        if (error.code === 'ENOENT') {
            return new NextResponse('Fayl tapılmadı', { status: 404 });
        }
        console.error("Fayl göstərmə zamanı API xətası:", error);
        return new NextResponse('Server xətası baş verdi', { status: 500 });
    }
}
