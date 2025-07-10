/** @type {import('next').NextConfig} */
const nextConfig = {
  // --- AÑADE ESTA SECCIÓN ---
  eslint: {
    // Advertencia: Esto permite que el proyecto se construya (build)
    // incluso si tu código tiene errores de ESLint.
    ignoreDuringBuilds: true,
  },
};

export default nextConfig;