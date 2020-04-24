import * as React from 'react';
import { AppProps } from 'next/app';

import 'antd/dist/antd.css';
import '../styles/app.css';

const App: React.FC<AppProps> = ({ Component, pageProps }) => <Component {...pageProps} />;

export default App;
