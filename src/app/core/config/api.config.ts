const localBackendUrl = 'http://localhost:8080';

export const API_BASE_URL = window.location.hostname === 'localhost' && window.location.port === '4200'
  ? localBackendUrl
  : '';

export const API_URL = `${API_BASE_URL}/api`;

export function assetUrl(url?: string): string | undefined {
  if (!url) return undefined;
  const normalizedUrl = persistedAssetUrl(url);
  if (normalizedUrl.startsWith('http')) return normalizedUrl;
  return `${API_BASE_URL}${normalizedUrl}`;
}

export function persistedAssetUrl(url?: string): string {
  if (!url) return '';
  if (url.startsWith(localBackendUrl)) return url.slice(localBackendUrl.length);
  if (API_BASE_URL && url.startsWith(API_BASE_URL)) return url.slice(API_BASE_URL.length);
  return url;
}
