/** @type {import('next').NextConfig} */
const nextConfig = {
  // Do NOT use standalone output - incompatible with Netlify's serverless
  // The @netlify/plugin-nextjs handles deployment automatically

  // Trailing slash behavior
  trailingSlash: false,

  // Image optimization - use Netlify's image CDN
  images: {
    unoptimized: false,
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
      },
    ],
  },

  // Disable x-powered-by header for security
  poweredByHeader: false,
};

module.exports = nextConfig;
