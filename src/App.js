import React, { useState, useEffect } from 'react';
import SelectPDF from './SelectPDF';
import Sidebar from './Sidebar';
import Cv from './Cv';

const App = () => {
  const [pdf, setPdf] = useState(null);
  const [scale, setScale] = useState(1);
  const [urls, setUrls] = useState([]);

  return !pdf ? (
    <SelectPDF setPdf={setPdf} />
  ) : (
    <main>
      <div className="main-container">
        <Sidebar title={pdf.name} scale={scale} setScale={setScale} />
        {pdf
          ? [...Array(pdf.data.numPages).keys()].map((pg) => (
              <Cv key={pg} pg={pg + 1} pdf={pdf.data} />
            ))
          : null}
      </div>
    </main>
  );
};

export default App;
