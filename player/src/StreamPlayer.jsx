import React, { Component } from 'react';
import _debounce from 'lodash/debounce';
import SoundCloud from 'soundcloud';

const playlist = [
  { stream: '36794174', title: 'Alyx Kidd', artist: '(M)Rated' },
  { stream: '146651864', title: 'Cruising Altitude', artist: '(M)Rated' },
  { track: 'happy.m4a', title: 'New Way to Be Happy (Mitchell Southam Remix)', artist: 'Le Visiteur & Jova Radevska' },
  { track: 'sad.m4a', title: 'Sad Machine', artist: 'Porter Robinson' },
  { track: 'xmas.mp3', title: 'Stargate Christmas', artist: '(M)Rated' },
];

let audioPlayer;

class StreamPlayer extends Component {
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
    // ID borrowed from https://www.robinwieruch.de/the-soundcloud-client-in-react-redux/#soundCloudApp
    SoundCloud.initialize({
      client_id: '1fb0d04a94f035059b0424154fd1b18c',
    });

    this.createPlayer();
  }

  componentWillUnmount() {
    audioPlayer.removeEventListener('timeupdate');
    audioPlayer.removeEventListener('ended');
  }
 
  createPlayer(index = this.state.currentIndex) {
    this.stop();
    if (playlist[index].stream) {
      SoundCloud.stream(`/tracks/${playlist[index].stream}`).then(function(player){
        audioPlayer = player;
        audioPlayer.addEventListener('time', _debounce(this.updateTimer), 500);
        audioPlayer.addEventListener('finished', () => { this.skip(); });
      });
    } else {
      audioPlayer = new Audio();
      audioPlayer.addEventListener('timeupdate', _debounce(this.updateTimer), 500);
      audioPlayer.addEventListener('ended', () => { this.skip(); });
      audioPlayer.src = `./music/${playlist[index].track}`;
    }
  }

  updateTimer() {
    const currentTime = audioPlayer.getDuration ? audioPlayer.currentTime() : audioPlayer.currentTime;
    const seekMax = audioPlayer.getDuration ? audioPlayer.getDuration() : audioPlayer.duration;
    this.setState({
      currentTime: parseInt(currentTime, 10) || 0,
      seekMax: parseInt(seekMax, 10) || 0 });
  }

  play() {
    audioPlayer.play();
  }

  stop() {
    audioPlayer && audioPlayer.pause();
  }

  prev() {
    this.skip(false);
  }

  next() {
    this.skip(true);
  }

  skip(isForward = true) {
    let index = isForward ? this.state.currentIndex + 1 : this.state.currentIndex - 1;
    if (index >= playlist.length) {
      index = 0;
    } else if (index < 0) {
      index = playlist.length - 1;
    }
    this.playAtIndex(index);
  }

  playThis(sender) {
    this.playAtIndex(sender.data('index'))
  }

  playAtIndex(index) {
    this.setState({ currentIndex: index});
    this.createPlayer(index);
    audioPlayer.play();
  }

  seek() {
    audioPlayer.currentTime = this.seekSlider.value;
  }

  toggleMute() {
    if (audioPlayer.volume) {
      audioPlayer.volume = audioPlayer.volume === 0 ? 1 : 0;
    } else {
      audioPlayer.setVolume(audioPlayer.volume);
    }
  }

  formatTime(seconds = 0) {
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

  renderIcon(song) {
    const style = {
      height: '16px',
      width: '16px',
      verticalAlign: 'text-top',
    };
    return <img style={style} src={`./icons/${song.stream ? "soundcloud.png" : "music.webp"}`} />;
  }

  renderPlaylist() {
    <div>
      Playlist
      {playlist.map((song, ndx) => {
        <div className="List-item" key={song.title} data-index={ndx} onClick={this.playThis}>
          {this.renderIcon(song)}
          {song.title}
          {song.artist}
        </div>
      })}
    </div>
  }

  render() {
    const { currentIndex, currentTime, seekMax, tags } = this.state;
    return (
      <div className="App-player" ref={(container) => { this.container = container; }}>
        <div className="Track-title">{this.renderIcon(playlist[currentIndex])} {tags ? tags.title : playlist[currentIndex].title}</div>
        <div className="Track-artist">by {tags ? tags.artist : playlist[currentIndex].artist}</div>
        <img ref={(coverImage) => { this.coverImage = coverImage; }} className="Player-cover" src="cover.jpg" alt="" />
        <button onClick={this.prev}>⏮️</button>
        <button onClick={this.stop}>⏸️</button>
        <button onClick={this.play}>▶️</button>
        <button onClick={this.next}>⏭️</button>
        <input ref={(seekSlider) => { this.seekSlider = seekSlider; }} onChange={this.seek} type="range" value={currentTime} max={seekMax}/>
        <button ref={(mute) => { this.mute = mute; }} onClick={this.toggleMute}>🔇</button>
        {this.renderTime()}
        {this.renderPlaylist()}
      </div>
    );
  }
};

export default StreamPlayer;