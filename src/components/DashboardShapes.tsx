import React, { useRef, useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import html2canvas from 'html2canvas';
import DashboardHeader from './DashboardHeader';
import SideNav from './SideNav';
import UntitledProject from './UntitledProject';
import CircleIcon from '../assets/circle.svg';
import SquareIcon from '../assets/square.svg';
import AddIcon from '../assets/black-add.svg';

const DashboardShapes: React.FC = () => {
  const [frameType, setFrameType] = useState<'circle' | 'square' | null>(null);
  const [frameSize, setFrameSize] = useState<number>(150);
  const [innerImage, setInnerImage] = useState<string | null>(null);
  const [framePosition, setFramePosition] = useState<{ top: number; left: number }>({ top: 0, left: 0 });
  const [dragging, setDragging] = useState<boolean>(false);

  const location = useLocation();
  const uploadedFile = location.state?.uploadedFile;
  const imgSectionRef = useRef<HTMLDivElement | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    console.log('Uploaded File:', uploadedFile);
  }, [uploadedFile]);

  const handleFrameTypeChange = (type: 'circle' | 'square') => {
    setFrameType(type);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        setInnerImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    setDragging(true);
  };

  const handleMouseUp = () => {
    setDragging(false);
  };

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (dragging && imgSectionRef.current) {
        const rect = imgSectionRef.current.getBoundingClientRect();
        let newTop = e.clientY - frameSize / 2;
        let newLeft = e.clientX - frameSize / 2;
  
        // Ensure the frame stays within the imgSection bounds
        if (newTop < rect.top) newTop = rect.top;
        if (newLeft < rect.left) newLeft = rect.left;
        if (newTop + frameSize > rect.top + rect.height) newTop = rect.top + rect.height - frameSize;
        if (newLeft + frameSize > rect.left + rect.width) newLeft = rect.left + rect.width - frameSize;
  
        setFramePosition({
          top: newTop - rect.top,
          left: newLeft - rect.left,
        });
      }
    };

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [dragging, frameSize]);

  const handleSaveProject = async () => {
    if (imgSectionRef.current) {
      try {
        const canvas = await html2canvas(imgSectionRef.current, {
          useCORS: true,
          allowTaint: true,
        });
        const imgData = canvas.toDataURL('image/png');
        console.log('Captured Image Data URL:', imgData);

        navigate('/dashboard-text', { state: { combinedImage: imgData } });
      } catch (error) {
        console.error('Error capturing image:', error);
      }
    }
  };

  const handleDownloadClick = () => { };

  return (
    <div className="container">
      <DashboardHeader />
      <div className="edit">
        <SideNav currentTab="shapes" onDownloadClick={handleDownloadClick} />
        <div className="body">
          <div className="project">
            <UntitledProject onSave={handleSaveProject} />
            <div className="img-section">
              <div className="import preview" ref={imgSectionRef} style={{ position: 'relative' }}>
                {uploadedFile && <img src={uploadedFile} alt="Uploaded" className="main-image" style={{ width: '100%', height: '100%' }} />}
                {frameType && (
                  <div
                    className={`frame ${frameType}`}
                    style={{
                      width: frameSize,
                      height: frameSize,
                      borderRadius: frameType === 'circle' ? '50%' : '0',
                      position: 'absolute',
                      top: framePosition.top,
                      left: framePosition.left,
                      border: '5px solid white',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      overflow: 'hidden',
                      cursor: 'move',
                    }}
                    onMouseDown={handleMouseDown}
                  >
                    {innerImage ? (
                      <img
                        src={innerImage}
                        alt="Inner"
                        className="inner-image"
                        style={{
                          width: '100%',
                          height: '100%',
                          objectFit: 'cover',
                          borderRadius: frameType === 'circle' ? '50%' : '0',
                        }}
                      />
                    ) : (
                      <div>
                        <input type="file" onChange={handleFileChange} style={{ display: 'none' }} id="innerImageInput" />
                        <label htmlFor="innerImageInput" className="upload-btn">
                          <img src={AddIcon} alt="" />
                        </label>
                      </div>
                    )}
                  </div>
                )}
              </div>
              <div className={`actions ${frameType ? 'size-slider' : 'shapes'}`}>
                <button className="crop" onClick={() => handleFrameTypeChange('circle')}>
                  <img src={CircleIcon} alt="" />
                  <p>Circle</p>
                </button>
                <button className="rotate" onClick={() => handleFrameTypeChange('square')}>
                  <img src={SquareIcon} alt="" />
                  <p>Square</p>
                </button>
                {frameType && (
                  <input
                    type="range"
                    min="50"
                    max="300"
                    value={frameSize}
                    onChange={(e) => setFrameSize(Number(e.target.value))}
                    className="size-slider"
                  />
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardShapes;
