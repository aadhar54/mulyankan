import React, { Component } from 'react';
import SelectPDF from './Welcome';
import jspdf from 'jspdf';

// LAYOUTS
import LoadPDF from './LoadPDF.js';
import LoadJSON from './LoadJSON';

// COMPONENTS
import Sidebar from '../components/Sidebar';
import Menu from '../components/Menu';
import Navbar from '../components/Navbar';

export class Home extends Component {
  constructor() {
    super();
    this.state = {
      pdf: null,
      fcArray: [],
      zoom: 1,
      copy: null,
      download: true,
      menuOpen: false,
      marks: 0
    };
  }

  updateMarks = action => {
    let markBoxArray = [];
    let marks = 0;
    console.log(this.state.fcArray);
    this.state.fcArray.forEach(c => {
      let markArray = c._objects.filter(o => o.textType === 'mark');
      markBoxArray = [...markBoxArray, ...markArray];
    });
    markBoxArray.forEach(mb => {
      console.log(mb.isOnScreen());

      if (mb.isOnScreen() && !isNaN(mb.text)) {
        marks += parseFloat(mb.text);
      }
    });
    this.setState({
      marks
    });
  };

  setActiveCanvas = index => {
    let sorter = (a, b) => {
      if (a.index < b.index) {
        return -1;
      } else if (a.qty > b.qty) {
        return 1;
      } else {
        return 0;
      }
    };
    let toBeActive = this.state.fcArray.filter(fc => fc.index === index)[0];
    let newArray = this.state.fcArray.filter(fc => fc.index !== index);
    newArray.forEach(c => (c.activeCanvas = false));
    toBeActive.activeCanvas = true;
    newArray.push(toBeActive);
    let finalArray = newArray.sort(sorter);
    console.log(finalArray);
  };

  setCopy = newCopy => {
    this.setState({ copy: newCopy });
  };

  setFcArray = (arg, erase = false) => {
    if (erase) {
      this.setState({
        fcArray: []
      });
      return;
    }
    this.setState(state => {
      let newFcArray = state.fcArray.concat(arg);
      return {
        fcArray: newFcArray
      };
    });
  };

  paste = mouseCoords => {
    let canvas = this.state.fcArray.filter(cv => cv.activeCanvas)[0];
    let coords = mouseCoords;
    console.log(canvas);
    if (this.state.copy) {
      if (this.state.copy.text) {
        let copy = this.state.copy;

        copy.clone(cp => {
          cp.set({
            width: copy.width,
            height: copy.height,
            fontSize: copy.get('fontSize'),
            fill: copy.get('fill'),
            fireRightClick: true,
            fontFamily: 'sans-serif',
            transparentCorners: false,
            cornerColor: '#0984e3',
            cornerSize: 7,
            top: coords.y ? coords.y - cp.get('height') / 2 : 0,
            left: coords.x ? coords.x - cp.get('width') / 2 : 0
          });
          canvas.add(cp);
          cp.setCoords();
        });
      } else {
        this.state.copy.clone(cp => {
          let copy = this.state.copy;
          console.log(copy.width, copy.height);
          cp.set({
            height: copy.height,
            width: copy.width,
            transparentCorners: false,
            cornerColor: '#0984e3',
            cornerSize: 7,
            evented: true,
            top: coords.y ? coords.y : 0,
            left: coords.x ? coords.x : 0
          });

          canvas.add(cp);
          cp.setCoords();
        });
      }
    }
  };

  setPdf = pdf => {
    this.state.fcArray.forEach(c => {
      c.dispose();
    });
    document
      .querySelectorAll('div[class^="canvas-container-"]')
      .forEach(cur => {
        console.log(cur);
      });

    this.setFcArray([], true);
    this.setState({
      pdf
    });
  };

  setDownload = value => {
    this.setState({
      download: value
    });
  };

  editText = (param, value) => {
    this.state.fcArray.forEach(fc => {
      if (fc._activeObject && fc._activeObject.text) {
        let def = fc._activeObject.get(param);
        if (def === value) {
          switch (param) {
            case 'underline':
              fc._activeObject.set(param, '');
              fc.renderAll();
              document.querySelector('.underline').style.backgroundColor =
                '#eee';
              break;
            case 'fontWeight':
              fc._activeObject.set(param, 'normal');
              fc.renderAll();
              document.querySelector('.bold').style.backgroundColor = '#eee';
              break;
            case 'fontStyle':
              fc._activeObject.set(param, 'normal');
              fc.renderAll();
              document.querySelector('.italic').style.backgroundColor = '#eee';
              break;
            default:
              return;
          }
        } else {
          fc._activeObject.set(param, value);
          fc.renderAll();
          switch (param) {
            case 'underline':
              document.querySelector('.underline').style.backgroundColor =
                '#ccc';
              break;
            case 'fontWeight':
              document.querySelector('.bold').style.backgroundColor = '#ccc';
              break;
            case 'fontStyle':
              document.querySelector('.italic').style.backgroundColor = '#ccc';
              break;
            default:
              return;
          }
        }
      }
    });
  };

  setZoom = (f, reset = false) => {
    let factor = f;
    this.state.fcArray.forEach(fc => {
      if (reset) {
        factor = 1 / (fc.height / fc.originalDimensions.height);
      }
      fc.setDimensions({
        width: fc.getWidth() * factor,
        height: fc.getHeight() * factor
      });
      let objects = fc.getObjects();
      objects.forEach(object => {
        object.scaleX *= factor;
        object.scaleY *= factor;
        object.top *= factor;
        object.left *= factor;

        object.setCoords();
        fc.renderAll();
        fc.zoom = fc.zoom * factor;
      });
    });
  };

  setFcanvas = fc => {
    const fcArray = this.state.fcanvas.concat(fc);
    this.setState({
      fcanvas: fcArray
    });
  };

  logURLs = name => {
    this.setZoom(1.1, true);
    let doc = new jspdf('p', 'pt', 'a4');
    let width = doc.internal.pageSize.width;
    let height = doc.internal.pageSize.height;
    let sorter = (a, b) => {
      if (a.index < b.index) {
        return -1;
      } else if (a.qty > b.qty) {
        return 1;
      } else {
        return 0;
      }
    };
    let downloadArray = this.state.fcArray.sort(sorter);
    downloadArray.forEach((cur, index, arr) => {
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
    doc.save(name, { returnPromise: true }).then(() => {
      console.log('ok');
    });
  };

  saveAsJSON = filename => {
    this.setZoom(1.1, true);
    let saveData = {};
    let sorter = (a, b) => {
      if (a.index < b.index) {
        return -1;
      } else if (a.qty > b.qty) {
        return 1;
      } else {
        return 0;
      }
    };
    let downloadArray = this.state.fcArray.sort(sorter);
    downloadArray.forEach((fc, index) => {
      saveData[index] = fc.toDatalessObject();
    });
    let json = JSON.stringify(saveData);
    const el = document.createElement('a');
    let name = `${filename}.json`;
    const type = name.split('.').pop();
    el.href = URL.createObjectURL(
      new Blob([json], { type: `text/${type === 'txt' ? 'plain' : type}` })
    );
    el.download = name;
    el.click();
  };

  toggleMenu = () => {
    this.setState({
      menuOpen: !this.state.menuOpen
    });
  };

  render() {
    document.oncontextmenu = () => {
      return false;
    };
    return !this.state.pdf ? (
      <SelectPDF setPdf={this.setPdf} />
    ) : (
      <div>
        <Navbar file={this.state.pdf} setZoom={this.setZoom} />
        <main>
          <Sidebar
            addText={this.addText}
            logURLs={this.logURLs}
            title={this.state.pdf.name}
            setZoom={this.setZoom}
            editText={this.editText}
            marks={this.state.marks}
          />
          <div className="main-container" id="main-container">
            <Menu
              logURLs={this.logURLs}
              saveAsJSON={this.saveAsJSON}
              setPdf={this.setPdf}
            />
            {this.state.pdf.type.includes('pdf')
              ? [...Array(this.state.pdf.data.numPages).keys()].map(pg => (
                  <LoadPDF
                    key={pg}
                    pg={pg + 1}
                    setCopy={this.setCopy}
                    pdf={this.state.pdf}
                    editText={this.editText}
                    paste={this.paste}
                    setActiveCanvas={this.setActiveCanvas}
                    setFcArray={this.setFcArray}
                    updateMarks={this.updateMarks}
                    marks={this.state.marks}
                  />
                ))
              : Object.entries(this.state.pdf.data).map((pg, index) => (
                  <LoadJSON
                    key={index}
                    page={index}
                    pdf={this.state.pdf}
                    setCopy={this.setCopy}
                    setFcArray={this.setFcArray}
                    setActiveCanvas={this.setActiveCanvas}
                    editText={this.editText}
                    paste={this.paste}
                    updateMarks={this.updateMarks}
                  />
                ))}
          </div>
        </main>
      </div>
    );
  }
}

export default Home;
