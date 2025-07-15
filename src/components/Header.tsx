// src/components/Header.tsx
'use client'

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabaseClient';
import type { User } from '@supabase/supabase-js';
import Button from './Button';

type Profile = {
  avatar_url: string | null;
};

export default function Header() {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [isDropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  // useEffect para detectar cambios de sesión (login/logout) en tiempo real
  useEffect(() => {
    const { data: authListener } = supabase.auth.onAuthStateChange(async (event, session) => {
      const currentUser = session?.user ?? null;
      setUser(currentUser);
      
      if (currentUser) {
        // Si hay un usuario, obtenemos su perfil para la foto de avatar
        const { data: profileData } = await supabase
          .from('profiles')
          .select('avatar_url')
          .eq('id', currentUser.id)
          .single();
        setProfile(profileData);
      } else {
        setProfile(null);
      }
    });

    return () => {
      authListener.subscription.unsubscribe();
    };
  }, []);

  // useEffect para cerrar el menú desplegable si se hace clic fuera de él
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [dropdownRef]);


  const handleSignOut = async () => {
    await supabase.auth.signOut();
    setDropdownOpen(false);
    router.push('/'); // Redirigimos al inicio
  };

  return (
    <header className="bg-white shadow-sm sticky top-0 z-50">
      <nav className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-3">
          
          <div className="flex-shrink-0">
            <Link href="/" className="flex items-center gap-2">
              <Image src="/images/jambo-logo.png" alt="Jambo Logo" width={100} height={40} />
            </Link>
          </div>

          <div className="hidden md:flex items-center space-x-8">
            <Link href="/browse" className="text-gray-700 hover:text-red-600 font-medium transition-colors">
              Buscar Profesionales
            </Link>
          </div>

          {/* --- RENDERIZADO CONDICIONAL: Depende de si el usuario ha iniciado sesión --- */}
          <div className="flex items-center gap-2">
            {user ? (
              // --- VISTA PARA USUARIO AUTENTICADO ---
              <div className="relative" ref={dropdownRef}>
                <button onClick={() => setDropdownOpen(!isDropdownOpen)} className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center overflow-hidden border-2 border-transparent hover:border-red-500 transition">
                  {profile?.avatar_url ? (
                    <img src={profile.avatar_url} alt="Avatar" className="w-full h-full object-cover" />
                  ) : (
                    <span className="text-xl text-gray-500">{user.email ? user.email.charAt(0).toUpperCase() : '?'}</span>
                  )}
                </button>
                {/* Menú Desplegable */}
                {isDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-xl py-2 z-50 border">
                    <Link href="/profile" onClick={() => setDropdownOpen(false)} className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">Mi Panel</Link>
                    <button onClick={handleSignOut} className="w-full text-left block px-4 py-2 text-sm text-red-600 hover:bg-gray-100">
                      Cerrar Sesión
                    </button>
                  </div>
                )}
              </div>
            ) : (
              // --- VISTA PARA USUARIO NO AUTENTICADO ---
              <div className="flex items-center gap-2">
                <Link href="/login">
                  <Button variant="secondary" className="px-4 py-2 text-sm">
                    Iniciar Sesión
                  </Button>
                </Link>
                <Link href="/signup">
                  <Button variant="primary" className="px-4 py-2 text-sm hidden sm:block">
                    Regístrate
                  </Button>
                </Link>
              </div>
            )}
          </div>

        </div>
      </nav>
    </header>
  );
}