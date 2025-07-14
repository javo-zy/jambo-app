// src/components/WorkGallery.tsx
import Image from 'next/image';

export default function WorkGallery({ images, professionalName }: { images: string[], professionalName: string | null }) {
  if (images.length === 0) return null;
  return (
    <section className="bg-white p-6 rounded-lg shadow-sm">
      <h3 className="text-2xl font-bold text-black mb-4">Galería de Trabajos</h3>
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
        {images.map((url, index) => (
          <div key={index} className="aspect-w-1 aspect-h-1">
            <Image 
              src={url} 
              alt={`Trabajo de ${professionalName}`} 
              layout="fill"
              objectFit="cover"
              className="rounded-lg"
            />
          </div>
        ))}
      </div>
    </section>
  );
}
