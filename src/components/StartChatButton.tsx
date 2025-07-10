// src/components/StartChatButton.tsx
'use client'

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabaseClient';
import type { User } from '@supabase/supabase-js';

export default function StartChatButton({ professional_id }: { professional_id: string }) {
  const [user, setUser] = useState<User | null>(null);
  const router = useRouter();

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => setUser(data.user));
  }, []);

  const handleClick = async () => {
    if (!user) {
      // Si el usuario no ha iniciado sesión, lo mandamos al login
      router.push('/login');
      return;
    }

    if (user.id === professional_id) {
        alert("No puedes iniciar un chat contigo mismo.");
        return;
    }

    try {
      // Llamamos a nuestra función de la base de datos
      const { data, error } = await supabase.rpc('create_or_get_conversation', {
        user1_id: user.id,
        user2_id: professional_id
      });

      if (error) throw error;
      
      // Redirigimos al usuario a la página de chat con el ID de la conversación
      router.push(`/chat/${data}`);

    } catch (error: any) {
      alert('Error al iniciar el chat: ' + error.message);
    }
  };
  
  // No mostramos el botón si el visitante es el mismo profesional
  if (!user || user.id === professional_id) {
    return null;
  }

  return (
    <button onClick={handleClick} style={{ marginTop: '20px', padding: '10px 20px', fontSize: '1rem', cursor: 'pointer' }}>
      Contactar
    </button>
  );
}