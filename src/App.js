import React, { useState, useEffect } from 'react';
import SelectPDF from './SelectPDF';
import Sidebar from './Sidebar';
import Cv from './Cv';

const App = () => {
  const [pdf, setPdf] = useState(null);
  const [scale, setScale] = useState(1);
  const [urls, setUrls] = useState([]);
  const [startRender, setStartRender] = useState(false);

  useEffect(() => {
    if (pdf) {
      [...Array(pdf.data.numPages).keys()].forEach(async (index) => {
        const pageNumber = index + 1;
        const page = await pdf.data.getPage(pageNumber);
        console.log('getting page ' + pageNumber);
        let viewport = page.getViewport({ scale: 1 });
        let canvas = document.createElement('canvas');
        let ctx = canvas.getContext('2d');
        canvas.height = viewport.height;
        canvas.width = viewport.width;
        const renderContext = {
          canvasContext: ctx,
          viewport,
        };
        const task = page.render(renderContext);
        task.promise.then(() => {
          let d = canvas.toDataURL();
          setUrls((prevUrls) => prevUrls.concat(d));
        });

        return <h1>Hello World</h1>;
      });
    }
  }, [pdf]);

  return !pdf ? (
    <SelectPDF setPdf={setPdf} />
  ) : (
    <main>
      <div className="main-container">
        <Sidebar title={pdf.name} scale={scale} setScale={setScale} />
        {pdf.data.numPages === urls.length
          ? urls.map((url, index) => <Cv key={index} index={index} url={url} />)
          : null}
      </div>
    </main>
  );
};

export default App;
