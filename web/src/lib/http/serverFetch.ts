export async function serverFetch(path: string, options: RequestInit = {}) {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_BACKEND_BASE_URL}${path}`,
    {
      ...options,
      headers: {
        ...options.headers,
      },
    }
  );

  if (!res.ok) {
    throw new Error(`HTTP error! status: ${res.status}`);
  }

  return res.text();
}
