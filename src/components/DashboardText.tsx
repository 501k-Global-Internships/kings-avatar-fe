import React, { useRef, useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import Draggable from 'react-draggable';
import { AxiosError } from 'axios';
import axios from '../api/axios';
import { ErrorResponse } from './AppInterface';
import DashboardHeader from './DashboardHeader';
import SideNav from './SideNav';
import UntitledProject from './UntitledProject';
import FontIcon from '../assets/fontsize.svg';
import TextEffectsIcon from '../assets/textEffects.svg';
import html2canvas from 'html2canvas';

const DashboardText: React.FC = () => {
  const location = useLocation();
  const combinedImage = location.state?.combinedImage;

  const textRef = useRef<HTMLDivElement | null>(null);
  const imgSectionRef = useRef<HTMLDivElement | null>(null);

  const [frameSize, setFrameSize] = useState(100);
  const [frameHeight, setFrameHeight] = useState(15);
  const [errMsg, setErrMsg] = useState<{ msg: string }[]>([]);
  const errRef = useRef<HTMLDivElement | null>(null);

  const handleDownloadImage = async () => {
    if (imgSectionRef.current) {
      const canvas = await html2canvas(imgSectionRef.current);

      // Convert the canvas to a blob
      canvas.toBlob(async (blob) => {
        if (blob) {
          // Create a file from the blob
          const file = new File([blob], 'kings-avatar.png', { type: 'image/png' });

          // Upload the file
          const formData = new FormData();
          formData.append('image', file);

          try {
            await axios.post('/upload/projects', formData, {
              headers: {
                'Content-Type': 'multipart/form-data',
                Authorization: 'Bearer ' + localStorage.getItem('token'),
              },
              withCredentials: true
            });

            // Download the image
            const link = document.createElement('a');
            link.href = canvas.toDataURL('image/png');
            link.download = 'final-image.png';
            link.click();

          } catch (err) {
            const error = err as AxiosError<ErrorResponse>;

            if (error.response && error.response.data) {
              if (Array.isArray(error.response.data.errors)) {
                setErrMsg(error.response.data.errors);
              } else if (error.response.status === 401) {
                setErrMsg([{ msg: 'Unauthorized! Please Sign In.' }]);
              } else {
                setErrMsg([{ msg: error.response.data.message }]);
              }
            } else {
              setErrMsg([{ msg: "No Server Response!" }]);
            }
            errRef?.current?.focus();
          }
        }
      }, 'image/png');
    }
  };

  useEffect(() => {
    if (textRef.current) {
      const minDimension = Math.min(frameSize, frameHeight);
      textRef.current.style.fontSize = `${minDimension / 1}px`;
    }
  }, [frameSize, frameHeight]);

  const handleDownloadClick = () => { };

  return (
    <div className="container">
      <DashboardHeader />
      <div className="edit">
        <SideNav currentTab='text' onDownloadClick={handleDownloadClick} />
        <div className="body">
          <div className="project">
            <UntitledProject onSave={handleDownloadImage} />
            <div className="img-section">
              {Array.isArray(errMsg) ? (
                errMsg.map((error, index) => (
                  <p key={index}
                    ref={index === 0 ? errRef : null}
                    className={errMsg ? "errmsg" : "offscreen"}
                    aria-live="assertive">
                    {error.msg}
                  </p>
                ))
              ) : (
                <p
                  ref={errRef}
                  className={errMsg ? "errmsg" : "offscreen"}
                  aria-live="assertive">
                  {errMsg}
                </p>
              )}
              <div className="import preview" ref={imgSectionRef}>
                {combinedImage && <img src={combinedImage} alt="Combined" className="main-image" />}
                <Draggable>
                  <div
                    className='frame'
                    ref={textRef}
                    style={{
                      width: `${frameSize}px`,
                      height: `${frameHeight}px`,
                      position: 'absolute',
                      paddingTop: 10,
                      paddingBottom: 12,
                      border: '2px solid #3183FF',
                      resize: 'both',
                      overflow: 'auto',
                      background: 'none',
                      color: 'White',
                      fontWeight: '500',
                      lineHeight: '10px',
                      outline: 'none',
                      textAlign: 'center',
                      textDecoration: 'none',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}
                    contentEditable
                    suppressContentEditableWarning={true}
                  >
                    TEXT HERE
                  </div>
                </Draggable>
              </div>
              <div className="actions shapes sliders">
                <button className="crop">
                  <img src={FontIcon} alt="" />
                  <p>Font</p>
                </button>
                <button className="rotate">
                  <img src={TextEffectsIcon} alt="" />
                  <p>Effects</p>
                </button>
                <div className="size-slider">
                  <label>W: </label>
                  <input
                    type="range"
                    min="50"
                    max="200"
                    value={frameSize}
                    onChange={(e) => setFrameSize(Number(e.target.value))}
                  />
                </div>
                <div className="size-slider">
                  <label>H: </label>
                  <input
                    type="range"
                    min="10"
                    max="50"
                    value={frameHeight}
                    onChange={(e) => setFrameHeight(Number(e.target.value))}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardText;
