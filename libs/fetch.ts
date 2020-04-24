import fetch from 'isomorphic-unfetch'
import { isServer } from '../utils'

function parseStatus(code: number, res: Promise<any>) {
  return new Promise((resolve, reject) => {
    if (code >= 200 && code < 300) {
      res.then((response) => resolve(response))
    } else if (code === 401) {
      res.then((response) => reject(response))
    } else {
      res.then((response) => reject(response))
    }
  })
}

function parseError(err: any) {
  return new Promise((resolve, reject) =>
    reject({ code: err.code, message: err.message || 'An error occurred' })
  )
}

export default (
  path: string,
  options: any = { method: 'GET' }
): Promise<any> => {
  const URL = isServer()
    ? process.env.BASE_URL
    : localStorage.getItem('BASE_URL') || process.env.BASE_URL
  const requestURL = `${URL}${path}`

  const TOKEN = isServer() ? '' : 'Bearer ' + localStorage.getItem('TOKEN')

  return fetch(requestURL, {
    headers: {
      'Content-Type': 'application/json',
      Authorization: TOKEN,
      ...options.headers
    },
    ...options
  })
    .then((res) => {
      const body = options.text ? res.text() : res.json()
      return parseStatus(res.status, body)
    })
    .catch((err) => parseError(err))
}
