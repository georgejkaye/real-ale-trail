import type { NextConfig } from "next"

const nextConfig: NextConfig = {
  async rewrites() {
    return [
      {
        source: "/api/:path*",
        destination: `${process.env.API_PROTOCOL}://${process.env.API_HOST}/:path*`,
      },
    ]
  },
  output: "standalone",
  experimental: {
    authInterrupts: true,
  },
}

export default nextConfig
