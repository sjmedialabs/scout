export async function authFetch(
  url: string,
  options: RequestInit = {},
  token?: string | null,
) {
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
