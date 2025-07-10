import { supabase } from '@/lib/supabaseClient';
import { notFound } from 'next/navigation';
import ReviewForm from '@/components/ReviewForm';
import StartChatButton from '@/components/StartChatButton';
import AvailabilityCalendar from '@/components/AvailabilityCalendar';

// --- TIPOS DE DATOS ---
type ReviewWithClientName = {
  id: string;
  rating: number | null;
  comment: string | null;
  client_name: string | null;
};

type PageProps = {
  params: { id: string };
  searchParams?: { [key: string]: string | string[] | undefined };
};

// --- FUNCIONES PARA OBTENER DATOS DEL SERVIDOR ---
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
  const { data, error } = await supabase.rpc('get_reviews_with_client_names', {
    professional_id_param: profileId
  });

  if (error) {
    console.error("Error calling DB function:", error);
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

// --- PEQUEÑOS COMPONENTES DE VISUALIZACIÓN (Definidos una sola vez) ---
function RatingSummary({ average, total }: { average: number, total: number }) {
  if (total === 0) return null;
  return (
    <div style={{ marginTop: '15px', display: 'flex', alignItems: 'center' }}>
      <span style={{ fontWeight: 'bold', fontSize: '1.2rem', color: '#f59e0b' }}>
        ★ {average.toFixed(1)}
      </span>
      <span style={{ marginLeft: '10px', color: '#666' }}>
        ({total} {total === 1 ? 'reseña' : 'reseñas'})
      </span>
    </div>
  );
}

function WorkGallery({ images, professionalName }: { images: string[], professionalName: string | null }) {
  if (images.length === 0) return null;
  return (
    <>
      <hr style={{ margin: '30px 0' }} />
      <h3 style={{ fontSize: '1.25rem' }}>Galería de Trabajos</h3>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '15px' }}>
        {images.map((url, index) => (
          <img key={index} src={url} alt={`Trabajo de ${professionalName}`} style={{ width: '100%', height: '200px', objectFit: 'cover', borderRadius: '8px' }}/>
        ))}
      </div>
    </>
  );
}

function ReviewsList({ reviews }: { reviews: ReviewWithClientName[] }) {
  return (
    <>
      <hr style={{ margin: '30px 0' }} />
      <h3 style={{ fontSize: '1.25rem' }}>Reseñas de Clientes</h3>
      {reviews.length > 0 ? (
        <div>
          {reviews.map((review) => (
            <div key={review.id} style={{ borderBottom: '1px solid #eee', paddingBottom: '15px', marginBottom: '15px' }}>
              <div style={{ display: 'flex', alignItems: 'center', marginBottom: '5px' }}>
                <span style={{ fontWeight: 'bold' }}>{review.client_name || 'Anónimo'}</span>
                <span style={{ marginLeft: '10px', fontWeight: 'bold', color: '#f59e0b' }}>
                  ★ {review.rating}
                </span>
              </div>
              <p style={{ margin: 0 }}>{review.comment}</p>
            </div>
          ))}
        </div>
      ) : (
        <p>Este profesional aún no tiene reseñas.</p>
      )}
    </>
  );
}


// --- COMPONENTE PRINCIPAL DE LA PÁGINA ---
export default async function ProfessionalDetailPage({ params }: PageProps) {
  const profile = await getProfile(params.id);
  const galleryImages = await getGalleryImages(params.id);
  const reviews = await getReviews(params.id);
  const availabilityEvents = await getAvailability(params.id);

  const totalReviews = reviews.length;
  const averageRating = totalReviews > 0
    ? reviews.reduce((acc, review) => acc + (review.rating || 0), 0) / totalReviews
    : 0;

  return (
    <div style={{ maxWidth: '700px', margin: '50px auto', padding: '20px' }}>
      <h1 style={{ fontSize: '2.5rem', marginBottom: '10px' }}>{profile.full_name}</h1>
      
      <p style={{ display: 'inline-block', background: '#e0e7ff', color: '#4338ca', padding: '5px 15px', borderRadius: '20px', fontWeight: 'bold' }}>
        {profile.specialty}
      </p>

      <RatingSummary average={averageRating} total={totalReviews} />
      
      {/* <StartChatButton professional_id={profile.id} /> */}

      <hr style={{ margin: '30px 0' }} />

      <h3 style={{ fontSize: '1.25rem' }}>Acerca de este profesional:</h3>
      <p style={{ fontSize: '1.1rem', lineHeight: '1.6' }}>
        {profile.bio || 'Este profesional aún no ha añadido una biografía.'}
      </p>

      <WorkGallery images={galleryImages} professionalName={profile.full_name} />

      <hr style={{ margin: '30px 0' }} />
      <h3 style={{ fontSize: '1.25rem' }}>Disponibilidad</h3>
      <AvailabilityCalendar events={availabilityEvents} />
      
      <ReviewsList reviews={reviews} />

      <hr style={{ margin: '30px 0' }} />
      <h3 style={{ fontSize: '1.25rem' }}>Escribe tu propia reseña</h3>
      <ReviewForm professional_id={profile.id} />
    </div>
  );
}