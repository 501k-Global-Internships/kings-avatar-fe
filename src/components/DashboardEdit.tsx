import React, { useEffect, useRef, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { AxiosError } from 'axios';
import html2canvas from 'html2canvas';
import Draggable from 'react-draggable';
import DashboardHeader from './DashboardHeader';
import DownloadModal from './DownloadModal';
import LoadingSpinner from './LoadingSpinner';
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
import NextIcon from '../assets/next.svg';
import PrevIcon from '../assets/prev.svg';
import axios from '../api/axios';
import { ErrorResponse, Frame, FrameType, ImageText, ResizeCorner } from './Types';
import { useGallery } from '../context/GalleryContext';
import './App.scss';

const DashboardEdit: React.FC = () => {
  const { galleryImages, setGalleryImages, setProjectImages } = useGallery();
  const [file, setFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [errMsg, setErrMsg] = useState<{ msg: string }[] | string>('');
  const [isVisible, setIsVisible] = useState<boolean>(false);

  const [croppedImageUrl, setCroppedImageUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  const [flip, setFlip] = useState<boolean>(false);
  const [flipHorizontal, setFlipHorizontal] = useState<boolean>(false);
  const [flipVertical, setFlipVertical] = useState<boolean>(false);

  const [changePhoto, setChangePhoto] = useState<boolean>(false);
  const [selectedButton, setSelectedButton] = useState<string>('');
  const [rotate, setRotate] = useState<number>(0);
  const [shapes, setShapes] = useState<boolean>(false);
  const [download, setDownload] = useState<boolean>(false);

  const [frameSize] = useState<number>(150);
  const [modalOpen, setModalOpen] = useState<boolean>(false);

  const [framePosition] = useState<{ top: number; left: number }>({ top: 100, left: 200 });
  const [innerImage] = useState<string | null>(null);
  const [dragging, setDragging] = useState<number | null>(null);
  const [frames, setFrames] = useState<Frame[]>([]);
  const [resizing, setResizing] = useState<{ id: number; corner: 'topLeft' | 'topRight' | 'bottomLeft' | 'bottomRight' } | null>(null);

  const [textFrameSize] = useState<number>(150);
  const [textFrameHeight] = useState<number>(15);
  const [textFrames, setTextFrames] = useState<ImageText[]>([]);
  const [texts, setTexts] = useState<boolean>(false);
  const [activeFrameId, setActiveFrameId] = useState<{ frameId: number | null; activeFrame: boolean }>({ frameId: null, activeFrame: false });
  const [textFrameAppear, setTextFrameAppear] = useState<boolean | null>(true);

  const errRef = useRef<HTMLParagraphElement>(null);
  const imgSectionRef = useRef<HTMLDivElement | null>(null);
  const textRef = useRef<HTMLDivElement | null>(null);

  const navigate = useNavigate();
  const location = useLocation();

  const handleMouseDown = (frameId: number) => {
    setDragging(frameId);
  };

  useEffect(() => {
    const getGalleryImages = async () => {
      try {
        const cachedImages = localStorage.getItem('galleryImages');

        if (cachedImages?.length) {
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
            navigate('/sign-in', { state: { from: location }, replace: true });
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
        const containerRect = imgSectionRef.current.getBoundingClientRect();
        const frame = frames.find(f => f.id === dragging);

        if (frame) {
          const newTop = e.clientY - containerRect.top - frame.size / 2;
          const newLeft = e.clientX - containerRect.left - frame.size / 2;

          setFrames(frames.map(f =>
            f.id === dragging
              ? {
                ...f,
                position: {
                  top: Math.max(0, Math.min(newTop, containerRect.height - frame.size)),
                  left: Math.max(0, Math.min(newLeft, containerRect.width - frame.size)),
                }
              }
              : f
          ));
        }
      } else if (resizing !== null && imgSectionRef.current) {
        const frame = frames.find(f => f.id === resizing.id);

        if (frame) {
          const containerRect = imgSectionRef.current.getBoundingClientRect();
          let newSize = frame.size;
          let newTop = frame.position.top;
          let newLeft = frame.position.left;

          switch (resizing.corner) {
            case 'topLeft':
              newSize = Math.max(frame.size + (frame.position.top - (e.clientY - containerRect.top)), 0);
              newTop = Math.max(e.clientY - containerRect.top, 0);
              newLeft = Math.max(e.clientX - containerRect.left, 0);
              break;
            case 'topRight':
              newSize = Math.max(e.clientX - containerRect.left - frame.position.left, 0);
              newTop = Math.max(e.clientY - containerRect.top, 0);
              break;
            case 'bottomLeft':
              newSize = Math.max(e.clientY - containerRect.top - frame.position.top, 0);
              newLeft = Math.max(e.clientX - containerRect.left, 0);
              break;
            case 'bottomRight':
              newSize = Math.max(
                Math.min(e.clientX - containerRect.left, e.clientY - containerRect.top) - frame.position.left,
                0
              );
              break;
          }

          setFrames(frames.map(f =>
            f.id === resizing.id
              ? {
                ...f,
                size: Math.min(newSize, containerRect.width - f.position.left),
                position: { top: newTop, left: newLeft }
              }
              : f
          ));
        }
      }
    };

    const handleMouseUp = () => {
      setDragging(null);
      setResizing(null);
    };

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [dragging, resizing, frames]);

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
        setLoading(false);
      } catch (err) {
        const error = err as AxiosError<ErrorResponse>;

        if (error.response && error.response.data) {
          if (Array.isArray(error.response.data.errors)) {
            setErrMsg(error.response.data.errors);
          } else if (error.response.status === 401) {
            setErrMsg('Unauthorized! Please Sign In.');
            navigate('/sign-in', { state: { from: location }, replace: true });
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

        setProjectImages(prevImages => {
          const updatedImages = [...prevImages, combinedImageUrl];
          localStorage.setItem('projectImages', JSON.stringify(updatedImages));
          return updatedImages;
        });

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
    const newFrame: Frame = {
      id: Date.now(),
      type,
      size: frameSize,
      position: framePosition,
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

  const handleResizeMouseDown = (e: React.MouseEvent, frameId: number, corner: ResizeCorner) => {
    e.preventDefault();
    setResizing({ id: frameId, corner });
  };

  return (
    <div className="container">
      <DashboardHeader />
      <div className="edit">
        <SideNav
          currentTab={shapes ? 'shapes' : texts ? 'text' : download ? 'download' : 'edit'}
          onShapesClick={() => { setShapes(true); setTexts(false); setDownload(false) }}
          onEditClick={() => { setShapes(false); setTexts(false); setDownload(false) }}
          onTextsClick={() => { setTexts(true); setShapes(false); setDownload(false) }}
          onDownloadClick={() => { setDownload(true); setShapes(false); setTexts(false) }}
          setModalOpen={setModalOpen}
        />
        <div className="body">
          <div className="project">
            <UntitledProject
              onSave={handleSaveProject}
              onShare={() => { }}
              untitled={true}
              actions={true}
            />
            {file || previewUrl ?
              <div className="cnt">
                <div className="img-section">
                  {modalOpen &&
                    <DownloadModal
                      setModalOpen={setModalOpen}
                      setTexts={setTexts}
                      handleDownloadClick={handleDownloadClick} />
                  }
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
                    {loading && !previewUrl ?
                      <LoadingSpinner loading={loading} />
                      :
                      <div className="img-container" ref={imgSectionRef}>
                        <img
                          src={croppedImageUrl ? croppedImageUrl : (previewUrl as string)}
                          alt="Uploaded"
                          className="main-image"
                          style={{ width: '100%', height: '100%', objectFit: 'contain' }}
                        />
                        {frames.map(frame => (
                          <div
                            className="frame-cnt"
                            style={{
                              position: 'absolute',
                              top: frame.position.top,
                              left: frame.position.left,
                            }}
                          >
                            <div className="btn">
                              <button
                                onClick={() => handleRemoveFrame(frame.id)}
                                className={activeFrameId.frameId === frame.id && activeFrameId.activeFrame ? '' : 'hide'}
                              >
                                <img className="remove" src={RemoveIcon} alt="" />
                              </button>
                            </div>
                            <div
                              key={frame.id}
                              className="frame-section"
                              style={{
                                width: frame.size,
                                height: frame.size,
                              }}
                              onMouseUp={() => setActiveFrameId({ frameId: frame.id, activeFrame: true })}
                            >
                              <div
                                className={activeFrameId.frameId === frame.id && activeFrameId.activeFrame ? 'frame-border' : 'frame-border hide'}
                                style={{
                                  width: frame.size,
                                  height: frame.size,
                                  top: 0,
                                  left: 0,
                                  position: 'absolute',
                                }}
                                onMouseDown={() => handleMouseDown(frame.id)}
                              >
                                <div
                                  className={`frame ${frame.type}`}
                                  style={{
                                    width: frame.size,
                                    height: frame.size,
                                    borderRadius: frame.type === 'circle' ? '50%' : '0',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    overflow: 'hidden',
                                    cursor: 'move',
                                  }}
                                  onDoubleClick={() => setActiveFrameId({ frameId: null, activeFrame: false })}
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
                                {/* Add Resizable Nodes */}
                                <div
                                  className={activeFrameId.frameId === frame.id && activeFrameId.activeFrame ? "resize-node top-left" : ''}
                                  onMouseDown={(e) => {
                                    e.stopPropagation(); // Prevent drag from being triggered
                                    handleResizeMouseDown(e, frame.id, 'topLeft');
                                  }}>
                                </div>
                                <div
                                  className={activeFrameId.frameId === frame.id && activeFrameId.activeFrame ? "resize-node top-right" : ''}
                                  onMouseDown={(e) => {
                                    e.stopPropagation();
                                    handleResizeMouseDown(e, frame.id, 'topRight');
                                  }}>
                                </div>
                                <div
                                  className={activeFrameId.frameId === frame.id && activeFrameId.activeFrame ? "resize-node bottom-left" : ''}
                                  onMouseDown={(e) => {
                                    e.stopPropagation();
                                    handleResizeMouseDown(e, frame.id, 'bottomLeft');
                                  }}>
                                </div>
                                <div
                                  className={activeFrameId.frameId === frame.id && activeFrameId.activeFrame ? "resize-node bottom-right" : ''}
                                  onMouseDown={(e) => {
                                    e.stopPropagation();
                                    handleResizeMouseDown(e, frame.id, 'bottomRight');
                                  }}>
                                </div>
                              </div>
                            </div>
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
                    }
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
                      <div className={`actions size-slider`}>
                        <button className="prev" onClick={() => { setShapes(false); setTexts(false); setDownload(false) }}>
                          <img src={PrevIcon} alt="" />
                          <p>Prev</p>
                        </button>
                        <button className="crop" onClick={() => handleFrameTypeChange('circle')}>
                          <img src={CircleIcon} alt="" />
                          <p>Circle</p>
                        </button>
                        <button className="rotate square" onClick={() => handleFrameTypeChange('square')}>
                          <img src={SquareIcon} alt="" />
                          <p>Square</p>
                        </button>
                        <button className="next" onClick={() => { setTexts(true); setShapes(false) }}>
                          <img src={NextIcon} alt="" />
                          <p>Next</p>
                        </button>
                      </div>
                      :
                      texts ?
                        <div className="actions size-slider">
                          <button className="prev" onClick={() => { setShapes(true) }}>
                            <img src={PrevIcon} alt="" />
                            <p>Prev</p>
                          </button>
                          <button className="crop" onClick={handleTextFrame}>
                            <img src={FontIcon} alt="" />
                            <p>Font</p>
                          </button>
                          <button className="rotate square">
                            <img src={TextEffectsIcon} alt="" />
                            <p>Effects</p>
                          </button>
                          <button className="next"
                            onClick={() => {
                              setModalOpen(true);
                              setDownload(true);
                              setTexts(false);
                              setShapes(false)
                            }}
                          >
                            <img src={NextIcon} alt="" />
                            <p>Next</p>
                          </button>
                        </div>
                        :
                        download ?
                          <div className="actions size-slider empty-div"></div>
                          :
                          <div className="actions size-slider">
                            <button className="prev"
                              onClick={() => {
                                setFile(null);
                                setPreviewUrl(null);
                                setCroppedImageUrl(null);
                                setFrames([])
                              }}
                            >
                              <img src={PrevIcon} alt="" />
                              <p>Prev</p>
                            </button>
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
                            <button className="rotate" onClick={() => { handleRotate(90); setIsVisible(false); }}>
                              <img src={RotateIcon} alt="" />
                              <p>Rotate</p>
                            </button>
                            <button
                              className="change"
                              onClick={() => {
                                setChangePhoto(!changePhoto);
                                setFlip(false);
                                setIsVisible(false);
                              }}
                            >
                              <img src={GalleryIcon} alt="" />
                              <p>Change Photo</p>
                            </button>
                            <button className="next" onClick={() => { setShapes(true) }}>
                              <img src={NextIcon} alt="" />
                              <p>Next</p>
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
