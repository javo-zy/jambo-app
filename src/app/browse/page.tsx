// src/app/page.tsx

'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabaseClient';
import ProfileCard from '@/components/ProfileCard';

type Profile = {
  id: string;
  full_name: string | null;
  specialty: string | null;
  avatar_url: string | null; // <-- Asegúrate de que este tipo incluya el avatar
};

export default function HomePage() {
  const [allProfiles, setAllProfiles] = useState<Profile[]>([]);
  const [filteredProfiles, setFilteredProfiles] = useState<Profile[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getProfiles = async () => {
      setLoading(true);
      // --- CAMBIO AQUÍ: Añadimos 'avatar_url' a la selección ---
      const { data: profiles, error } = await supabase
        .from('profiles')
        .select('id, full_name, specialty, avatar_url');

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
    <div className="max-w-3xl mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold text-gray-800 text-center mb-4">
        Encuentra Profesionales de Confianza
      </h1>
      <p className="text-center text-gray-600 mb-8">
        Busca por especialidad para encontrar la ayuda que necesitas.
      </p>

      <div className="mb-8">
        <input
          type="text"
          placeholder="Busca por especialidad (ej. Plomero, Electricista...)"
          value={searchTerm}
          onChange={handleSearch}
          className="w-full p-3 text-lg border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        />
      </div>

      {loading ? (
        <p className="text-center">Cargando profesionales...</p>
      ) : filteredProfiles.length > 0 ? (
        <div className="space-y-4">
          {filteredProfiles.map((profile) => (
            <ProfileCard key={profile.id} profile={profile} />
          ))}
        </div>
      ) : (
        <p className="text-center bg-gray-100 p-4 rounded-lg">
          No se encontraron profesionales para tu búsqueda.
        </p>
      )}
    </div>
  );
}