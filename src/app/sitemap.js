export default function sitemap() {
  const baseUrl = "https://www.saundryaearth.com";

  const staticPages = [
    { url: baseUrl, priority: 1.0, changeFrequency: "daily" },
    { url: `${baseUrl}/products`, priority: 0.9, changeFrequency: "daily" },
    { url: `${baseUrl}/categories`, priority: 0.9, changeFrequency: "daily" },
    { url: `${baseUrl}/about`, priority: 0.8, changeFrequency: "monthly" },
    {
      url: `${baseUrl}/testimonials`,
      priority: 0.8,
      changeFrequency: "monthly",
    },
    { url: `${baseUrl}/faq`, priority: 0.7, changeFrequency: "monthly" },
    { url: `${baseUrl}/support`, priority: 0.6, changeFrequency: "monthly" },
    {
      url: `${baseUrl}/privacy-policy`,
      priority: 0.5,
      changeFrequency: "yearly",
    },
    {
      url: `${baseUrl}/terms-and-conditions`,
      priority: 0.5,
      changeFrequency: "yearly",
    },
    {
      url: `${baseUrl}/return-refund-policy`,
      priority: 0.5,
      changeFrequency: "yearly",
    },
  ];

  return staticPages.map((page) => ({
    ...page,
    lastModified: new Date(),
  }));
}
