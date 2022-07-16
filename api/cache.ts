import Cache from 'node-cache';

let cache: Cache;

export function getCache(): Cache {
  if (cache) {
    return cache;
  }

  cache = new Cache();
  return cache;
}
