import React from 'react';
import { Spin } from 'antd';

function PageLoading() {
  return (
    <div className="page-loading-wrapper">
      <h1>PassWall</h1>
      <Spin />
      <style jsx>
        {`
          .page-loading-wrapper {
            width: 100%;
            height: 100vh;
            display: flex;
            align-items: center;
            justify-content: center;
            flex-direction: column;
          }
        `}
      </style>
    </div>
  );
}
export default PageLoading;
