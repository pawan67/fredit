/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ["uploadthing.com", "lh3.googleusercontent.com"],
  },
  experimental: {
    appDir: true,
  },
  
  typescript: {
    ignoreBuildErrors: true,
  },
};

module.exports = nextConfig;
