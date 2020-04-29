import * as React from 'react';
import { Typography } from 'antd';
import { TitleProps } from 'antd/lib/typography/Title';

const PassTitle: React.FC<TitleProps> = titleProps => (
  <Typography.Title {...titleProps}>
    <img src="/images/icon_256.png" alt="Logo" height="48" width="48" />
    <span style={{ fontWeight: 'bold' }}>Pass</span>
    Wall
  </Typography.Title>
);

export default PassTitle;
