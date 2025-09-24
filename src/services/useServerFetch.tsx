import { notFound } from "next/navigation";
import { cookies } from "next/headers";

// Server-side version (for use in Server Components, Server Actions, etc.)
export const FetchData = async (url: string, options: { method?: string; headers?: Record<string, string>; [key: string]: any } = {}) => {
  const baseUrl = process.env.NEXT_PUBLIC_API_URL || "";

  try {
    // Get access token from cookies on server
    const cookieStore = await cookies();
    const accessToken = cookieStore.get("accessToken")?.value;

    const headers = {
      "Content-Type": "application/json",
      ...(options.headers || {}),
    };

    // Add Authorization header if access token exists
    if (accessToken) {
      headers["Authorization"] = `Bearer ${accessToken}`;
    }

    const res = await fetch(`${baseUrl}${url}`, {
      method: options.method || "GET",
      headers,
      cache: "no-store", // 👈 This line disables caching
      credentials: "include",
      ...options,
    });

    if (!res.ok) {
      if (res.status === 500) {
        throw new Error(`Server error: Failed to fetch data from ${url}`);
      } else if (res.status === 401) {
        console.warn(`Unauthorized access to ${url}`);
        // Return null instead of throwing to avoid breaking the page
        return null;
      } else {
        console.warn(`Failed to fetch data from ${url}: ${res.statusText}`);
        return null;
      }
    }

    const data = await res.json();
    return data;
  } catch (error) {
    console.error("Error fetching data:", error);
    // Return null instead of throwing to avoid breaking the page
    return null;
  }
};