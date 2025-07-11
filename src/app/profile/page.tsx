// src/app/profile/page.tsx
'use client'

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { supabase } from '@/lib/supabaseClient';
import type { User } from '@supabase/supabase-js';
import Button from '@/components/Button';

export default function ProfilePage() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [fullName, setFullName] = useState('');
  const [specialty, setSpecialty] = useState('');
  const [bio, setBio] = useState('');
  const [locationSaved, setLocationSaved] = useState(false);
  
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [galleryImages, setGalleryImages] = useState<{ name: string, url: string }[]>([]);

  const router = useRouter();

  const fetchGalleryImages = useCallback(async (userId: string) => {
    if (!userId) return;
    const { data: files, error } = await supabase.storage.from('work-gallery').list(userId, { limit: 100, sortBy: { column: 'created_at', order: 'desc' } });
    if (error) {
      console.error('Error cargando galería:', error);
      return;
    }
    if (files) {
      const urls = files.map(file => ({
        name: file.name,
        url: supabase.storage.from('work-gallery').getPublicUrl(`${userId}/${file.name}`).data.publicUrl
      }));
      setGalleryImages(urls);
    }
  }, []);

  useEffect(() => {
    const fetchUserData = async () => {
      setLoading(true);
      const { data: { session } } = await supabase.auth.getSession();
      if (session) {
        setUser(session.user);
        const { data: profileData } = await supabase.from('profiles').select('*').eq('id', session.user.id).single();
        if (profileData) {
          setFullName(profileData.full_name || '');
          setSpecialty(profileData.specialty || '');
          setBio(profileData.bio || '');
          setLocationSaved(!!profileData.location);
        }
        await fetchGalleryImages(session.user.id);
      } else {
        router.push('/login');
      }
      setLoading(false);
    };
    fetchUserData();
  }, [router, fetchGalleryImages]);

  const handleUpdateProfile = async (event: React.FormEvent) => {
    event.preventDefault();
    setLoading(true);
    if (!user) return;
    try {
      const { error } = await supabase.from('profiles').update({ full_name: fullName, specialty: specialty, bio: bio }).eq('id', user.id);
      if (error) throw error;
      alert('¡Perfil actualizado con éxito!');
    } catch (error: any) {
      alert('Error al actualizar el perfil: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleImageUpload = async () => {
    if (!selectedFile || !user) return alert('Por favor, selecciona un archivo.');
    setUploading(true);
    const filePath = `${user.id}/${Date.now()}_${selectedFile.name}`;
    try {
      const { error } = await supabase.storage.from('work-gallery').upload(filePath, selectedFile);
      if (error) throw error;
      alert('¡Imagen subida con éxito!');
      const fileInput = document.getElementById('workImage') as HTMLInputElement;
      if (fileInput) fileInput.value = '';
      setSelectedFile(null);
      await fetchGalleryImages(user.id);
    } catch (error: any) {
      alert('Error al subir la imagen: ' + error.message);
    } finally {
      setUploading(false);
    }
  };

  const handleImageDelete = async (imageName: string) => {
    if (!user || !window.confirm('¿Estás seguro de que quieres borrar esta imagen?')) return;
    const filePath = `${user.id}/${imageName}`;
    try {
      const { error } = await supabase.storage.from('work-gallery').remove([filePath]);
      if (error) throw error;
      alert('Imagen borrada con éxito.');
      await fetchGalleryImages(user.id);
    } catch (error: any) {
      alert('Error al borrar la imagen: ' + error.message);
    }
  };

  const handleSetLocation = () => {
    if (!navigator.geolocation) return alert('Tu navegador no soporta la geolocalización.');
    setLoading(true);
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;
        const locationString = `POINT(${longitude} ${latitude})`;
        if (user) {
          try {
            const { error } = await supabase.from('profiles').update({ location: locationString }).eq('id', user.id);
            if (error) throw error;
            alert('¡Ubicación guardada con éxito!');
            setLocationSaved(true);
          } catch (err: any) {
            alert('Error al guardar la ubicación: ' + err.message);
          } finally {
            setLoading(false);
          }
        }
      },
      (error) => {
        alert('No se pudo obtener la ubicación: ' + error.message);
        setLoading(false);
      }
    );
  };

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    router.push('/');
  };

  if (loading && !user) return <p className="text-center mt-12">Cargando...</p>;
  
  return (
    <div className="min-h-screen bg-gray-100 p-4 sm:p-8">
      <div className="max-w-4xl mx-auto space-y-8">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold text-black">Mi Panel de Control</h1>
          <Button variant="danger" onClick={handleSignOut} disabled={loading || uploading}>
            Cerrar Sesión
          </Button>
        </div>

        <section className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-2xl font-semibold mb-4 text-black">Datos del Perfil</h2>
          <form onSubmit={handleUpdateProfile} className="space-y-4">
            <div>
              <label className="block mb-1 font-medium text-black">Email</label>
              <input type="text" value={user?.email} disabled className="w-full p-3 bg-gray-200 border border-gray-300 rounded-lg" />
            </div>
            <div>
              <label htmlFor="fullName" className="block mb-1 font-medium text-black">Nombre Completo</label>
              <input id="fullName" type="text" value={fullName} onChange={(e) => setFullName(e.target.value)} className="w-full p-3 border border-gray-300 rounded-lg" />
            </div>
            <div>
              <label htmlFor="specialty" className="block mb-1 font-medium text-black">Especialidad</label>
              <input id="specialty" type="text" value={specialty} onChange={(e) => setSpecialty(e.target.value)} className="w-full p-3 border border-gray-300 rounded-lg" />
            </div>
            <div>
              <label htmlFor="bio" className="block mb-1 font-medium text-black">Biografía Corta</label>
              <textarea id="bio" value={bio} onChange={(e) => setBio(e.target.value)} className="w-full p-3 border border-gray-300 rounded-lg min-h-[120px]" />
            </div>
            <Button type="submit" variant="primary" className="w-full sm:w-auto" disabled={loading || uploading}>
              {loading ? 'Actualizando...' : 'Guardar Cambios del Perfil'}
            </Button>
          </form>
        </section>

        <section className="bg-white p-6 rounded-lg shadow-md">
           <h2 className="text-2xl font-semibold mb-4 text-black">Ubicación y Agenda</h2>
           <p className="mb-2 text-black">
              {locationSaved ? '✅ Tu ubicación está guardada.' : '❌ Aún no has guardado tu ubicación.'}
            </p>
           <div className="flex flex-wrap gap-4">
              <Button onClick={handleSetLocation} disabled={loading} className="bg-green-600 hover:bg-green-700 focus:ring-green-500 text-white">
                {loading ? 'Obteniendo...' : 'Establecer mi Ubicación'}
              </Button>
              <Link href="/profile/agenda" className="inline-block">
                <Button variant="secondary">
                  Gestionar mi Agenda
                </Button>
              </Link>
           </div>
        </section>

        <section className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-2xl font-semibold mb-4 text-black">Galería de Trabajos</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 mb-4">
            {galleryImages.map(image => (
              <div key={image.name} className="relative group">
                <img src={image.url} alt="Trabajo realizado" className="w-full h-32 object-cover rounded-lg" />
                <button onClick={() => handleImageDelete(image.name)} className="absolute top-1 right-1 bg-black bg-opacity-50 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" /></svg>
                </button>
              </div>
            ))}
          </div>
          {galleryImages.length === 0 && <p className="text-gray-500">Aún no has subido imágenes.</p>}
          
          <div>
            <label htmlFor="workImage" className="block mb-1 font-medium text-black">Añadir nueva imagen:</label>
            <input id="workImage" type="file" accept="image/*" onChange={(e) => e.target.files && setSelectedFile(e.target.files[0])} disabled={uploading} className="block file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-red-50 file:text-red-700 hover:file:bg-red-100" />
            <Button type="button" onClick={handleImageUpload} disabled={uploading || !selectedFile} className="mt-2 bg-purple-600 hover:bg-purple-700 focus:ring-purple-500 text-white">
              {uploading ? 'Subiendo...' : 'Subir Imagen'}
            </Button>
          </div>
        </section>
      </div>
    </div>
  )
}