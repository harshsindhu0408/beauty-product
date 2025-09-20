// lib/clientFetch.js

// Client-side version (for use in Client Components)
export const clientFetch = async (url, options = {}) => {
  const baseUrl = process.env.NEXT_PUBLIC_API_URL || "";

  try {
    // Get access token from localStorage on client
    let accessToken = null;
    if (typeof window !== 'undefined') {
      accessToken = localStorage.getItem('accessToken');
    }

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
      credentials: accessToken ? "include" : "omit", // Only include credentials if we have a token
      ...options,
    });

    if (!res.ok) {
      if (res.status === 500) {
        throw new Error(`Server error: Failed to fetch data from ${url}`);
      } else if (res.status === 404) {
        console.warn(`Resource not found: ${url}`);
        return null;
      } else if (res.status === 401) {
        console.warn(`Unauthorized access to ${url}`);
        // Clear invalid token
        if (typeof window !== 'undefined') {
          localStorage.removeItem('accessToken');
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

export const debounce = (func, delay) => {
  let timeoutId;
  return (...args) => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => func.apply(null, args), delay);
  };
};