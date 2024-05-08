/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false,
  //  reactStrictMode: true, -- because of the 'bug' in react-beautiful-dnd
  swcMinify: true,
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'media.monum.es',
        port: '',
      },
    ],
  },
};

module.exports = nextConfig;
