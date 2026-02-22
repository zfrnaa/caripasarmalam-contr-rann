import withPWA from "@ducanh2912/next-pwa";

/** @type {import('next').NextConfig} */
const nextConfig = {
  output: "standalone",
  typescript: { ignoreBuildErrors: true },
  images: {unoptimized: true},
  turbopack: {},
  experimental: {
    outputFileTracingRoot: undefined,
  }
};

export default withPWA({
  dest: "public",
  cacheOnFrontEndNav: true,
  aggressiveFrontEndNavCaching: true,
  reloadOnOnline: true,
  swMinify: true,
  disable: process.env.NODE_ENV === "development",

  fallbacks: {
    document: "/offline", // shown for uncached HTML navigations
  },

  workboxOptions: {
    maximumFileSizeToCacheInBytes: 5 * 1024 * 1024,
    skipWaiting: true,
    clientsClaim: true,
    runtimeCaching: [
      // Next.js hashed static chunks — cache forever
      {
        urlPattern: /^https?:\/\/.*\/_next\/static\/.*/i,
        handler: "CacheFirst",
        options: {
          cacheName: "next-static-assets",
          expiration: { maxEntries: 200, maxAgeSeconds: 60 * 60 * 24 * 365 },
          cacheableResponse: { statuses: [0, 200] },
        },
      },
      // App HTML pages — NetworkFirst (fresh when online, cached when offline)
      {
        urlPattern: ({ request }) => request.mode === 'navigate',
        handler: "NetworkFirst",
        options: {
          cacheName: "page-cache",
          networkTimeoutSeconds: 3,
          expiration: { maxEntries: 50 },
          cacheableResponse: { statuses: [0, 200] },
        },
      },
      // Google Fonts CSS
      {
        urlPattern: /^https:\/\/fonts\.googleapis\.com\/.*/i,
        handler: "StaleWhileRevalidate",
        options: {
          cacheName: "google-fonts-stylesheets",
          expiration: { maxEntries:20 },
        },
      },
      // Google Fonts files
      {
        urlPattern: /^https:\/\/fonts\.gstatic\.com\/.*/i,
        handler: "CacheFirst",
        options: {
          cacheName: "google-fonts-webfonts",
          expiration: { maxEntries: 20, maxAgeSeconds: 60 * 60 * 24 * 365 },
          cacheableResponse: { statuses: [0, 200] },
        },
      },
    ],
  },
})(nextConfig);
