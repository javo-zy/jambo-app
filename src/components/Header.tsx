// src/components/Header.tsx
import Link from 'next/link';
import Button from './Button';

export default function Header() {
  return (
    <header className="bg-white shadow-sm sticky top-0 z-50">
      <nav className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-4">
          
          {/* Logo */}
          <div className="flex-shrink-0">
            <Link href="/" className="text-2xl font-extrabold text-red-600">
              JAMBO
            </Link>
          </div>

          {/* Enlaces de Navegación */}
          <div className="hidden md:flex items-center space-x-8">
            <Link href="/browse" className="text-gray-700 hover:text-red-600 font-medium transition-colors">
              Buscar Profesionales
            </Link>
            {/* Aquí podríamos añadir más enlaces como "Sobre Nosotros" o "Servicios" */}
          </div>

          {/* Botón de Acción */}
          <div>
            <Link href="/login">
              <Button variant="primary" className="px-4 py-2 text-sm">
                Iniciar Sesión
              </Button>
            </Link>
          </div>

        </div>
      </nav>
    </header>
  );
}