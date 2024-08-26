import React from 'react';
import DashboardHeader from './DashboardHeader';
import SideNav from './SideNav';
import UntitledProject from './UntitledProject';
import { useGallery } from '../context/GalleryContext';

const DashboardGallery: React.FC = () => {
  const { galleryImages } = useGallery();

  const getImageSizeClass = (numImages: number) => {
    if (numImages <= 4) return 'large';
    if (numImages <= 6) return 'medium';
    return 'small';
  };

  const imageSizeClass = getImageSizeClass(galleryImages.length);

  const handleSaveProject = async () => { };

  const handleDownloadClick = () => { };

  return (
    <div className="container">
      <DashboardHeader />
      <div className="edit">
      <SideNav currentTab='gallery' 
      onDownloadClick={handleDownloadClick} 
      onShapesClick={() => {}}
      onTextsClick={() => {}}
      onEditClick={() => {}}
      />
        <div className="body">
          <div className="project">
            <UntitledProject onSave={handleSaveProject} />
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
