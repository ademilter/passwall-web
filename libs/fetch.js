import fetch from 'isomorphic-unfetch'
import Router from 'next/router'
import { message } from 'antd'

export default async function (path, options = {}) {
  const URL = localStorage.getItem('BASE_URL') || process.env.BASE_URL;
  const { showToaster = true, ...rest } = options;

  try {
    const res = await fetch(`${URL}${path}`, {
      headers: {
        'Content-Type': 'application/json',
        Authorization: 'Bearer ' + localStorage.getItem('TOKEN')
      },
      ...rest,
    });
    if (res.status == 401) {
      Router.push('/login');

      return Promise.reject(res);
    }
    else if (showToaster && res.status === 400) {
      message.error('Bad request');

      return Promise.reject(res);
    } else if (showToaster && res.status === 404) {
      message.error('Not found on server');

      return Promise.reject(res);
    } else if (showToaster && res.status !== 200) {
      message.error('Something happened on server');

      return Promise.reject(res);
    }

    return res.json()
  } catch (e) {
    if (showToaster) {
      message.error('Request failed');
    }

    return Promise.reject(e);
  }
}
