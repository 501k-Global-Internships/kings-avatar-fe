import React from 'react'
import './DownloadModal.scss';
import DownloadIcon from '../assets/downloads.svg';
import CopyIcon from '../assets/copy.svg';
import RemoveIcon from '../assets/remove.svg';
import { DownloadModalProps } from './Types';

const DownloadModal: React.FC<DownloadModalProps> = ({ setModalOpen, setTexts, handleDownloadClick, handleShareClick }) => {
  const handleCloseModal = () => {
    setModalOpen(false);
    setTexts(true);
    document.body.classList.remove('modal-open');
  };

  return (
    <div className="modal-container">
      <div className="modal">
        <button
          onClick={handleCloseModal}
          className='remove-btn'
        >
          <img className="remove" src={RemoveIcon} alt="" />
        </button>
        <div className="modal-content">
          <div className="hdr">
            <h2>Share Avatar Link </h2>
          </div>
          <div className="txt">
            <p>Your Avatar link is ready</p>
          </div>
          <div className="to-do">
            <div className="copy">
              <button onClick={handleShareClick}>copy Link <img src={CopyIcon} alt="" /></button>
            </div>
            <div className="download">
              <button onClick={handleDownloadClick}>Download <img src={DownloadIcon} alt="" /></button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};


export default DownloadModal
