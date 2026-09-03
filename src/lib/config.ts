export const API_URL =
  process.env.REACT_APP_API_URL || "http://localhost:3017/api";

export const SERVER_URL = API_URL.replace(/\/api\/?$/, "");

export function getAssetUrl(path?: string): string | undefined {
  if (!path) return undefined;
  if (/^https?:\/\//.test(path)) return path;
  return `${SERVER_URL}${path.startsWith("/") ? path : `/${path}`}`;
}
