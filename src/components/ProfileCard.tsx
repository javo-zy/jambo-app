// src/components/ProfileCard.tsx
import Link from 'next/link';
// Importamos el componente que acabamos de mejorar
import RatingSummary from './RatingSummary'; 

// --- NUEVO COMPONENTE INTERNO para renderizar las estrellas visualmente ---
const StarRating = ({ rating }: { rating: number }) => {
  const totalStars = 5;
  const fullStars = Math.round(rating); // Redondeamos para obtener estrellas completas

  return (
    <div className="flex items-center">
      {[...Array(totalStars)].map((_, index) => {
        const starNumber = index + 1;
        return (
          <span key={starNumber} className={starNumber <= fullStars ? 'text-amber-500' : 'text-gray-300'}>
            ★
          </span>
        );
      })}
    </div>
  );
};


// --- TIPO DE DATOS ACTUALIZADO: Ahora incluye la información de la calificación ---
type Profile = {
  id: string;
  full_name: string | null;
  specialty: string | null;
  avatar_url: string | null;
  // Nuevas props para la calificación dinámica
  average_rating: number;
  total_reviews: number;
};

export default function ProfileCard({ profile }: { profile: Profile }) {
  return (
    <Link href={`/professionals/${profile.id}`} className="block group">
      {/* Clases de transición mejoradas para un efecto más suave */}
      <div className="bg-white p-4 border border-gray-200 rounded-lg shadow-sm group-hover:shadow-lg group-hover:border-red-500 transition-all duration-300 h-full flex flex-col">
        <div className="flex items-center space-x-4">
          
          {/* Foto del profesional (sin cambios) */}
          <div className="flex-shrink-0">
            <div className="w-20 h-20 rounded-full bg-gray-200 flex items-center justify-center overflow-hidden border">
              {profile.avatar_url ? (
                <img src={profile.avatar_url} alt={profile.full_name || 'Avatar'} className="w-full h-full object-cover" />
              ) : (
                <span className="text-3xl text-gray-500">
                  {profile.full_name ? profile.full_name.charAt(0) : '?'}
                </span>
              )}
            </div>
          </div>

          {/* Información del profesional */}
          <div className="flex-grow">
            <h2 className="text-xl font-bold text-gray-900 truncate">{profile.full_name || 'Sin nombre'}</h2>
            <p className="text-md text-gray-700">{profile.specialty || 'Sin especialidad'}</p>
            
            {/* --- SECCIÓN DE CALIFICACIÓN DINÁMICA --- */}
            <div className="flex items-center gap-2 mt-2">
              {/* Si hay reseñas, mostramos las estrellas y el resumen */}
              {profile.total_reviews > 0 ? (
                <>
                  <StarRating rating={profile.average_rating} />
                  {/* Usamos el componente RatingSummary con un tamaño de texto más pequeño */}
                  <span className="text-xs text-gray-500">
                    ({profile.total_reviews})
                  </span>
                </>
              ) : (
                <p className="text-sm text-gray-500">Sin reseñas todavía</p>
              )}
            </div>
          </div>

          {/* Icono de flecha (sin cambios) */}
          <div className="flex-shrink-0 self-center text-gray-400 group-hover:text-red-600 transition-colors">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </div>

        </div>
      </div>
    </Link>
  );
}