// src/components/ReviewsList.tsx
type ReviewWithClientName = {
  id: string;
  rating: number | null;
  comment: string | null;
  client_name: string | null;
};

export default function ReviewsList({ reviews }: { reviews: ReviewWithClientName[] }) {
  return (
    <section className="bg-white p-6 rounded-lg shadow-sm">
      <h3 className="text-2xl font-bold text-black mb-4">Reseñas de Clientes</h3>
      {reviews.length > 0 ? (
        <div className="space-y-6">
          {reviews.map((review) => (
            <div key={review.id} className="border-t border-gray-200 pt-4">
              <div className="flex items-center mb-1">
                <span className="font-semibold text-black">{review.client_name || 'Anónimo'}</span>
                <span className="ml-3 flex items-center">
                  <span className="text-yellow-400">★</span>
                  <span className="ml-1 font-bold text-black">{review.rating}</span>
                </span>
              </div>
              <p className="text-gray-700">{review.comment}</p>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-gray-600">Este profesional aún no tiene reseñas.</p>
      )}
    </section>
  );
}
