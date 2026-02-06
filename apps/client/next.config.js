/** @type {import('next').NextConfig} */
const nextConfig = {
  transpilePackages: ["@daily-dictation/ui"],
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: 'http://localhost:3001/api/:path*',
      },
    ]
  },
};

export default nextConfig;
