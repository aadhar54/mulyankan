import React, { useState } from 'react';
import firebase from 'firebase/app';
import 'firebase/auth';
import { useAuthState } from 'react-firebase-hooks/auth';
import WelcomeNav from './../components/WelcomeNav';
const pdfjsLib = window['pdfjs-dist/build/pdf'];

const auth = firebase.auth();

const SelectPDF = ({ setPdf }) => {
  const [file, setFile] = useState(null);
  const [user, loading, error] = useAuthState(auth);
  const prepareFile = fileObject => {
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
        task.onProgress = progress => {
          console.log(progress);
        };
        task.promise.then(res => {
          setPdf({
            name: file.name,
            data: res,
            type: file.type
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
          type: file.type
        });
      });
    }
  };

  return (
    <div
      className="welcome"
      onDragOver={e => e.preventDefault()}
      onDrop={e => {
        e.preventDefault();
        prepareFile(e.dataTransfer.files[0]);
      }}
    >
      <div className="welcome-container">
        <WelcomeNav active="home" />
        <div className="welcome-contents">
          <div className="welcome-select-pdf">
            <div
              style={{ cursor: file ? 'auto' : 'pointer' }}
              onClick={
                file
                  ? null
                  : () => document.querySelector('.file-upload-input').click()
              }
              className="welcome-select-container"
            >
              <div className="select-pdf-top">
                <input
                  type="file"
                  className="file-upload-input"
                  style={{ display: 'none' }}
                  onChange={e => {
                    if (e.target.files[0]) {
                      prepareFile(e.target.files[0]);
                    }
                  }}
                />
                <span>Drag or Click to select a PDF or JSON save file</span>
              </div>
              <div className="welcome-file-container">
                {!file ? (
                  <i className="material-icons file-upload-icon">
                    file_download
                  </i>
                ) : (
                  <div>
                    <span className="upload-file-name">{file.name}</span>
                    <div className="welcome-buttons">
                      <button
                        onClick={
                          file
                            ? () =>
                                document
                                  .querySelector('.file-upload-input')
                                  .click()
                            : null
                        }
                      >
                        <i className="material-icons welcome-buttons-child">
                          refresh
                        </i>
                        <span className="welcome-buttons-child">Reselect</span>
                      </button>
                      <button onClick={() => proceed()}>
                        <span className="welcome-buttons-child">Proceed</span>
                        <i className="material-icons welcome-buttons-child">
                          chevron_right
                        </i>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
          <div className="online-files">
            <i className="material-icons">new_releases</i>
            <p className="cloud-coming-soon">
              Feature to save files to the cloud will be available soon!
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SelectPDF;

/*
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
*/
