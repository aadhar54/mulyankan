import React, { useState, useEffect } from 'react';
const pdfjsLib = window['pdfjs-dist/build/pdf'];

const Menu = ({ setPdf, saveAsJSON, logURLs }) => {
  const [file, setFile] = useState(null);
  const [isOpen, setIsOpen] = useState(false);
  const [mode, setMode] = useState(null);
  const [error, setError] = useState(false);

  const prepareFile = (fileObject) => {
    console.log(fileObject.type);
    if (
      (fileObject && fileObject.type.includes('pdf')) ||
      fileObject.type.includes('json')
    ) {
      console.log(fileObject.name);
      setFile(fileObject);
    }
  };

  const proceed = () => {
    const reader = new FileReader();
    if (file.type.includes('pdf')) {
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
            type: file.type,
          });
        });
      });
    } else if (file.type.includes('json')) {
      let blob;
      const jsonReader = new FileReader();
      reader.readAsArrayBuffer(file);
      reader.addEventListener('load', async () => {
        blob = new Blob([reader.result], { type: 'application/json' });
        jsonReader.readAsText(blob);
      });
      jsonReader.addEventListener('load', () => {
        let json = jsonReader.result;
        json = JSON.parse(json);
        setPdf({
          name: file.name,
          data: json,
          type: file.type,
        });
      });
    }
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
        <div
          className="modal-close"
          onClick={(e) => {
            toggleMenu(e);
            setMode(null);
          }}
        ></div>
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
          if (mode === 'open') prepareFile(e.dataTransfer.files[0]);
        }}
      >
        <button
          className="openpdf openpdf-menu"
          onClick={(e) => {
            if (mode) {
              setMode(null);
              setFile(null);
            } else {
              toggleMenu(e);
            }
          }}
        >
          <i
            style={{ color: isOpen ? '#f0932b' : '#2d3436' }}
            className="material-icons"
          >
            {mode ? 'arrow_back' : 'menu'}
          </i>
        </button>
        <div className={`menu ${isOpen ? 'menu-visible' : ''}`}>
          {!mode ? (
            <div>
              <div onClick={() => setMode('open')} className="menu-option">
                <i className="material-icons">insert_drive_file</i>
                <p>Open</p>
              </div>
              <div onClick={() => setMode('save')} className="menu-option">
                <i className="material-icons">save</i>
                <p>Save As</p>
              </div>
              <div onClick={() => setMode('download')} className="menu-option">
                <i className="material-icons">vertical_align_bottom</i>
                <p>Download</p>
              </div>
            </div>
          ) : mode === 'open' && !file ? (
            <div
              className="menu-prev"
              onClick={() => document.querySelector('#menu-input').click()}
            >
              <div className="menu-text">Drag PDF here or Click to Select</div>
              <div className="menu-shape">
                <i className="material-icons">attachment</i>
              </div>
            </div>
          ) : mode === 'open' && file ? (
            <div className="menu-file">
              <div className="file-text">Selected File:</div>
              <div className="file-title">{file.name}</div>
              <div className="file-buttons">
                <button
                  className="menu-back"
                  onClick={() => {
                    setFile(null);
                    setMode('open');
                  }}
                >
                  <i className="material-icons">chevron_left</i>
                  <p>Back</p>
                </button>
                <button
                  className="menu-proceed"
                  onClick={() => {
                    proceed();
                    setIsOpen(false);
                    setMode(null);
                  }}
                >
                  <p>Proceed</p>
                  <i className="material-icons">chevron_right</i>
                </button>
              </div>
            </div>
          ) : mode === 'save' ? (
            <div className="save-menu">
              <p className="file-text">Save As</p>
              <p
                className="file-title file-title-save"
                style={{ color: error ? '#ff4757' : '#00b894' }}
              >
                {error
                  ? 'Please enter a proper file name.'
                  : "Enter a proper file name and click Save. You'll be able to edit this file normally later."}
              </p>
              <input
                onFocus={() => setError(false)}
                type="text"
                className="save-name"
                placeholder="Enter File Name"
              />
              <div className="file-buttons">
                <button
                  className="menu-back"
                  onClick={() => {
                    setFile(null);
                    setMode(null);
                  }}
                >
                  <i className="material-icons">chevron_left</i>
                  <p>Back</p>
                </button>
                <button
                  className="menu-proceed"
                  onClick={() => {
                    if (document.querySelector('.save-name').value) {
                      saveAsJSON(document.querySelector('.save-name').value);
                      setIsOpen(false);
                      setMode(null);
                      setError(false);
                    } else {
                      setError(true);
                    }
                  }}
                >
                  <p>Save</p>
                  <i className="material-icons">vertical_align_bottom</i>
                </button>
              </div>
            </div>
          ) : (
            <div className="save-menu">
              <p className="file-text">Download File</p>
              <p
                className="file-title file-title-save"
                style={{ color: error ? '#ff4757' : '#00b894' }}
              >
                {error
                  ? 'Please enter a proper file name.'
                  : 'Enter a proper file name and click Download to download PDF.'}
              </p>
              <input
                onFocus={() => setError(false)}
                type="text"
                className="save-name"
                placeholder="Enter File Name"
              />
              <div className="file-buttons">
                <button
                  className="menu-back"
                  onClick={() => {
                    setFile(null);
                    setMode(null);
                  }}
                >
                  <i className="material-icons">chevron_left</i>
                  <p>Back</p>
                </button>
                <button
                  className="menu-proceed"
                  onClick={() => {
                    if (document.querySelector('.save-name').value) {
                      logURLs(document.querySelector('.save-name').value);
                      setIsOpen(false);
                      setMode(null);
                      setError(false);
                    } else {
                      setError(true);
                    }
                  }}
                >
                  <p>Download</p>
                  <i className="material-icons">vertical_align_bottom</i>
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

/*
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
*/
