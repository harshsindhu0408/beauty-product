// lib/clientFetch.js

export const clientFetch = async (url, options = {}) => {
  const baseUrl = process.env.NEXT_PUBLIC_API_URL || "";

  try {
    let accessToken = null;

    // ✅ Get access token from localStorage (client-side only)
    if (typeof window !== "undefined") {
      accessToken = localStorage.getItem("accessToken");
    }

    const headers = {
      "Content-Type": "application/json",
      ...(options.headers || {}),
    };

    // ✅ Add Authorization header if token exists
    if (accessToken) {
      headers["Authorization"] = `Bearer ${accessToken}`;
    }

    const res = await fetch(`${baseUrl}${url}`, {
      method: options.method || "GET",
      headers,
      credentials: accessToken ? "include" : "omit",
      cache: "no-store", // disable caching (optional but recommended)
      ...options,
    });

    // ✅ Handle non-OK responses
    if (!res.ok) {
      if (res.status === 500) {
        throw new Error(`Server error: Failed to fetch data from ${url}`);
      } else if (res.status === 404) {
        console.warn(`Resource not found: ${url}`);
        return null;
      } else if (res.status === 401) {
        console.warn(`Unauthorized access to ${url}`);

        // 🧹 Clear all authentication data
        if (typeof window !== "undefined") {
          localStorage.removeItem("accessToken");

          // Delete cookie-based auth tokens (if any exist)
          document.cookie = "accessToken=; Max-Age=0; path=/;";
          document.cookie = "refreshToken=; Max-Age=0; path=/;";

          // 🔁 Redirect to login or home page
          window.location.href = "/";
        }

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
    return null;
  }
};

// 🔁 Utility: debounce function for client-side event optimization
export const debounce = (func, delay) => {
  let timeoutId;
  return (...args) => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => func.apply(null, args), delay);
  };
};
