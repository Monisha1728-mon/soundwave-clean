import React from "react";
import { usePlayer } from "../context/PlayerContext";
import {
  RiPlayFill, RiPauseFill, RiSkipBackFill, RiSkipForwardFill,
  RiShuffleLine, RiRepeatLine, RiRepeat2Line,
  RiHeartFill, RiHeartLine, RiVolumeUpFill, RiVolumeMuteFill,
  RiLoader4Line
} from "react-icons/ri";

export default function PlayerBar() {
  const {
    currentSong, isPlaying, currentTime, duration,
    volume, isShuffle, isRepeat, isLoading, likedSongs,
    togglePlay, playNext, playPrev,
    seek, changeVolume,
    setIsShuffle, setIsRepeat,
    toggleLike, formatTime
  } = usePlayer();

  if (!currentSong) return (
    <div className="player-bar empty-player">
      <div className="player-hint">🎵 Click any song to start playing</div>
    </div>
  );

  const progress = duration ? (currentTime / duration) * 100 : 0;
  const isLiked = likedSongs.has(currentSong.id);

  return (
    <div className="player-bar">

      {/* Left: Song Info */}
      <div className="player-left">
        <img src={currentSong.coverUrl} alt={currentSong.title} className="player-thumb" />
        <div className="player-song-info">
          <div className="player-title">{currentSong.title}</div>
          <div className="player-artist">{currentSong.artist}</div>
        </div>
        <button
          className={`player-like ${isLiked ? "liked" : ""}`}
          onClick={() => toggleLike(currentSong.id)}
        >
          {isLiked ? <RiHeartFill /> : <RiHeartLine />}
        </button>
      </div>

      {/* Center: Controls + Progress */}
      <div className="player-center">
        <div className="player-controls">
          <button
            className={`ctrl-btn ${isShuffle ? "active" : ""}`}
            onClick={() => setIsShuffle(!isShuffle)}
          >
            <RiShuffleLine />
          </button>
          <button className="ctrl-btn" onClick={playPrev}>
            <RiSkipBackFill />
          </button>
          <button className="ctrl-btn play-pause" onClick={togglePlay} disabled={isLoading}>
            {isLoading ? <RiLoader4Line className="spin" /> :
             isPlaying ? <RiPauseFill /> : <RiPlayFill />}
          </button>
          <button className="ctrl-btn" onClick={playNext}>
            <RiSkipForwardFill />
          </button>
          <button
            className={`ctrl-btn ${isRepeat ? "active" : ""}`}
            onClick={() => setIsRepeat(!isRepeat)}
          >
            {isRepeat ? <RiRepeat2Line /> : <RiRepeatLine />}
          </button>
        </div>

        {/* Progress Bar */}
        <div className="progress-area">
          <span className="time-label">{formatTime(currentTime)}</span>
          <div
            className="progress-track"
            onClick={(e) => {
              const rect = e.currentTarget.getBoundingClientRect();
              const pct = (e.clientX - rect.left) / rect.width;
              seek(pct * duration);
            }}
          >
            <div className="progress-fill" style={{ width: `${progress}%` }} />
            <div className="progress-thumb" style={{ left: `${progress}%` }} />
          </div>
          <span className="time-label">{formatTime(duration)}</span>
        </div>
      </div>

      {/* Right: Volume */}
      <div className="player-right">
        <button className="ctrl-btn" onClick={() => changeVolume(volume > 0 ? 0 : 0.7)}>
          {volume === 0 ? <RiVolumeMuteFill /> : <RiVolumeUpFill />}
        </button>
        <div
          className="volume-track"
          onClick={(e) => {
            const rect = e.currentTarget.getBoundingClientRect();
            const pct = (e.clientX - rect.left) / rect.width;
            changeVolume(Math.max(0, Math.min(1, pct)));
          }}
        >
          <div className="volume-fill" style={{ width: `${volume * 100}%` }} />
        </div>
        <span className="volume-label">{Math.round(volume * 100)}%</span>
      </div>

    </div>
  );
}