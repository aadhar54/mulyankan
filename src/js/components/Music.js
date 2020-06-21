import React, { useState } from 'react';
import Sugar from 'sugar';

const Music = () => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleMusic = e => {
    e.preventDefault();
    setIsOpen(!isOpen);
  };

  const nameLength = 40;

  const tracks = [
    {
      name: Sugar.String('Show me the meaning of being lonely').truncate(
        nameLength
      ).raw,
      url: '#'
    },
    {
      name: Sugar.String('I want it that way').truncate(nameLength).raw,
      url: '#'
    },
    {
      name: Sugar.String('Love of my Life').truncate(nameLength).raw,
      url: '#'
    },
    { name: Sugar.String('Roja').truncate(nameLength).raw, url: '#' }
  ];

  return (
    <div>
      {!isOpen ? null : (
        <div className="modal-close" onClick={e => toggleMusic(e)}></div>
      )}
      <div className="music-wrapper">
        <button
          onClick={e => toggleMusic(e)}
          className="openmusic openmusic-menu"
        >
          <i
            className="material-icons"
            style={{ color: isOpen ? '#ffffff' : '#fd79a8' }}
          >
            {isOpen ? 'arrow_back' : 'library_music'}
          </i>
        </button>
        <div className={`music ${isOpen ? 'music-visible' : ''}`}>
          {tracks.map((track, index) => (
            <div key={index} className="music-option">
              <i className="material-icons">play_circle_outline</i>
              <p>{track.name}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Music;
