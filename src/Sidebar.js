import React from 'react';

const Sidebar = ({ scale, setScale, title, setDownload }) => {
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
          src="./images/wrong.png"
          className="image-icon"
          alt="Correct Mark"
          draggable="true"
        />
      </div>
      <div className="icons-grid">
        <img
          onDragStart={dragStart}
          id="underline"
          src="./images/underline.png"
          className="image-icon"
          alt="Correct Mark"
          draggable="true"
        />
        <img
          onDragStart={dragStart}
          id="circle"
          src="./images/circle.png"
          className="image-icon"
          alt="Correct Mark"
          draggable="true"
        />
      </div>
      <button style={{ fontSize: '2rem' }}>Download</button>
    </div>
  );
};

export default Sidebar;
