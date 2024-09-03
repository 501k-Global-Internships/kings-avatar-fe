import React from 'react'
import './DownloadModal.scss';
import DownloadIcon from '../assets/downloads.svg';
import CopyIcon from '../assets/copy.svg';
import { DownloadModalProps } from './AppInterface';

const DownloadModal: React.FC<DownloadModalProps> = ({ setModalOpen }) => {
  const handleCloseModal = () => {
    setModalOpen(false);
    document.body.classList.remove('modal-open');
  };

  return (
    <div className="modal-container" onClick={handleCloseModal}>
      <div className="modal">
        <div className="modal-content">
          <div className="hdr">
            <h2>Share Avatar Link </h2>
          </div>
          <div className="txt">
            <p>Your Avatar link is ready</p>
          </div>
          <div className="to-do">
            <div className="copy">
              <button>copy Link <img src={CopyIcon} alt="" /></button>
            </div>
            <div className="download">
              <button>Download <img src={DownloadIcon} alt="" /></button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};


export default DownloadModal
