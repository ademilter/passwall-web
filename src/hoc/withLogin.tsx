import React from 'react'
import { NextPage } from 'next'
import { hasToken } from '../utils'
import { cache } from 'swr'
import fetch from '../libs/fetch'
import PageLoading from '../components/page-loading'
import LoginForm from '../components/login-form'
import { message } from 'antd'

function withLogin(Component: NextPage<any>) {
  const WithLogin = (props: any) => {
    const [errorMessage, setErrorMessage] = React.useState('')

    const [isLoading, setIsLoading] = React.useState(true)

    const [isShownLoginForm, setIsShownLoginFrom] = React.useState(false)

    const showLoginForm = React.useCallback(() => {
      setIsShownLoginFrom(true)
    }, [])

    const onSubmit = React.useCallback(async (values: any, actions: any) => {
      try {
        localStorage.setItem('BASE_URL', values.BaseURL)
        const { token } = await fetch('/auth/signin', {
          method: 'POST',
          body: JSON.stringify(values)
        })
        localStorage.setItem('TOKEN', token)
        cache.clear()
        setIsShownLoginFrom(false)
      } catch (e) {
        setErrorMessage(e.message)
        message.error(e.message)
      }
    }, [])

    const checkToken = React.useCallback(async () => {
      if (!hasToken()) {
        setIsLoading(false)
        setIsShownLoginFrom(true)
        return
      }

      try {
        await fetch('/auth/check', { method: 'POST' })

        setIsLoading(false)
        setIsShownLoginFrom(false)
      } catch (error) {
        setIsLoading(false)
        setIsShownLoginFrom(true)
      }
    }, [])

    React.useEffect(() => {
      checkToken()
    }, [])

    if (isLoading) {
      return <PageLoading />
    }
    if (isShownLoginForm) {
      return <LoginForm onSubmit={onSubmit} errorMessage={errorMessage} />
    }

    return <Component {...props} showLoginForm={showLoginForm} />
  }

  WithLogin.displayName = `withLogin(${
    Component.displayName || Component.name || 'Component'
  }`

  WithLogin.getInitialProps = Component.getInitialProps

  return WithLogin
}

export default withLogin
