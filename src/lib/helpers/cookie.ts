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
  maxAgeSeconds = 60 * 60 * 24 * 7,
) => {
  if (typeof document === "undefined") return;

  document.cookie = `${name}=${encodeURIComponent(value)}; path=/; max-age=${maxAgeSeconds}; SameSite=Lax`;
};
