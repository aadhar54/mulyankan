import React, { useEffect } from 'react';
import ContextMenu from '../components/ContextMenu.js';
const fabric = require('fabric').fabric;

const Cv = ({
  pdf,
  pg,
  editText,
  setCopy,
  setFcArray,
  paste,
  setActiveCanvas,
  updateMarks
}) => {
  let viewport,
    canvas,
    ctx,
    fcanvas,
    mouseCoords,
    undoStack = [],
    redoStack = [],
    pauseSaving = false;

  const undo = c => {
    pauseSaving = true;
    if (undoStack.length === 1) {
      pauseSaving = false;
      return;
    }
    let json = JSON.stringify(undoStack[undoStack.length - 2]);
    redoStack.push(undoStack.pop());
    console.log(JSON.parse(json));
    c.loadFromJSON(json, () => {
      console.log('this runs');
      c._objects[0].evented = false;
      c._objects[0].selectable = false;
      c._objects[0].hasBorders = false;
      c._objects[0].hasControls = false;
      c._objects[0].hasRotatingPoint = false;
      c._objects.forEach(cur => {
        cur.transparentCorners = false;
        cur.cornerColor = '#0984e3';
        cur.cornerSize = 7;
        if (cur.text) if (!isNaN(cur.text)) cur.textType = 'mark';
      });
      c.renderAll();
      pauseSaving = false;
    });
    updateMarks('undo');
  };

  const redo = c => {
    pauseSaving = true;
    if (redoStack.length === 0) {
      pauseSaving = false;
      return;
    }
    let json = JSON.stringify(redoStack[redoStack.length - 1]);
    undoStack.push(redoStack.pop());
    c.loadFromJSON(json, () => {
      console.log('this runs');
      c._objects[0].evented = false;
      c._objects[0].selectable = false;
      c._objects[0].hasBorders = false;
      c._objects[0].hasControls = false;
      c._objects[0].hasRotatingPoint = false;
      c._objects.forEach(cur => {
        cur.transparentCorners = false;
        cur.cornerColor = '#0984e3';
        cur.cornerSize = 7;
      });
      c.renderAll();
      pauseSaving = false;
    });
    updateMarks('redo');
  };

  let updateHistory = data => {
    if (data) {
      if (!pauseSaving) {
        undoStack.push(data);
        redoStack.pop();
      }
    }
  };

  const configureCanvas = fc => {
    fc.originalDimensions = {
      height: fc.getHeight(),
      width: fc.getWidth()
    };

    fc.on('object:added', e => {
      console.log(pauseSaving);
      updateHistory(fc.toJSON());

      if (e.target.text && e.target.textType === 'mark') {
        updateMarks();
      }
    });
    fc.on('object:modified', e => {
      updateHistory(fc.toJSON());
      if (e.target.text && e.target.textType === 'mark') {
        updateMarks();
      }
    });

    fc.on('text:changed', e => {
      if (e.target.text && e.target.textType === 'mark') {
        updateMarks();
      }
    });

    fc.on('drop', e => {
      setActiveCanvas(fc.index);
      let pointerLocation = fc.getPointer(e.e);
      mouseCoords = pointerLocation;
    });

    fc.on('mouse:down', e => {
      setActiveCanvas(fc.index);
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
                        setCopy(fc._activeObject);
                      }
                    }
                  }
                  document
                    .querySelectorAll('.context-menu-pure')
                    .forEach(cm => cm.remove());
                }
              },
              {
                icon: 'assignment',
                name: 'Paste',
                action: () => {
                  paste(mouseCoords);
                  document
                    .querySelectorAll('.context-menu-pure')
                    .forEach(cm => cm.remove());
                }
              },
              {
                icon: 'undo',
                name: 'Undo',
                action: () => {
                  undo(fc);
                  document
                    .querySelectorAll('.context-menu-pure')
                    .forEach(cm => cm.remove());
                }
              },
              {
                icon: 'redo',
                name: 'Redo',
                action: () => {
                  redo(fc);
                  console.log('redo');
                  document
                    .querySelectorAll('.context-menu-pure')
                    .forEach(cm => cm.remove());
                }
              },
              {
                icon: 'delete',
                name: 'Remove',
                action: () => {
                  updateHistory(fc.toJSON());
                  fc.remove(fc._activeObject);
                  document
                    .querySelectorAll('.context-menu-pure')
                    .forEach(cm => cm.remove());
                }
              }
            ]
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
          .forEach(cm => cm.remove());
      }
    });

    fabric.util.addListener(document.body, 'keydown', options => {
      if (
        options.keyCode === 37 ||
        options.keyCode === 38 ||
        options.keyCode === 39 ||
        options.keyCode === 40 ||
        options.keyCode === 66 ||
        options.keyCode === 73 ||
        options.keyCode === 85 ||
        options.keyCode === 86 ||
        options.keyCode === 67 ||
        options.keyCode === 90 ||
        options.keyCode === 89
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
              fcanvas._activeObject.clone(clonedObj => {
                setCopy(clonedObj);
              });
            }
            if (keyCode === 86) {
              paste({ x: 0, y: 0 });
            }
          }
        } else {
          if (options.ctrlKey) {
            let keyCode = options.keyCode;
            if (keyCode === 89) {
              redo(fcanvas);
            }
            if (keyCode === 90) {
              undo(fcanvas);
            }
          }
        }
      }
    });

    fabric.util.addListener(document.body, 'keyup', e => {});
    document
      .querySelector(`.canvas-container-${pg}`)
      .addEventListener('dragover', e => e.preventDefault());
    document
      .querySelector(`.canvas-container-${pg}`)
      .addEventListener('drop', e => {
        e.preventDefault();

        let id = e.dataTransfer.getData('id');
        if (id === '#text') {
          let text = new fabric.Textbox('Text', {
            width: 100,
            height: 30,
            fontSize: 40,
            fill: '#ff4757',
            fireRightClick: true,
            fontFamily: 'sans-serif',
            transparentCorners: false,
            cornerColor: '#0984e3',
            cornerSize: 7
          });

          text.textType = 'text';

          text.set({
            fill: '#ff4757',
            fontFamily: 'sans-serif',
            top: mouseCoords ? mouseCoords.y - text.get('height') / 2 : 0,
            left: mouseCoords ? mouseCoords.x - text.get('width') / 2 : 0
          });

          text.on('mousedown', e => {
            if (e.button === 3) {
              console.log('right click');
            }
          });

          fcanvas.on('before:selection:cleared', obj => {
            document.querySelector('.bold').style.backgroundColor = '#eee';
            document.querySelector('.italic').style.backgroundColor = '#eee';
            document.querySelector('.underline').style.backgroundColor = '#eee';
          });

          fcanvas.on('object:selected', obj => {
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
        } else if (id === '#mark') {
          let text = new fabric.Textbox('Mark', {
            width: 30,
            height: 30,
            fontSize: 40,
            fill: '#ff4757',
            fireRightClick: true,
            fontFamily: 'sans-serif',
            transparentCorners: false,
            cornerColor: '#0984e3',
            cornerSize: 7
          });

          text.textType = 'mark';
          console.log(text);

          text.set({
            fill: '#ff4757',
            fontFamily: 'sans-serif',
            top: mouseCoords ? mouseCoords.y - text.get('height') / 2 : 0,
            left: mouseCoords ? mouseCoords.x - text.get('width') / 2 : 0
          });

          text.on('mousedown', e => {
            if (e.button === 3) {
              console.log('right click');
            }
          });

          fcanvas.on('before:selection:cleared', obj => {
            document.querySelector('.bold').style.backgroundColor = '#eee';
            document.querySelector('.italic').style.backgroundColor = '#eee';
            document.querySelector('.underline').style.backgroundColor = '#eee';
          });

          fcanvas.on('object:selected', obj => {
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
            cornerSize: 7
          });
          let scaleValue = 50;
          img.scaleToWidth(scaleValue);
          img.scaleToHeight(scaleValue);
          img.set({
            top: mouseCoords ? mouseCoords.y - scaleValue / 2 : 0,
            left: mouseCoords ? mouseCoords.x - scaleValue / 2 : 0
          });

          fcanvas.add(img);
        }
      });
    fc.zoom = 1;
    fc.index = pg;
    fc.activeCanvas = false;
    setFcArray(fc);
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
      viewport
    };
    const task = page.render(renderContext);
    task.promise.then(() => {
      const bg = canvas.toDataURL();
      fcanvas = new fabric.Canvas(`fabric-${pg}`);
      fcanvas.set({
        fireRightClick: true,
        stopContextMenu: true
      });
      fcanvas.setDimensions({
        height: viewport.height,
        width: viewport.width
      });
      fabric.Image.fromURL(
        bg,
        img => {
          fcanvas.add(img);
          fcanvas.sendToBack(img);
          fcanvas.renderAll();
        },
        {
          evented: false,
          selectable: false,
          hasBorders: false,
          hasControls: false,
          hasRotatingPoint: false
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
      onContextMenu={e => e.preventDefault()}
    >
      <canvas id={`fabric-${pg}`} className="fabric-js"></canvas>
    </div>
  );
};

export default Cv;
