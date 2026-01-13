import Image from 'next/image';

export default function Loading() {
  return (
    <div className="fixed inset-0 z-50 flex h-full w-full items-center justify-center bg-background">
      <div className="animate-pulse flex flex-col items-center gap-4 text-center">
        <Image 
          src="/logo1.png"
          alt="Yüklənir..."
          width={100}
          height={100}
        />
        <p className="text-xl font-semibold text-primary">#TECləSivilizasiyaGəlir</p>
      </div>
    </div>
  )
}
