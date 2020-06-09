import React from 'react';
const fabric = require('fabric').fabric;

const Canvas = ({ pdf, pageNumber, scale }) => {
  let viewport, canvas, ctx, fcanvas;
  const getPageAndRender = async () => {
    const page = await pdf.getPage(pageNumber);
    viewport = page.getViewport({ scale });
    canvas = document.querySelector(`.page-${pageNumber}`);
    ctx = canvas.getContext('2d');
    canvas.height = viewport.height;
    canvas.width = viewport.width;
    const renderContext = {
      canvasContext: ctx,
      viewport,
    };
    await page.render(renderContext);

    canvas.addEventListener('dragover', (e) => e.preventDefault());
    fcanvas = new fabric.Canvas(`page-${pageNumber}`);
  };

  getPageAndRender();

  const drop = (e) => {
    const id = e.dataTransfer.getData('id');
    console.log(id);
    let img = document.querySelector(id);
    const imageInstance = new fabric.Image(img, {
      left: 100,
      top: 100,
    });
    fcanvas.add(imageInstance);
  };

  return (
    <div id="canvas-container" onDrop={drop} className="canvas-container">
      <canvas
        id={`page-${pageNumber}`}
        className={`page-${pageNumber}`}
      ></canvas>
    </div>
  );
};

export default Canvas;
