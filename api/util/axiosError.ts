import axios from 'axios';

export function logAxiosError(err: Error): void {
  if (axios.isAxiosError(err)) {
    console.log('Axios Error: ', {
      baseUrl: err.response?.config.baseURL,
      url: err.response?.config.url,
      status: err.response?.status,
      data: err.response?.data,
    });
  }
}
