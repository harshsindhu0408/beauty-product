export default function robots() {
  const baseUrl = "https://saundryaearth.com";

  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: [
        "/api/",
        "/admin/", // If you have an admin dashboard
        "/account/", // Keep user accounts private
        "/cart",
        "/checkout",
        "/verify-email",
        "/verify-otp",
        "/*?*", // Disallow query parameters to prevent duplicate indexing
      ],
    },
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}
