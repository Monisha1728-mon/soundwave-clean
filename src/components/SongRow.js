import React, { useState } from "react";
import { usePlayer } from "../context/PlayerContext";
import {
  RiPlayFill, RiPauseFill, RiHeartLine, RiHeartFill,
  RiMoreFill
} from "react-icons/ri";

export default function SongRow({ song, index }) {
  const { currentSong, isPlaying, playSong, togglePlay, toggleLike, likedSongs, formatTime } = usePlayer();
  const isActive = currentSong?.id === song.id;
  const isLiked = likedSongs.has(song.id);
  const [hovered, setHovered] = useState(false);

  const handlePlay = () => {
    if (isActive) {
      togglePlay();
    } else {
      playSong(song);
    }
  };

  return (
    <div
      className={`song-row ${isActive ? "active" : ""}`}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onDoubleClick={handlePlay}
    >
      <div className="song-index">
        {hovered || isActive ? (
          <button className="play-btn-small" onClick={handlePlay}>
            {isActive && isPlaying ? <RiPauseFill /> : <RiPlayFill />}
          </button>
        ) : (
          <span className={isActive ? "active-num" : ""}>{index + 1}</span>
        )}
      </div>

      <div className="song-info">
        <img src={song.coverUrl} alt={song.title} className="song-thumb" />
        <div>
          <div className={`song-title ${isActive ? "active" : ""}`}>{song.title}</div>
          <div className="song-artist">{song.artist}</div>
        </div>
      </div>

      <div className="song-album">{song.album}</div>
      <div className="song-genre">
        <span className="genre-tag">{song.genre}</span>
      </div>

      <div className="song-actions">
        <button
          className={`like-btn ${isLiked ? "liked" : ""}`}
          onClick={() => toggleLike(song.id)}
        >
          {isLiked ? <RiHeartFill /> : <RiHeartLine />}
        </button>
        <span className="song-duration">{formatTime(song.duration)}</span>
        <button className="more-btn"><RiMoreFill /></button>
      </div>
    </div>
  );
}