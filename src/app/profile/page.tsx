// src/app/profile/page.tsx

'use client'

import Link from 'next/link';
import { useState, useEffect, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabaseClient'
import type { User } from '@supabase/supabase-js'

export default function ProfilePage() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [fullName, setFullName] = useState('');
  const [specialty, setSpecialty] = useState('');
  const [bio, setBio] = useState('');
  const router = useRouter();
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [galleryImages, setGalleryImages] = useState<{ name: string, url: string }[]>([]);
  const [locationSaved, setLocationSaved] = useState(false);

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

  if (loading && !user) return <p style={{ textAlign: 'center', marginTop: '50px' }}>Cargando...</p>;

  return (
    <div style={{ maxWidth: '600px', margin: '50px auto' }}>
      <h1>Tu Perfil Profesional</h1>
      <div style={{ marginBottom: '20px' }}>
        <Link href="/profile/agenda" style={{ textDecoration: 'none', padding: '10px 15px', background: '#28a745', color: 'white', borderRadius: '5px' }}>
          Gestionar mi Agenda
        </Link>
      </div>
      <form onSubmit={handleUpdateProfile}>
        <div style={{ marginBottom: '15px' }}>
          <label>Email</label>
          <input type="text" value={user?.email} disabled style={{ width: '100%', padding: '8px', background: '#eee' }} />
        </div>
        <div style={{ marginBottom: '15px' }}>
          <label htmlFor="fullName">Nombre Completo</label>
          <input id="fullName" type="text" value={fullName} onChange={(e) => setFullName(e.target.value)} style={{ width: '100%', padding: '8px' }} />
        </div>
        <div style={{ marginBottom: '15px' }}>
          <label htmlFor="specialty">Especialidad (ej. Plomero, Electricista)</label>
          <input id="specialty" type="text" value={specialty} onChange={(e) => setSpecialty(e.target.value)} style={{ width: '100%', padding: '8px' }} />
        </div>
        <div style={{ marginBottom: '15px' }}>
          <label htmlFor="bio">Biografía Corta</label>
          <textarea id="bio" value={bio} onChange={(e) => setBio(e.target.value)} style={{ width: '100%', padding: '8px', minHeight: '100px' }} />
        </div>
        <button type="submit" disabled={loading || uploading} style={{ width: '100%', padding: '10px', background: 'blue', color: 'white', border: 'none', cursor: 'pointer' }}>
          {loading ? 'Actualizando...' : 'Actualizar Perfil'}
        </button>
      </form>

      <hr style={{ margin: '20px 0' }} />
      <h3 style={{ fontSize: '1.25rem' }}>Tu Ubicación de Trabajo</h3>
      <div style={{ padding: '15px', background: '#f0f0f0', borderRadius: '8px' }}>
        <p style={{ margin: '0 0 10px 0' }}>
          {locationSaved ? '✅ Tu ubicación está guardada.' : '❌ Aún no has guardado tu ubicación.'}
        </p>
        <button onClick={handleSetLocation} disabled={loading} style={{ padding: '8px 15px', background: 'darkgreen', color: 'white', border: 'none', cursor: 'pointer', borderRadius: '5px' }}>
          {loading ? 'Obteniendo...' : 'Establecer mi ubicación actual'}
        </button>
      </div>

      <hr style={{ margin: '20px 0' }} />
      <h3 style={{ fontSize: '1.25rem' }}>Galería de Trabajos</h3>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(120px, 1fr))', gap: '10px', marginBottom: '20px' }}>
        {galleryImages.map(image => (
          <div key={image.name} style={{ position: 'relative' }}>
            <img src={image.url} alt="Trabajo realizado" style={{ width: '100%', height: '120px', objectFit: 'cover', borderRadius: '8px' }} />
            <button onClick={() => handleImageDelete(image.name)} style={{ position: 'absolute', top: '5px', right: '5px', background: 'rgba(0,0,0,0.6)', color: 'white', border: 'none', borderRadius: '50%', cursor: 'pointer', width: '24px', height: '24px', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 0, fontSize: '14px' }}>
              X
            </button>
          </div>
        ))}
        {galleryImages.length === 0 && <p>Aún no has subido imágenes.</p>}
      </div>
      <div style={{ marginBottom: '15px' }}>
        <label htmlFor="workImage">Añadir nueva imagen</label>
        <input id="workImage" type="file" accept="image/*" onChange={(e) => e.target.files && setSelectedFile(e.target.files[0])} disabled={uploading} />
      </div>
      <button type="button" onClick={handleImageUpload} disabled={uploading || !selectedFile} style={{ padding: '8px 15px', background: 'purple', color: 'white', border: 'none', cursor: 'pointer', borderRadius: '5px' }}>
        {uploading ? 'Subiendo...' : 'Subir Imagen'}
      </button>

      <hr style={{ margin: '20px 0' }} />
      <button onClick={handleSignOut} disabled={loading || uploading} style={{ width: '100%', padding: '10px', background: 'red', color: 'white', border: 'none', cursor: 'pointer' }}>
        Cerrar Sesión
      </button>
    </div>
  )
}