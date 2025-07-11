// src/components/WorkGallery.tsx
export default function WorkGallery({ images, professionalName }: { images: string[], professionalName: string | null }) {
  if (images.length === 0) return null;
  return (
    <>
      <hr style={{ margin: '30px 0' }} />
      <h3 style={{ fontSize: '1.25rem' }}>Galería de Trabajos</h3>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '15px' }}>
        {images.map((url, index) => (
          <img key={index} src={url} alt={`Trabajo de ${professionalName}`} style={{ width: '100%', height: '200px', objectFit: 'cover', borderRadius: '8px' }}/>
        ))}
      </div>
    </>
  );
}