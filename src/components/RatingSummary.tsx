// src/components/RatingSummary.tsx
export default function RatingSummary({ average, total }: { average: number, total: number }) {
  if (total === 0) return null;
  return (
    <div style={{ marginTop: '15px', display: 'flex', alignItems: 'center' }}>
      <span style={{ fontWeight: 'bold', fontSize: '1.2rem', color: '#f59e0b' }}>
        ★ {average.toFixed(1)}
      </span>
      <span style={{ marginLeft: '10px', color: '#666' }}>
        ({total} {total === 1 ? 'reseña' : 'reseñas'})
      </span>
    </div>
  );
}