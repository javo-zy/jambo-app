// src/app/page.tsx
import Button from '@/components/Button';
import Image from 'next/image';
import Link from 'next/link';
import React from 'react';

export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center">

      <section className="relative w-full h-[60vh] md:h-[70vh] flex items-center justify-center text-center text-white overflow-hidden p-4">
        <Image
          src="/images/backgrounds/hero-background.jpg" // Ruta corregida
          alt="Profesional trabajando"
          fill
          style={{ objectFit: 'cover', objectPosition: 'center' }}
          className="absolute inset-0 z-0 brightness-[0.7]"
          priority 
        />
        <div className="relative z-10 max-w-4xl mx-auto">
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold leading-tight mb-4 drop-shadow-lg">
            ¿Necesitas una reparación rápida?
          </h1>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Link href="/browse">
              <Button className="px-6 py-3 rounded-full text-lg">Buscar Ahora</Button>
            </Link>
          </div>
        </div>
      </section>

      <section id="aboutus" className="py-16 px-4 bg-white w-full">
        <div className="container mx-auto flex flex-col md:flex-row items-center gap-12">
          <div className="md:w-1/2 text-center md:text-left">
            <h2 className="text-4xl font-extrabold text-gray-900 mb-6">Sobre Nosotros</h2>
            <p className="text-lg text-gray-700 leading-relaxed">
              En Jambo, estamos dedicados a simplificar el proceso de encontrar profesionales confiables para todas tus necesidades de reparación y mantenimiento del hogar. Nuestra plataforma conecta a personas que buscan servicios de alta calidad con expertos verificados en su área. Nos esforzamos por construir una comunidad de confianza, eficiencia y comodidad.
            </p>
          </div>
          <div className="md:w-1/2 flex justify-center">
            <Image
              src="/images/backgrounds/about-us-placeholder.jpg" // Ruta corregida
              alt="Sobre nosotros"
              width={500}
              height={350}
              className="rounded-lg shadow-xl" 
            />
          </div>
        </div>
      </section>

      <section id="ourservices" className="py-16 px-4 w-full bg-gray-50">
        <h2 className="text-4xl font-extrabold text-gray-900 mb-12 text-center">Nuestros Servicios</h2>
        <div className="container mx-auto grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-8">
          <div className="bg-white p-6 rounded-lg shadow-md text-center flex flex-col items-center">
            <Image
              src="/images/services/electrician.jpg" // Ruta corregida
              alt="Electricista"
              width={250}
              height={200}
              className="rounded-md object-cover mb-4" 
            />
            <h3 className="text-xl font-semibold text-gray-800">Electricista</h3>
            <p className="text-gray-600 text-sm mt-2">Instalaciones, reparaciones, cableado.</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-md text-center flex flex-col items-center">
            <Image
              src="/images/services/mason.jpg" // Ruta corregida
              alt="Albañil"
              width={250}
              height={200}
              className="rounded-md object-cover mb-4" 
            />
            <h3 className="text-xl font-semibold text-gray-800">Albañil</h3>
            <p className="text-gray-600 text-sm mt-2">Construcción y reparación de estructuras.</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-md text-center flex flex-col items-center">
            <Image
              src="/images/services/plumber.jpg" // Ruta corregida
              alt="Fontanero"
              width={250}
              height={200}
              className="rounded-md object-cover mb-4" 
            />
            <h3 className="text-xl font-semibold text-gray-800">Fontanero</h3>
            <p className="text-gray-600 text-sm mt-2">Reparación de tuberías, grifos, inodoros.</p>
          </div>
        </div>
      </section>

      <section id='functions' className="py-16 px-4 w-full bg-red-700 text-white">
        <h2 className="text-4xl font-extrabold mb-12 text-center">¿Cómo funciona?</h2>
        <div className="container mx-auto grid grid-cols-1 md:grid-cols-2 gap-12">
          <div className="flex flex-col items-center text-center">
            <h3 className="font-semibold text-3xl mb-8">Para Clientes</h3>
            <div className="space-y-8">
              <div className="flex flex-col items-center">
                <Image src="/images/icons/image (1).png" alt="Buscar" width={80} height={80}  />
                <h4 className="font-semibold text-2xl mb-2">1. Busca</h4>
                <p className="text-lg">Encuentra el profesional ideal por categoría, ubicación o calificación.</p>
              </div>
              <div className="flex flex-col items-center">
                <Image src="/images/icons/image (2).png" alt="Contacta" width={80} height={80}  />
                <h4 className="font-semibold text-2xl mb-2">2. Contacta</h4>
                <p className="text-lg">Envía un mensaje o llama directamente al profesional de tu elección.</p>
              </div>
              <div className="flex flex-col items-center">
                <Image src="/images/icons/image (3).png" alt="Contrata" width={80} height={80}  />
                <h4 className="font-semibold text-2xl mb-2">3. Contrata</h4>
                <p className="text-lg">Acuerda los detalles del servicio y califica la experiencia.</p>
              </div>
            </div>
          </div>
          <div className="flex flex-col items-center text-center mt-12 md:mt-0">
            <h3 className="font-semibold text-3xl mb-8">Para Expertos</h3>
            <div className="space-y-8">
              <div className="flex flex-col items-center">
                <Image src="/images/icons/image (4).png" alt="Regístrate" width={80} height={80}  />
                <h4 className="font-semibold text-2xl mb-2">1. Regístrate</h4>
                <p className="text-lg">Crea tu perfil y destaca tus habilidades.</p>
              </div>
              <div className="flex flex-col items-center">
                <Image src="/images/icons/image (5).png" alt="Ofrece tus servicios" width={80} height={80}  />
                <h4 className="font-semibold text-2xl mb-2">2. Ofrece tus servicios</h4>
                <p className="text-lg">Describe lo que haces y tu disponibilidad.</p>
              </div>
              <div className="flex flex-col items-center">
                <Image src="/images/icons/image.png" alt="Obtén clientes" width={80} height={80}  />
                <h4 className="font-semibold text-2xl mb-2">3. Obtén clientes</h4>
                <p className="text-lg">Conecta con personas que necesitan tus servicios en tu zona.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id='questions' className="py-16 px-4 w-full bg-white text-center">
        <h2 className="text-4xl font-extrabold text-gray-900 mb-6">¿Más preguntas?</h2>
        <p className="text-xl text-gray-600 mb-8">
          Visita nuestra sección de preguntas frecuentes o contáctanos.
        </p>
        <Link href="/faq">
          <Button variant="secondary" className="border-gray-800 text-gray-800 hover:bg-gray-800 hover:text-white">Ir a Preguntas Frecuentes</Button>
        </Link>
      </section>
    </div>
  );
}
