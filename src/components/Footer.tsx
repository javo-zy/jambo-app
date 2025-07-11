// src/components/Footer.tsx
import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="bg-gray-800 text-white">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          
          {/* Columna 1: Logo y descripción */}
          <div className="col-span-2 md:col-span-1">
            <h3 className="text-2xl font-bold text-white">JAMBO</h3>
            <p className="mt-2 text-gray-400 text-sm">
              Conectando habilidades con necesidad.
            </p>
          </div>

          {/* Columna 2: Enlaces de la Compañía */}
          <div>
            <h4 className="font-semibold tracking-wider uppercase">Compañía</h4>
            <ul className="mt-4 space-y-2">
              <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Sobre Nosotros</a></li>
              <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Blog</a></li>
              <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Contacto</a></li>
            </ul>
          </div>

          {/* Columna 3: Enlaces de Profesionales */}
          <div>
            <h4 className="font-semibold tracking-wider uppercase">Profesionales</h4>
            <ul className="mt-4 space-y-2">
              <li><Link href="/signup" className="text-gray-400 hover:text-white transition-colors">Regístrate</Link></li>
              <li><a href="#" className="text-gray-400 hover:text-white transition-colors">¿Cómo funciona?</a></li>
            </ul>
          </div>

          {/* Columna 4: Legal */}
          <div>
            <h4 className="font-semibold tracking-wider uppercase">Legal</h4>
            <ul className="mt-4 space-y-2">
              <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Términos de Servicio</a></li>
              <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Política de Privacidad</a></li>
            </ul>
          </div>

        </div>
      </div>

      {/* Barra inferior del footer */}
      <div className="bg-gray-900 py-4 px-4 sm:px-6 lg:px-8">
        <p className="text-center text-gray-500 text-sm">
          &copy; {new Date().getFullYear()} JAMBO. Todos los derechos reservados.
        </p>
      </div>
    </footer>
  );
}