import React, { useEffect } from 'react';
import DashboardHeader from './DashboardHeader';
import SideNav from './SideNav';
import UntitledProject from './UntitledProject';
import { useGallery } from '../context/GalleryContext';

const DashboardGallery: React.FC = () => {
  const { galleryImages, setGalleryImages } = useGallery();

  useEffect(() => {
    const cachedImages = localStorage.getItem('galleryImages');
    if (cachedImages?.length) {
      setGalleryImages(JSON.parse(cachedImages));
    }
  }, [setGalleryImages]);

  const getImageSizeClass = (numImages: number) => {
    if (numImages <= 4) return 'large';
    if (numImages <= 6) return 'medium';
    return 'small';
  };

  const imageSizeClass = getImageSizeClass(galleryImages.length);

  return (
    <div className="container">
      <DashboardHeader admin={true} handleDownloadClick={() => {}} />
      <div className="edit">
        <SideNav currentTab='gallery'
          onDownloadClick={() => { }}
          onShapesClick={() => { }}
          onTextsClick={() => { }}
          onEditClick={() => { }}
          setModalOpen={() => { }}
        />
        <div className="body">
          <div className="project">
            <UntitledProject
              onSave={() => { }}
              onShare={() => { }}
              untitled={false}
              actions={false}
            />
            <div className="cnt">
              <div className="img-section">
                <div className="import img-box">
                  {galleryImages.length ? (
                    <div className={`images ${imageSizeClass}`}>
                      {galleryImages.map((galleryImage, i) => (
                        <img src={galleryImage} alt="" key={i} />
                      ))}
                    </div>
                  ) : (
                    <div className="no-images">
                      <p>No Gallery Images Yet. Upload An Image And Create Your Avatar.</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardGallery;
