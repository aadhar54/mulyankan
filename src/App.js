import React, { useState } from 'react';
import SelectPDF from './SelectPDF';
import Sidebar from './Sidebar';
import Cv from './Cv';

const App = () => {
  const [pdf, setPdf] = useState(null);
  const [scale, setScale] = useState(1);
  const [fcanvas, setFcanvas] = useState([]);

  return !pdf ? (
    <SelectPDF setPdf={setPdf} />
  ) : (
    <main>
      <div className="main-container">
        <Sidebar title={pdf.name} scale={scale} setScale={setScale} />
        {pdf
          ? [...Array(pdf.data.numPages).keys()].map((pg) => (
              <Cv
                setFcanvas={setFcanvas}
                scale={scale}
                key={pg}
                pg={pg + 1}
                pdf={pdf.data}
              />
            ))
          : null}
      </div>
    </main>
  );
};

export default App;
