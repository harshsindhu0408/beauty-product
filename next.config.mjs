/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "http",
        hostname: "localhost",
        pathname: "/uploads/**",
      },
      {
        protocol: "https",
        hostname: "api.saundryaearth.com",
        pathname: "/uploads/products/**",
      },
      {
        protocol: "https",
        hostname: "api.saundryaearth.com",
        pathname: "/uploads/banners/**",
      },
      {
        protocol: "https",
        hostname: "api.saundryaearth.com",
        pathname: "/uploads/categories/**",
      },
      {
        protocol: "https",
        hostname: "images.unsplash.com",
        pathname: "/**",
      },
    ],
  },
};

export default nextConfig;
