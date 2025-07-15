// src/app/professionals/[id]/page.tsx

import { supabase } from '@/lib/supabaseClient';
import { notFound } from 'next/navigation';

// Importamos nuestros componentes
import ReviewForm from '@/components/ReviewForm';
import AvailabilityCalendar from '@/components/AvailabilityCalendar';
import RatingSummary from '@/components/RatingSummary';
import WorkGallery from '@/components/WorkGallery';
import ReviewsList from '@/components/ReviewsList';
import StartChatButton from '@/components/StartChatButton'; // <-- Import del botón de chat activado

// --- TIPOS DE DATOS (Idealmente, mover a un archivo central como /lib/types.ts) ---
type ReviewWithClientName = {
  id: string;
  rating: number | null;
  comment: string | null;
  client_name: string | null;
};

// --- FUNCIONES PARA OBTENER DATOS (Sin cambios en su lógica interna) ---
async function getProfile(id: string) {
  const { data, error } = await supabase.from('profiles').select('*').eq('id', id).single();
  if (error || !data) {
    notFound();
  }
  return data;
}

async function getGalleryImages(profileId: string) {
  const { data: files, error } = await supabase.storage.from('work-gallery').list(profileId, { limit: 10, sortBy: { column: 'created_at', order: 'desc' } });
  if (error || !files || files.length === 0) {
    return [];
  }
  return files.map(file => supabase.storage.from('work-gallery').getPublicUrl(`${profileId}/${file.name}`).data.publicUrl);
}

async function getReviews(profileId: string): Promise<ReviewWithClientName[]> {
  const { data, error } = await supabase.rpc('get_reviews_with_client_names', { professional_id_param: profileId });
  if (error) {
    console.error("Error fetching reviews:", error);
    return [];
  }
  return data || [];
}

async function getAvailability(profileId: string) {
  const { data, error } = await supabase
    .from('availability_slots')
    .select('id, start_time, end_time')
    .eq('professional_id', profileId)
    .eq('is_booked', false);

  if (error) {
    console.error('Error fetching availability:', error);
    return [];
  }
  
  return data.map(slot => ({
    id: slot.id,
    title: 'Disponible',
    start: new Date(slot.start_time),
    end: new Date(slot.end_time),
  }));
}


// --- COMPONENTE PRINCIPAL DE LA PÁGINA (CON MEJORAS) ---
export default async function ProfessionalDetailPage({ params }: { params: { id: string } }) {
  
  // MEJORA 1: Carga de datos en paralelo para mayor velocidad
  const [profile, galleryImages, reviews, availabilityEvents] = await Promise.all([
    getProfile(params.id),
    getGalleryImages(params.id),
    getReviews(params.id),
    getAvailability(params.id),
  ]);

  const totalReviews = reviews.length;
  const averageRating = totalReviews > 0
    ? reviews.reduce((acc, review) => acc + (review.rating || 0), 0) / totalReviews
    : 0;

  return (
    <div className="bg-gray-50 min-h-screen">
      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* --- LAYOUT MEJORADO DE DOS COLUMNAS --- */}
        <main className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Columna Principal: Contenido visual y dinámico */}
          <div className="lg:col-span-2 space-y-8">
            <WorkGallery images={galleryImages} professionalName={profile.full_name} />
            
            <section className="bg-white p-6 rounded-lg shadow-sm">
              <h2 className="text-2xl font-bold text-black mb-4">Disponibilidad</h2>
              <AvailabilityCalendar events={availabilityEvents} />
            </section>

            {/* Las reseñas y el formulario de reseña ahora van juntos */}
            <section>
                <ReviewsList reviews={reviews} />
                <div className="bg-white p-6 rounded-lg shadow-sm mt-8">
                    <h3 className="text-xl font-bold text-black mb-4">Escribe tu propia reseña</h3>
                    <ReviewForm professional_id={profile.id} />
                </div>
            </section>
          </div>

          {/* MEJORA 2: Sidebar de Perfil Mejorada (Fija en pantallas grandes) */}
          <aside className="lg:col-span-1 space-y-8 lg:sticky lg:top-24 self-start">
            <section className="bg-white p-6 rounded-lg shadow-sm">
              <div className="flex flex-col items-center text-center">
                {/* Avatar real con fallback a la inicial */}
                <div className="w-32 h-32 rounded-full bg-gray-200 mx-auto mb-4 flex items-center justify-center overflow-hidden border-4 border-white shadow-lg">
                  {profile.avatar_url ? (
                    <img src={profile.avatar_url} alt={`Foto de ${profile.full_name}`} className="w-full h-full object-cover" />
                  ) : (
                    <span className="text-5xl text-gray-500">{profile.full_name ? profile.full_name.charAt(0) : '?'}</span>
                  )}
                </div>
                <h1 className="text-3xl font-extrabold text-black">{profile.full_name}</h1>
                <p className="text-xl text-red-600 font-semibold mt-1">{profile.specialty}</p>
                <RatingSummary average={averageRating} total={totalReviews} />
                
                {/* Botón de Contacto prominente */}
                <div className="mt-6 w-full">
                   <StartChatButton professional_id={profile.id} />
                </div>
              </div>

              {/* La biografía ahora es parte de la tarjeta de perfil */}
              <div className="border-t border-gray-200 mt-6 pt-6">
                <h3 className="text-xl font-bold text-black mb-2">Acerca de este profesional</h3>
                <p className="text-gray-700 leading-relaxed text-left">
                  {profile.bio || 'Este profesional aún no ha añadido una biografía.'}
                </p>
              </div>
            </section>
          </aside>

        </main>
      </div>
    </div>
  );
}