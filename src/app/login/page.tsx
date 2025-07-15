// src/app/login/page.tsx
'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link';
import Image from 'next/image';
import { supabase } from '@/lib/supabaseClient'
import Button from '@/components/Button';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [passwordVisible, setPasswordVisible] = useState(false);
  const router = useRouter();

  const handleSignIn = async (event: React.FormEvent) => {
    event.preventDefault();
    setLoading(true);
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
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center items-center p-4">
      <div className="max-w-md w-full mx-auto">
        <div className="bg-white p-8 rounded-xl shadow-lg">
          
          <div className="flex justify-center mb-6">
            <Image src="/images/jambo-logo.png" alt="Logo de Jambo" width={120} height={40} />
          </div>

          <h1 className="text-3xl font-bold text-center mb-2 text-gray-900">Bienvenido de Nuevo</h1>
          <p className="text-center text-gray-600 mb-6">Inicia sesión para continuar en JAMBO</p>
          
          <form onSubmit={handleSignIn} className="space-y-6">
            {error && <p className="text-red-500 text-center mb-4 bg-red-100 p-3 rounded-lg">{error}</p>}
            
            <div>
              <label htmlFor="email" className="block mb-1 font-medium text-gray-700">Email</label>
              <input 
                id="email" type="email" required value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 text-gray-900"
                disabled={loading}
              />
            </div>
            
            <div className="relative">
              <label htmlFor="password" className="block mb-1 font-medium text-gray-700">Contraseña</label>
              <input 
                id="password" required value={password}
                type={passwordVisible ? 'text' : 'password'}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 text-gray-900"
                disabled={loading}
              />
              <button 
                type="button" 
                onClick={() => setPasswordVisible(!passwordVisible)}
                className="absolute inset-y-0 right-0 top-7 pr-3 flex items-center text-gray-500 hover:text-gray-700"
                aria-label={passwordVisible ? "Ocultar contraseña" : "Mostrar contraseña"}
              >
                {passwordVisible ? (
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path d="M10 12a2 2 0 100-4 2 2 0 000 4z" /><path fillRule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.022 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clipRule="evenodd" /></svg>
                ) : (
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path d="M10 12a2 2 0 100-4 2 2 0 000 4z" /><path fillRule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.022 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clipRule="evenodd" /></svg>
                )}
              </button>
            </div>

            <Button type="submit" variant="primary" className="w-full" disabled={loading}>
              {loading ? 'Iniciando sesión...' : 'Iniciar Sesión'}
            </Button>
          </form>
        </div>
        <p className="text-center mt-6 text-gray-600">
          ¿No tienes una cuenta? <Link href="/signup" className="text-red-600 hover:underline font-medium">Regístrate</Link>
        </p>
      </div>
    </div>
  );
}