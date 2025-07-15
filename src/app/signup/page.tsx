// src/app/signup/page.tsx
'use client'

import { useState } from 'react'
import { supabase } from '@/lib/supabaseClient'
import Link from 'next/link';
import Image from 'next/image';
import Button from '@/components/Button';

export default function SignupPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState(''); // <-- Nuevo estado para confirmar contraseña
  const [fullName, setFullName] = useState('');
  const [accountType, setAccountType] = useState('client'); // <-- Nuevo estado para el tipo de cuenta
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  const [passwordVisible, setPasswordVisible] = useState(false); // <-- Estado para visibilidad
  const [confirmPasswordVisible, setConfirmPasswordVisible] = useState(false); // <-- Estado para visibilidad

  const handleSignUp = async (event: React.FormEvent) => {
    event.preventDefault();
    
    // --- NUEVAS VALIDACIONES DE CONTRASEÑA ---
    if (password.length < 8) {
      setError('La contraseña debe tener al menos 8 caracteres.');
      return;
    }
    if (password !== confirmPassword) {
      setError('Las contraseñas no coinciden.');
      return;
    }
    // --- FIN DE VALIDACIONES ---

    setLoading(true);
    setError('');
    setSuccessMessage('');

    try {
      const { data, error: signUpError } = await supabase.auth.signUp({
        email: email,
        password: password,
        options: {
          data: {
            // Pasamos los datos adicionales que se guardarán en la tabla de perfiles
            full_name: fullName,
            role: accountType, // <-- GUARDAMOS EL ROL SELECCIONADO
          }
        }
      });

      if (signUpError) throw signUpError;
      
      setSuccessMessage('¡Registro exitoso! Revisa tu email para confirmar tu cuenta.');

    } catch (error: any) {
      if (error.message.includes('unique constraint')) {
        setError('Ya existe una cuenta con este correo electrónico.');
      } else {
        setError('Ocurrió un error al crear la cuenta.');
      }
    } finally {
      setLoading(false);
    }
  };

  if (successMessage) {
    return (
      <div className="min-h-screen bg-gray-50 flex justify-center items-center p-4">
        <div className="max-w-md w-full mx-auto text-center bg-white p-8 rounded-xl shadow-lg">
          <Image src="/images/icons/check-circle.svg" alt="Éxito" width={60} height={60} className="mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-green-600">¡Éxito!</h2>
          <p className="mt-2 text-gray-800">{successMessage}</p>
          <Link href="/login" className="text-red-600 hover:underline font-medium mt-6 inline-block">
            Ir a Iniciar Sesión
          </Link>
        </div>
      </div>
    );
  }
  
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center items-center p-4">
      <div className="max-w-md w-full mx-auto">
        <div className="bg-white p-8 rounded-xl shadow-lg">
          <div className="flex justify-center mb-6">
            <Image src="/images/jambo-logo.png" alt="Logo de Jambo" width={140} height={50} />
          </div>
          <h1 className="text-3xl font-bold text-center mb-2 text-gray-900">Crea tu Cuenta</h1>
          <p className="text-center text-gray-600 mb-8">Únete a la comunidad JAMBO</p>
          
          <form onSubmit={handleSignUp} className="space-y-4">
            {error && <p className="text-red-500 text-center mb-4 bg-red-100 p-3 rounded-lg">{error}</p>}
            
            {/* --- MEJORA 1: SELECTOR DE TIPO DE CUENTA --- */}
            <div>
              <label className="block mb-2 font-medium text-gray-700">¿Qué tipo de cuenta quieres crear?</label>
              <div className="grid grid-cols-2 gap-4">
                <button
                  type="button"
                  onClick={() => setAccountType('client')}
                  className={`p-4 border-2 rounded-lg text-center transition-all ${accountType === 'client' ? 'border-red-600 bg-red-50 ring-2 ring-red-200' : 'border-gray-300 hover:border-gray-400'}`}
                >
                  <span className="text-3xl" role="img" aria-label="Cliente">👤</span>
                  <span className="block font-semibold mt-1 text-gray-800">Soy Cliente</span>
                  <p className="text-xs text-gray-500">Quiero contratar servicios.</p>
                </button>
                <button
                  type="button"
                  onClick={() => setAccountType('professional')}
                  className={`p-4 border-2 rounded-lg text-center transition-all ${accountType === 'professional' ? 'border-red-600 bg-red-50 ring-2 ring-red-200' : 'border-gray-300 hover:border-gray-400'}`}
                >
                  <span className="text-3xl" role="img" aria-label="Profesional">🛠️</span>
                  <span className="block font-semibold mt-1 text-gray-800">Soy Profesional</span>
                  <p className="text-xs text-gray-500">Quiero ofrecer servicios.</p>
                </button>
              </div>
            </div>

            <div>
              <label htmlFor="fullName" className="block mb-1 font-medium text-gray-700">Nombre Completo</label>
              <input id="fullName" type="text" required value={fullName} onChange={(e) => setFullName(e.target.value)} className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 text-gray-900" disabled={loading} />
            </div>
            
            <div>
              <label htmlFor="email" className="block mb-1 font-medium text-gray-700">Email</label>
              <input id="email" type="email" required value={email} onChange={(e) => setEmail(e.target.value)} className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 text-gray-900" disabled={loading} />
            </div>
            
            {/* --- MEJORA 2: MEJORAS DE CONTRASEÑA --- */}
            <div className="relative">
              <label htmlFor="password" className="block mb-1 font-medium text-gray-700">Contraseña (mín. 8 caracteres)</label>
              <input id="password" required value={password} type={passwordVisible ? 'text' : 'password'} onChange={(e) => setPassword(e.target.value)} className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 text-gray-900" disabled={loading} />
              <button type="button" onClick={() => setPasswordVisible(!passwordVisible)} className="absolute inset-y-0 right-0 top-7 pr-3 flex items-center text-gray-500 hover:text-gray-700">
                {/* SVG del ojo aquí */}
              </button>
            </div>

            <div className="relative">
              <label htmlFor="confirmPassword" className="block mb-1 font-medium text-gray-700">Confirmar Contraseña</label>
              <input id="confirmPassword" required value={confirmPassword} type={confirmPasswordVisible ? 'text' : 'password'} onChange={(e) => setConfirmPassword(e.target.value)} className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 text-gray-900" disabled={loading} />
              <button type="button" onClick={() => setConfirmPasswordVisible(!confirmPasswordVisible)} className="absolute inset-y-0 right-0 top-7 pr-3 flex items-center text-gray-500 hover:text-gray-700">
                {/* SVG del ojo aquí */}
              </button>
            </div>

            <div className="pt-4">
                <Button type="submit" variant="primary" className="w-full" disabled={loading}>
                {loading ? 'Creando cuenta...' : 'Crear Cuenta'}
                </Button>
            </div>
          </form>
        </div>
        <p className="text-center mt-6 text-gray-600">
          ¿Ya tienes una cuenta? <Link href="/login" className="text-red-600 hover:underline font-medium">Inicia Sesión</Link>
        </p>
      </div>
    </div>
  );
}