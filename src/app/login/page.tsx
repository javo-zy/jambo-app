'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation' 
import { supabase } from '@/lib/supabaseClient'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const router = useRouter() 

  const handleSignIn = async (event: React.FormEvent) => {
    event.preventDefault()
    setLoading(true)

    try {
      const { error } = await supabase.auth.signInWithPassword({
        email: email,
        password: password,
      })

      if (error) {
        throw error
      }

      // Si el inicio de sesión es exitoso, redirige al usuario a su perfil
      router.push('/profile')

    } catch (error: any) {
      alert('Error al iniciar sesión: ' + error.message)
    } finally {
      setLoading(false)
    }
  };

  return (
    <div style={{ maxWidth: '400px', margin: '50px auto' }}>
      <h1>Iniciar Sesión</h1>
      <form onSubmit={handleSignIn}>
        <div style={{ marginBottom: '15px' }}>
          <label htmlFor="email">Email</label>
          <input 
            id="email" 
            name="email" 
            type="email" 
            required 
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            style={{ width: '100%', padding: '8px', marginTop: '5px' }} 
            disabled={loading}
          />
        </div>
        
        <div style={{ marginBottom: '15px' }}>
          <label htmlFor="password">Contraseña</label>
          <input 
            id="password" 
            name="password" 
            type="password" 
            required 
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            style={{ width: '100%', padding: '8px', marginTop: '5px' }}
            disabled={loading}
          />
        </div>

        <button type="submit" style={{ width: '100%', padding: '10px', background: 'green', color: 'white', border: 'none', cursor: 'pointer' }} disabled={loading}>
          {loading ? 'Iniciando sesión...' : 'Iniciar Sesión'}
        </button>
      </form>
    </div>
  );
}