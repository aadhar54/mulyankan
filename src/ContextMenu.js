import React from 'react';

const ContextMenu = ({ context }) => {
  return (
    <div
      className="context-menu"
      style={{
        display: context.open ? 'block' : 'none',
        top: context.open ? `${context.y}px` : '0',
        left: context.open ? `${context.x}px` : '0',
      }}
    >
      <div className="context-menu-wrapper">
        <button className="context-menu-btn">
          <i className="material-icons">content_copy</i>
          <p>Copy</p>
        </button>
        <button className="context-menu-btn">
          <i className="material-icons">assignment</i>
          <p>Paste</p>
        </button>
      </div>
    </div>
  );
};

export default ContextMenu;
