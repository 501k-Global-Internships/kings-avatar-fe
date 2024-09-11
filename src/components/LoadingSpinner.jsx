import React from 'react';
import { css } from '@emotion/react';
import ClipLoader from "react-spinners/ClipLoader";
import './LoadingSpinner.scss';

const override = css`
display: block;
margin: 0 auto;
position: absolute;
top: 50%;
left: 50%;
transform: translate(-50%, -50%);
z-index: 9999; 
`;

const LoadingSpinner = ({ loading }) => {
  return (
    loading && (
      <div className="loading-spinner-overlay">
        <ClipLoader color="#3183ff" loading={loading} css={override} size={25} />
      </div>
    )
  );
};

export default LoadingSpinner;
