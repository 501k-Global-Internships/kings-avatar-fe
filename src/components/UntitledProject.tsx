import React from 'react';
import './UntitledProject.scss';

interface UntitledProjectProps {
  onSave: () => void;
}

const UntitledProject: React.FC<UntitledProjectProps> = ({ onSave }) => {
  return (
    <div className="untitled">
      <div className="empty"></div>
      <div className="text">
        <p>Untitled Project</p>
      </div>
      <div className="actions">
        <button className="save" onClick={onSave}>SAVE PROJECT</button>
        <button className="share">SHARE</button>
      </div>
    </div>
  );
}

export default UntitledProject;
