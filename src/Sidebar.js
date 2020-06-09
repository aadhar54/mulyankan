import React from 'react';

const Sidebar = ({ scale, setScale, title }) => {
  const dragStart = (e) => {
    e.dataTransfer.setData('id', `#${e.target.id}`);
  };

  return (
    <div className="sidebar">
      <div className="sidebar-title">{title}</div>
      <div className="buttons-grid">
        <button className="zoom-in" onClick={() => setScale(scale + 0.2)}>
          Zoom in
        </button>
        <button className="zoom-out" onClick={() => setScale(scale - 0.2)}>
          Zoom out
        </button>
      </div>

      <div className="icons-grid">
        <img
          onDragStart={dragStart}
          id="tick"
          src="./images/tick.png"
          className="image-icon"
          alt="Correct Mark"
          draggable="true"
        />
        <img
          onDragStart={dragStart}
          id="wrong"
          src="./images/wrong.jpg"
          className="image-icon"
          alt="Correct Mark"
          draggable="true"
        />
      </div>
    </div>
  );
};

export default Sidebar;
