// src/components/ProfileCard.tsx

import Link from 'next/link';

// Definimos los 'tipos' de datos que espera nuestro componente.
// Esto es una buena práctica de TypeScript.
type Profile = {
  id: string;
  full_name: string | null;
  specialty: string | null;
  // Podríamos añadir más campos aquí en el futuro, como avatar_url
};

// El componente recibe un 'profile' como una "prop" o propiedad.
export default function ProfileCard({ profile }: { profile: Profile }) {
  const cardStyle = {
    border: '1px solid #ddd',
    borderRadius: '8px',
    padding: '20px',
    marginBottom: '15px',
    boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
    textDecoration: 'none',
    color: 'inherit',
    display: 'block'
  };

  return (
    // Envolvemos la tarjeta en un componente <Link> de Next.js.
    // Esto la hace un enlace clickeable que nos llevará a la página de detalle del profesional.
    // Esta página aún no existe, pero ya estamos preparando el camino.
    <Link href={`/professionals/${profile.id}`} style={cardStyle}>
      <h2 style={{ margin: '0 0 10px 0' }}>{profile.full_name || 'Profesional sin nombre'}</h2>
      <p style={{ margin: 0, padding: '5px 10px', background: '#e0e0e0', borderRadius: '15px', display: 'inline-block' }}>
        {profile.specialty || 'Sin especialidad'}
      </p>
    </Link>
  );
}