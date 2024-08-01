import React, { createContext, useContext, useState, ReactNode } from 'react';

interface GalleryContextProps {
  galleryImages: string[];
  setGalleryImages: React.Dispatch<React.SetStateAction<string[]>>;
  projectImages: string[];
  setProjectImages: React.Dispatch<React.SetStateAction<string[]>>;
}

const GalleryContext = createContext<GalleryContextProps | undefined>(undefined);

export const GalleryProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [galleryImages, setGalleryImages] = useState<string[]>([]);
  const [projectImages, setProjectImages] = useState<string[]>([]);

  return (
    <GalleryContext.Provider value={{ galleryImages, setGalleryImages, projectImages, setProjectImages }}>
      {children}
    </GalleryContext.Provider>
  );
};

export const useGallery = (): GalleryContextProps => {
  const context = useContext(GalleryContext);
  if (context === undefined) {
    throw new Error('useGallery must be used within a GalleryProvider');
  }
  return context;
};
