import React from 'react';

const playlist = [
  'happy.m4a',
  'sad.m4a',
  'xmas.mp3',
];

const Player = () => {
  return (
    <div>
      {playlist.map((track) =>
        <div key={track} className="App-player">
          {track} <br />
          <audio controls>
            <source src={`./music/${track}`} type="audio/mpeg" />
            Y U NO HAVE HTML5?
          </audio>
        </div>
      )}
    </div>
  );
};

export default Player;