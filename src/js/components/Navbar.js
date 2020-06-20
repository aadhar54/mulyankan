import React from 'react';
import Sugar from 'sugar';

const Navbar = ({ file, setZoom }) => {
  const fileName = Sugar.String(file.name);
  const displayName = fileName.truncate(25).raw;
  return (
    <div className="navbar">
      <div className="navbar-wrapper">
        <div className="navbar__filename">{displayName}</div>
        <div className="navbar__zooming">
          <div className="buttons-grid">
            <button className="btn" onClick={() => setZoom(1.1)}>
              <i className="material-icons">zoom_in</i>
            </button>
            <button onClick={() => setZoom(0.9)}>
              <i className="material-icons">zoom_out</i>
            </button>
            <button onClick={() => setZoom(0.9, true)}>
              <i className="material-icons">refresh</i>
            </button>
          </div>
        </div>
        <div className="navbar__saving">Saving...</div>
        <div className="navbar__help">Help</div>
      </div>
    </div>
  );
};

export default Navbar;