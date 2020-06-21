import React, { useState } from 'react';
import Sugar from 'sugar';
import firebase from 'firebase/app';
import 'firebase/storage';
import { Howl, Howler } from 'howler';

const Music = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [playing, setPlaying] = useState(false);

  const play = async url => {
    const storage = firebase.storage();
    let ref = storage.refFromURL(url);
    let res = await ref.getDownloadURL();
    ref.getDownloadURL().then(url => {
      console.log(res);
      let track = new Howl({
        src: res,
        autoplay: true
      });
      track.once('load', () => {
        track.play();
        setPlaying(true);
      });
    });
  };

  const toggleMusic = e => {
    e.preventDefault();
    setIsOpen(!isOpen);
  };

  const nameLength = 40;

  const tracks = [
    {
      name: Sugar.String('Roja Instrumental').truncate(nameLength).raw,
      url: 'gs://mulyankan-58611.appspot.com/Roja Instrumental.mp3'
    }
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
            <div
              onClick={() => play(track.url)}
              key={index}
              className="music-option"
            >
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
