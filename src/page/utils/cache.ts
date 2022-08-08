const cache = new Map<string, any>();

export type CacheFn<T> = (fn: () => Promise<T>) => Promise<T>;

export function createCache<T>(key: string): CacheFn<T> {
  return async fn => {
    if (!cache.has(key)) cache.set(key, await fn());
    return cache.get(key);
  };
}
