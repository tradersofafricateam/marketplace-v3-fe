export const readCookie = (name: string) => {
  if (typeof document === "undefined") return undefined;

  const match = document.cookie
    .split("; ")
    .find((row) => row.startsWith(`${name}=`));

  return match ? decodeURIComponent(match.split("=")[1]) : undefined;
};

export const writeCookie = (
  name: string,
  value: string,
  maxAgeSeconds?: number,
) => {
  if (typeof document === "undefined") return;

  const maxAge = maxAgeSeconds !== undefined ? `; max-age=${maxAgeSeconds}` : "";
  document.cookie = `${name}=${encodeURIComponent(value)}; path=/${maxAge}; SameSite=Lax`;
};

export const deleteCookie = (name: string) => {
  if (typeof document === "undefined") return;

  document.cookie = `${name}=; path=/; max-age=0; SameSite=Lax`;
};
