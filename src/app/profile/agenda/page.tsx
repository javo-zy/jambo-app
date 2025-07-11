// src/app/profile/agenda/page.tsx
'use client'

import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/lib/supabaseClient';
import { Calendar, dateFnsLocalizer, Event } from 'react-big-calendar';
import format from 'date-fns/format';
import parse from 'date-fns/parse';
import startOfWeek from 'date-fns/startOfWeek';
import getDay from 'date-fns/getDay';
import es from 'date-fns/locale/es';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import type { User } from '@supabase/supabase-js';
import Button from '@/components/Button'; // Importamos nuestro componente de botón

// --- Configuración del calendario ---
const locales = {
  'es': es,
};
const localizer = dateFnsLocalizer({
  format,
  parse,
  startOfWeek: () => startOfWeek(new Date(), { weekStartsOn: 1 }),
  getDay,
  locales,
});

type AvailabilityEvent = {
  id: string;
  title: string;
  start: Date;
  end: Date;
};

export default function AgendaPage() {
  const [user, setUser] = useState<User | null>(null);
  const [events, setEvents] = useState<AvailabilityEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [startTime, setStartTime] = useState('');
  const [endTime, setEndTime] = useState('');

  const fetchAvailability = useCallback(async (userId: string) => {
    const { data, error } = await supabase
      .from('availability_slots')
      .select('*')
      .eq('professional_id', userId)
      .eq('is_booked', false);

    if (error) {
      console.error('Error cargando disponibilidad:', error);
    } else {
      const formattedEvents = data.map(slot => ({
        id: slot.id,
        title: 'Disponible',
        start: new Date(slot.start_time),
        end: new Date(slot.end_time),
      }));
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

  const handleAddSlot = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!startTime || !endTime || !user) {
      alert('Por favor, selecciona una fecha y hora de inicio y fin.');
      return;
    }
    const { error } = await supabase.from('availability_slots').insert({
      professional_id: user.id,
      start_time: new Date(startTime).toISOString(),
      end_time: new Date(endTime).toISOString(),
    });
    if (error) {
      alert('Error al añadir el bloque de disponibilidad: ' + error.message);
    } else {
      alert('¡Bloque de disponibilidad añadido con éxito!');
      await fetchAvailability(user.id);
      setStartTime('');
      setEndTime('');
    }
  };
  
  if (loading) return <p className="text-center mt-12">Cargando agenda...</p>;

  return (
    <div className="min-h-screen bg-gray-100 p-4 sm:p-8">
      <div className="max-w-6xl mx-auto space-y-8">
        <h1 className="text-3xl font-bold text-black">Gestionar mi Disponibilidad</h1>

        {/* Tarjeta para añadir nueva disponibilidad */}
        <section className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-2xl font-semibold mb-4 text-black">Añadir Nuevo Bloque Disponible</h2>
          <form onSubmit={handleAddSlot} className="space-y-4 md:space-y-0 md:flex md:items-end md:gap-4">
            <div className="flex-1">
              <label htmlFor="start" className="block mb-1 font-medium text-black">Inicio del bloque</label>
              <input 
                id="start" 
                type="datetime-local" 
                value={startTime} 
                onChange={e => setStartTime(e.target.value)} 
                required 
                className="w-full p-3 border border-gray-300 rounded-lg"
              />
            </div>
            <div className="flex-1">
              <label htmlFor="end" className="block mb-1 font-medium text-black">Fin del bloque</label>
              <input 
                id="end" 
                type="datetime-local" 
                value={endTime} 
                onChange={e => setEndTime(e.target.value)} 
                required 
                className="w-full p-3 border border-gray-300 rounded-lg"
              />
            </div>
            <Button type="submit" variant="primary">Añadir Disponibilidad</Button>
          </form>
        </section>
        
        {/* Tarjeta del Calendario */}
        <section className="bg-white p-6 rounded-lg shadow-md">
           <div style={{ height: '600px' }}>
            <Calendar
              localizer={localizer}
              events={events}
              startAccessor="start"
              endAccessor="end"
              style={{ height: '100%' }}
              culture='es'
              messages={{
                next: "Siguiente",
                previous: "Anterior",
                today: "Hoy",
                month: "Mes",
                week: "Semana",
                day: "Día",
                agenda: "Agenda",
                date: "Fecha",
                time: "Hora",
                event: "Evento",
              }}
            />
          </div>
        </section>
      </div>
    </div>
  );
}