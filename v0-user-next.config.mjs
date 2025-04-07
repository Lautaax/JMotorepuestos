/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ['localhost', 'placeholder.com', 'via.placeholder.com'],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
      },
    ],
  },
  // Asegurarse de que todas las rutas dinámicas usen el mismo nombre de parámetro
  experimental: {
    // Asegurarse de que no haya conflictos entre [id] y [slug]
    typedRoutes: true,
  },
};

export default nextConfig;

