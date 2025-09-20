// Client-side version (for use in Client Components, hooks, etc.)
export const FetchClient = async (url, options = {}) => {
  const baseUrl = process.env.NEXT_PUBLIC_API_URL || "";

  try {
    // Get access token from cookies on client
    const getCookie = (name) => {
      if (typeof document === 'undefined') return null;
      const value = `; ${document.cookie}`;
      const parts = value.split(`; ${name}=`);
      if (parts.length === 2) return parts.pop().split(';').shift();
      return null;
    };

    const accessToken = getCookie("accessToken");

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
      credentials: "include",
      ...options,
      // Remove next options as they're not valid on client-side
      next: undefined,
    });

    if (!res.ok) {
      if (res.status === 500) {
        throw new Error(`Server error: Failed to fetch data from ${url}`);
      } else if (res.status === 404) {
        throw new Error(`Resource not found: ${url}`);
      } else if (res.status === 401) {
        console.warn(`Unauthorized access to ${url}`);
        // You might want to redirect to login page here
        window.location.href = '/auth';
        throw new Error('Unauthorized');
      } else {
        console.warn(`Failed to fetch data from ${url}: ${res.statusText}`);
        throw new Error(`Request failed: ${res.statusText}`);
      }
    }

    // Handle cases where response might be empty (like for DELETE requests)
    const contentType = res.headers.get("content-type");
    if (contentType && contentType.includes("application/json")) {
      const data = await res.json();
      return data;
    }

    return null;

  } catch (error) {
    console.error("Error fetching data:", error);
    throw error; // Re-throw to allow error handling in calling code
  }
};

// Convenience methods for common HTTP verbs
export const clientApi = {
  get: (url, options = {}) => FetchClient(url, { ...options, method: "GET" }),
  post: (url, data, options = {}) => 
    FetchClient(url, { 
      ...options, 
      method: "POST", 
      body: JSON.stringify(data) 
    }),
  put: (url, data, options = {}) => 
    FetchClient(url, { 
      ...options, 
      method: "PUT", 
      body: JSON.stringify(data) 
    }),
  patch: (url, data, options = {}) => 
    FetchClient(url, { 
      ...options, 
      method: "PATCH", 
      body: JSON.stringify(data) 
    }),
  delete: (url, options = {}) => FetchClient(url, { ...options, method: "DELETE" }),
};