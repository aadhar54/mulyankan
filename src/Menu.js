import React, { useState, useEffect } from 'react';
const pdfjsLib = window['pdfjs-dist/build/pdf'];

const Menu = ({ setPdf }) => {
  const [file, setFile] = useState(null);
  const [isOpen, setIsOpen] = useState(false);

  const prepareFile = (fileObject) => {
    if (fileObject && fileObject.type.includes('pdf')) {
      console.log(fileObject.name);
      setFile(fileObject);
    }
  };

  const proceed = () => {
    const reader = new FileReader();
    reader.readAsBinaryString(file);
    reader.addEventListener('load', async () => {
      const task = pdfjsLib.getDocument({ data: reader.result });
      task.onProgress = (progress) => {
        console.log(progress);
      };
      task.promise.then((res) => {
        setPdf({
          name: file.name,
          data: res,
        });
      });
    });
  };

  const toggleMenu = (e) => {
    e.preventDefault();
    setIsOpen(!isOpen);
  };

  useEffect(() => {
    if (!isOpen) {
      setFile(null);
    }
  }, [isOpen]);

  return (
    <div>
      {!isOpen ? null : (
        <div className="modal-close" onClick={toggleMenu}></div>
      )}
      <input
        type="file"
        id="menu-input"
        onChange={(e) => prepareFile(e.target.files[0])}
        style={{ display: 'none' }}
      />
      <div
        className="menu-wrapper"
        onDragOver={(e) => e.preventDefault()}
        onDrop={(e) => {
          e.preventDefault();
          prepareFile(e.dataTransfer.files[0]);
        }}
      >
        <button className="openpdf openpdf-menu" onClick={toggleMenu}>
          <i
            style={{ color: isOpen ? '#f0932b' : '#2d3436' }}
            className="material-icons"
          >
            insert_drive_file
          </i>
        </button>
        <div className={`menu ${isOpen ? 'menu-visible' : ''}`}>
          {!file ? (
            <div
              className="menu-prev"
              onClick={() => document.querySelector('#menu-input').click()}
            >
              <div className="menu-text">Drag PDF here or Click to Select</div>
              <div className="menu-shape">
                <i className="material-icons">attachment</i>
              </div>
            </div>
          ) : (
            <div className="menu-file">
              <div className="file-text">Selected File:</div>
              <div className="file-title">{file.name}</div>
              <div className="file-buttons">
                <button className="menu-back" onClick={() => setFile(null)}>
                  <i className="material-icons">chevron_left</i>
                  <p>Back</p>
                </button>
                <button
                  className="menu-proceed"
                  onClick={() => {
                    proceed();
                    setIsOpen(false);
                  }}
                >
                  <p>Proceed</p>
                  <i className="material-icons">chevron_right</i>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Menu;
