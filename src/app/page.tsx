// src/app/page.tsx
import Button from '@/components/Button';
import Image from 'next/image';
import Link from 'next/link';
import React from 'react';

export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center">

      {/* --- SECCIÓN HERO MEJORADA --- */}
      <section className="relative w-full h-[60vh] md:h-[70vh] flex items-center justify-center text-center text-white overflow-hidden p-4">
        <Image
          src="/images/backgrounds/hero-background.jpg"
          alt="Profesional trabajando"
          fill
          style={{ objectFit: 'cover', objectPosition: 'center' }}
          className="absolute inset-0 z-0 brightness-[0.6]" // Ligeramente más oscuro para mejorar contraste
          priority 
        />
        <div className="relative z-10 max-w-4xl mx-auto">
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold leading-tight mb-6 drop-shadow-lg">
            La ayuda confiable que necesitas, a un clic de distancia.
          </h1>
          {/* DOBLE CTA: Uno para clientes y otro para profesionales */}
          <div className="flex flex-col sm:flex-row justify-center items-center gap-4">
            <Link href="/browse">
              <Button variant="primary" className="px-8 py-3 text-lg w-full sm:w-auto">
                Buscar Profesionales
              </Button>
            </Link>
            <Link href="/signup">
              <Button variant="outline" className="text-white border-white hover:bg-white hover:text-red-600 w-full sm:w-auto">
                Soy un Profesional
              </Button>
            </Link>
          </div>
        </div>
      </section>

      <section id="aboutus" className="py-16 px-4 bg-white w-full">
        <div className="container mx-auto flex flex-col md:flex-row items-center gap-12">
          <div className="md:w-1/2 text-center md:text-left">
            <h2 className="text-4xl font-extrabold text-gray-900 mb-6">Nuestra Misión</h2>
            {/* TEXTO MEJORADO: Enfocado en la misión social de Jambo */}
            <p className="text-lg text-gray-700 leading-relaxed">
              En Jambo, nuestra misión es dar visibilidad al talento y la experiencia. Conectamos a personas que necesitan ayuda en su hogar con profesionales capacitados de su propia comunidad, incluso si no cuentan con certificados formales. Creamos oportunidades y construimos confianza.
            </p>
          </div>
          <div className="md:w-1/2 flex justify-center">
            {/* TODO: Reemplazar esta imagen de placeholder por una foto auténtica que represente a la comunidad de Jambo */}
            <Image
              src="/images/backgrounds/about-us-placeholder.jpg"
              alt="Miembros de la comunidad Jambo"
              width={500}
              height={350}
              className="rounded-lg shadow-xl" 
            />
          </div>
        </div>
      </section>

      {/* --- SECCIÓN SERVICIOS MEJORADA --- */}
      <section id="ourservices" className="py-16 px-4 w-full bg-gray-50">
        <h2 className="text-4xl font-extrabold text-gray-900 mb-12 text-center">Encuentra ayuda para todo</h2>
        <div className="container mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {/* TARJETA INTERACTIVA Y CON ENLACE */}
          <Link href="/browse?category=electricista" className="block group">
            <div className="bg-white p-6 rounded-lg shadow-md text-center flex flex-col items-center transition-transform duration-300 group-hover:-translate-y-2 group-hover:shadow-xl">
              <Image src="/images/services/electrician.png" alt="Electricista" width={250} height={200} className="rounded-md object-cover mb-4" />
              <h3 className="text-xl font-semibold text-gray-800">Electricistas</h3>
              <p className="text-gray-600 text-sm mt-2">Instalaciones, reparaciones, cableado.</p>
            </div>
          </Link>
          {/* TARJETA INTERACTIVA Y CON ENLACE */}
          <Link href="/browse?category=albanil" className="block group">
            <div className="bg-white p-6 rounded-lg shadow-md text-center flex flex-col items-center transition-transform duration-300 group-hover:-translate-y-2 group-hover:shadow-xl">
              <Image src="/images/services/mason.png" alt="Albañil" width={250} height={200} className="rounded-md object-cover mb-4" />
              <h3 className="text-xl font-semibold text-gray-800">Albañiles</h3>
              <p className="text-gray-600 text-sm mt-2">Construcción y reparación de estructuras.</p>
            </div>
          </Link>
          {/* TARJETA INTERACTIVA Y CON ENLACE */}
          <Link href="/browse?category=fontanero" className="block group">
            <div className="bg-white p-6 rounded-lg shadow-md text-center flex flex-col items-center transition-transform duration-300 group-hover:-translate-y-2 group-hover:shadow-xl">
              <Image src="/images/services/plumber.png" alt="Fontanero" width={250} height={200} className="rounded-md object-cover mb-4" />
              <h3 className="text-xl font-semibold text-gray-800">Fontaneros</h3>
              <p className="text-gray-600 text-sm mt-2">Reparación de tuberías, grifos, inodoros.</p>
            </div>
          </Link>
        </div>
      </section>
      
      {/* --- SECCIÓN "CÓMO FUNCIONA" MEJORADA --- */}
      {/* COLOR DE FONDO ACTUALIZADO a un tono de la paleta de marca */}
      <section id='functions' className="py-16 px-4 w-full bg-[#981A2B] text-white">
        <h2 className="text-4xl font-extrabold mb-12 text-center">¿Cómo funciona?</h2>
        <div className="container mx-auto grid grid-cols-1 md:grid-cols-2 gap-12">
          <div className="flex flex-col items-center text-center">
            <h3 className="font-semibold text-3xl mb-8">Para Clientes</h3>
            <div className="space-y-8">
              <div className="flex flex-col items-center"><Image src="/images/icons/image (1).png" alt="Buscar" width={80} height={80}  /><h4 className="font-semibold text-2xl mb-2 mt-2">1. Busca</h4><p className="text-lg">Encuentra el profesional ideal por categoría y ubicación.</p></div>
              <div className="flex flex-col items-center"><Image src="/images/icons/image (2).png" alt="Contacta" width={80} height={80}  /><h4 className="font-semibold text-2xl mb-2 mt-2">2. Contacta</h4><p className="text-lg">Envía un mensaje directo para acordar los detalles del servicio.</p></div>
              <div className="flex flex-col items-center"><Image src="/images/icons/image (3).png" alt="Contrata" width={80} height={80}  /><h4 className="font-semibold text-2xl mb-2 mt-2">3. Califica</h4><p className="text-lg">Una vez terminado el trabajo, valora la experiencia para ayudar a la comunidad.</p></div>
            </div>
          </div>
          <div className="flex flex-col items-center text-center mt-12 md:mt-0">
            <h3 className="font-semibold text-3xl mb-8">Para Expertos</h3>
            <div className="space-y-8">
              <div className="flex flex-col items-center"><Image src="/images/icons/image (4).png" alt="Regístrate" width={80} height={80}  /><h4 className="font-semibold text-2xl mb-2 mt-2">1. Regístrate</h4><p className="text-lg">Crea tu perfil gratis y muestra tus habilidades y trabajos anteriores.</p></div>
              <div className="flex flex-col items-center"><Image src="/images/icons/image (5).png" alt="Ofrece tus servicios" width={80} height={80}  /><h4 className="font-semibold text-2xl mb-2 mt-2">2. Recibe Solicitudes</h4><p className="text-lg">Los clientes de tu zona te contactarán directamente a través de la plataforma.</p></div>
              <div className="flex flex-col items-center"><Image src="/images/icons/image.png" alt="Obtén clientes" width={80} height={80}  /><h4 className="font-semibold text-2xl mb-2 mt-2">3. Crece</h4><p className="text-lg">Obtén reseñas, construye tu reputación y haz crecer tu negocio.</p></div>
            </div>
          </div>
        </div>
      </section>

      {/* --- SECCIÓN PREGUNTAS MEJORADA --- */}
      <section id='questions' className="py-16 px-4 w-full bg-white text-center">
        <h2 className="text-4xl font-extrabold text-gray-900 mb-6">¿Aún tienes dudas?</h2>
        <p className="text-xl text-gray-600 mb-8">
          Estamos aquí para ayudarte. Visita nuestra sección de preguntas frecuentes.
        </p>
        <Link href="/faq">
          {/* BOTÓN CONSISTENTE: Usando el componente reutilizable Button */}
          <Button variant="secondary" className="px-8 py-3">
            Ir a Preguntas Frecuentes
          </Button>
        </Link>
      </section>
    </div>
  );
}