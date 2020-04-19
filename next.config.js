const {
  PHASE_DEVELOPMENT_SERVER,
  PHASE_PRODUCTION_BUILD
} = require('next/constants')

const DEV_BASE_URL = 'http://0.0.0.0:3625'
const PROD_BASE_URL = 'https://passwall-server.herokuapp.com'

module.exports = function (phase, { defaultConfig }) {
  const isDev = phase === PHASE_DEVELOPMENT_SERVER
  const isProd = phase === PHASE_PRODUCTION_BUILD && process.env.STAGING !== '1'

  const env = {
    BASE_URL: (function () {
      if (isDev) return DEV_BASE_URL
      if (isProd) return PROD_BASE_URL
    })()
  }

  return {
    env
  }
}
