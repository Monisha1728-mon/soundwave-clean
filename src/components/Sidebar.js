import React from "react";
import { usePlayer } from "../context/PlayerContext";
import {
  RiHome5Fill, RiSearchLine, RiHeartFill,
  RiMusicFill, RiAddCircleLine, RiVolumeUpFill
} from "react-icons/ri";

const navItems = [
  { icon: <RiHome5Fill />, label: "Home", view: "home" },
  { icon: <RiSearchLine />, label: "Search", view: "search" },
  { icon: <RiHeartFill />, label: "Liked Songs", view: "liked" },
];

export default function Sidebar() {
  const { activeView, setActiveView, songs, likedSongs } = usePlayer();

  const playlists = [
    { name: "All Songs", count: songs.length, color: "#1ed760" },
    { name: "Electronic", count: songs.filter(s => s.genre === "Electronic").length, color: "#f59e0b" },
    { name: "Chill Vibes", count: songs.filter(s => ["Chill","Lo-Fi","Ambient"].includes(s.genre)).length, color: "#8b5cf6" },
    { name: "Rock & Pop", count: songs.filter(s => ["Rock","Pop Rock","Indie Pop"].includes(s.genre)).length, color: "#ef4444" },
    { name: "World Music", count: songs.filter(s => ["World","Latin","Fusion"].includes(s.genre)).length, color: "#06b6d4" },
  ];

  return (
    <aside className="sidebar">
      <div className="sidebar-logo">
        <RiVolumeUpFill className="logo-icon" />
        <span className="logo-text">SoundWave</span>
      </div>

      <nav className="sidebar-nav">
        {navItems.map(item => (
          <button
            key={item.view}
            className={`nav-item ${activeView === item.view ? "active" : ""}`}
            onClick={() => setActiveView(item.view)}
          >
            <span className="nav-icon">{item.icon}</span>
            <span>{item.label}</span>
            {item.view === "liked" && likedSongs.size > 0 && (
              <span className="badge">{likedSongs.size}</span>
            )}
          </button>
        ))}
      </nav>

      <div className="sidebar-divider" />

      <div className="sidebar-playlists">
        <div className="playlist-header">
          <RiMusicFill />
          <span>Your Library</span>
          <button className="add-btn"><RiAddCircleLine /></button>
        </div>
        {playlists.map((pl, i) => (
          <button
            key={i}
            className="playlist-item"
            onClick={() => setActiveView("home")}
          >
            <div className="playlist-dot" style={{ background: pl.color }} />
            <div className="playlist-info">
              <span className="playlist-name">{pl.name}</span>
              <span className="playlist-count">{pl.count} songs</span>
            </div>
          </button>
        ))}
      </div>
    </aside>
  );
}