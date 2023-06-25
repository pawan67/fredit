/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ["uploadthing.com", "lh3.googleusercontent.com"],
  },
  experimental: {
    appDir: true,
  },
  // ignore ts build errors
  typescript: {
    ignoreBuildErrors: true,
  },
};

module.exports = nextConfig;
