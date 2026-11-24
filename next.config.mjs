/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    // Only needed while some content still points at the old Solo CDN.
    remotePatterns: [
      { protocol: "https", hostname: "images.unsplash.com" },
      { protocol: "https", hostname: "cdn.soloist.ai" },
    ],
  },
};

export default nextConfig;
