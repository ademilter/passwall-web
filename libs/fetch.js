import fetch from 'isomorphic-unfetch'
import Router from 'next/router'

export default async function (path, options) {
  const URL = localStorage.getItem('BASE_URL') || process.env.BASE_URL

  const res = await fetch(`${URL}${path}`, {
    headers: {
      'Content-Type': 'application/json',
      Authorization: 'Bearer ' + localStorage.getItem('TOKEN')
    },
    ...options
  })

  if (![200, 201].includes(res.status)) await Router.push('/login')

  return res.json()
}
