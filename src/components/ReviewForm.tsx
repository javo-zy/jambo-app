// src/components/ReviewForm.tsx
'use client'

import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabaseClient'
import type { User } from '@supabase/supabase-js'
import Button from './Button'; // Importamos nuestro botón

export default function ReviewForm({ professional_id }: { professional_id: string }) {
  const [user, setUser] = useState<User | null>(null)
  const [rating, setRating] = useState(0)
  const [comment, setComment] = useState('')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  useEffect(() => {
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
      
    } catch (err: any) {
      setError('Error al publicar la reseña: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <p className="text-gray-600">Cargando formulario...</p>
  }
  
  if (!user) {
    return (
      <div className="text-center">
        <p className="text-gray-700">Debes <a href="/login" className="text-red-600 hover:underline font-semibold">iniciar sesión</a> para dejar una reseña.</p>
      </div>
    );
  }

  if (success) {
    return <p className="text-green-600 font-semibold">{success}</p>
  }

  return (
    <form onSubmit={handleSubmit}>
      {error && <p className="text-red-500 mb-4">{error}</p>}
      
      <div className="mb-4">
        <label className="block mb-1 font-medium text-black">Calificación:</label>
        <div className="flex gap-1 text-3xl cursor-pointer">
          {[1, 2, 3, 4, 5].map(star => (
            <span key={star} onClick={() => !loading && setRating(star)} className={star <= rating ? 'text-yellow-400' : 'text-gray-300'}>
              ★
            </span>
          ))}
        </div>
      </div>
      
      <div className="mb-4">
        <label htmlFor="comment" className="block mb-1 font-medium text-black">Comentario (opcional):</label>
        <textarea
          id="comment"
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 text-gray-900 min-h-[100px]"
          disabled={loading}
        />
      </div>
      
      <Button type="submit" variant="primary" disabled={loading} className="w-full">
        {loading ? 'Publicando...' : 'Publicar Reseña'}
      </Button>
    </form>
  );
}
