import { getCache } from "../cache";

const cache = getCache();

export async function waitForData<T>(key: string) {
  return new Promise((resolve, reject) => {
    let times = 0;
    const interval = setInterval(async () => {
      if (times >= 10) {
        reject(' timeout exceeded for ' + key);
        clearInterval(interval);
        return;
      }

      const bookingDetails = await cache.get<T>(
        key
      );

      times++;

      if (bookingDetails) {
        console.log(`Data fetched for ${key}`);

        resolve(bookingDetails);
        clearInterval(interval);
      }
    }, 1000);
  });
}

