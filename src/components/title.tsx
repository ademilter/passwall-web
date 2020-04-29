import * as React from 'react';
import { Typography } from 'antd';
import { TitleProps } from 'antd/lib/typography/Title';

const PassTitle: React.FC<TitleProps> = titleProps => (
  <Typography.Title {...titleProps}>
    <img src="/images/icon_125.png" alt="Logo" height="40" width="40" style={{ margin: 5 }} />
    <span style={{ fontWeight: 'bold' }}>Pass</span>
    Wall
  </Typography.Title>
);

export default PassTitle;
