import React, { useCallback, useEffect, useRef, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Cropper from 'react-easy-crop';
import { Area } from 'react-easy-crop/types';
import { AxiosError } from 'axios';
import html2canvas from 'html2canvas';
import DashboardHeader from './DashboardHeader';
import SideNav from './SideNav';
import UntitledProject from './UntitledProject';
import AddIcon from '../assets/add.svg';
import CropIcon from '../assets/crop.svg';
import FlipIcon from '../assets/flip.svg';
import RotateIcon from '../assets/tabler_rotate.svg';
import GalleryIcon from '../assets/tabler_photo.svg'
import axios from '../api/axios';
import { ErrorResponse } from './AppInterface';
import { useGallery } from '../context/GalleryContext';
import './App.scss';

const DashboardEdit: React.FC = () => {
  const { galleryImages, setGalleryImages, projectImages, setProjectImages } = useGallery();
  const [file, setFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [errMsg, setErrMsg] = useState<{ msg: string }[] | string>('');
  const [isVisible, setIsVisible] = useState<boolean>(false);
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState<number>(1);
  const [croppedArea, setCroppedArea] = useState<Area | null>(null);
  const [cropImage, setCropImage] = useState<Boolean>(false);
  const [croppedImageUrl, setCroppedImageUrl] = useState<string | null>(null);
  const [flip, setFlip] = useState<boolean>(false);
  const [flipHorizontal, setFlipHorizontal] = useState<boolean>(false);
  const [flipVertical, setFlipVertical] = useState<boolean>(false);
  const [changePhoto, setChangePhoto] = useState<boolean>(false);
  const [selectedButton, setSelectedButton] = useState<string>('');
  const [rotate, setRotate] = useState<number>(0);

  const errRef = useRef<HTMLParagraphElement>(null);
  const imgSectionRef = useRef<HTMLDivElement | null>(null);
  const navigate = useNavigate();
  const location = useLocation();

  const handleSaveProject = async () => {
    if (croppedImageUrl) {
      setProjectImages([...projectImages, croppedImageUrl]);
      navigate('/dashboard-projects')
    }
  };

  useEffect(() => {
    const getGalleryImages = async () => {
      try {
        const response = await axios.get('/upload/gallery', {
          headers: {
            'Content-Type': 'multipart/form-data',
            Authorization: 'Bearer ' + localStorage.getItem('token'),
          },
          withCredentials: true
        });

        setGalleryImages(response.data);
      } catch (err) {
        const error = err as AxiosError<ErrorResponse>;

        if (error.response && error.response.data) {
          if (Array.isArray(error.response.data.errors)) {
            setErrMsg(error.response.data.errors);
          } else if (error.response.status === 401) {
            navigate('/', { state: { from: location }, replace: true });
          } else {
            setErrMsg([{ msg: error.response.data.message }]);
          }
        } else {
          setErrMsg([{ msg: "No Server Response!" }]);
        }
        errRef?.current?.focus();
      }
    };

    getGalleryImages();
  }, [location, navigate, setGalleryImages]);

  const onFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      setFile(selectedFile);

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

        setPreviewUrl(response.data.url);
        // navigate('/dashboard-shapes', { state: { uploadedFile: response.data.url } });
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

  const handleCropComplete = useCallback((croppedArea: Area, croppedAreaPixels: Area) => {
    setCroppedArea(croppedAreaPixels);
  }, []);

  const getCroppedImg = (imageSrc: string, pixelCrop: Area): Promise<string> => {
    return new Promise((resolve, reject) => {
      const image = new Image();
      image.src = imageSrc;
      image.crossOrigin = 'anonymous'; // Add this line
      image.onload = () => {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        canvas.width = pixelCrop.width;
        canvas.height = pixelCrop.height;

        ctx.drawImage(
          image,
          pixelCrop.x,
          pixelCrop.y,
          pixelCrop.width,
          pixelCrop.height,
          0,
          0,
          pixelCrop.width,
          pixelCrop.height
        );

        const dataUrl = canvas.toDataURL('image/jpeg');
        resolve(dataUrl);
      };
      image.onerror = (error) => reject(error);
    });
  };

  const handleCropButtonClick = async () => {
    setCropImage(!cropImage);
    if (croppedArea && previewUrl) {
      try {
        const croppedImage = await getCroppedImg(previewUrl, croppedArea);
        console.log(croppedImage, 'here');
        setCroppedImageUrl(croppedImage);

      } catch (error) {
        console.error('Failed to crop image:', error);
      }
    }
  };

  const handleDownloadClick = async () => {
    if (croppedImageUrl) {
      const canvas = await html2canvas(imgSectionRef.current as HTMLElement);

      const link = document.createElement('a');
      link.href = canvas.toDataURL('image/png');
      link.download = 'kings-avatar.jpg';
      link.click();
    }
  };

  const renderTransformedImage = (imageSrc: string, flipH: boolean, flipV: boolean, rotation: number): Promise<string> => {
    return new Promise((resolve, reject) => {
      const image = new Image();
      image.src = imageSrc;
      image.crossOrigin = 'anonymous'; // Add this line if you encounter CORS issues
      image.onload = () => {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        const normalizedRotation = rotation % 360;

        if (normalizedRotation === 90 || normalizedRotation === 270) {
          canvas.width = image.height;
          canvas.height = image.width;
        } else {
          canvas.width = image.width;
          canvas.height = image.height;
        }

        ctx.translate(canvas.width / 2, canvas.height / 2);
        ctx.rotate((rotation * Math.PI) / 180);
        ctx.scale(flipH ? -1 : 1, flipV ? -1 : 1);
        ctx.drawImage(image, -image.width / 2, -image.height / 2);

        const dataUrl = canvas.toDataURL('image/jpeg');
        resolve(dataUrl);
      };
      image.onerror = (error) => reject(error);
    });
  };

  useEffect(() => {
    const updateImage = async () => {
      if (previewUrl) {
        const transformedImageUrl = await renderTransformedImage(previewUrl, flipHorizontal, flipVertical, rotate);
        setCroppedImageUrl(transformedImageUrl);
      }
    };

    updateImage();
  }, [flipHorizontal, flipVertical, rotate, previewUrl]);

  const handleRotate = (angle: number) => {
    setRotate((prevRotate) => prevRotate + angle);
  };

  const handleFlip = (direction: 'horizontal' | 'vertical') => {
    if (direction === 'horizontal') {
      setFlipHorizontal(!flipHorizontal);
    } else if (direction === 'vertical') {
      setFlipVertical(!flipVertical);
    }
  };

  return (
    <div className="container">
      <DashboardHeader />
      <div className="edit">
        <SideNav currentTab='edit' onDownloadClick={handleDownloadClick} />
        <div className="body">
          <div className="project">
            <UntitledProject onSave={handleSaveProject} />
            {file || previewUrl ?
              <div className="cnt">
                <div className="img-section">
                  <div className="import preview" ref={imgSectionRef} style={{ position: 'relative' }}>
                    {cropImage ?
                      <div className="crop-container">
                        <Cropper
                          image={previewUrl as string}
                          crop={crop}
                          zoom={zoom}
                          maxZoom={30}
                          aspect={4 / 3}
                          objectFit='contain'
                          onCropChange={setCrop}
                          onCropComplete={handleCropComplete}
                          onZoomChange={setZoom}
                          showGrid={true}
                          cropShape='rect'
                          style={{
                            containerStyle: {
                              position: 'absolute',
                              top: 0,
                              left: 0,
                              right: 0,
                              bottom: 0,
                              zIndex: 1
                            },
                            cropAreaStyle: {
                              border: '2px dashed #fff',
                              background: 'rgba(0, 0, 0, 0.2)',
                            }
                          }}
                        />
                      </div>
                      :
                      <img src={croppedImageUrl ? croppedImageUrl : previewUrl as string} alt="Uploaded" className="main-image" style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
                    }
                  </div>
                  <div>
                    <div className="more-actions">
                      <div className={`change-photo ${changePhoto ? '' : 'hidden'}`}>
                        <button
                          className={selectedButton === 'gallery' ? 'active' : ''}
                          onClick={() => {
                            setIsVisible(!isVisible);
                            setSelectedButton('gallery');
                          }}
                        >
                          Gallery
                        </button>
                        <label
                          htmlFor="galleryInput"
                          className={selectedButton === 'import' ? 'active' : ''}
                          onClick={() => {
                            setSelectedButton('import');
                            setIsVisible(false);
                          }}
                        >
                          Import
                        </label>
                        <input type="file" id="galleryInput" style={{ display: 'none', cursor: 'pointer' }} onChange={onFileChange} />
                      </div>
                      <div className={`flip ${flip ? '' : 'hidden'}`}>
                        <button
                          className={selectedButton === 'vertical' ? 'active' : ''}
                          onClick={() => {
                            handleFlip('vertical');
                            setSelectedButton('vertical')
                          }}
                        >
                          Vertical
                        </button>
                        <button
                          className={selectedButton === 'horizontal' ? 'active' : ''}
                          onClick={() => {
                            handleFlip('horizontal');
                            setSelectedButton('horizontal')
                          }}
                        >
                          Horizontal
                        </button>
                      </div>
                    </div>
                    <div className="actions size-slider">
                      <button className="crop" onClick={handleCropButtonClick}>
                        <img src={CropIcon} alt="" />
                        <p>Crop</p>
                      </button>
                      <button
                        className="flip"
                        onClick={() => {
                          setFlip(!flip);
                          setChangePhoto(false);
                        }}
                      >
                        <img src={FlipIcon} alt="" />
                        <p>Flip</p>
                      </button>
                      <button className="rotate"  onClick={() => handleRotate(90)}>
                        <img src={RotateIcon} alt="" />
                        <p>Rotate</p>
                      </button>
                      <button
                        className="change"
                        onClick={() => {
                          setChangePhoto(!changePhoto);
                          setFlip(false);
                        }}
                      >
                        <img src={GalleryIcon} alt="" />
                        <p>Change Photo</p>
                      </button>
                    </div>
                  </div>
                </div>
                <div className={`gallery-images ${isVisible ? '' : 'hidden'}`}>
                  <div className="img-cnt">
                    {galleryImages.map((galleryImage, i) => (
                      <div className="img" key={i} onClick={() => setPreviewUrl(galleryImage)}>
                        <img src={galleryImage} alt="" />
                      </div>
                    ))}
                  </div>
                  <div className="add-btn">
                    <label htmlFor="galleryInput">
                      <img src={AddIcon} alt="" />
                      <p>Upload</p>
                    </label>
                    <input type="file" id="galleryInput" style={{ display: 'none', cursor: 'pointer' }} onChange={onFileChange} />
                  </div>
                </div>
              </div>
              :
              <div className="cnt">
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
                      <label htmlFor="" onClick={() => setIsVisible(!isVisible)}>
                        <img src={AddIcon} alt="" />
                        <p>Import from Gallery</p>
                      </label>
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
                <div className={`gallery-images ${isVisible ? '' : 'hidden'}`}>
                  <div className="img-cnt">
                    {galleryImages.map((galleryImage, i) => (
                      <div className="img" key={i}
                        onClick={() => {
                          setPreviewUrl(galleryImage);
                          setIsVisible(false);
                        }}
                      >
                        <img src={galleryImage} alt="" />
                      </div>
                    ))}
                  </div>
                  <div className="add-btn">
                    <label htmlFor="galleryInput">
                      <img src={AddIcon} alt="" />
                      <p>Upload</p>
                    </label>
                    <input type="file" id="galleryInput" style={{ display: 'none', cursor: 'pointer' }} onChange={onFileChange} />
                  </div>
                </div>
              </div>}
          </div>
        </div>
      </div>
    </div>
  );
}

export default DashboardEdit;
