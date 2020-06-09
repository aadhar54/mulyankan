import React, { useEffect } from 'react';
const fabric = require('fabric').fabric;

const Canvas = ({ pdf, pg, scale, setFcanvas }) => {
  let viewport, canvas, ctx, fcanvas, downloadCanvas;

  const getPageAndRender = async () => {
    const page = await pdf.getPage(pg);
    viewport = page.getViewport({ scale: 1 });
    canvas = document.querySelector(`.page-${pg}`);
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
      fcanvas.setBackgroundImage(bg, fcanvas.renderAll.bind(fcanvas));
      fcanvas.setHeight(viewport.height);
      fcanvas.setWidth(viewport.width);

      // fcanvas.on('mouse:wheel', (opt) => {
      //   let delta = opt.e.deltaY;
      //   let zoom = fcanvas.getZoom();
      //   zoom *= 0.999 ** zoom;
      //   if (zoom > 20) zoom = 20;
      //   if (zoom < 0.01) zoom = 0.01;
      //   fcanvas.setZoom(zoom);
      //   opt.e.preventDefault();
      //   opt.e.stopPropagation();
      // });
    });

    document
      .querySelector(`.canvas-container-${pg}`)
      .addEventListener('dragover', (e) => e.preventDefault());
    document
      .querySelector(`.canvas-container-${pg}`)
      .addEventListener('drop', (e) => {
        e.preventDefault();
        let id = e.dataTransfer.getData('id');
        let imgEl = document.querySelector(id);
        let img = new fabric.Image(imgEl, {
          left: 0,
          top: 0,
        });
        fcanvas.add(img);
      });
  };

  getPageAndRender();

  return (
    <div id="canvas-container" className={`canvas-container-${pg}`}>
      <button
        style={{ fontSize: '2rem' }}
        onClick={() => downloadCanvas()}
        className="download"
      >
        Download
      </button>
      <canvas
        style={{ display: 'none' }}
        id={`page-${pg}`}
        className={`page-${pg}`}
      ></canvas>
      <canvas id={`fabric-${pg}`}></canvas>
    </div>
  );
};

export default Canvas;
