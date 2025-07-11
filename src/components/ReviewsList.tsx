// src/components/ReviewsList.tsx
type ReviewWithClientName = {
  id: string;
  rating: number | null;
  comment: string | null;
  client_name: string | null;
};

export default function ReviewsList({ reviews }: { reviews: ReviewWithClientName[] }) {
  return (
    <>
      <hr style={{ margin: '30px 0' }} />
      <h3 style={{ fontSize: '1.25rem' }}>Reseñas de Clientes</h3>
      {reviews.length > 0 ? (
        <div>
          {reviews.map((review) => (
            <div key={review.id} style={{ borderBottom: '1px solid #eee', paddingBottom: '15px', marginBottom: '15px' }}>
              <div style={{ display: 'flex', alignItems: 'center', marginBottom: '5px' }}>
                <span style={{ fontWeight: 'bold' }}>{review.client_name || 'Anónimo'}</span>
                <span style={{ marginLeft: '10px', fontWeight: 'bold', color: '#f59e0b' }}>
                  ★ {review.rating}
                </span>
              </div>
              <p style={{ margin: 0 }}>{review.comment}</p>
            </div>
          ))}
        </div>
      ) : (
        <p>Este profesional aún no tiene reseñas.</p>
      )}
    </>
  );
}