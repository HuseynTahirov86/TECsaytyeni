
"use client";

import { useSearchParams } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Printer, Loader2 } from 'lucide-react';
import { Suspense, useEffect, useState } from 'react';
import { getCertificateById } from '@/lib/data';
import type { TrainingRegistration } from '@/lib/data';

const formatDateForCertificate = (date: Date) => {
    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const day = date.getDate().toString().padStart(2, '0');
    return `${year}-${month}-${day}`;
};

function CertificateContent() {
    const searchParams = useSearchParams();
    const certificateId = searchParams.get('id');
    const [certificateData, setCertificateData] = useState<TrainingRegistration | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    
    useEffect(() => {
        if (certificateId) {
            setIsLoading(true);
            getCertificateById(certificateId)
                .then(data => {
                    if (data) {
                        setCertificateData(data);
                    } else {
                        setError("Bu ID ilə sertifikat tapılmadı.");
                    }
                })
                .catch(() => setError("Sertifikat məlumatlarını yükləyərkən xəta baş verdi."))
                .finally(() => setIsLoading(false));
        } else {
             // Fallback to URL params if ID is not available for some reason (e.g., direct link)
            const name = searchParams.get('name');
            const training = searchParams.get('training');
            if(name && training && certificateId) {
                 setCertificateData({
                    fullName: name,
                    trainingTitle: training,
                    certificateId: certificateId
                 } as TrainingRegistration)
            } else {
                setError("Sertifikat ID-si təqdim edilməyib.");
            }
            setIsLoading(false);
        }
    }, [certificateId, searchParams]);


    const handlePrint = () => {
        const printContent = document.getElementById('certificate-container');
        if (!printContent || !certificateData) return;

        const issueDate = certificateData.completionDate ? formatDateForCertificate(certificateData.completionDate.toDate()) : formatDateForCertificate(new Date());

        const printWindow = window.open('', '_blank');
        if (!printWindow) return;
        
        printWindow.document.write(`
            <!DOCTYPE html>
            <html>
            <head>
                <title>Sertifikat</title>
                <style>
                    body, html {
                        margin: 0;
                        padding: 0;
                        width: 100%;
                        height: 100vh;
                        background: #fff;
                        -webkit-print-color-adjust: exact;
                        color-adjust: exact;
                        box-sizing: border-box;
                        overflow: hidden;
                    }
                    
                    .certificate-container {
                        position: relative;
                        width: 100%;
                        height: 100vh;
                        display: flex;
                        align-items: center;
                        justify-content: center;
                        margin: 0;
                        padding: 0;
                    }
                    
                    .certificate-container img {
                        width: 100%;
                        height: 100%;
                        object-fit: contain;
                    }
                    
                    .certificate-overlay {
                        position: absolute;
                        top: 0;
                        left: 0;
                        width: 100%;
                        height: 100%;
                        color: #374151;
                    }
                    
                    /* Dinamik məzmun üçün stillər */
                    .training-name {
                        position: absolute;
                        top: 38%;
                        left: 50%;
                        transform: translateX(-50%);
                        width: 55%;
                        text-align: center;
                        font-family: serif;
                        font-size: 21.4px;
                        line-height: 1.2;
                    }
                    
                    .participant-name {
                        position: absolute;
                        top: 50.5%;
                        left: 50%;
                        transform: translateX(-50%);
                        width: 60%;
                        text-align: center;
                        font-family: serif;
                        font-weight: bold;
                        font-size: 28px;
                    }
                    
                    .issue-date {
                        position: absolute;
                        top: 82.5%;
                        left: 18.5%;
                        transform: translateX(-50%);
                        width: 17%;
                        text-align: center;
                        font-family: monospace;
                        font-size: 11.3px;
                        color: black;
                    }
                    
                    .certificate-id {
                        position: absolute;
                        top: 81.5%;
                        left: 76%;
                        width: 18%;
                        text-align: left;
                        font-family: monospace;
                        font-weight: 600;
                        font-size: 11.3px;
                        letter-spacing: 0.05em;
                    }
                    
                    @media print {
                        @page {
                            size: A4 landscape;
                            margin: 0;
                        }
                        
                        body, html {
                            padding: 0;
                            margin: 0;
                            height: 100vh;
                            overflow: hidden;
                        }
                        
                        .certificate-container {
                            width: 100vw;
                            height: 100vh;
                            max-height: 100vh;
                            page-break-after: avoid;
                            page-break-inside: avoid;
                            break-inside: avoid;
                        }
                        
                        .certificate-container img {
                            width: 100%;
                            height: 100%;
                            object-fit: contain;
                        }
                    }
                </style>
            </head>
            <body>
                <div class="certificate-container">
                    <img src="/tesekkurname.png" alt="Sertifikat" />
                    <div class="certificate-overlay">
                        <div class="training-name">
                            "${certificateData.trainingTitle}"
                        </div>
                        <div class="participant-name">
                            ${certificateData.fullName}
                        </div>
                        <div class="issue-date">
                            ${issueDate}
                        </div>
                        <div class="certificate-id">
                            ${certificateData.certificateId}
                        </div>
                    </div>
                </div>
            </body>
            </html>
        `);
        
        printWindow.document.close();
        
        // Şəkil yüklənənə qədər gözlə
        printWindow.onload = () => {
            setTimeout(() => {
                printWindow.print();
                printWindow.close();
            }, 1000);
        };
    };

    if (isLoading) {
        return <div className="bg-gray-100 min-h-screen flex flex-col items-center justify-center p-4 print:hidden"><Loader2 className="h-8 w-8 animate-spin" /></div>
    }

    if (error || !certificateData) {
         return <div className="bg-gray-100 min-h-screen flex flex-col items-center justify-center p-4 text-red-500 font-semibold print:hidden">{error || "Sertifikat tapılmadı."}</div>
    }

    const issueDate = certificateData.completionDate ? formatDateForCertificate(certificateData.completionDate.toDate()) : formatDateForCertificate(new Date());
    const aspectRatio = 1000 / 707;

    return (
        <div className="bg-gray-100 min-h-screen flex flex-col items-center justify-center p-4 print:p-0 print:bg-white print:min-h-0 print:flex-none">
            <div 
                id="certificate-container"
                className="relative w-full max-w-4xl shadow-lg print:shadow-none print:max-w-none"
                style={{ aspectRatio: `${aspectRatio}` }}
            >
                <img src="/tesekkurname.png" alt="Sertifikat" className="w-full h-full object-contain" />
                
                {/* Dynamic Content Overlay */}
                <div className="absolute inset-0 text-gray-800">
                    {/* Training Name */}
                    <div 
                        className="absolute w-[55%] text-center"
                        style={{ top: '38%', left: '50%', transform: 'translateX(-50%)' }}
                    >
                        <p className="font-serif text-[21.4px] leading-tight">
                            "{certificateData.trainingTitle}"
                        </p>
                    </div>

                    {/* Participant Name */}
                    <div 
                        className="absolute w-[60%] text-center"
                        style={{ top: '50.5%', left: '50%', transform: 'translateX(-50%)' }}
                    >
                        <p className="font-serif font-bold text-[28px]">
                            {certificateData.fullName}
                        </p>
                    </div>

                    {/* Issue Date */}
                    <div 
                        className="absolute w-[17%] text-center text-black"
                         style={{ top: '82.5%', left: '18.5%', transform: 'translateX(-50%)' }}
                    >
                        <p className="font-mono text-[11.3px]">{issueDate}</p>
                    </div>

                    {/* Certificate ID */}
                    <div 
                        className="absolute w-[18%] text-left"
                        style={{ top: '81.5%', left: '76%' }}
                    >
                        <p className="font-mono font-semibold text-[11.3px] tracking-wider">
                           {certificateData.certificateId}
                        </p>
                    </div>
                </div>
            </div>

            <div className="mt-8 flex gap-4 print:hidden">
                <Button onClick={handlePrint} size="lg">
                    <Printer className="mr-2 h-5 w-5" />
                    Çap Et və ya PDF Saxla
                </Button>
            </div>

            <style jsx global>{`
                /* Normal görünüş üçün stillər */
                .certificate-display {
                    background: #f3f4f6;
                    min-height: 100vh;
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    justify-content: center;
                    padding: 1rem;
                }
                
                @media print {
                    /* Print stillər artıq yeni pəncərədə tətbiq olunur */
                    .print-hidden { 
                        display: none !important; 
                    }
                }
            `}</style>
        </div>
    );
}

export default function CertificateClientPage() {
    return (
        <Suspense fallback={<div>Yüklənir...</div>}>
            <CertificateContent />
        </Suspense>
    );
}
