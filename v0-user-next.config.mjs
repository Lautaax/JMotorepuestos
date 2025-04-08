/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: ['placeholder.com', 'via.placeholder.com'],
  },
  // Configuración para manejar módulos de servidor
  webpack: (config, { isServer }) => {
    if (!isServer) {
      // No incluir módulos de servidor en el bundle del cliente
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
        net: false,
        tls: false,
        dns: false,
        child_process: false,
        aws4: false,
        'util/types': false,
      };
      
      // Ignorar módulos binarios en el cliente
      config.module = config.module || {};
      config.module.rules = config.module.rules || [];
      
      // Regla para ignorar archivos .node
      config.module.rules.push({
        test: /\.node$/,
        loader: 'null-loader',
      });
      
      // Regla para ignorar archivos HTML en node_modules
      config.module.rules.push({
        test: /\.html$/,
        include: /node_modules/,
        loader: 'null-loader',
      });
      
      // Ignorar módulos específicos en el cliente
      config.module.rules.push({
        test: /mongodb|bcrypt|@mongodb-js\/zstd|snappy|kerberos|mongodb-client-encryption/,
        use: 'null-loader',
      });
    }
    return config;
  },
  // Asegurarse de que ciertos paquetes solo se importen en el servidor
  serverExternalPackages: [
    'mongodb', 
    'mongoose', 
    'mercadopago', 
    'lru-cache',
    'xlsx',
    'bcrypt',
    '@mapbox/node-pre-gyp',
    '@mongodb-js/zstd',
    'snappy',
    'kerberos',
    'mongodb-client-encryption'
  ],
  // Configuración experimental
  experimental: {
    // Habilitar compilaciones paralelas para mejorar el rendimiento
    parallelServerCompiles: true,
    parallelServerBuildTraces: true,
    // Configuración para manejar módulos de servidor
    serverMinification: true,
    serverSourceMaps: true,
  },
};

export default nextConfig;
