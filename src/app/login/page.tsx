// src/app/login/page.tsx
'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'; // Importamos Link para la navegación
import { supabase } from '@/lib/supabaseClient'
import Button from '@/components/Button';

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('');
  const router = useRouter()

  const handleSignIn = async (event: React.FormEvent) => {
    event.preventDefault()
    setLoading(true)
    setError('');

    try {
      const { error } = await supabase.auth.signInWithPassword({
        email: email,
        password: password,
      });
      if (error) throw error;
      router.push('/profile');
    } catch (error: any) {
      setError('Credenciales inválidas. Por favor, inténtalo de nuevo.');
    } finally {
      setLoading(false)
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center items-center">
      <div className="max-w-md w-full mx-auto">
        <div className="bg-white p-8 rounded-lg shadow-md">
          <h1 className="text-3xl font-bold text-center mb-2 text-black">Bienvenido de Nuevo</h1>
          <p className="text-center text-gray-600 mb-6">Inicia sesión para continuar en JAMBO</p>
          <form onSubmit={handleSignIn}>
            {error && <p className="text-red-500 text-center mb-4">{error}</p>}
            
            <div className="mb-4">
              <label htmlFor="email" className="block mb-1 font-medium text-black">Email</label>
              <input 
                id="email" 
                type="email" 
                required 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500"
                disabled={loading}
              />
            </div>
            
            <div className="mb-6">
              <label htmlFor="password" className="block mb-1 font-medium text-black">Contraseña</label>
              <input 
                id="password" 
                type="password" 
                required 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500"
                disabled={loading}
              />
            </div>

            <Button type="submit" variant="primary" className="w-full" disabled={loading}>
              {loading ? 'Iniciando sesión...' : 'Iniciar Sesión'}
            </Button>
          </form>
        </div>
        <p className="text-center mt-4 text-black">
          ¿No tienes una cuenta? <Link href="/signup" className="text-red-600 hover:underline font-medium">Regístrate</Link>
        </p>
      </div>
    </div>
  );
}