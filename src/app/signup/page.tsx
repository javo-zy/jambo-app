// src/app/signup/page.tsx
'use client'

import { useState } from 'react'
import { supabase } from '@/lib/supabaseClient'
import Link from 'next/link';
import Button from '@/components/Button';

export default function SignupPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [fullName, setFullName] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  const handleSignUp = async (event: React.FormEvent) => {
    event.preventDefault();
    setLoading(true);
    setError('');
    setSuccessMessage('');

    try {
      const { data, error: signUpError } = await supabase.auth.signUp({
        email: email,
        password: password,
        options: {
          data: {
            full_name: fullName
          }
        }
      });

      if (signUpError) throw signUpError;
      
      setSuccessMessage('¡Registro exitoso! Revisa tu email para confirmar tu cuenta.');

    } catch (error: any) {
      setError('Ocurrió un error: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  if (successMessage) {
    return (
      <div className="min-h-screen bg-gray-50 flex justify-center items-center">
        <div className="max-w-md w-full mx-auto text-center bg-white p-8 rounded-lg shadow-md">
          <h2 className="text-2xl font-bold text-green-600">¡Éxito!</h2>
          <p className="mt-2 text-black">{successMessage}</p>
          <Link href="/login" className="text-red-600 hover:underline font-medium mt-4 inline-block">
            Ir a Iniciar Sesión
          </Link>
        </div>
      </div>
    );
  }
  
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center items-center">
      <div className="max-w-md w-full mx-auto">
        <div className="bg-white p-8 rounded-lg shadow-md">
          <h1 className="text-3xl font-bold text-center mb-2 text-black">Crea tu Cuenta</h1>
          <p className="text-center text-gray-600 mb-6">Únete a la comunidad JAMBO</p>
          
          <form onSubmit={handleSignUp}>
            {error && <p className="text-red-500 text-center mb-4">{error}</p>}
            
            <div className="mb-4">
              <label htmlFor="fullName" className="block mb-1 font-medium text-black">Nombre Completo</label>
              <input id="fullName" type="text" required value={fullName} onChange={(e) => setFullName(e.target.value)} className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500" disabled={loading}/>
            </div>
            
            <div className="mb-4">
              <label htmlFor="email" className="block mb-1 font-medium text-black">Email</label>
              <input id="email" type="email" required value={email} onChange={(e) => setEmail(e.target.value)} className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500" disabled={loading}/>
            </div>
            
            <div className="mb-6">
              <label htmlFor="password" className="block mb-1 font-medium text-black">Contraseña</label>
              <input id="password" type="password" required value={password} onChange={(e) => setPassword(e.target.value)} className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500" disabled={loading}/>
            </div>

            <Button type="submit" variant="primary" className="w-full" disabled={loading}>
              {loading ? 'Registrando...' : 'Crear Cuenta'}
            </Button>
          </form>
        </div>
        <p className="text-center mt-4 text-black">
          ¿Ya tienes una cuenta? <Link href="/login" className="text-red-600 hover:underline font-medium">Inicia Sesión</Link>
        </p>
      </div>
    </div>
  );
}