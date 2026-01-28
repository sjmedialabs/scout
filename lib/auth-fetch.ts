export async function authFetch(url: string, options: RequestInit = {}) {
  if (typeof window === "undefined") {
    throw new Error("authFetch can only be used on the client");
  }

  const token = localStorage.getItem("token");

  if (!token) {
    throw new Error("Auth token missing");
  }

  return fetch(url, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
      ...(options.headers || {}),
    },
  });
}
