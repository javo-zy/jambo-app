'use client' 

import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabaseClient'
import type { User } from '@supabase/supabase-js'

// El componente recibe el ID del profesional como una "prop"
export default function ReviewForm({ professional_id }: { professional_id: string }) {
  const [user, setUser] = useState<User | null>(null)
  const [rating, setRating] = useState(0)
  const [comment, setComment] = useState('')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  useEffect(() => {
    // Al cargar el componente, revisamos si hay un usuario con sesión iniciada
    const checkUser = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      setUser(session?.user ?? null);
      setLoading(false);
    }
    checkUser();
  }, [])

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!user) {
      setError('Debes iniciar sesión para dejar una reseña.');
      return;
    }
    if (rating === 0) {
      setError('Por favor, selecciona una calificación de estrellas.');
      return;
    }

    setLoading(true);
    setError('');
    setSuccess('');

    try {
      const { error: insertError } = await supabase
        .from('reviews')
        .insert({
          professional_id: professional_id,
          client_id: user.id,
          rating: rating,
          comment: comment,
        });

      if (insertError) throw insertError;

      setSuccess('¡Gracias por tu reseña! Tu opinión ha sido publicada.');
      setRating(0);
      setComment('');
      // Podríamos llamar a una función para refrescar la lista de reseñas automáticamente
      
    } catch (err: any) {
      setError('Error al publicar la reseña: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <p>Cargando formulario...</p>
  }
  
  // Si el usuario no ha iniciado sesión, le mostramos un mensaje.
  if (!user) {
    return (
      <div style={{ padding: '20px', border: '1px solid #ddd', borderRadius: '8px', textAlign: 'center' }}>
        <p>Debes <a href="/login" style={{ color: 'blue', textDecoration: 'underline' }}>iniciar sesión</a> para dejar una reseña.</p>
      </div>
    );
  }

  // Si el usuario ya ha enviado la reseña, muestra el mensaje de éxito.
  if (success) {
    return <p style={{ color: 'green' }}>{success}</p>
  }

  // Si el usuario ha iniciado sesión, le mostramos el formulario.
  return (
    <form onSubmit={handleSubmit} style={{ padding: '20px', border: '1px solid #ddd', borderRadius: '8px' }}>
      <h4>Deja tu Calificación</h4>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      
      <div style={{ marginBottom: '15px' }}>
        <label>Calificación:</label>
        {/* Un simple sistema de 5 estrellas con botones */}
        <div style={{ display: 'flex', gap: '5px', fontSize: '2rem', cursor: 'pointer' }}>
          {[1, 2, 3, 4, 5].map(star => (
            <span key={star} onClick={() => setRating(star)} style={{ color: star <= rating ? '#f59e0b' : '#ccc' }}>
              ★
            </span>
          ))}
        </div>
      </div>
      
      <div style={{ marginBottom: '15px' }}>
        <label htmlFor="comment">Comentario (opcional):</label>
        <textarea
          id="comment"
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          style={{ width: '100%', minHeight: '80px', padding: '8px', marginTop: '5px' }}
          disabled={loading}
        />
      </div>
      
      <button type="submit" disabled={loading} style={{ padding: '10px 15px', background: 'blue', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer' }}>
        {loading ? 'Publicando...' : 'Publicar Reseña'}
      </button>
    </form>
  );
}