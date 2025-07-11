// src/components/ProfileCard.tsx
import Link from 'next/link';

// Definimos los 'tipos' de datos que necesita la tarjeta
type Profile = {
  id: string;
  full_name: string | null;
  specialty: string | null;
  avatar_url: string | null; // Añadimos el avatar para la foto
};

export default function ProfileCard({ profile }: { profile: Profile }) {
  return (
    // Toda la tarjeta es un enlace que lleva al perfil detallado
    <Link href={`/professionals/${profile.id}`} className="block mb-4 group">
      <div className="bg-white p-4 border border-gray-200 rounded-lg shadow-sm group-hover:shadow-md group-hover:border-blue-500 transition-all duration-300">
        <div className="flex items-center space-x-4">
          
          {/* Foto del profesional */}
          <div className="flex-shrink-0">
            <div className="w-20 h-20 rounded-full bg-gray-200 flex items-center justify-center overflow-hidden">
              {/* Si hay avatar lo muestra, si no, muestra iniciales */}
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
            <h2 className="text-xl font-bold text-gray-900">{profile.full_name || 'Sin nombre'}</h2>
            <p className="text-md text-gray-700">{profile.specialty || 'Sin especialidad'}</p>
            
            {/* Placeholder para las estrellas (aún no funcional) */}
            <div className="flex items-center mt-1">
              <span className="text-yellow-400">★★★★</span><span className="text-gray-300">☆</span>
              <span className="text-sm text-gray-500 ml-2">(12 reseñas)</span>
            </div>
          </div>

          {/* Icono de flecha para indicar que es clickeable */}
          <div className="flex-shrink-0 text-gray-400 group-hover:text-blue-600 transition-colors">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </div>

        </div>
      </div>
    </Link>
  );
}