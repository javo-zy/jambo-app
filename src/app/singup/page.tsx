// src/app/signup/page.tsx

'use client'

import { useState } from 'react'
import { supabase } from '@/lib/supabaseClient'

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
      // Ahora, en el registro, pasamos el nombre completo en las 'options'
      // El trigger en la base de datos lo leerá desde aquí
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
      
      // Ya no necesitamos insertar el perfil manualmente, el trigger lo hace por nosotros.
      
      setSuccessMessage('¡Registro exitoso! Revisa tu email para confirmar tu cuenta.');

    } catch (error: any) {
      setError('Ocurrió un error: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  if (successMessage) {
    return (
      <div style={{ maxWidth: '400px', margin: '50px auto', padding: '20px', textAlign: 'center', border: '1px solid green', color: 'green' }}>
        <h2>¡Éxito!</h2>
        <p>{successMessage}</p>
      </div>
    );
  }
  
  return (
    <div style={{ maxWidth: '400px', margin: '50px auto' }}>
      <h1>Crear una cuenta de Profesional</h1>
      <form onSubmit={handleSignUp}>
        {error && <p style={{ color: 'red' }}>{error}</p>}
        
        <div style={{ marginBottom: '15px' }}>
          <label htmlFor="fullName">Nombre Completo</label>
          <input id="fullName" name="fullName" type="text" required value={fullName} onChange={(e) => setFullName(e.target.value)} style={{ width: '100%', padding: '8px', marginTop: '5px' }} disabled={loading}/>
        </div>
        
        <div style={{ marginBottom: '15px' }}>
          <label htmlFor="email">Email</label>
          <input id="email" name="email" type="email" required value={email} onChange={(e) => setEmail(e.target.value)} style={{ width: '100%', padding: '8px', marginTop: '5px' }} disabled={loading}/>
        </div>
        
        <div style={{ marginBottom: '15px' }}>
          <label htmlFor="password">Contraseña</label>
          <input id="password" name="password" type="password" required value={password} onChange={(e) => setPassword(e.target.value)} style={{ width: '100%', padding: '8px', marginTop: '5px' }} disabled={loading}/>
        </div>

        <button type="submit" style={{ width: '100%', padding: '10px', background: 'blue', color: 'white', border: 'none', cursor: 'pointer' }} disabled={loading}>
          {loading ? 'Registrando...' : 'Registrarse'}
        </button>
      </form>
    </div>
  );
}