// src/services/clientfetch.js

export const clientFetch = async (url, options = {}) => {
  const baseUrl =
    process.env.NEXT_PUBLIC_API_URL || "https://api.saundryaearth.com/api/v1/";

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
      cache: "no-store",
      ...options,
    });

    // ✅ CORRECTED: Handle non-OK responses
    if (!res.ok) {
      let errorData = null;
      try {
        errorData = await res.json();
      } catch (e) {
        // Ignore JSON parse errors if response body is not JSON
      }

      const errorMessage =
        errorData?.message || res.statusText || "An error occurred";

      if (res.status === 500) {
        throw new Error(`Server error: Failed to fetch data from ${url}`);
      } else if (res.status === 404) {
        console.warn(`Resource not found: ${url}`);
        return null;
      } else if (res.status === 401) {
        console.warn(`Unauthorized access to ${url}`);

        // 🚫 Trigger logout process for 401 responses
        await handleLogout();
        return null;
      } else {
        // Throw error for 400 Bad Request and others so the UI can catch and show the message
        console.warn(`Failed to fetch data from ${url}: ${res.statusText}`);
        throw new Error(errorMessage);
      }
    }

    const data = await res.json();
    return data;
  } catch (error) {
    if (options.throwError) {
      throw error;
    }
    console.error("Error fetching data:", error);
    return null;
  }
};

// 🚫 Centralized logout function
export const handleLogout = async () => {
  if (typeof window === "undefined") return;

  try {
    // Optional: Call logout endpoint to invalidate token on server
    const baseUrl =
      process.env.NEXT_PUBLIC_API_URL ||
      "https://api.saundryaearth.com/api/v1/";
    const accessToken = localStorage.getItem("accessToken");

    if (accessToken) {
      await fetch(`${baseUrl}auth/logout`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
      }).catch((err) => {
        // Silently fail if logout API call fails
        console.warn("Logout API call failed:", err);
      });
    }
  } finally {
    // 🧹 Always clear client-side storage regardless of API call result
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    localStorage.removeItem("userData");

    // Delete all auth-related cookies
    const cookies = document.cookie.split(";");
    for (let i = 0; i < cookies.length; i++) {
      const cookie = cookies[i];
      const eqPos = cookie.indexOf("=");
      const name = eqPos > -1 ? cookie.substr(0, eqPos).trim() : cookie.trim();
      document.cookie = name + "=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/";
    }

    // 🔁 Redirect to login page
    window.location.href = "/auth"; // or "/login" depending on your route
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

// 🎯 Optional: Export a standalone logout function for manual use
export const logout = () => {
  if (typeof window !== "undefined") {
    handleLogout();
  }
};
