// src/app/browse/page.tsx
'use client'

import { useState, useEffect, useCallback } from 'react';
import { useRouter, useSearchParams, usePathname } from 'next/navigation';
import { supabase } from '@/lib/supabaseClient';
import ProfileCard from '@/components/ProfileCard';

// --- TIPO DE DATO ACTUALIZADO: Debe coincidir con lo que devuelve nuestra nueva función SQL ---
type ProfileWithRating = {
  id: string;
  full_name: string | null;
  specialty: string | null;
  avatar_url: string | null;
  average_rating: number;  // <-- Nuevo campo
  total_reviews: number;   // <-- Nuevo campo
};

const ProfileCardSkeleton = () => (
  <div className="bg-white p-4 border border-gray-200 rounded-lg shadow-sm animate-pulse">
    {/* ... (el código del skeleton no cambia) ... */}
    <div className="flex items-center space-x-4">
      <div className="w-20 h-20 rounded-full bg-gray-300"></div>
      <div className="flex-grow space-y-3">
        <div className="h-4 bg-gray-300 rounded w-3/4"></div>
        <div className="h-3 bg-gray-300 rounded w-1/2"></div>
        <div className="h-3 bg-gray-300 rounded w-1/4"></div>
      </div>
    </div>
  </div>
);


export default function BrowsePage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const pathname = usePathname();
  
  const [searchTerm, setSearchTerm] = useState(searchParams.get('q') || '');
  const [profiles, setProfiles] = useState<ProfileWithRating[]>([]); // <-- Usamos el nuevo tipo
  const [loading, setLoading] = useState(true);

  // --- LÓGICA DE BÚSQUEDA ACTUALIZADA para llamar a la nueva función RPC ---
  const fetchProfiles = useCallback(async (query: string) => {
    setLoading(true);
    
    // Llamamos a nuestra nueva función de la base de datos
    const { data, error } = await supabase.rpc('search_professionals_with_ratings', {
      search_term: query
    });

    if (error) {
      console.error('Error fetching profiles:', error);
      setProfiles([]);
    } else if (data) {
      setProfiles(data);
    }
    
    setLoading(false);
  }, []);

  // El resto de los hooks (useEffect) no necesitan cambios
  useEffect(() => {
    const timerId = setTimeout(() => {
      const params = new URLSearchParams(searchParams);
      if (searchTerm) {
        params.set('q', searchTerm);
      } else {
        params.delete('q');
      }
      router.replace(`${pathname}?${params.toString()}`);
    }, 500);
    return () => clearTimeout(timerId);
  }, [searchTerm, pathname, router, searchParams]);

  useEffect(() => {
    const currentQuery = searchParams.get('q') || '';
    fetchProfiles(currentQuery);
  }, [searchParams, fetchProfiles]);

  return (
    <div className="bg-gray-50 min-h-screen">
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        {/* ... (la parte del buscador no cambia) ... */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-extrabold text-gray-900">Busca un Profesional</h1>
          <p className="mt-2 text-lg text-gray-600">Encuentra la ayuda experta que necesitas para tu próximo proyecto.</p>
        </div>
        <div className="mb-10 sticky top-20 z-10 bg-gray-50 py-4">
          <input
            type="text"
            placeholder="Filtra por especialidad (ej. Plomero, Electricista...)"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full p-4 text-lg border-2 border-gray-300 rounded-full shadow-sm focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-colors text-gray-900 placeholder:text-gray-500"
          />
        </div>

        <div>
          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {[...Array(4)].map((_, i) => <ProfileCardSkeleton key={i} />)}
            </div>
          ) : profiles.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {profiles.map((profile) => (
                // Pasamos los nuevos datos a la tarjeta de perfil
                <ProfileCard 
                  key={profile.id} 
                  profile={{
                    id: profile.id,
                    full_name: profile.full_name,
                    specialty: profile.specialty,
                    avatar_url: profile.avatar_url,
                    average_rating: Number(profile.average_rating), // Aseguramos que sea un número
                    total_reviews: profile.total_reviews
                  }} 
                />
              ))}
            </div>
          ) : (
            <div className="text-center bg-white p-8 rounded-lg shadow-md">
              <h3 className="text-xl font-semibold text-gray-800">No se encontraron resultados</h3>
              <p className="text-gray-500 mt-2">Intenta con otra búsqueda o verifica que la especialidad esté bien escrita.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}