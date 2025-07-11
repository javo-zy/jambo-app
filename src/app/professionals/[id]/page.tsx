// src/app/professionals/[id]/page.tsx

import { supabase } from '@/lib/supabaseClient';
import { notFound } from 'next/navigation';

// Importamos nuestros componentes
import ReviewForm from '@/components/ReviewForm';
import AvailabilityCalendar from '@/components/AvailabilityCalendar';
import RatingSummary from '@/components/RatingSummary';
import WorkGallery from '@/components/WorkGallery';
import ReviewsList from '@/components/ReviewsList';
// import StartChatButton from '@/components/StartChatButton';

// --- TIPOS DE DATOS ---
type ReviewWithClientName = {
  id: string;
  rating: number | null;
  comment: string | null;
  client_name: string | null;
};

// --- FUNCIONES PARA OBTENER DATOS (Definidas una sola vez aquí) ---
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


// --- COMPONENTE PRINCIPAL DE LA PÁGINA ---
export default async function ProfessionalDetailPage({ params }: { params: { id: string } }) {
  const profile = await getProfile(params.id);
  const galleryImages = await getGalleryImages(params.id);
  const reviews = await getReviews(params.id);
  const availabilityEvents = await getAvailability(params.id);

  const totalReviews = reviews.length;
  const averageRating = totalReviews > 0
    ? reviews.reduce((acc: any, review: any) => acc + (review.rating || 0), 0) / totalReviews
    : 0;

  return (
    <div className="bg-gray-50 min-h-screen">
      <div className="max-w-6xl mx-auto px-4 py-8">
        <main className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          <div className="lg:col-span-2 space-y-8">
            <section className="bg-white p-6 rounded-lg shadow-sm">
              <h2 className="text-2xl font-bold text-gray-800 mb-4">Acerca de este profesional</h2>
              <p className="text-gray-600 leading-relaxed">
                {profile.bio || 'Este profesional aún no ha añadido una biografía.'}
              </p>
            </section>

            <WorkGallery images={galleryImages} professionalName={profile.full_name} />
            
            <section className="bg-white p-6 rounded-lg shadow-sm">
              <h2 className="text-2xl font-bold text-gray-800 mb-4">Disponibilidad</h2>
              <AvailabilityCalendar events={availabilityEvents} />
            </section>

            <ReviewsList reviews={reviews} />
          </div>

          <aside className="lg:col-span-1 space-y-8">
            <section className="bg-white p-6 rounded-lg shadow-sm text-center">
              <div className="w-32 h-32 rounded-full bg-gray-200 mx-auto mb-4 flex items-center justify-center overflow-hidden">
                 <span className="text-5xl text-gray-500">
                  {profile.full_name ? profile.full_name.charAt(0) : '?'}
                </span>
              </div>
              <h1 className="text-3xl font-bold text-gray-900">{profile.full_name}</h1>
              <p className="text-lg text-red-600 font-semibold">{profile.specialty}</p>
              <RatingSummary average={averageRating} total={totalReviews} />
              
              {/* <div className="mt-6">
                 <StartChatButton professional_id={profile.id} />
              </div> */}
            </section>

             <section className="bg-white p-6 rounded-lg shadow-sm">
                <h3 className="text-xl font-bold text-gray-800 mb-4">Escribe tu propia reseña</h3>
                <ReviewForm professional_id={profile.id} />
             </section>
          </aside>

        </main>
      </div>
    </div>
  );
}