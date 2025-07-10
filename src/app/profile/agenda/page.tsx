// src/app/profile/agenda/page.tsx
'use client'

import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/lib/supabaseClient';
import { Calendar, dateFnsLocalizer } from 'react-big-calendar';
import format from 'date-fns/format';
import parse from 'date-fns/parse';
import startOfWeek from 'date-fns/startOfWeek';
import getDay from 'date-fns/getDay';
import es from 'date-fns/locale/es'; // Importamos el idioma español
import 'react-big-calendar/lib/css/react-big-calendar.css'; // Importamos los estilos del calendario
import type { User } from '@supabase/supabase-js';

// --- Configuración inicial para el calendario ---
const locales = {
  'es': es,
};
const localizer = dateFnsLocalizer({
  format,
  parse,
  startOfWeek: () => startOfWeek(new Date(), { weekStartsOn: 1 }), // Lunes como primer día
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

  // Estados para el nuevo bloque de disponibilidad
  const [startTime, setStartTime] = useState('');
  const [endTime, setEndTime] = useState('');

  // Función para cargar los bloques de disponibilidad
  const fetchAvailability = useCallback(async (userId: string) => {
    const { data, error } = await supabase
      .from('availability_slots')
      .select('*')
      .eq('professional_id', userId)
      .eq('is_booked', false);

    if (error) {
      console.error('Error cargando disponibilidad:', error);
    } else {
      // Transformamos los datos de Supabase al formato que espera el calendario
      const formattedEvents = data.map(slot => ({
        id: slot.id,
        title: 'Disponible',
        start: new Date(slot.start_time),
        end: new Date(slot.end_time),
      }));
      setEvents(formattedEvents);
    }
  }, []);

  // Cargar datos iniciales
  useEffect(() => {
    const init = async () => {
      const { data: { user: currentUser } } = await supabase.auth.getUser();
      setUser(currentUser);
      if (currentUser) {
        await fetchAvailability(currentUser.id);
      }
      setLoading(false);
    };
    init();
  }, [fetchAvailability]);

  // Función para añadir un nuevo bloque de disponibilidad
  const handleAddSlot = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!startTime || !endTime || !user) {
      alert('Por favor, selecciona una fecha y hora de inicio y fin.');
      return;
    }

    const { error } = await supabase
      .from('availability_slots')
      .insert({
        professional_id: user.id,
        start_time: new Date(startTime).toISOString(),
        end_time: new Date(endTime).toISOString(),
      });

    if (error) {
      alert('Error al añadir el bloque de disponibilidad: ' + error.message);
    } else {
      alert('¡Bloque de disponibilidad añadido con éxito!');
      // Volvemos a cargar los eventos para que se refleje en el calendario
      await fetchAvailability(user.id);
      setStartTime('');
      setEndTime('');
    }
  };
  
  if (loading) return <p>Cargando agenda...</p>;

  return (
    <div style={{ padding: '20px' }}>
      <h1>Gestionar mi Disponibilidad</h1>
      
      {/* Formulario para añadir nueva disponibilidad */}
      <form onSubmit={handleAddSlot} style={{ marginBottom: '20px', padding: '15px', border: '1px solid #ddd', borderRadius: '8px' }}>
        <h3>Añadir nuevo bloque disponible</h3>
        <div style={{ display: 'flex', gap: '15px', alignItems: 'center' }}>
          <div>
            <label htmlFor="start">Inicio:</label>
            <input id="start" type="datetime-local" value={startTime} onChange={e => setStartTime(e.target.value)} required />
          </div>
          <div>
            <label htmlFor="end">Fin:</label>
            <input id="end" type="datetime-local" value={endTime} onChange={e => setEndTime(e.target.value)} required />
          </div>
          <button type="submit">Añadir</button>
        </div>
      </form>
      
      {/* Componente del Calendario */}
      <div style={{ height: '600px' }}>
        <Calendar
          localizer={localizer}
          events={events}
          startAccessor="start"
          endAccessor="end"
          style={{ height: '100%' }}
          culture='es' // Usamos la cultura española para los nombres de días/meses
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
    </div>
  );
}