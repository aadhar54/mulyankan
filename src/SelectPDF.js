import React from 'react';
const pdfjsLib = window['pdfjs-dist/build/pdf'];

const SelectPDF = ({ setPdf }) => {
  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    const reader = new FileReader();
    if (file.type.includes('pdf')) {
      console.log(file);
      // setPdf({
      //   name: file.name,
      //   data: file,
      // });
      if (file.type.includes('pdf')) {
        reader.readAsBinaryString(file);
        reader.addEventListener('load', async () => {
          const task = pdfjsLib.getDocument({ data: reader.result });
          task.promise.then((res) => {
            setPdf({
              name: file.name,
              data: res,
            });
          });
        });
      }
    }
  };

  return (
    <div>
      <input type="file" onChange={handleFileUpload} />
    </div>
  );
};

export default SelectPDF;
