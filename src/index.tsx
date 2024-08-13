import ReactDOM from 'react-dom/client';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { GalleryProvider } from './context/GalleryContext';
import './index.css';
import App from './App';

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);
root.render(
  <BrowserRouter>
    <GalleryProvider>
      <Routes>
        <Route path="/*" element={<App />} />
      </Routes>
    </GalleryProvider>
  </BrowserRouter>,
);
