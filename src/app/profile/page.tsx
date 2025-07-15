// src/app/profile/page.tsx
'use client'

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { supabase } from '@/lib/supabaseClient';
import type { User } from '@supabase/supabase-js';
import Button from '@/components/Button';

// --- NUEVO COMPONENTE INTERNO: Notificación Toast ---
const Notification = ({ message, type, onClose }: { message: string, type: 'success' | 'error', onClose: () => void }) => {
  useEffect(() => {
    const timer = setTimeout(onClose, 5000); // Desaparece después de 5 segundos
    return () => clearTimeout(timer);
  }, [onClose]);

  const baseClasses = "fixed top-5 right-5 p-4 rounded-lg shadow-xl text-white flex items-center z-50";
  const typeClasses = type === 'success' ? 'bg-green-600' : 'bg-red-600';

  return (
    <div className={`${baseClasses} ${typeClasses}`}>
      <p className="mr-4">{message}</p>
      <button onClick={onClose} className="font-bold">&times;</button>
    </div>
  );
};

// --- NUEVO COMPONENTE INTERNO: Modal de Confirmación ---
const ConfirmationModal = ({ message, onConfirm, onCancel }: { message: string, onConfirm: () => void, onCancel: () => void }) => {
    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 p-4">
            <div className="bg-white rounded-lg shadow-xl p-6 text-center max-w-sm">
                <p className="text-lg text-gray-800 mb-6">{message}</p>
                <div className="flex justify-center gap-4">
                    <Button variant="secondary" onClick={onCancel}>Cancelar</Button>
                    <Button variant="danger" onClick={onConfirm}>Confirmar</Button>
                </div>
            </div>
        </div>
    );
};


export default function ProfilePage() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  // ... resto de tus estados ...
  const [fullName, setFullName] = useState('');
  const [specialty, setSpecialty] = useState('');
  const [bio, setBio] = useState('');
  const [locationSaved, setLocationSaved] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [galleryImages, setGalleryImages] = useState<{ name: string, url: string }[]>([]);

  // --- NUEVOS ESTADOS para manejar las notificaciones y el modal ---
  const [notification, setNotification] = useState<{ message: string; type: 'success' | 'error' } | null>(null);
  const [modal, setModal] = useState<{ message: string; onConfirm: () => void } | null>(null);

  const router = useRouter();

  const fetchGalleryImages = useCallback(async (userId: string) => {
    // ... tu función sin cambios ...
    if (!userId) return;
    const { data: files, error } = await supabase.storage.from('work-gallery').list(userId, { limit: 100, sortBy: { column: 'created_at', order: 'desc' } });
    if (error) {
      console.error('Error cargando galería:', error);
      return;
    }
    if (files) {
      const urls = files.map(file => ({ name: file.name, url: supabase.storage.from('work-gallery').getPublicUrl(`${userId}/${file.name}`).data.publicUrl }));
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


  // --- FUNCIONES ACTUALIZADAS: Ahora usan setNotification y setModal ---
  const handleUpdateProfile = async (event: React.FormEvent) => {
    event.preventDefault();
    setLoading(true);
    if (!user) return;
    try {
      const { error } = await supabase.from('profiles').update({ full_name: fullName, specialty: specialty, bio: bio }).eq('id', user.id);
      if (error) throw error;
      setNotification({ message: '¡Perfil actualizado con éxito!', type: 'success' });
    } catch (error: any) {
      setNotification({ message: 'Error al actualizar el perfil: ' + error.message, type: 'error' });
    } finally {
      setLoading(false);
    }
  };

  const handleImageUpload = async () => {
    if (!selectedFile || !user) return setNotification({ message: 'Por favor, selecciona un archivo.', type: 'error' });
    setUploading(true);
    const filePath = `${user.id}/${Date.now()}_${selectedFile.name}`;
    try {
      const { error } = await supabase.storage.from('work-gallery').upload(filePath, selectedFile);
      if (error) throw error;
      setNotification({ message: '¡Imagen subida con éxito!', type: 'success' });
      setSelectedFile(null); // Resetea el estado
      // Para resetear el input visualmente, cambiaremos su key
      await fetchGalleryImages(user.id);
    } catch (error: any) {
      setNotification({ message: 'Error al subir la imagen: ' + error.message, type: 'error' });
    } finally {
      setUploading(false);
    }
  };

  const handleImageDelete = async (imageName: string) => {
    if (!user) return;

    // Lógica de borrado real
    const performDelete = async () => {
        const filePath = `${user.id}/${imageName}`;
        try {
            const { error } = await supabase.storage.from('work-gallery').remove([filePath]);
            if (error) throw error;
            setNotification({ message: 'Imagen borrada con éxito.', type: 'success' });
            await fetchGalleryImages(user.id);
        } catch (error: any) {
            setNotification({ message: 'Error al borrar la imagen: ' + error.message, type: 'error' });
        }
        setModal(null); // Cierra el modal después de la operación
    };

    // Abre el modal de confirmación
    setModal({
        message: '¿Estás seguro de que quieres borrar esta imagen? Esta acción no se puede deshacer.',
        onConfirm: performDelete,
    });
  };

  const handleSetLocation = () => {
    if (!navigator.geolocation) return setNotification({ message: 'Tu navegador no soporta la geolocalización.', type: 'error' });
    setLoading(true);
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;
        const locationString = `POINT(${longitude} ${latitude})`;
        if (user) {
          try {
            const { error } = await supabase.from('profiles').update({ location: locationString }).eq('id', user.id);
            if (error) throw error;
            setNotification({ message: '¡Ubicación guardada con éxito!', type: 'success' });
            setLocationSaved(true);
          } catch (err: any) {
            setNotification({ message: 'Error al guardar la ubicación: ' + err.message, type: 'error' });
          } finally {
            setLoading(false);
          }
        }
      },
      (error) => {
        setNotification({ message: 'No se pudo obtener la ubicación: ' + error.message, type: 'error' });
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
      {/* Renderizamos la notificación si existe */}
      {notification && <Notification message={notification.message} type={notification.type} onClose={() => setNotification(null)} />}
      {/* Renderizamos el modal si existe */}
      {modal && <ConfirmationModal message={modal.message} onConfirm={modal.onConfirm} onCancel={() => setModal(null)} />}

      <div className="max-w-4xl mx-auto space-y-8">
        {/* ... El resto de tu JSX sin cambios ... */}
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold text-gray-900">Mi Panel de Control</h1>
          <Button variant="danger" onClick={handleSignOut} disabled={loading || uploading}>
            Cerrar Sesión
          </Button>
        </div>

        <section className="bg-white p-6 rounded-xl shadow-lg">
           <h2 className="text-2xl font-semibold mb-4 text-gray-800">Datos del Perfil</h2>
           <form onSubmit={handleUpdateProfile} className="space-y-4">
              {/* ... campos del formulario sin cambios ... */}
              <div><label className="block mb-1 font-medium text-gray-700">Email</label><input type="text" value={user?.email} disabled className="w-full p-3 bg-gray-200 border border-gray-300 rounded-lg cursor-not-allowed text-gray-500" /></div>
              <div><label htmlFor="fullName" className="block mb-1 font-medium text-gray-700">Nombre Completo</label><input id="fullName" type="text" value={fullName} onChange={(e) => setFullName(e.target.value)} className="w-full p-3 border border-gray-300 rounded-lg text-gray-900" /></div>
              <div><label htmlFor="specialty" className="block mb-1 font-medium text-gray-700">Especialidad</label><input id="specialty" type="text" value={specialty} onChange={(e) => setSpecialty(e.target.value)} className="w-full p-3 border border-gray-300 rounded-lg text-gray-900" /></div>
              <div><label htmlFor="bio" className="block mb-1 font-medium text-gray-700">Biografía Corta</label><textarea id="bio" value={bio} onChange={(e) => setBio(e.target.value)} className="w-full p-3 border border-gray-300 rounded-lg min-h-[120px] text-gray-900" /></div>
              <Button type="submit" variant="primary" className="w-full sm:w-auto" disabled={loading || uploading}>{loading ? 'Actualizando...' : 'Guardar Cambios del Perfil'}</Button>
           </form>
        </section>

        <section className="bg-white p-6 rounded-xl shadow-lg">
           <h2 className="text-2xl font-semibold mb-4 text-gray-800">Ubicación y Agenda</h2>
           <p className="mb-4 text-gray-700">{locationSaved ? '✅ Tu ubicación está guardada.' : '❌ Aún no has guardado tu ubicación para que los clientes te encuentren.'}</p>
           <div className="flex flex-wrap gap-4">
              <Button onClick={handleSetLocation} disabled={loading} variant="secondary"> {loading ? 'Obteniendo...' : 'Establecer mi Ubicación'} </Button>
              <Link href="/profile/agenda" className="inline-block"><Button variant="secondary">Gestionar mi Agenda</Button></Link>
           </div>
        </section>

        <section className="bg-white p-6 rounded-xl shadow-lg">
          <h2 className="text-2xl font-semibold mb-4 text-gray-800">Galería de Trabajos</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 mb-4">
            {galleryImages.map(image => (
              <div key={image.name} className="relative group aspect-square">
                <Image src={image.url} alt="Trabajo realizado" layout="fill" objectFit="cover" className="rounded-lg" />
                <button onClick={() => handleImageDelete(image.name)} className="absolute top-1 right-1 bg-black bg-opacity-60 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity focus:opacity-100">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" /></svg>
                </button>
              </div>
            ))}
          </div>
          {galleryImages.length === 0 && <p className="text-gray-500">Aún no has subido imágenes.</p>}
          <div className="mt-6">
            <label htmlFor="workImage" className="block mb-2 font-medium text-gray-700">Añadir nueva imagen:</label>
            <input key={selectedFile ? 'file-selected' : 'no-file'} id="workImage" type="file" accept="image/*" onChange={(e) => e.target.files && setSelectedFile(e.target.files[0])} disabled={uploading} className="block text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-red-50 file:text-red-700 hover:file:bg-red-100" />
            <Button type="button" onClick={handleImageUpload} disabled={uploading || !selectedFile} className="mt-4">
              {uploading ? 'Subiendo...' : 'Subir Imagen'}
            </Button>
          </div>
        </section>
      </div>
    </div>
  )
}