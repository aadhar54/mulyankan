import React from 'react';
const fabric = require('fabric').fabric;

const Cv = ({ url, index }) => {
  const init = () => {
    const canvas = new fabric.Canvas(`page-${index}`);
    const img = new Image();
    img.onload = () => {
      const fimg = new fabric.Image(img);
      canvas.setOverlayImage(url, canvas.renderAll.bind(canvas));
    };
  };
  init();

  return (
    <div className="canvas-container">
      <canvas className={`page-${index}`} id={`page-${index}`}></canvas>
    </div>
  );
};

export default Cv;
