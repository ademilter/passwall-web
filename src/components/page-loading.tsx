import React from 'react';
import { Spin } from 'antd';

function PageLoading() {
  return (
    <div className="page-loading-wrapper">
      <h1>PassWall</h1>
      <Spin />
    </div>
  );
}
export default PageLoading;
