/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    // Only needed while some content still points at the old Solo CDN.
    remotePatterns: [
      { protocol: "https", hostname: "images.unsplash.com" },
      { protocol: "https", hostname: "cdn.soloist.ai" },
    ],
  },
  // Next serves files, not directory indexes, from public/.
  // Tina writes the editor to public/admin/index.html.
  async rewrites() {
    return [{ source: "/admin", destination: "/admin/index.html" }];
  },
};

export default nextConfig;
