// src/components/RatingSummary.tsx

export default function RatingSummary({ average, total }: { average: number, total: number }) {
  // La lógica para no mostrar nada si no hay reseñas sigue igual
  if (total === 0) {
    return null;
  }

  return (
    // --- DIV CON CLASES DE TAILWIND ---
    // mt-4: margen superior
    // flex: activa flexbox
    // items-center: alinea verticalmente los elementos al centro
    // gap-2: añade un espacio entre los elementos hijos
    <div className="mt-4 flex items-center gap-2">

      {/* --- SPAN DE LA CALIFICACIÓN --- */}
      {/* font-bold: negrita */}
      {/* text-xl: tamaño de fuente más grande */}
      {/* text-amber-500: un color amarillo/ámbar estándar de Tailwind para las estrellas */}
      <span className="font-bold text-xl text-amber-500">
        ★ {average.toFixed(1)}
      </span>

      {/* --- SPAN DEL TOTAL DE RESEÑAS --- */}
      {/* text-sm: tamaño de fuente más pequeño */}
      {/* text-gray-600: un color de gris estándar para texto secundario */}
      <span className="text-sm text-gray-600">
        ({total} {total === 1 ? 'reseña' : 'reseñas'})
      </span>
      
    </div>
  );
}