
import fetch from "isomorphic-unfetch"
import Router from "next/router"

function parseStatus(code, res) {
  return new Promise((resolve, reject) => {
      if (code >= 200 && code < 300) {
          res.then((response) => resolve(response))
      } else if(code === 401) {
        Router.push('/login')
        res.then((response) => reject(response))
      } else {
          res.then((response) => reject(response))
      }
  });
}

function parseError(err) {
  return new Promise((resolve, reject) => reject({ code: err.code, message: err.message }))
}

export default (path, options = {method: 'GET'}) => {
  const URL = localStorage.getItem('BASE_URL') || process.env.BASE_URL
  const requestURL = `${URL}${path}`;

  return fetch(requestURL, {
    headers: {
      'Content-Type': 'application/json',
      Authorization: 'Bearer ' + localStorage.getItem('TOKEN'),
      ...options.headers
    },
    ...options
  })
    .then((res) => parseStatus(res.status, res.json()))
    .catch((err) => parseError(err));
};