/** @type {import('next').NextConfig} */
const nextConfig = {
  webpack: (config, { isServer }) => {
    if (!isServer) {
      // Don't resolve Node.js modules on the client-side
      config.resolve.fallback = {
        ...config.resolve.fallback,
        child_process: false,
        fs: false,
        net: false,
        tls: false,
        os: false,
        path: false,
      };
    }
    return config;
  },
  experimental: {
    serverComponentsExternalPackages: ['firebase-admin']
  }
};

module.exports = nextConfig;