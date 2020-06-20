import React, { useState, useEffect } from 'react';
import { CirclePicker } from 'react-color';
import Lazyload from 'react-lazy-load';
import Slider from 'react-rangeslider';
import 'react-rangeslider/lib/index.css';

const Sidebar = ({ title, setZoom, editText }) => {
  const dragStart = e => {
    e.dataTransfer.setData('id', `#${e.target.id}`);
  };

  const [sliderValue, setSliderVaue] = useState(40);

  useEffect(() => {
    editText('fontSize', sliderValue);
  }, [sliderValue, editText]);

  return (
    <div className="sidebar" id="sidebar">
      <div className="divider-invisible"></div>
      {/* <div className="sidebar-title sidebar-sub">Zooming</div>
      <div className="buttons-grid">
        <button className="btn" onClick={() => setZoom(1.1)}>
          <i className="material-icons">add_circle_outline</i>
        </button>
        <button onClick={() => setZoom(0.9)}>
          <i className="material-icons">remove_circle_outline</i>
        </button>
        <button onClick={() => setZoom(0.9, true)}>
          <i className="material-icons">refresh</i>
        </button>
      </div> */}
      <div className="sidebar-title sidebar-sub">Marking</div>
      <div className="divider"></div>
      <div className="sidebar-title sidebar-sub">Corrections</div>
      <div className="icons-grid">
        <Lazyload>
          <img
            onDragStart={dragStart}
            id="tick"
            src="./images/tick.png"
            className="image-icon"
            alt="Correct Mark"
            draggable="true"
          />
        </Lazyload>
        <Lazyload>
          <img
            onDragStart={dragStart}
            id="wrong"
            src="./images/wrong.png"
            className="image-icon"
            alt="Correct Mark"
            draggable="true"
          />
        </Lazyload>
      </div>
      <div className="icons-grid">
        <Lazyload>
          <img
            onDragStart={dragStart}
            id="underline"
            src="./images/underline.png"
            className="image-icon"
            alt="Correct Mark"
            draggable="true"
          />
        </Lazyload>

        <Lazyload>
          <img
            onDragStart={dragStart}
            id="circle"
            src="./images/circle.png"
            className="image-icon"
            alt="Correct Mark"
            draggable="true"
          />
        </Lazyload>
      </div>
      <div className="divider"></div>
      <div className="sidebar-title sidebar-sub">Text</div>
      <div
        className="text-btn"
        onDragStart={dragStart}
        id="text"
        draggable="true"
      >
        <p onDragStart={dragStart} id="text">
          Drag onto page to add text box
        </p>
        <Lazyload>
          <img
            onDragStart={dragStart}
            id="text"
            className="image-icon"
            src="./images/text.png"
            alt="Textbox"
          />
        </Lazyload>
      </div>
      <div className="buttons-grid">
        <button
          className="btn bold"
          onClick={() => editText('fontWeight', 'bold')}
        >
          <i className="material-icons">format_bold</i>
        </button>
        <button
          className="btn italic"
          onClick={() => editText('fontStyle', 'italic')}
        >
          <i className="material-icons">format_italic</i>
        </button>
        <button
          className="btn underline"
          onClick={() => editText('underline', 'true')}
        >
          <i className="material-icons">format_underlined</i>
        </button>
      </div>
      <div className="buttons-grid buttons-grid-fsize">
        <button
          className="btn italic"
          onClick={() => setSliderVaue(sliderValue - 1)}
        >
          <i className="material-icons">remove</i>
        </button>
        <div className="slider-horizontal">
          <Slider
            min={0}
            max={100}
            value={sliderValue}
            orientation="horizontal"
            onChange={v => setSliderVaue(v)}
          />
        </div>

        <button
          className="btn bold"
          onClick={() => setSliderVaue(sliderValue + 1)}
        >
          <i className="material-icons">add</i>
        </button>
      </div>
      <div className="text-color">
        <CirclePicker
          onChange={color => editText('fill', color.hex)}
          width="100%"
          style={{ margin: '0' }}
          colors={[
            '#2ecc71',
            '#ff4757',
            '#ff7f50',
            '#fbc531',
            '#81ecec',
            '#0984e3',
            '#6c5ce7',
            '#fd79a8',
            '#747d8c',
            '#000000'
          ]}
        />
      </div>

      <div className="divider"></div>
      <div className="copyright">
        <div className="copyright-1">
          Made with{' '}
          <span role="img" aria-label="love">
            ❤️
          </span>{' '}
          by Soham Karandikar.
        </div>
        <div className="copyright-2">
          &copy; 2020 by Soham Karandikar. All rights reserved.
        </div>
      </div>
      <div className="divider"></div>
    </div>
  );
};

export default Sidebar;
