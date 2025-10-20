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
    ],
  },
  async rewrites() {
    if (process.env.NODE_ENV === 'development') {
      return [
        {
          source: '/uploads/:path*',
          destination: `${backend.origin}/uploads/:path*`,
        },
      ]
    }
    return []
  },
}

export default nextConfig
