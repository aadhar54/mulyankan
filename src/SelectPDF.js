import React, { useState } from 'react';
const pdfjsLib = window['pdfjs-dist/build/pdf'];

const SelectPDF = ({ setPdf }) => {
  const [file, setFile] = useState(null);

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

  return (
    <div className="select-pdf">
      <input
        id="file-input"
        style={{ display: 'none' }}
        type="file"
        onChange={(e) => prepareFile(e.target.files[0])}
      />
      <button
        className="upload-pdf"
        onDragOver={(e) => e.preventDefault()}
        onDrop={(e) => {
          e.preventDefault();
          prepareFile(e.dataTransfer.files[0]);
        }}
        onClick={() => document.querySelector('#file-input').click()}
      >
        Drag PDF here or Click to select
      </button>
      {file ? (
        <div>
          <div className="filename-wrapper">
            <p className="filename selected-file">Selected File:</p>
            <p className="filename">{file ? file.name : null}</p>
          </div>
          <div className="proceed-wrapper">
            <div className="proceed-btn">
              <input type="checkbox" id="check" />
              <label
                onClick={() => {
                  proceed();
                }}
                htmlFor="check"
                className="btn-label"
              >
                <span className="load open"></span>
                <p className="btn-text">Proceed</p>
              </label>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
};

export default SelectPDF;
