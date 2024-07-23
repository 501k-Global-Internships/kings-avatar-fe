import React, { useRef, useState } from 'react';
import { AxiosError } from 'axios';
import { useNavigate } from 'react-router-dom';
import axios from '../api/axios';
import { ErrorResponse } from './AppInterface';
import DashboardHeader from './DashboardHeader';
import SideNav from './SideNav';
import UntitledProject from './UntitledProject';
import AddIcon from '../assets/add.svg';
import CropIcon from '../assets/crop.svg';
import FlipIcon from '../assets/flip.svg';
import RotateIcon from '../assets/tabler_rotate.svg';

const DashboardEdit: React.FC = () => {
  // const [file, setFile] = useState<File | null>(null);
  // const [uploadedFile, setUploadedFile] = useState<string | null>(null);
  const [errMsg, setErrMsg] = useState<{ msg: string }[] | string>('');

  const errRef = useRef<HTMLParagraphElement>(null);
  const navigate = useNavigate();

  const handleSaveProject = async () => {};

  const onFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      // setFile(selectedFile);

      const formData = new FormData();
      formData.append('image', selectedFile);

      try {
        const response = await axios.post('/upload/gallery', formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
            Authorization: 'Bearer ' + localStorage.getItem('token'),
          },
          withCredentials: true
        });

        console.log(response);
        

        // setUploadedFile(response.data.url);
        navigate('/dashboard-shapes', { state: { uploadedFile: response.data.url } });
      } catch (err) {
        const error = err as AxiosError<ErrorResponse>;

        if (error.response && error.response.data) {
          if (Array.isArray(error.response.data.errors)) {
            setErrMsg(error.response.data.errors);
          } else if (error.response.status === 401) {
            setErrMsg('Unauthorized! Please Sign In.');
          } else {
            setErrMsg([{ msg: error.response.data.message }]);
          }
        } else {
          setErrMsg([{ msg: "No Server Response!" }]);
        }
        errRef?.current?.focus();
      }
    }
  };

  return (
    <div className="container">
      <DashboardHeader />
      <div className="edit">
        <SideNav currentTab='edit' />
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
              <div className="import">
                <div className="gallery">
                  <label htmlFor="galleryInput">
                    <img src={AddIcon} alt="" />
                    <p>Import from Gallery</p>
                  </label>
                  <input type="file" id="galleryInput" style={{ display: 'none', cursor: 'pointer' }} onChange={onFileChange} />
                </div>
                <div className="file">
                  <label htmlFor="fileInput">
                    <img src={AddIcon} alt="" />
                    <p>Import File</p>
                  </label>
                  <input type="file" id="fileInput" style={{ display: 'none', cursor: 'pointer' }} onChange={onFileChange} />
                </div>
              </div>
              <div className="actions">
                <button className="crop">
                  <img src={CropIcon} alt="" />
                  <p>Crop</p>
                </button>
                <button className="flip">
                  <img src={FlipIcon} alt="" />
                  <p>Flip</p>
                </button>
                <button className="rotate">
                  <img src={RotateIcon} alt="" />
                  <p>Rotate</p>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default DashboardEdit;
