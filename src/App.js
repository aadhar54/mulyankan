// unredo2

import React, { Component, useEffect } from 'react';
import SelectPDF from './SelectPDF';
import Sidebar from './Sidebar';
import jspdf from 'jspdf';
import Menu from './Menu';
import './context-menu.css';
const fabric = require('fabric').fabric;
const ContextMenu = window['ContextMenu'];

let fcArray = [];
let copy;

const Cv = ({ pdf, pg, setFcanvas, editText, setContext, paste }) => {
  let viewport,
    canvas,
    ctx,
    fcanvas,
    mouseCoords,
    state = [],
    mods = 0;

  const undo = (c) => {
    if (mods < state.length) {
      c.clear().renderAll();
      c.loadFromJSON(state[state.length - 1 - mods - 1], () => {
        c._objects[0].evented = false;
        c._objects[0].selectable = false;
        c._objects[0].hasBorders = false;
        c._objects[0].hasControls = false;
        c._objects[0].hasRotatingPoint = false;
        c._objects.forEach((cur) => {
          cur.transparentCorners = false;
          cur.cornerColor = '#0984e3';
          cur.cornerSize = 7;
        });
        c.renderAll();
      });
      mods += 1;
    }
  };

  const redo = (c) => {
    if (mods > 0) {
      c.clear().renderAll();
      c.loadFromJSON(state[state.length - 1 - mods + 1], () => {
        c._objects[0].evented = false;
        c._objects[0].selectable = false;
        c._objects[0].hasBorders = false;
        c._objects[0].hasControls = false;
        c._objects[0].hasRotatingPoint = false;
        c._objects.forEach((cur) => {
          cur.transparentCorners = false;
          cur.cornerColor = '#0984e3';
          cur.cornerSize = 7;
        });
        c.renderAll();
      });
      mods -= 1;
    }
  };

  const updateHistory = (saveHistory, c) => {
    if (saveHistory === true) {
      let myjson = JSON.stringify(c);
      state.push(myjson);
    }
  };

  const configureCanvas = (fc) => {
    fc.originalDimensions = {
      height: fc.getHeight(),
      width: fc.getWidth(),
    };

    fc.on('object:added', () => {
      updateHistory(true, fc);
    });
    fc.on('object:modified', () => {
      updateHistory(true, fc);
    });

    fc.on('drop', (e) => {
      fcArray.forEach((fc) => {
        if (fc.index === pg) {
          fc.activeCanvas = true;
        } else {
          fc.activeCanvas = false;
        }
      });
      let pointerLocation = fc.getPointer(e.e);
      mouseCoords = pointerLocation;
    });

    fc.on('mouse:down', (e) => {
      fcArray.forEach((fc) => {
        if (fc.index === pg) {
          fc.activeCanvas = true;
        } else {
          fc.activeCanvas = false;
        }
      });
      let pointerLocation = fc.getPointer(e.e);
      mouseCoords = pointerLocation;
      if (!document.querySelector('.context-menu-pure')) {
        if (e.button === 3) {
          let menu = new ContextMenu({
            theme: 'pure', // or 'blue'
            items: [
              {
                icon: 'content_copy',
                name: 'Copy',
                action: () => {
                  if (fc._activeObject) {
                    if (
                      fc._activeObject.top <= fc.getPointer(e.e).y &&
                      fc._activeObject.top + fc._activeObject.height >=
                        fc.getPointer(e.e).y
                    ) {
                      if (
                        fc._activeObject.left <= fc.getPointer(e.e).x &&
                        fc._activeObject.left + fc._activeObject.width >=
                          fc.getPointer(e.e).x
                      ) {
                        copy = fc._activeObject;
                      }
                    }
                  }
                  document
                    .querySelectorAll('.context-menu-pure')
                    .forEach((cm) => cm.remove());
                },
              },
              {
                icon: 'assignment',
                name: 'Paste',
                action: () => {
                  paste(mouseCoords);
                  document
                    .querySelectorAll('.context-menu-pure')
                    .forEach((cm) => cm.remove());
                },
              },
              {
                icon: 'undo',
                name: 'Undo',
                action: () => undo(fc),
              },
              {
                icon: 'redo',
                name: 'Redo',
                action: () => redo(fc),
              },
            ],
          });
          e.e.preventDefault();
          const time = menu.isOpen() ? 100 : 0;
          menu.hide();
          setTimeout(() => {
            menu.show(e.e.pageX, e.e.pageY);
          }, time);
        }
      } else {
        document
          .querySelectorAll('.context-menu-pure')
          .forEach((cm) => cm.remove());
      }
    });

    fabric.util.addListener(document.body, 'keydown', (options) => {
      if (
        options.keyCode === 37 ||
        options.keyCode === 38 ||
        options.keyCode === 39 ||
        options.keyCode === 40 ||
        options.keyCode === 66 ||
        options.keyCode === 73 ||
        options.keyCode === 85 ||
        options.keyCode === 86 ||
        options.keyCode === 67
      ) {
        if (fcanvas._activeObject && !fcanvas._activeObject.isEditing) {
          let keyCode = options.keyCode;
          if (keyCode === 38) {
            options.preventDefault();
            let top = fcanvas._activeObject.top;
            fcanvas._activeObject.top = top - 2;
            fcanvas._activeObject.setCoords();
            fcanvas.renderAll();
          }
          if (keyCode === 40) {
            options.preventDefault();
            let top = fcanvas._activeObject.top;
            fcanvas._activeObject.top = top + 2;
            fcanvas._activeObject.setCoords();
            fcanvas.renderAll();
          }
          if (keyCode === 37) {
            options.preventDefault();
            let left = fcanvas._activeObject.left;
            fcanvas._activeObject.left = left - 2;
            fcanvas._activeObject.setCoords();
            fcanvas.renderAll();
          }
          if (keyCode === 39) {
            options.preventDefault();
            let left = fcanvas._activeObject.left;
            fcanvas._activeObject.left = left + 2;
            fcanvas._activeObject.setCoords();
            fcanvas.renderAll();
          }
          if (options.ctrlKey && !options.shiftKey) {
            options.preventDefault();
            if (keyCode === 66) {
              editText('fontWeight', 'bold');
              fcanvas.renderAll();
            }
            if (keyCode === 73) {
              editText('fontStyle', 'italic');
              fcanvas.renderAll();
            }
            if (keyCode === 85) {
              editText('underline', 'true');
              fcanvas.renderAll();
            }
            if (keyCode === 67) {
              fcanvas._activeObject.clone((clonedObj) => {
                copy = clonedObj;
              });
            }
            if (keyCode === 86) {
              paste({ x: 0, y: 0 });
            }
          }
        }
      }
    });

    fabric.util.addListener(document.body, 'keyup', (e) => {});
    document
      .querySelector(`.canvas-container-${pg}`)
      .addEventListener('dragover', (e) => e.preventDefault());
    document
      .querySelector(`.canvas-container-${pg}`)
      .addEventListener('drop', (e) => {
        e.preventDefault();

        let id = e.dataTransfer.getData('id');
        if (id === '#text') {
          let text = new fabric.Textbox('Text', {
            width: 30,
            height: 30,
            fontSize: 40,
            fill: '#ff4757',
            fireRightClick: true,
            fontFamily: 'sans-serif',
            transparentCorners: false,
            cornerColor: '#0984e3',
            cornerSize: 7,
          });

          text.set({
            fill: '#ff4757',
            fontFamily: 'sans-serif',
            top: mouseCoords ? mouseCoords.y - text.get('height') / 2 : 0,
            left: mouseCoords ? mouseCoords.x - text.get('width') / 2 : 0,
          });

          text.on('mousedown', (e) => {
            if (e.button === 3) {
              console.log('right click');
            }
          });

          fcanvas.on('before:selection:cleared', (obj) => {
            document.querySelector('.bold').style.backgroundColor = '#eee';
            document.querySelector('.italic').style.backgroundColor = '#eee';
            document.querySelector('.underline').style.backgroundColor = '#eee';
          });

          fcanvas.on('object:selected', (obj) => {
            let target = obj.target;
            if (target.text) {
              if (target.get('fontWeight') === 'bold') {
                document.querySelector('.bold').style.backgroundColor = '#ccc';
              }
              if (target.get('fontStyle') === 'italic') {
                document.querySelector('.italic').style.backgroundColor =
                  '#ccc';
              }
              if (target.get('underline') === 'true') {
                document.querySelector('.underline').style.backgroundColor =
                  '#ccc';
              }
            }
          });

          fcanvas.add(text);
        } else {
          let imgEl = document.querySelector(id);
          let img = new fabric.Image(imgEl, {
            transparentCorners: false,
            cornerColor: '#0984e3',
            cornerSize: 7,
          });
          let scaleValue = 50;
          img.scaleToWidth(scaleValue);
          img.scaleToHeight(scaleValue);
          img.set({
            top: mouseCoords ? mouseCoords.y - scaleValue / 2 : 0,
            left: mouseCoords ? mouseCoords.x - scaleValue / 2 : 0,
          });

          fcanvas.add(img);
        }
      });
    fc.zoom = 1;
    fc.index = pg;
    fc.activeCanvas = false;
    fcArray.push(fc);
  };

  const getPageAndRender = async () => {
    const page = await pdf.data.getPage(pg);
    viewport = page.getViewport({ scale: 1 });
    canvas = document.createElement('canvas');
    ctx = canvas.getContext('2d');
    canvas.height = viewport.height;
    canvas.width = viewport.width;
    const renderContext = {
      canvasContext: ctx,
      viewport,
    };
    const task = page.render(renderContext);
    task.promise.then(() => {
      const bg = canvas.toDataURL();
      fcanvas = new fabric.Canvas(`fabric-${pg}`);
      fcanvas.set({
        fireRightClick: true,
        stopContextMenu: true,
      });
      fcanvas.setDimensions({
        height: viewport.height,
        width: viewport.width,
      });
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
      configureCanvas(fcanvas);
    });
  };

  useEffect(() => {
    getPageAndRender();
  }, [pdf]);

  return (
    <div
      id="canvas-container"
      className={`canvas-container-${pg}`}
      onContextMenu={(e) => e.preventDefault()}
    >
      <canvas id={`fabric-${pg}`} className="fabric-js"></canvas>
    </div>
  );
};

const LoadJSON = ({ pdf, page, setFcanvas, editText, paste }) => {
  let fcanvas, mouseCoords;
  let pg = page + 1;
  console.log(pg);
  let json = JSON.stringify(pdf.data[page]);
  let img = pdf.data[page].objects[0];

  const getPageAndRender = async () => {
    fcanvas = new fabric.Canvas(`fabric-${pg}`);
    fcanvas.originalDimensions = {
      height: img.height,
      width: img.width,
    };
    console.log(fcanvas);
    // fabric.util.enlivenObjects(pdf.data[page].objects, function (objs) {
    //   objs.forEach((o, index) => {
    //     if (index === 0) {
    //       o.evented = false;
    //       o.selectable = false;
    //       o.hasBorders = false;
    //       o.hasControls = false;
    //       o.hasRotatingPoint = false;
    //     }
    //     o.transparentCorners = false;
    //     o.cornerColor = '#0984e3';
    //     o.cornerSize = 7;
    //     fcanvas.add(o);
    //   });
    // });
    fcanvas.setDimensions({
      height: img.height,
      width: img.width,
    });
    console.log(fcanvas.height, fcanvas.width);
    fcanvas.renderAll();
    fcanvas.loadFromJSON(json, function () {
      fcanvas._objects[0].evented = false;
      fcanvas._objects[0].selectable = false;
      fcanvas._objects[0].hasBorders = false;
      fcanvas._objects[0].hasControls = false;
      fcanvas._objects[0].hasRotatingPoint = false;
      fcanvas._objects.forEach((cur) => {
        cur.transparentCorners = false;
        cur.cornerColor = '#0984e3';
        cur.cornerSize = 7;
      });
      fcanvas.renderAll();
    });
    let configureFcanvas = () => {
      fcanvas.set({
        fireRightClick: true,
        stopContextMenu: true,
      });
      fcanvas.originalDimensions = {
        height: fcanvas.getHeight(),
        width: fcanvas.getWidth(),
      };

      fcanvas.on('mouse:down', (e) => {
        fcArray.forEach((fc) => {
          if (fc.index === pg) {
            fc.activeCanvas = true;
          } else {
            fc.activeCanvas = false;
          }
        });
        let pointerLocation = fcanvas.getPointer(e.e);
        mouseCoords = pointerLocation;
        if (!document.querySelector('.context-menu-pure')) {
          if (e.button === 3) {
            let menu = new ContextMenu({
              theme: 'pure', // or 'blue'
              items: [
                {
                  icon: 'content_copy',
                  name: 'Copy',
                  action: () => {
                    if (fcanvas._activeObject) {
                      if (
                        fcanvas._activeObject.top <=
                          fcanvas.getPointer(e.e).y &&
                        fcanvas._activeObject.top +
                          fcanvas._activeObject.height >=
                          fcanvas.getPointer(e.e).y
                      ) {
                        if (
                          fcanvas._activeObject.left <=
                            fcanvas.getPointer(e.e).x &&
                          fcanvas._activeObject.left +
                            fcanvas._activeObject.width >=
                            fcanvas.getPointer(e.e).x
                        ) {
                          copy = fcanvas._activeObject;
                        }
                      }
                    }
                    document
                      .querySelectorAll('.context-menu-pure')
                      .forEach((cm) => cm.remove());
                  },
                },
                {
                  icon: 'assignment',
                  name: 'Paste',
                  action: () => {
                    paste(mouseCoords);
                    document
                      .querySelectorAll('.context-menu-pure')
                      .forEach((cm) => cm.remove());
                  },
                },
              ],
            });
            e.e.preventDefault();
            const time = menu.isOpen() ? 100 : 0;
            menu.hide();
            setTimeout(() => {
              menu.show(e.e.pageX, e.e.pageY);
            }, time);
          }
        } else {
          document
            .querySelectorAll('.context-menu-pure')
            .forEach((cm) => cm.remove());
        }
      });

      fcanvas.on('drop', (e) => {
        let pointerLocation = fcanvas.getPointer(e.e);
        mouseCoords = pointerLocation;
        fcArray.forEach((fc) => {
          if (fc.index === pg) {
            fc.activeCanvas = true;
          } else {
            fc.activeCanvas = false;
          }
        });
      });

      fabric.util.addListener(document.body, 'keydown', (options) => {
        if (
          options.keyCode === 37 ||
          options.keyCode === 38 ||
          options.keyCode === 39 ||
          options.keyCode === 40 ||
          options.keyCode === 66 ||
          options.keyCode === 73 ||
          options.keyCode === 85 ||
          options.keyCode === 86 ||
          options.keyCode === 67
        ) {
          if (fcanvas._activeObject && !fcanvas._activeObject.isEditing) {
            let keyCode = options.keyCode;
            if (keyCode === 38) {
              options.preventDefault();
              let top = fcanvas._activeObject.top;
              fcanvas._activeObject.top = top - 2;
              fcanvas._activeObject.setCoords();
              fcanvas.renderAll();
            }
            if (keyCode === 40) {
              options.preventDefault();
              let top = fcanvas._activeObject.top;
              fcanvas._activeObject.top = top + 2;
              fcanvas._activeObject.setCoords();
              fcanvas.renderAll();
            }
            if (keyCode === 37) {
              options.preventDefault();
              let left = fcanvas._activeObject.left;
              fcanvas._activeObject.left = left - 2;
              fcanvas._activeObject.setCoords();
              fcanvas.renderAll();
            }
            if (keyCode === 39) {
              options.preventDefault();
              let left = fcanvas._activeObject.left;
              fcanvas._activeObject.left = left + 2;
              fcanvas._activeObject.setCoords();
              fcanvas.renderAll();
            }
            if (options.ctrlKey && !options.shiftKey) {
              options.preventDefault();
              if (keyCode === 66) {
                editText('fontWeight', 'bold');
                fcanvas.renderAll();
              }
              if (keyCode === 73) {
                editText('fontStyle', 'italic');
                fcanvas.renderAll();
              }
              if (keyCode === 85) {
                editText('underline', 'true');
                fcanvas.renderAll();
              }
              if (keyCode === 67) {
                fcanvas._activeObject.clone((clonedObj) => {
                  console.log('okay');
                  copy = clonedObj;
                });
              }
              if (keyCode === 86) {
                paste({ x: 0, y: 0 });
              }
            }
          }
        }
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
            let text = new fabric.Textbox('Text', {
              width: 30,
              height: 30,
              fontSize: 40,
              fill: '#ff4757',
              fireRightClick: true,
              fontFamily: 'sans-serif',
              transparentCorners: false,
              cornerColor: '#0984e3',
              cornerSize: 7,
            });

            text.set({
              fill: '#ff4757',
              fontFamily: 'sans-serif',
              top: mouseCoords ? mouseCoords.y - text.get('height') / 2 : 0,
              left: mouseCoords ? mouseCoords.x - text.get('width') / 2 : 0,
            });

            text.on('mousedown', (e) => {
              if (e.button === 3) {
                console.log('right click');
              }
            });

            fcanvas.on('before:selection:cleared', (obj) => {
              document.querySelector('.bold').style.backgroundColor = '#eee';
              document.querySelector('.italic').style.backgroundColor = '#eee';
              document.querySelector('.underline').style.backgroundColor =
                '#eee';
            });

            fcanvas.on('object:selected', (obj) => {
              let target = obj.target;
              if (target.text) {
                if (target.get('fontWeight') === 'bold') {
                  document.querySelector('.bold').style.backgroundColor =
                    '#ccc';
                }
                if (target.get('fontStyle') === 'italic') {
                  document.querySelector('.italic').style.backgroundColor =
                    '#ccc';
                }
                if (target.get('underline') === 'true') {
                  document.querySelector('.underline').style.backgroundColor =
                    '#ccc';
                }
              }
            });

            fcanvas.add(text);
          } else {
            let imgEl = document.querySelector(id);
            let img = new fabric.Image(imgEl, {
              transparentCorners: false,
              cornerColor: '#0984e3',
              cornerSize: 7,
            });
            let scaleValue = 50;
            img.scaleToWidth(scaleValue);
            img.scaleToHeight(scaleValue);
            if (mouseCoords) {
              img.set({
                top: mouseCoords ? mouseCoords.y - scaleValue / 2 : 0,
                left: mouseCoords ? mouseCoords.x - scaleValue / 2 : 0,
              });
            }

            fcanvas.on('object:modified', (obj) => {
              let target = obj.target;
              if (!target.isOnScreen()) {
                fcanvas.remove(target);
              }
            });

            fcanvas.add(img);
          }
        });
      fcanvas.zoom = 1;
      fcanvas.index = pg;
      fcArray.push(fcanvas);
    };
    configureFcanvas();
  };

  useEffect(() => {
    getPageAndRender();
  }, [pdf]);
  return (
    <div
      id="canvas-container"
      className={`canvas-container-${pg}`}
      onContextMenu={(e) => e.preventDefault()}
    >
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
      menuOpen: false,
      copy: null,
    };
  }

  paste = (mouseCoords) => {
    let canvas = fcArray.filter((cv) => cv.activeCanvas)[0];
    let coords = mouseCoords;

    console.log(canvas);
    if (copy) {
      if (copy.text) {
        copy.clone((cp) => {
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
            left: coords.x ? coords.x - cp.get('width') / 2 : 0,
          });
          canvas.add(cp);
          cp.setCoords();
        });
      } else {
        copy.clone((cp) => {
          console.log(copy.width, copy.height);
          cp.set({
            height: copy.height,
            width: copy.width,
            transparentCorners: false,
            cornerColor: '#0984e3',
            cornerSize: 7,
            evented: true,
            top: coords.y ? coords.y : 0,
            left: coords.x ? coords.x : 0,
          });

          canvas.add(cp);
          cp.setCoords();
        });
      }
    }
  };

  setPdf = (pdf) => {
    fcArray.forEach((c) => {
      c.dispose();
    });
    document
      .querySelectorAll('div[class^="canvas-container-"]')
      .forEach((cur) => {
        console.log(cur);
      });
    fcArray = [];
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

  setFcanvas = (fc) => {
    const fcArray = this.state.fcanvas.concat(fc);
    this.setState({
      fcanvas: fcArray,
    });
  };

  logURLs = (name) => {
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
    let downloadArray = fcArray.sort(sorter);
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

  saveAsJSON = (filename) => {
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
    let downloadArray = fcArray.sort(sorter);
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
      menuOpen: !this.state.menuOpen,
    });
  };

  render() {
    return !this.state.pdf ? (
      <SelectPDF setPdf={this.setPdf} />
    ) : (
      <main>
        <Sidebar
          addText={this.addText}
          logURLs={this.logURLs}
          title={this.state.pdf.name}
          setZoom={this.setZoom}
          editText={this.editText}
        />
        <div className="main-container" id="main-container">
          <Menu
            logURLs={this.logURLs}
            saveAsJSON={this.saveAsJSON}
            setPdf={this.setPdf}
          />
          {this.state.pdf.type.includes('pdf')
            ? [...Array(this.state.pdf.data.numPages).keys()].map((pg) => (
                <Cv
                  setFcanvas={this.setFcanvas}
                  key={pg}
                  pg={pg + 1}
                  pdf={this.state.pdf}
                  editText={this.editText}
                  paste={this.paste}
                />
              ))
            : Object.entries(this.state.pdf.data).map((pg, index) => (
                <LoadJSON
                  setFcanvas={this.setFcanvas}
                  key={index}
                  page={index}
                  pdf={this.state.pdf}
                  editText={this.editText}
                  paste={this.paste}
                />
              ))}
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
