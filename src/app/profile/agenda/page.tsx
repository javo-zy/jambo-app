// src/app/profile/agenda/page.tsx
'use client'

import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/lib/supabaseClient';
import { Calendar, dateFnsLocalizer, Event as BigCalendarEvent } from 'react-big-calendar';
import format from 'date-fns/format';
import parse from 'date-fns/parse';
import startOfWeek from 'date-fns/startOfWeek';
import getDay from 'date-fns/getDay';
import es from 'date-fns/locale/es';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import type { User } from '@supabase/supabase-js';
import Button from '@/components/Button';

// --- Componentes de Notificación y Modal (Idealmente, mover a un archivo compartido) ---
const Notification = ({ message, type, onClose }: { message: string, type: 'success' | 'error', onClose: () => void }) => {
  useEffect(() => {
    const timer = setTimeout(onClose, 5000);
    return () => clearTimeout(timer);
  }, [onClose]);
  const typeClasses = type === 'success' ? 'bg-green-600' : 'bg-red-600';
  return (
    <div className={`fixed top-5 right-5 p-4 rounded-lg shadow-xl text-white flex items-center z-50 ${typeClasses}`}>
      <p className="mr-4">{message}</p>
      <button onClick={onClose} className="font-bold">&times;</button>
    </div>
  );
};

const ConfirmationModal = ({ message, onConfirm, onCancel }: { message: string, onConfirm: () => void, onCancel: () => void }) => {
    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 p-4">
            <div className="bg-white rounded-lg shadow-xl p-6 text-center max-w-sm">
                <p className="text-lg text-gray-800 mb-6">{message}</p>
                <div className="flex justify-center gap-4">
                    <Button variant="secondary" onClick={onCancel}>Cancelar</Button>
                    <Button variant="danger" onClick={onConfirm}>Eliminar</Button>
                </div>
            </div>
        </div>
    );
};

// --- Configuración del calendario ---
const locales = { 'es': es };
const localizer = dateFnsLocalizer({ format, parse, startOfWeek: () => startOfWeek(new Date(), { weekStartsOn: 1 }), getDay, locales });

// Tipos
type AvailabilityEvent = { id: string; title: string; start: Date; end: Date; };

export default function AgendaPage() {
  const [user, setUser] = useState<User | null>(null);
  const [events, setEvents] = useState<AvailabilityEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [startTime, setStartTime] = useState('');
  const [endTime, setEndTime] = useState('');
  
  // Estados para el sistema de notificaciones y modales
  const [notification, setNotification] = useState<{ message: string; type: 'success' | 'error' } | null>(null);
  const [modal, setModal] = useState<{ message: string; onConfirm: () => void } | null>(null);

  const fetchAvailability = useCallback(async (userId: string) => {
    const { data, error } = await supabase.from('availability_slots').select('*').eq('professional_id', userId).eq('is_booked', false);
    if (error) {
      setNotification({ message: 'Error al cargar tu disponibilidad.', type: 'error' });
    } else {
      const formattedEvents = data.map(slot => ({ id: slot.id, title: 'Disponible', start: new Date(slot.start_time), end: new Date(slot.end_time) }));
      setEvents(formattedEvents);
    }
  }, []);

  useEffect(() => {
    const init = async () => {
      setLoading(true);
      const { data: { user: currentUser } } = await supabase.auth.getUser();
      setUser(currentUser);
      if (currentUser) {
        await fetchAvailability(currentUser.id);
      }
      setLoading(false);
    };
    init();
  }, [fetchAvailability]);

  // --- FUNCIÓN ACTUALIZADA para añadir disponibilidad ---
  const handleAddSlot = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!startTime || !endTime || !user) {
      setNotification({ message: 'Por favor, selecciona una fecha y hora de inicio y fin.', type: 'error' });
      return;
    }
    setIsSubmitting(true);
    const { error } = await supabase.from('availability_slots').insert({
      professional_id: user.id,
      start_time: new Date(startTime).toISOString(),
      end_time: new Date(endTime).toISOString(),
    });
    if (error) {
      setNotification({ message: 'Error al añadir el bloque: ' + error.message, type: 'error' });
    } else {
      setNotification({ message: '¡Bloque de disponibilidad añadido con éxito!', type: 'success' });
      await fetchAvailability(user.id);
      setStartTime('');
      setEndTime('');
    }
    setIsSubmitting(false);
  };

  // --- NUEVA FUNCIÓN para manejar la selección de un evento ---
  const handleSelectEvent = (event: AvailabilityEvent) => {
    const performDelete = async () => {
        const { error } = await supabase.from('availability_slots').delete().eq('id', event.id);
        if (error) {
            setNotification({ message: 'Error al eliminar el bloque.', type: 'error' });
        } else {
            setNotification({ message: 'Bloque eliminado correctamente.', type: 'success' });
            // Actualizamos la lista de eventos filtrando el eliminado
            setEvents(prevEvents => prevEvents.filter(e => e.id !== event.id));
        }
        setModal(null); // Cierra el modal
    };
    
    // Abre el modal de confirmación
    setModal({
        message: '¿Estás seguro de que quieres eliminar este bloque de disponibilidad?',
        onConfirm: performDelete,
    });
  };
  
  if (loading) return <p className="text-center mt-12">Cargando agenda...</p>;

  return (
    <div className="min-h-screen bg-gray-100 p-4 sm:p-8">
      {/* Renderizado condicional de notificaciones y modales */}
      {notification && <Notification message={notification.message} type={notification.type} onClose={() => setNotification(null)} />}
      {modal && <ConfirmationModal message={modal.message} onConfirm={modal.onConfirm} onCancel={() => setModal(null)} />}

      <div className="max-w-6xl mx-auto space-y-8">
        <h1 className="text-3xl font-bold text-black">Gestionar mi Disponibilidad</h1>

        <section className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-2xl font-semibold mb-4 text-black">Añadir Nuevo Bloque Disponible</h2>
          <form onSubmit={handleAddSlot} className="space-y-4 md:space-y-0 md:flex md:items-end md:gap-4">
            <div className="flex-1">
              <label htmlFor="start" className="block mb-1 font-medium text-black">Inicio del bloque</label>
              <input id="start" type="datetime-local" value={startTime} onChange={e => setStartTime(e.target.value)} required className="w-full p-3 border border-gray-300 rounded-lg"/>
            </div>
            <div className="flex-1">
              <label htmlFor="end" className="block mb-1 font-medium text-black">Fin del bloque</label>
              <input id="end" type="datetime-local" value={endTime} onChange={e => setEndTime(e.target.value)} required className="w-full p-3 border border-gray-300 rounded-lg"/>
            </div>
            <Button type="submit" variant="primary" disabled={isSubmitting}>
              {isSubmitting ? 'Añadiendo...' : 'Añadir Disponibilidad'}
            </Button>
          </form>
        </section>
        
        <section className="bg-white p-6 rounded-lg shadow-md">
           <p className="text-gray-600 mb-4 text-center">💡 Haz clic sobre un bloque "Disponible" en el calendario para eliminarlo.</p>
           <div style={{ height: '600px' }}>
            <Calendar
              localizer={localizer}
              events={events}
              onSelectEvent={handleSelectEvent} // <-- NUEVA PROP para manejar clics en eventos
              startAccessor="start"
              endAccessor="end"
              style={{ height: '100%' }}
              culture='es'
              messages={{ next: "Siguiente", previous: "Anterior", today: "Hoy", month: "Mes", week: "Semana", day: "Día", agenda: "Agenda", date: "Fecha", time: "Hora", event: "Evento" }}
              eventPropGetter={() => ({ // Añade un cursor de puntero a los eventos para indicar que son clicables
                style: {
                    cursor: 'pointer',
                    backgroundColor: '#BC1823' // Usando uno de los rojos de la marca
                }
              })}
            />
          </div>
        </section>
      </div>
    </div>
  );
}