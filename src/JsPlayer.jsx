import React, { Component } from 'react';
import _debounce from 'lodash/debounce';

const playlist = [
  { track: 'sad.m4a', title: 'Sad Machine', artist: 'Porter Robinson' },
  { track: 'happy.m4a', title: 'New Way to Be Happy (Mitchell Southam Remix)', artist: 'Le Visiteur & Jova Radevska' },
  { track: 'xmas.mp3', title: 'Stargate Christmas', artist: '(M)Rated' },
];

let audioPlayer = new Audio();

class JsPlayer extends Component {
  constructor(props) {
    super();
    this.state = {
      currentIndex: 0,
      currentTime: 0,
      seekMax: 0,
      tags: null,
    };
    this.updateTimer = this.updateTimer.bind(this);
    this.play = this.play.bind(this);
    this.stop = this.stop.bind(this);
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
    audioPlayer.src = `./music/${playlist[index].track}`;
  }

  updateTimer() {
    this.setState({ currentTime: parseInt(audioPlayer.currentTime, 10), seekMax: audioPlayer.duration || 60 });
  }

  play(e) {
    e.preventDefault();
    audioPlayer.play();
  }

  stop(e) {
    e.preventDefault();
    audioPlayer.pause();
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
    const { currentTime, seekMax } = this.state;
    return (
      <span className="App-player-seek-timer">{this.formatTime(currentTime)} - {this.formatTime(seekMax)}</span>
    );
  }

  render() {
    const { currentIndex, currentTime, seekMax, tags } = this.state;
    return (
      <div className="App-player" ref={(container) => { this.container = container; }}>
        <div className="Track-title">{tags ? tags.title : playlist[currentIndex].title}</div>
        <div className="Track-artist">by {tags ? tags.artist : playlist[currentIndex].artist}</div>
        <img ref={(coverImage) => { this.coverImage = coverImage; }} className="Player-cover" src="cover.jpg" alt="" />
        <button onClick={this.prev}>⏮️</button>
        <button onClick={this.stop}>⏸️</button>
        <button onClick={this.play}>▶️</button>
        <button onClick={this.next}>⏭️</button>
        <input ref={(seekSlider) => { this.seekSlider = seekSlider; }} onChange={this.seek} type="range" value={currentTime} max={seekMax}/>
        <button ref={(mute) => { this.mute = mute; }} onClick={this.toggleMute}>🔇</button>
        {this.renderTime()}
      </div>
    );
  }
};

export default JsPlayer;