const createNextIntlPlugin = require('next-intl/plugin');
const { i18n } = require('next-intl');

const withNextIntl = createNextIntlPlugin();

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false,
  swcMinify: true,
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'media.monum.es',
        port: '',
      },
      {
        protocol: 'https',
        hostname: 'monum-profile-images.s3.eu-west-1.amazonaws.com',
        port: '',
      },
    ],
  },
  i18n,
};

module.exports = withNextIntl(nextConfig);
