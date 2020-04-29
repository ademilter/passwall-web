import * as React from 'react';
import { AppProps } from 'next/app';
import Head from 'next/head';

import 'antd/dist/antd.css';
import '../styles/app.css';

const App: React.FC<AppProps> = ({ Component, pageProps }) => (
  <div>
    <Head>
      <link rel="icon" type="image/x-icon" href="/images/favicon.ico" />
    </Head>
    <Component {...pageProps} />
  </div>
);

export default App;
