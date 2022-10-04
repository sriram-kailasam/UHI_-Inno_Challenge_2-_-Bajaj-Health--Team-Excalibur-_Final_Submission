import { logAxiosError } from './axiosError';
import axios from 'axios';

type RunSafeResult<T> = {
  data?: T;
  error?: Error;
  isError: boolean;
};

export async function runSafe<T>(promise: Promise<T>): Promise<RunSafeResult<T>> {
  try {
    const data = await promise;
    return { data, isError: false };
  } catch (err) {
    if (axios.isAxiosError(err)) {
      logAxiosError(err as Error);
    } else {
      console.error(err);
    }

    return { error: err as Error, isError: true };
  }
}
