import React from 'react';
import { NextPage } from 'next';
import { cache } from 'swr';
import { message } from 'antd';
import { hasToken } from '../utils';
import fetch from '../libs/fetch';
import PageLoading from '../components/page-loading';
import LoginForm from '../components/login-form';
import { SingInParameter } from '../helpers/Login';

function withLogin<T>(Component: NextPage<T>) {
  const WithLogin = (props: T) => {
    const [errorMessage, setErrorMessage] = React.useState('');

    const [isLoading, setIsLoading] = React.useState(true);

    const [isShownLoginForm, setIsShownLoginFrom] = React.useState(false);

    const showLoginForm = React.useCallback(() => {
      setIsShownLoginFrom(true);
    }, []);

    const onSubmit = React.useCallback(async (values: SingInParameter) => {
      try {
        localStorage.setItem('BASE_URL', values.base_url);
        const { access_token, refresh_token } = await fetch('/auth/signin', {
          method: 'POST',
          body: JSON.stringify(values),
        });
        localStorage.setItem('TOKEN', access_token);
        localStorage.setItem('REFRESH_TOKEN', refresh_token);
        cache.clear();
        setIsShownLoginFrom(false);
      } catch (e) {
        setErrorMessage(e.message);
        message.error(e.message);
      }
    }, []);

    const checkToken = React.useCallback(async () => {
      if (!hasToken()) {
        setIsLoading(false);
        setIsShownLoginFrom(true);
        return;
      }

      try {
        await fetch('/auth/check', { method: 'POST' });

        setIsLoading(false);
        setIsShownLoginFrom(false);
      } catch (error) {
        setIsLoading(false);
        setIsShownLoginFrom(true);
      }
    }, []);

    React.useEffect(() => {
      checkToken();
    }, [checkToken]);

    if (isLoading) {
      return <PageLoading />;
    }
    if (isShownLoginForm) {
      return <LoginForm onSubmit={onSubmit} errorMessage={errorMessage} />;
    }

    return <Component {...props} showLoginForm={showLoginForm} />;
  };

  WithLogin.displayName = `withLogin(${Component.displayName || Component.name || 'Component'}`;

  WithLogin.getInitialProps = Component.getInitialProps;

  return WithLogin;
}

export default withLogin;
