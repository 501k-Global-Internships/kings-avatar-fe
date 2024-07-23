import React, { useEffect, useRef, useState } from 'react';
import DashboardHeader from './DashboardHeader';
import SideNav from './SideNav';
import axios from '../api/axios';
import UntitledProject from './UntitledProject';
import AddIcon from '../assets/add.svg';
import { AxiosError } from 'axios';
import { ErrorResponse } from './AppInterface';

const DashboardProject: React.FC = () => {
  const [projectImages, setProjectImages] = useState([]);
  const [errMsg, setErrMsg] = useState<{ msg: string }[]>([]);
  const errRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const getGalleryImages = async () => {
      try {
        const response = await axios.get('/upload/projects', {
          headers: {
            'Content-Type': 'multipart/form-data',
            Authorization: 'Bearer ' + localStorage.getItem('token'),
          },
          withCredentials: true
        });

        setProjectImages(response.data)
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

    getGalleryImages()
  }, []);

  const getImageSizeClass = (numImages: number) => {
    if (numImages <= 4) return 'large';
    if (numImages <= 6) return 'medium';
    return 'small';
  };

  const imageSizeClass = getImageSizeClass(projectImages.length);


  const handleSaveProject = async () => { };

  return (
    <div className="container">
      <DashboardHeader />
      <div className="edit">
        <SideNav currentTab='projects' />
        <div className="body">
          <div className="project">
            <UntitledProject onSave={handleSaveProject} />
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
              <div className="import img-box">
                {projectImages.length ? (
                  <div className={`images ${imageSizeClass}`}>
                    {projectImages.map((projectImage, i) => (
                      <img src={projectImage} alt="" key={i} />
                    ))}
                  </div>
                ) : (
                  <div className="no-images">
                    <p>No Project Images Yet. Upload An Image And Create Your Avatar.</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardProject;
