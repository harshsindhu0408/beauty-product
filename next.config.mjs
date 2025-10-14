/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "http",
        hostname: "localhost",
        port: "8080", // 👈 allow your backend dev server
        pathname: "/uploads/products/**",
      },
      {
        protocol: "https",
        hostname: "api.saundryaearth.com",
        pathname: "/uploads/products/**",
      },
    ],
  },
};

export default nextConfig;
