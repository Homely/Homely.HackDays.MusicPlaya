import React from 'react';
import Player from './Player.jsx';
import JsPlayer from './JsPlayer.jsx';
import './App.css';

const App = () => {
  return (
    <div className="App">
      <header className="App-header">
        <div className="App-logo"><span role="img" aria-label="logo">🎧</span></div>
        <h1 className="App-title">Welcome all Playas</h1>
      </header>
      <div className="App-intro">
        <h3>HTML Playa</h3>
        <Player />
        <h3>React Playa</h3>
        <JsPlayer />
      </div>
    </div>
  );
};

export default App;
