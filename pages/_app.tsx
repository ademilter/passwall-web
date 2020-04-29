import * as React from 'react';
import { AppProps } from 'next/app';
import Head from 'next/head';

import 'antd/dist/antd.css';
import '../styles/app.css';

const App: React.FC<AppProps> = ({ Component, pageProps }) => (
  <div>
    <Head>
      <link rel="apple-touch-icon" sizes="180x180" href="/images/favicon/apple-icon-180x180.png" />
      <link rel="icon" type="image/png" sizes="32x32" href="/images/favicon/favicon-32x32.png" />
      <link rel="icon" type="image/png" sizes="16x16" href="/images/favicon/favicon-16x16.png" />
      <link rel="manifest" href="/images/favicon/manifest.json" />
      <link rel="mask-icon" href="/images/favicon/safari-pinned-tab.svg" color="#5bbad5" />
      <meta name="msapplication-TileColor" content="#da532c" />
      <meta name="theme-color" content="#ffffff" />
    </Head>
    <Component {...pageProps} />
  </div>
);

export default App;
