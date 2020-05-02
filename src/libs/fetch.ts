/* eslint-disable no-use-before-define */
/* eslint-disable @typescript-eslint/no-use-before-define */
/* eslint-disable @typescript-eslint/no-explicit-any */
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

function parseError(err: any) {
  return new Promise((resolve, reject) =>
    reject({ code: err.code, message: err.message, errors: err.errors || 'An error occurred' }),
  );
}

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
    .catch(err => {
      const isRefreshTokenError = err.errors && err.errors.includes('REFRESH_TOKEN_ERROR');
      if (err.code === 401 && !isRefreshTokenError) {
        return refreshToken(path, options);
      }
      return parseError(err);
    });
}

async function refreshToken(path: string, options: FetchOptions) {
  try {
    const response = await fetch('/auth/refresh', {
      method: 'POST',
      body: JSON.stringify({
        refresh_token: localStorage.getItem('REFRESH_TOKEN'),
      }),
    });

    const { access_token: TOKEN, refresh_token: REFRESH_TOKEN } = response;

    if (TOKEN && REFRESH_TOKEN) {
      localStorage.setItem('TOKEN', TOKEN);
      localStorage.setItem('REFRESH_TOKEN', REFRESH_TOKEN);

      if (path) return await fetch(path, options);
    }
  } catch ({ errors }) {
    if (errors && errors.includes('REFRESH_TOKEN_ERROR')) {
      localStorage.removeItem('TOKEN');
      localStorage.removeItem('REFRESH_TOKEN');

      if (!isServer()) {
        // force update withLogin
        window.location.href = '/';
      }
      return null;
    }
  }

  return null;
}

export default fetch;
