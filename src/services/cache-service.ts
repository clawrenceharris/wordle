/* eslint-disable @typescript-eslint/no-explicit-any */
type CacheEntry = {
  timestamp: number;
  data: any;
};
const cache: Record<string, CacheEntry> = {};
const TTL = 1000 * 60 * 60 * 12; // 12 hours
export const CacheService = {
  get(key: string) {
    const entry = cache[key];
    if (!entry) return null;
    if (Date.now() - entry.timestamp > TTL) {
      delete cache[key];
      return null;
    }
    return entry.data;
  },
  set(key: string, data: any) {
    cache[key] = { timestamp: Date.now(), data };
  },
};
