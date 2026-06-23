import { environment } from '../../../environments/environment';

const knownBackendUrls = ['http://localhost:8080', environment.apiBaseUrl].filter(Boolean);

export const API_BASE_URL = environment.apiBaseUrl;
export const API_URL = `${environment.apiBaseUrl}/api`;

export function assetUrl(url?: string): string | undefined {
  if (!url) return undefined;
  const normalizedUrl = persistedAssetUrl(url);
  if (normalizedUrl.startsWith('http')) return normalizedUrl;
  return `${API_BASE_URL}${normalizedUrl}`;
}

export function persistedAssetUrl(url?: string): string {
  if (!url) return '';
  for (const backendUrl of knownBackendUrls) {
    if (url.startsWith(backendUrl)) return url.slice(backendUrl.length);
  }
  return url;
}
