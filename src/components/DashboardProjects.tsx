import React, { useEffect } from 'react';
import DashboardHeader from './DashboardHeader';
import SideNav from './SideNav';
import UntitledProject from './UntitledProject';
import { useGallery } from '../context/GalleryContext';

const DashboardProjects: React.FC = () => {
  const { projectImages, setProjectImages } = useGallery();

  useEffect(() => {
    const cachedImages = localStorage.getItem('projectImages');
    if (cachedImages) {
      setProjectImages(JSON.parse(cachedImages));
    }
  }, [setProjectImages]);

  const getImageSizeClass = (numImages: number) => {
    if (numImages <= 4) return 'large';
    if (numImages <= 6) return 'medium';
    return 'small';
  };

  const imageSizeClass = getImageSizeClass(projectImages.length);

  return (
    <div className="container">
      <DashboardHeader />
      <div className="edit">
        <SideNav currentTab='projects'
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
    </div>
  );
};

export default DashboardProjects;
