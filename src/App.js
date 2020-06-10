import React, { Component } from 'react';
import SelectPDF from './SelectPDF';
import Sidebar from './Sidebar';
import jspdf from 'jspdf';
const fabric = require('fabric').fabric;

const fcArray = [];

const Cv = ({ pdf, pg, setFcanvas }) => {
  let viewport, canvas, ctx, fcanvas, keyDown;

  const getPageAndRender = async () => {
    const page = await pdf.getPage(pg);
    viewport = page.getViewport({ scale: 1 });
    canvas = document.createElement('canvas');
    ctx = canvas.getContext('2d');
    canvas.height = viewport.height;
    canvas.width = viewport.width;
    const renderContext = {
      canvasContext: ctx,
      viewport,
    };
    let mouseCoords;
    const task = page.render(renderContext);
    task.promise.then(() => {
      const bg = canvas.toDataURL();
      fcanvas = new fabric.Canvas(`fabric-${pg}`);
      fcanvas.setHeight(viewport.height);
      fcanvas.setWidth(viewport.width);
      fabric.Image.fromURL(
        bg,
        (img) => {
          fcanvas.add(img);
          fcanvas.sendToBack(img);
          fcanvas.renderAll();
        },
        {
          evented: false,
          selectable: false,
          hasBorders: false,
          hasControls: false,
          hasRotatingPoint: false,
        }
      );
      fcanvas.originalDimensions = {
        height: fcanvas.getHeight(),
        width: fcanvas.getWidth(),
      };

      fcanvas.on('drop', (e) => {
        let pointerLocation = fcanvas.getPointer(e.e);
        mouseCoords = pointerLocation;
      });

      document
        .querySelector(`#fabric-${pg}`)
        .addEventListener('keypress', (e) => {
          console.log(e.keyCode);
        });

      keyDown = (e) => {
        e.preventDefault();
        console.log(e.keyCode);
      };

      fabric.util.addListener(document.body, 'keydown', (options) => {
        options.preventDefault();
        if (fcanvas._activeObject) {
          let keyCode = options.keyCode;
          if (keyCode === 38) {
            let top = fcanvas._activeObject.top;
            fcanvas._activeObject.top = top - 2;
            fcanvas.renderAll();
          }
          if (keyCode === 40) {
            let top = fcanvas._activeObject.top;
            fcanvas._activeObject.top = top + 2;
            fcanvas.renderAll();
          }
          if (keyCode === 37) {
            let left = fcanvas._activeObject.left;
            fcanvas._activeObject.left = left - 2;
            fcanvas.renderAll();
          }
          if (keyCode === 39) {
            let left = fcanvas._activeObject.left;
            fcanvas._activeObject.left = left + 2;
            fcanvas.renderAll();
          }
        }
      });

      fcanvas.zoom = 1;
      fcArray.push(fcanvas);
    });

    document
      .querySelector(`.canvas-container-${pg}`)
      .addEventListener('dragover', (e) => e.preventDefault());
    document
      .querySelector(`.canvas-container-${pg}`)
      .addEventListener('drop', (e) => {
        e.preventDefault();

        let id = e.dataTransfer.getData('id');
        if (id === '#text') {
          let text = new fabric.Textbox('Enter text here', {
            left: mouseCoords.x,
            top: mouseCoords.y,
            fill: '#ff4757',
            fontFamily: 'sans-serif',
            transparentCorners: false,
            cornerColor: '#0984e3',
            cornerSize: 7,
          });

          text.set({ fill: '#ff4757', fontFamily: 'sans-serif' });
          fcanvas.add(text);
        } else {
          let imgEl = document.querySelector(id);
          let img = new fabric.Image(imgEl, {
            left: mouseCoords.x,
            top: mouseCoords.y,
            transparentCorners: false,
            cornerColor: '#0984e3',
            cornerSize: 7,
          });
          fcanvas.add(img);
        }
      });
  };

  getPageAndRender();

  return (
    <div id="canvas-container" className={`canvas-container-${pg}`}>
      <canvas id={`fabric-${pg}`} className="fabric-js"></canvas>
    </div>
  );
};

export class App extends Component {
  constructor() {
    super();
    this.state = {
      pdf: null,
      fcanvas: [],
      zoom: 1,
      download: true,
    };
  }

  setPdf = (pdf) => {
    this.setState({
      pdf,
    });
  };

  setDownload = (value) => {
    this.setState({
      download: value,
    });
  };

  editText = (param, value) => {
    fcArray.forEach((fc) => {
      if (fc._activeObject && fc._activeObject.text) {
        let def = fc._activeObject.get(param);
        if (def === value) {
          switch (param) {
            case 'underline':
              fc._activeObject.set(param, '');
              break;
            case 'fontWeight':
              fc._activeObject.set(param, 'normal');
              break;
            case 'fontStyle':
              fc._activeObject.set(param, 'normal');
              break;
            default:
              return;
          }
        } else {
          fc._activeObject.set(param, value);
        }
        fc.renderAll();
      }
    });
  };

  setZoom = (f, reset = false) => {
    let factor = f;
    fcArray.forEach((fc) => {
      if (reset) {
        factor = 1 / (fc.height / fc.originalDimensions.height);
      }
      fc.setDimensions({
        width: fc.getWidth() * factor,
        height: fc.getHeight() * factor,
      });
      let objects = fc.getObjects();
      objects.forEach((object) => {
        let scaleX = object.scaleX;
        let scaleY = object.scaleY;
        let top = object.top;
        let left = object.left;

        object.scaleX = scaleX * factor;
        object.scaleY = scaleY * factor;
        object.top = top * factor;
        object.left = left * factor;

        object.setCoords();
        fc.renderAll();
        fc.zoom = fc.zoom * factor;
      });
    });
  };

  setFcanvas = (fc) => {
    const fcArray = this.state.fcanvas.concat(fc);
    this.setState({
      fcanvas: fcArray,
    });
  };

  logURLs = (name) => {
    let doc = new jspdf('p', 'pt', 'a4');
    let width = doc.internal.pageSize.width;
    let height = doc.internal.pageSize.height;
    fcArray.forEach((cur, index, arr) => {
      doc.addImage(
        cur.toDataURL({ format: 'png' }),
        'PNG',
        0,
        0,
        width,
        height
      );
      if (!(index === arr.length - 1)) {
        doc.addPage();
      }
    });
    doc.save(name);
    this.setState({
      download: false,
    });
  };

  render() {
    return !this.state.pdf ? (
      <SelectPDF setPdf={this.setPdf} />
    ) : (
      <main>
        <div className="main-container">
          <Sidebar
            addText={this.addText}
            logURLs={this.logURLs}
            title={this.state.pdf.name}
            setZoom={this.setZoom}
            editText={this.editText}
            download={this.state.download}
            setDownload={this.setDownload}
          />
          {this.state.pdf
            ? [...Array(this.state.pdf.data.numPages).keys()].map((pg) => (
                <Cv
                  setFcanvas={this.setFcanvas}
                  key={pg}
                  pg={pg + 1}
                  pdf={this.state.pdf.data}
                />
              ))
            : null}
        </div>
      </main>
    );
  }
}

export default App;

// import React, { useState } from 'react';
// import SelectPDF from './SelectPDF';
// import Sidebar from './Sidebar';
// import Cv from './Cv';

// const App = () => {
//   const [pdf, setPdf] = useState(null);
//   const [scale, setScale] = useState(1);
//   const [fcanvas, setFcanvas] = useState({});

//
// };

// export default App;
