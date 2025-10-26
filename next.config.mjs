/** @type {import('next').NextConfig} */
const backendUrl = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:8081'
const backend = new URL(backendUrl)

const nextConfig = {
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
    remotePatterns: [
      {
        protocol: backend.protocol.replace(':', ''),
        hostname: backend.hostname,
        port: backend.port || undefined,
        pathname: '/uploads/**',
      },
      {
        protocol: 'https',
        hostname: 'res.cloudinary.com',
        pathname: '/**',
      },
    ],
  },
  async rewrites() {
    return []
  },
}

export default nextConfig
