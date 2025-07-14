// src/app/browse/page.tsx

'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabaseClient';
import ProfileCard from '@/components/ProfileCard';

// Definimos el tipo de dato para un perfil
type Profile = {
  id: string;
  full_name: string | null;
  specialty: string | null;
  avatar_url: string | null;
};

export default function BrowsePage() {
  const [allProfiles, setAllProfiles] = useState<Profile[]>([]);
  const [filteredProfiles, setFilteredProfiles] = useState<Profile[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getProfiles = async () => {
      setLoading(true);
      const { data: profiles, error } = await supabase
        .from('profiles')
        .select('id, full_name, specialty, avatar_url'); // Nos aseguramos de pedir el avatar

      if (error) {
        console.error('Error fetching profiles:', error);
      } else if (profiles) {
        setAllProfiles(profiles);
        setFilteredProfiles(profiles);
      }
      setLoading(false);
    };

    getProfiles();
  }, []);

  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    const term = event.target.value;
    setSearchTerm(term);

    if (term === '') {
      setFilteredProfiles(allProfiles);
    } else {
      const filtered = allProfiles.filter(profile =>
        profile.specialty && profile.specialty.toLowerCase().includes(term.toLowerCase())
      );
      setFilteredProfiles(filtered);
    }
  };

  return (
    <div className="bg-gray-50 min-h-screen">
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-extrabold text-gray-900">Busca un Profesional</h1>
          <p className="mt-2 text-lg text-gray-600">Encuentra la ayuda experta que necesitas para tu próximo proyecto.</p>
        </div>

        <div className="mb-10 sticky top-20 z-10 bg-black-50 py-4">
          <input
            type="text"
            placeholder="Filtra por especialidad (ej. Plomero, Electricista...)"
            value={searchTerm}
            onChange={handleSearch}
            className="w-full p-4 text-lg border-2 border-gray-300 rounded-full shadow-sm focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-colors text-gray-900 placeholder:text-gray-500"
          />
        </div>

        {/* Contenedor de Resultados */}
        <div className="space-y-6">
          {loading ? (
            <p className="text-center text-gray-500">Cargando profesionales...</p>
          ) : filteredProfiles.length > 0 ? (
            filteredProfiles.map((profile) => (
              <ProfileCard key={profile.id} profile={profile} />
            ))
          ) : (
            <div className="text-center bg-white p-8 rounded-lg shadow-md">
              <h3 className="text-xl font-semibold text-gray-800">No se encontraron resultados</h3>
              <p className="text-gray-500 mt-2">Intenta con otra búsqueda o revisa la lista completa.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
