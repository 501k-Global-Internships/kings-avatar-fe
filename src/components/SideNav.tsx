import React from 'react'
import EditIcon from '../assets/lucide_edit.svg'
import ShapesIcon from '../assets/shapes.svg'
import TextIcon from '../assets/ion_text.svg'
import GalleryIcon from '../assets/tabler_photo.svg'
import DownloadIcon from '../assets/downloads.svg'
import ShareIcon from '../assets/octicon_share-24.svg'
import './SideNav.scss'
import { Link } from 'react-router-dom'

interface SideNavProps {
  currentTab: string;
}

const SideNav: React.FC<SideNavProps> = ({ currentTab }) => {
  return (
    <div className="side-nav">
      <div className="nav">
        <nav>
          <ul>
            <li className={`${currentTab === 'edit' ? "active" : ""}`}>
              <Link to="/dashboard-edit">
                <img src={EditIcon} alt="" />
                <p>Edit</p>
              </Link>
            </li>
            <li className={`${currentTab === 'shapes' ? "active" : ""}`}>
              <Link to="/dashboard-shapes">
                <img src={ShapesIcon} alt="" />
                <p>Shapes</p>
              </Link>
            </li>
            <li className={`${currentTab === 'text' ? "active" : ""}`}>
              <Link to="/dashboard-text">
                <img src={TextIcon} alt="" />
                <p>Text</p>
              </Link>
            </li>
            <li className={`${currentTab === 'gallery' ? "active" : ""}`}>
              <Link to="/dashboard-gallery">
                <img src={GalleryIcon} alt="" />
                <p>Gallery</p>
              </Link>
            </li>
            <li className={`${currentTab === 'download' ? "active" : ""}`}>
              <Link to="">
                <img src={DownloadIcon} alt="" />
                <p>Download</p>
              </Link>
            </li>
            <li className={`${currentTab === 'projects' ? "active" : ""}`}>
              <Link to="/dashboard-projects">
                <img src={ShareIcon} alt="" />
                <p>Projects</p>
              </Link>
            </li>
          </ul>
        </nav>
      </div>
    </div>
  )
}

export default SideNav
