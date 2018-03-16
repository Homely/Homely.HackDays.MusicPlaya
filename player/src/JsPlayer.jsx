import React, { Component } from 'react';
import _debounce from 'lodash/debounce';

const playlist = [
  'happy.m4a',
  'sad.m4a',
  'xmas.mp3',
];

let audioPlayer = new Audio();

class JsPlayer extends Component {
  constructor(props) {
    super();
    this.state = {
      currentIndex: 0,
      currentTime: 0,
      seekMax: 0,
    };
    this.updateTimer = this.updateTimer.bind(this);
    this.togglePlay = this.togglePlay.bind(this);
    this.toggleMute = this.toggleMute.bind(this);
    this.prev = this.prev.bind(this);
    this.next = this.next.bind(this);
    this.seek = this.seek.bind(this);
  }

  componentDidMount() {
    this.createPlayer();
    audioPlayer.addEventListener('timeupdate', _debounce(this.updateTimer), 500);
  }

  componentWillUnmount() {
    audioPlayer.removeEventListener('timeupdate');
  }
 
  createPlayer(index = this.state.currentIndex) {
    audioPlayer.src = `./music/${playlist[index]}`;
  }

  updateTimer() {
    this.setState({ currentTime: parseInt(audioPlayer.currentTime, 10), seekMax: audioPlayer.duration || 60 });
  }

  togglePlay(e) {
    e.preventDefault();
    audioPlayer.play();
  }

  prev(e) {
    this.skip(e, false);
  }

  next(e) {
    this.skip(e, true);
  }

  skip(e, isForward) {
    e.preventDefault();
    const index = isForward ? Math.min(this.state.currentIndex + 1, playlist.length ) : Math.max(this.state.currentIndex - 1, 0)
    this.setState({ currentIndex: index});
    this.createPlayer(index);
    audioPlayer.play();
  }

  seek(e) {
    e.preventDefault();
    audioPlayer.currentTime = this.seekSlider.value;
  }

  toggleMute(e) {
    e.preventDefault();
    audioPlayer.volume = audioPlayer.volume === 0 ? 1 : 0;
  }

  formatTime(seconds) {
    const date = new Date(null);
    date.setSeconds(seconds); // specify value for SECONDS here
    return date.toISOString().substr(14, 5);
  }

  renderTime() {
    const { currentIndex, currentTime, seekMax } = this.state;
    return (
      <span className="App-player-seek-timer">{this.formatTime(currentTime)} - {this.formatTime(seekMax)}</span>
    );
  }

  render() {
    const { currentIndex, currentTime, seekMax } = this.state;
    return (
      <div className="App-player" ref={(container) => { this.container = container; }}>
        Playing: {currentIndex + 1} - {playlist[currentIndex]} <br />
        <img ref={(coverImage) => { this.coverImage = coverImage; }} className="Player-cover" src="cover.jpg" alt="" />
        <button onClick={this.prev}>⏮️</button>
        <button ref={(play) => { this.play = play; }} onClick={this.togglePlay}>▶️</button>
        <button onClick={this.next}>⏭️</button>
        <input ref={(seekSlider) => { this.seekSlider = seekSlider; }} onChange={this.seek} type="range" value={currentTime} max={seekMax}/>
        <button ref={(mute) => { this.mute = mute; }} onClick={this.toggleMute}>🔇</button>
        {this.renderTime()}
      </div>
    );
  }
};

export default JsPlayer;