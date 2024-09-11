import React from 'react';
import { UntitledProjectProps } from './Types';
import './UntitledProject.scss';

const UntitledProject: React.FC<UntitledProjectProps> = ({ onSave, onShare, untitled, actions }) => {
  return (
    <div className="untitled">
      <div className="empty"></div>
      {
        untitled ?
          <div className="text">
            <p>Untitled Project</p>
          </div>
          :
          <div className="text">
          </div>
      }
      {
        actions ?
          <div className="actions">
            <button className="save" onClick={onSave}>SAVE PROJECT</button>
            <button className="share" onClick={onShare}>SHARE</button>
          </div>
          :
          <div className="actions">
          </div>
      }
    </div>
  );
}

export default UntitledProject;
