/** @type {import('next').NextConfig} */
const nextConfig = {
  // Standard build - let Netlify handle it
  trailingSlash: false,

  // Use unoptimized images to avoid serverless complexity
  images: {
    unoptimized: true,
  },

  // Disable x-powered-by header for security
  poweredByHeader: false,
};

module.exports = nextConfig;
