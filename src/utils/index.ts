export const isServer = () => typeof window === 'undefined';

const isValidToken = (token: string) =>
  Boolean(token && /^[A-Za-z0-9-_=]+\.[A-Za-z0-9-_=]+\.?[A-Za-z0-9-_.+/=]*$/.test(token));

export const hasToken = () => {
  if (isServer()) {
    return false;
  }

  const token = localStorage.getItem('TOKEN');

  return isValidToken(token || '');
};

export function trimEllip(str: string, length: number) {
  return str.length > length ? `${str.substring(0, length)}...` : str;
}
