import React from 'react';
const fabric = require('fabric').fabric;

const Cv = ({ pdf, pg }) => {
  const init = async () => {
    const canvas = document.getElementById();
    const canvasContext = canvas.getContext('2d');
    pdf.getPage(pg).then((page) => {
      const viewport = page.viewport({ scale: 1 });
      canvas.height = viewport.height;
      canvas.width = viewport.width;
      const task = page.render({ canvasContext, viewport });
      task.promise.then(() => {
        const bg = canvas.toDataURL();
        console.log(bg);
      });
    });
  };
  init();

  return (
    <div className="canvas-container">
      <canvas className={`page-${pg}`} id={`page-${pg}`}></canvas>
    </div>
  );
};

export default Cv;
