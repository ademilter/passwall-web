import isomorphicUnFetch from 'isomorphic-unfetch';
import { isServer } from '../utils';

interface FetchOptions extends RequestInit {
  text?: boolean;
}

function parseStatus<T>(code: number, res: Promise<T>): Promise<T> {
  return new Promise((resolve, reject) => {
    if (code >= 200 && code < 300) {
      res.then(response => resolve(response));
    } else if (code === 401) {
      res.then(response => reject(response));
    } else {
      res.then(response => reject(response));
    }
  });
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function parseError(err: any) {
  return new Promise((resolve, reject) => reject({ code: err.code, message: err.message || 'An error occurred' }));
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function fetch<T = any>(path: string, options: FetchOptions = { method: 'GET' }): Promise<T> {
  const URL = isServer() ? process.env.BASE_URL : localStorage.getItem('BASE_URL') || process.env.BASE_URL;
  const requestURL = `${URL}${path}`;

  const TOKEN = isServer() ? '' : `Bearer ${localStorage.getItem('TOKEN')}`;

  return isomorphicUnFetch(requestURL, {
    headers: {
      'Content-Type': 'application/json',
      Authorization: TOKEN,
      ...options.headers,
    },
    ...options,
  })
    .then(res => {
      const body = options.text ? res.text() : res.json();
      return parseStatus(res.status, body);
    })
    .catch(err => parseError(err));
}

export default fetch;
