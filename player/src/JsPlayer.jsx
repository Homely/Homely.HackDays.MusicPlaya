import React, { Component } from 'react';

const playlist = [
  'happy.m4a',
  'sad.m4a',
  'xmas.mp3',
];

class JsPlayer extends Component {
  constructor(props) {
    super();
    this.state = {
      currentIndex: 0,
    };
    this.nextTrack = this.nextTrack.bind(this);
  }

  nextTrack = () => {
    console.log(playlist.length);
    this.setState({ currentIndex: Math.min(this.state.currentIndex + 1, playlist.length) });
  }

  render() {
    const { currentIndex } = this.state;
    return (
      <div>
        <audio ref={(player) => { this.player = player; }} controls="controls">
          <source src={`./music/${playlist[currentIndex]}`} type="audio/mpeg" />
        Your browser does not support the audio element.
        </audio>
        <button onClick={this.nextTrack}>Next</button>
        <div>Playing {currentIndex + 1}.{playlist[currentIndex]}</div>
      </div>
    );
  }
};

export default JsPlayer;