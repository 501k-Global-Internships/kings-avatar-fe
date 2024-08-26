import React, { useEffect, useRef, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { AxiosError } from 'axios';
import html2canvas from 'html2canvas';
import Draggable from 'react-draggable';
import DashboardHeader from './DashboardHeader';
import SideNav from './SideNav';
import UntitledProject from './UntitledProject';
import AddIcon from '../assets/add.svg';
import FlipIcon from '../assets/flip.svg';
import RotateIcon from '../assets/tabler_rotate.svg';
import GalleryIcon from '../assets/tabler_photo.svg';
import CircleIcon from '../assets/circle.svg';
import SquareIcon from '../assets/square.svg';
import RemoveIcon from '../assets/remove.svg';
import FontIcon from '../assets/fontsize.svg';
import TextEffectsIcon from '../assets/textEffects.svg';
import axios from '../api/axios';
import { ErrorResponse, Frame, FrameType, ImageText } from './AppInterface';
import { useGallery } from '../context/GalleryContext';
import './App.scss';

const DashboardEdit: React.FC = () => {
  const { galleryImages, setGalleryImages, projectImages, setProjectImages } = useGallery();
  const [file, setFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [errMsg, setErrMsg] = useState<{ msg: string }[] | string>('');
  const [isVisible, setIsVisible] = useState<boolean>(false);

  const [croppedImageUrl, setCroppedImageUrl] = useState<string | null>(null);

  const [flip, setFlip] = useState<boolean>(false);
  const [flipHorizontal, setFlipHorizontal] = useState<boolean>(false);
  const [flipVertical, setFlipVertical] = useState<boolean>(false);

  const [changePhoto, setChangePhoto] = useState<boolean>(false);
  const [selectedButton, setSelectedButton] = useState<string>('');
  const [rotate, setRotate] = useState<number>(0);
  const [shapes, setShapes] = useState<boolean>(false);

  const [frameType] = useState<'circle' | 'square' | null>(null);
  const [frameSize] = useState<number>(150);
  const [resizing, setResizing] = useState<number | null>(null);

  const [framePosition] = useState<{ top: number; left: number }>({ top: 100, left: 200 });
  const [innerImage] = useState<string | null>(null);
  const [dragging, setDragging] = useState<number | null>(null);
  const [frames, setFrames] = useState<Frame[]>([]);

  const [textFrameSize] = useState<number>(150);
  const [textFrameHeight] = useState<number>(15);
  const [textFrames, setTextFrames] = useState<ImageText[]>([]);
  const [texts, setTexts] = useState<boolean>(false);
  const [frameAppear, setFrameAppear] = useState<boolean>(false);
  const [textFrameAppear, setTextFrameAppear] = useState<boolean | null>(true);

  const errRef = useRef<HTMLParagraphElement>(null);
  const imgSectionRef = useRef<HTMLDivElement | null>(null);
  const textRef = useRef<HTMLDivElement | null>(null);

  const navigate = useNavigate();
  const location = useLocation();

  const handleMouseDown = (id: number) => {
    setDragging(id);
  };

  const handleMouseUp = () => {
    setDragging(null);
    setResizing(null);
  };

  useEffect(() => {
    const getGalleryImages = async () => {
      try {
        const cachedImages = localStorage.getItem('galleryImages');

        if (cachedImages) {
          setGalleryImages(JSON.parse(cachedImages));
        } else {
          const response = await axios.get('/upload/gallery', {
            headers: {
              'Content-Type': 'multipart/form-data',
              Authorization: 'Bearer ' + localStorage.getItem('token'),
            },
            withCredentials: true,
          });

          setGalleryImages(response.data);
          localStorage.setItem('galleryImages', JSON.stringify(response.data));
        }
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

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (dragging !== null && imgSectionRef.current) {
        const rect = imgSectionRef.current.getBoundingClientRect();
        let newTop = e.clientY - frameSize / 2;
        let newLeft = e.clientX - frameSize / 2;

        // Ensure the frame stays within the imgSection bounds
        if (newTop < rect.top) newTop = rect.top;
        if (newLeft < rect.left) newLeft = rect.left;
        if (newTop + frameSize > rect.top + rect.height) newTop = rect.top + rect.height - frameSize;
        if (newLeft + frameSize > rect.left + rect.width) newLeft = rect.left + rect.width - frameSize;

        setFrames(frames.map(frame =>
          frame.id === dragging
            ? { ...frame, framePosition: { top: newTop - rect.top, left: newLeft - rect.left } }
            : frame
        ));
      } else if (resizing !== null) {
        const frame = frames.find(frame => frame.id === resizing);
        if (frame) {
          const newSize = Math.max(e.clientX - frame.framePosition.left, e.clientY - frame.framePosition.top) / 2;
          setFrames(frames.map(f =>
            f.id === resizing
              ? { ...f, frameSize: newSize }
              : f
          ));
        }
      }
    };

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [dragging, resizing, frameSize, frames]);

  useEffect(() => {
    if (textRef.current) {
      const minDimension = Math.min(textFrameSize, textFrameHeight);
      textRef.current.style.fontSize = `${minDimension / 1}px`;
    }
  }, [textFrameSize, textFrameHeight]);

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
      image.crossOrigin = 'anonymous';
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

  const handleSaveProject = async () => {
    if (imgSectionRef.current) {
      try {
        const canvas = await html2canvas(imgSectionRef.current as HTMLElement);

        const combinedImageUrl = canvas.toDataURL('image/png');

        setProjectImages([...projectImages, combinedImageUrl]);
        navigate('/dashboard-projects');
      } catch (error) {
        console.error('Error rendering combined image:', error);
      }
    }
  };

  const handleRotate = (angle: number) => {
    setFlip(false)
    setChangePhoto(false)
    setRotate((prevRotate) => prevRotate + angle);
  };

  const handleFlip = (direction: 'horizontal' | 'vertical') => {
    if (direction === 'horizontal') {
      setFlipHorizontal(!flipHorizontal);
    } else if (direction === 'vertical') {
      setFlipVertical(!flipVertical);
    }
  };

  const handleFrameTypeChange = (type: FrameType) => {
    const newFrame = {
      id: Date.now(),
      type,
      frameSize: frameSize,
      framePosition: framePosition,
      innerImage: innerImage,
    };
    setFrames([...frames, newFrame]);
  };

  const handleTextFrame = () => {
    const newFrame = {
      id: Date.now(),
      textFrameSize: textFrameSize,
      textFrameHeight: textFrameHeight,
      framePosition: framePosition,
    };
    setTextFrames([...textFrames, newFrame]);
  };

  const handleFrameChange = (id: number, updatedFrame: Frame) => {
    setFrames(frames.map(frame => frame.id === id ? updatedFrame : frame));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, id: number) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        handleFrameChange(id, { ...frames.find(frame => frame.id === id)!, innerImage: reader.result as string });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemoveFrame = (id: number) => {
    setFrames(frames.filter(frame => frame.id !== id));
  };

  const handleRemoveTextFrame = (id: number) => {
    setTextFrames(textFrames.filter(frame => frame.id !== id));
  };

  const handleResizeMouseDown = (id: number) => {
    setResizing(id);
  };

  return (
    <div className="container">
      <DashboardHeader />
      <div className="edit">
        <SideNav
          currentTab={shapes ? 'shapes' : texts ? 'text' : 'edit'}
          onDownloadClick={handleDownloadClick}
          onShapesClick={() => { setShapes(!shapes); setTexts(false) }}
          onEditClick={() => { setShapes(false); setTexts(false) }}
          onTextsClick={() => { setTexts(!texts); setShapes(false) }}
        />
        <div className="body">
          <div className="project">
            <UntitledProject onSave={handleSaveProject} />
            {file || previewUrl ?
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
                  <div className="import preview" style={{ position: 'relative' }}>
                    <div className="img-container" ref={imgSectionRef}>
                      <img
                        src={croppedImageUrl ? croppedImageUrl : (previewUrl as string)}
                        alt="Uploaded"
                        className="main-image"
                        style={{ width: '100%', height: '100%', objectFit: 'contain' }}
                      />
                      {frames.map(frame => (
                        <div
                          key={frame.id}
                          className="frame-section"
                          style={{
                            position: 'absolute',
                            top: frame.framePosition.top,
                            left: frame.framePosition.left,
                          }}
                          onMouseDown={(e) => setFrameAppear(false)}
                          onMouseUp={(e) => setFrameAppear(true)}
                        >
                          <div className={frameAppear ? 'frame-border hide' : 'frame-border'}
                            style={{
                              width: frame.type === 'square' ? (frame.frameSize + 10) : frame.frameSize,
                              height: frame.type === 'square' ? (frame.frameSize + 10) : frame.frameSize,
                            }}
                            onMouseDown={() => handleResizeMouseDown(frame.id)}
                          >
                            <div className={`frame ${frame.type}`}
                              style={{
                                width: frame.frameSize,
                                height: frame.frameSize,
                                borderRadius: frame.type === 'circle' ? '50%' : '0',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                overflow: 'hidden',
                                cursor: 'move',
                              }}
                              onMouseDown={(e) => handleMouseDown(frame.id)}
                            >
                              {frame.innerImage ? (
                                <img
                                  src={frame.innerImage}
                                  alt="Inner"
                                  className="inner-image"
                                  style={{
                                    width: '100%',
                                    height: '100%',
                                    objectFit: 'cover',
                                    borderRadius: frame.type === 'circle' ? '50%' : '0',
                                  }}
                                />
                              ) : (
                                <div>
                                  <input
                                    type="file"
                                    onChange={(e) => handleFileChange(e, frame.id)}
                                    style={{ display: 'none' }}
                                    id={`innerImageInput-${frame.id}`}
                                  />
                                  <label htmlFor={`innerImageInput-${frame.id}`} className="upload-btn">
                                    <img src={AddIcon} alt="" />
                                  </label>
                                </div>
                              )}
                            </div>
                          </div>
                          <button
                            onClick={() => handleRemoveFrame(frame.id)}
                            className={frameAppear ? 'hide' : ''}
                          >
                            <img className="remove" src={RemoveIcon} alt="" />
                          </button>
                        </div>
                      ))}
                      {textFrames.map(textFrame => (
                        <div
                          key={textFrame.id}
                          style={{
                            position: 'absolute',
                            top: textFrame.framePosition.top,
                            left: textFrame.framePosition.left,
                          }}
                        >
                          <Draggable
                            onStart={() => setTextFrameAppear(false)}
                            onDrag={() => setTextFrameAppear(true)}
                          >
                            <div className="text-frame"
                              style={{
                                width: `${textFrame.textFrameSize + 30}px`,
                              }}
                            >
                              <div className="frame"
                                ref={textRef}
                                style={{
                                  width: `${textFrame.textFrameSize}px`,
                                  height: `${textFrame.textFrameHeight}px`,
                                  paddingTop: 10,
                                  paddingBottom: 12,
                                  border: textFrameAppear === true || null ? '1px solid #3183FF' : 'none',
                                  resize: textFrameAppear === true || null ? 'both' : 'none',
                                  overflow: 'auto',
                                  background: 'none',
                                  color: 'white',
                                  fontWeight: '500',
                                  lineHeight: '10px',
                                  outline: 'none',
                                  textAlign: 'center',
                                  textDecoration: 'none',
                                  display: 'flex',
                                  alignItems: 'center',
                                  justifyContent: 'center',
                                }}
                                contentEditable
                                suppressContentEditableWarning={true}
                              >
                                TEXT HERE
                              </div>
                              <button
                                onClick={() => handleRemoveTextFrame(textFrame.id)}
                                className={textFrameAppear === true || null ? 'btn' : 'btn hide'}
                              >
                                <img className="remove" src={RemoveIcon} alt="" />
                              </button>
                            </div>
                          </Draggable>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div className='action-center'>
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
                    {shapes ?
                      <div className={`actions ${frameType ? 'size-slider' : 'shapes'}`}>
                        <button className="crop" onClick={() => handleFrameTypeChange('circle')}>
                          <img src={CircleIcon} alt="" />
                          <p>Circle</p>
                        </button>
                        <button className="rotate square" onClick={() => handleFrameTypeChange('square')}>
                          <img src={SquareIcon} alt="" />
                          <p>Square</p>
                        </button>
                      </div>
                      :
                      texts ?
                        <div className="actions shapes">
                          <button className="crop" onClick={handleTextFrame}>
                            <img src={FontIcon} alt="" />
                            <p>Font</p>
                          </button>
                          <button className="rotate square">
                            <img src={TextEffectsIcon} alt="" />
                            <p>Effects</p>
                          </button>
                        </div>
                        :
                        <div className="actions size-slider">
                          <button
                            className="flip"
                            onClick={() => {
                              setFlip(!flip);
                              setChangePhoto(false);
                              setIsVisible(false);
                            }}
                          >
                            <img src={FlipIcon} alt="" />
                            <p>Flip</p>
                          </button>
                          <button className="rotate" onClick={() =>{ handleRotate(90); setIsVisible(false);}}>
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
                        </div>}
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
