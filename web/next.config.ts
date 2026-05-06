/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone',
  turbopack: {
    root: __dirname,
  },

  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.tokopedia.net',
      },
      {
        protocol: 'https',
        hostname: 'down-id.img.susercontent.com',
      },
      {
        protocol: 'https',
        hostname: 'cf.shopee.co.id',
      },
      {
        protocol: 'https',
        hostname: 'static.bmdstatic.com',
      },
      {
        protocol: 'https',
        hostname: 'www.static-src.com',
      },
      {
        protocol: 'https',
        hostname: 's0.bukalapak.com',
      },
      {
        protocol: 'https',
        hostname: 'assets.acer.com',
      },
      {
        protocol: 'https',
        hostname: 'www.asus.com',
      },
      {
        protocol: 'https',
        hostname: 'p1-ofp.static.pub',
      },
      {
        protocol: 'https',
        hostname: 'www.lenovo.com',
      },
      {
        protocol: 'https',
        hostname: 'ssl-product-images.www8-hp.com',
      },
      {
        protocol: 'https',
        hostname: 'i.dell.com',
      },
    ],
  },

  async headers() {
    const securityHeaders = [
      {
        key: 'X-DNS-Prefetch-Control',
        value: 'on',
      },
      {
        key: 'X-Frame-Options',
        value: 'DENY',
      },
      {
        key: 'X-Content-Type-Options',
        value: 'nosniff',
      },
      {
        key: 'Referrer-Policy',
        value: 'strict-origin-when-cross-origin',
      },
      {
        key: 'Permissions-Policy',
        value:
          'camera=(), microphone=(), geolocation=(), browsing-topics=(), payment=(), usb=(), magnetometer=(), gyroscope=(), accelerometer=()',
      },
      {
        key: 'Strict-Transport-Security',
        value: 'max-age=63072000; includeSubDomains; preload',
      },
      {
        key: 'Content-Security-Policy',
        value: [
          "default-src 'self'",
          "base-uri 'self'",
          "form-action 'self'",
          "frame-ancestors 'none'",
          "object-src 'none'",
          "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://js.puter.com",
          "style-src 'self' 'unsafe-inline'",
          "img-src 'self' data: blob: https:",
          "font-src 'self' data:",
          "connect-src 'self' https://*.supabase.co https://generativelanguage.googleapis.com https://api.cohere.ai https://api.exa.ai https://js.puter.com https://*.puter.com",
          'frame-src https://js.puter.com https://*.puter.com',
          "worker-src 'self' blob:",
          "manifest-src 'self'",
          'upgrade-insecure-requests',
        ].join('; '),
      },
    ];

    return [
      {
        source: '/(.*)',
        headers: securityHeaders,
      },
    ];
  },
};

module.exports = nextConfig;
