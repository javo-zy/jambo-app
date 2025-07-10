// src/app/page.tsx

'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabaseClient';
import ProfileCard from '@/components/ProfileCard';

type Profile = {
  id: string;
  full_name: string | null;
  specialty: string | null;
  distance?: number; // Añadimos la distancia como un campo opcional
};

export default function HomePage() {
  const [profiles, setProfiles] = useState<Profile[]>([]);
  const [loading, setLoading] = useState(true);
  const [locationError, setLocationError] = useState('');

  useEffect(() => {
    const findNearbyProfessionals = (position: GeolocationPosition) => {
      const { latitude, longitude } = position.coords;

      // Llamamos a nuestra nueva función de la base de datos
      supabase
        .rpc('nearby_professionals', {
          client_lat: latitude,
          client_lon: longitude,
        })
        .then(({ data, error }) => {
          if (error) {
            console.error('Error fetching nearby professionals:', error);
            setLocationError('No se pudieron cargar los profesionales cercanos.');
          } else if (data) {
            setProfiles(data);
          }
          setLoading(false);
        });
    };

    const handleLocationError = () => {
      setLocationError('No se pudo obtener tu ubicación. Mostrando todos los profesionales.');
      // Como fallback, si el usuario niega el permiso, cargamos todos los perfiles
      supabase.from('profiles').select('*').then(({ data }) => {
        if (data) setProfiles(data);
        setLoading(false);
      });
    };

    if (navigator.geolocation) {
      // Pedimos la ubicación al navegador
      navigator.geolocation.getCurrentPosition(findNearbyProfessionals, handleLocationError);
    } else {
      handleLocationError(); // El navegador no soporta geolocalización
    }
  }, []);

  // Modificamos el ProfileCard para mostrar la distancia
  const ProfileCardWithDistance = ({ profile }: { profile: Profile }) => (
    <div style={{ position: 'relative' }}>
      <ProfileCard profile={profile} />
      {profile.distance && (
        <span style={{ position: 'absolute', top: '20px', right: '20px', background: 'rgba(0,0,0,0.7)', color: 'white', padding: '5px 10px', borderRadius: '12px', fontSize: '0.9rem' }}>
          {/* Convertimos metros a kilómetros */}
          Aprox. {(profile.distance / 1000).toFixed(1)} km
        </span>
      )}
    </div>
  );

  return (
    <div style={{ maxWidth: '800px', margin: '50px auto' }}>
      <h1 style={{ textAlign: 'center', marginBottom: '40px' }}>
        Profesionales Cercanos a Ti
      </h1>

      {loading && <p style={{ textAlign: 'center' }}>Obteniendo tu ubicación y buscando profesionales...</p>}
      
      {locationError && <p style={{ textAlign: 'center', color: 'orange' }}>{locationError}</p>}

      {!loading && (
        profiles.length > 0 ? (
          <div>
            {profiles.map((profile) => (
              <ProfileCardWithDistance key={profile.id} profile={profile} />
            ))}
          </div>
        ) : (
          <p style={{ textAlign: 'center' }}>No se encontraron profesionales registrados cerca de ti.</p>
        )
      )}
    </div>
  );
}