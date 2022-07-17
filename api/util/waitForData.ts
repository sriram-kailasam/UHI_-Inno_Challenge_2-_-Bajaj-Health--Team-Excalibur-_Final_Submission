import { getCache } from "../cache";

const cache = getCache();

export async function waitForData<T>(key: string, minWait: number = 0) {
  return new Promise<T>((resolve, reject) => {
    let times = 0;

    setTimeout(() => {
      const interval = setInterval(async () => {
        if (times >= 10) {
          reject('timeout exceeded for ' + key);
          clearInterval(interval);
          return;
        }

        const data = await cache.get<T>(
          key
        );

        times++;

        if (data) {
          console.log(`Data fetched for ${key}`);

          resolve(data);
          clearInterval(interval);
        }
      }, 1000);
    }, minWait)

  });
}

