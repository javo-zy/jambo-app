// src/components/AvailabilityCalendar.tsx
'use client'

import { Calendar, dateFnsLocalizer, Event } from 'react-big-calendar';
import format from 'date-fns/format';
import parse from 'date-fns/parse';
import startOfWeek from 'date-fns/startOfWeek';
import getDay from 'date-fns/getDay';
import es from 'date-fns/locale/es';
import 'react-big-calendar/lib/css/react-big-calendar.css';

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

// Definimos el tipo de evento que recibirá este componente
interface AvailabilityEvent extends Event {
  id: string;
  title: string;
}

export default function AvailabilityCalendar({ events }: { events: AvailabilityEvent[] }) {
  if (events.length === 0) {
    return <p className="text-gray-600">Este profesional aún no ha marcado su disponibilidad.</p>;
  }

  return (
    <div style={{ height: '500px', marginTop: '10px' }}>
      <Calendar
        localizer={localizer}
        events={events}
        startAccessor="start"
        endAccessor="end"
        style={{ height: '100%' }}
        culture='es'
        views={['month', 'week', 'day']} // Vistas que permitimos
        messages={{
          next: "Siguiente",
          previous: "Anterior",
          today: "Hoy",
          month: "Mes",
          week: "Semana",
          day: "Día",
        }}
      />
    </div>
  );
}