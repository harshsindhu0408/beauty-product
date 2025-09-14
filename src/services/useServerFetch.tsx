import { notFound } from "next/navigation";

export const FetchData = async (url, options = {}) => {
  const baseUrl = process.env.NEXT_PUBLIC_API_BACKEND_URL || "";

  try {
    const res = await fetch(`${baseUrl}${url}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        ...(options.headers || {}),
      },
      next: {
        tags: [url],
        revalidate: options.revalidate ?? 30,
      },
      credentials: "include",
      ...options,
    });

    if (!res.ok) {
      if (res.status === 500) {
        throw new Error(`Server error: Failed to fetch data from ${url}`);
      } else if (res.status === 404) {
        notFound();
      } else {
        console.warn(`Failed to fetch data from ${url}: ${res.statusText}`);
        return null;
      }
    }

    const data = await res.json();
    return data;
  } catch (error) {
    console.error("Error fetching data:", error);
    throw error;
  }
};
