import React, { useEffect } from "react";
import { usePlayer } from "../context/PlayerContext";
import { useSongs } from "../hooks/useSongs";
import SongRow from "./SongRow";
import { RiPlayFill, RiShuffleLine } from "react-icons/ri";

export default function MainContent() {
  const { songs: fetchedSongs, loading } = useSongs();
  const {
    songs, setSongs, playSong, setIsShuffle,
    searchQuery, setSearchQuery, activeView, likedSongs
  } = usePlayer();

  useEffect(() => {
    if (fetchedSongs.length) setSongs(fetchedSongs);
  }, [fetchedSongs, setSongs]);

  const filtered = songs.filter(s => {
    const q = searchQuery.toLowerCase();
    return (
      s.title?.toLowerCase().includes(q) ||
      s.artist?.toLowerCase().includes(q) ||
      s.album?.toLowerCase().includes(q) ||
      s.genre?.toLowerCase().includes(q)
    );
  });

  const displaySongs = activeView === "liked"
    ? songs.filter(s => likedSongs.has(s.id))
    : filtered;

  const genres = [...new Set(songs.map(s => s.genre))];

  const handlePlayAll = () => {
    if (displaySongs.length) playSong(displaySongs[0]);
  };

  const handleShuffle = () => {
    setIsShuffle(true);
    const randomSong = displaySongs[Math.floor(Math.random() * displaySongs.length)];
    if (randomSong) playSong(randomSong);
  };

  if (loading) {
    return (
      <div className="main-content loading-state">
        <div className="loading-spinner" />
        <p>Loading your music...</p>
      </div>
    );
  }

  return (
    <main className="main-content">

      {/* Hero Section */}
      {activeView === "home" && !searchQuery && (
        <div className="hero-section">
          <div className="hero-content">
            <div className="hero-badge">🎵 Featured Playlist</div>
            <h1 className="hero-title">SoundWave Collection</h1>
            <p className="hero-sub">20 handpicked tracks across genres</p>
            <div className="hero-actions">
              <button className="btn-play-hero" onClick={handlePlayAll}>
                <RiPlayFill /> Play All
              </button>
              <button className="btn-shuffle-hero" onClick={handleShuffle}>
                <RiShuffleLine /> Shuffle
              </button>
            </div>
          </div>
          <div className="hero-art-grid">
            {songs.slice(0, 4).map(s => (
              <img key={s.id} src={s.coverUrl} alt={s.title} className="hero-art" />
            ))}
          </div>
        </div>
      )}

      {/* Genre Chips */}
      {activeView === "home" && !searchQuery && (
        <div className="genre-chips">
          <button className="genre-chip active" onClick={() => setSearchQuery("")}>All</button>
          {genres.map(g => (
            <button key={g} className="genre-chip" onClick={() => setSearchQuery(g)}>{g}</button>
          ))}
        </div>
      )}

      {/* Section Header */}
      <div className="section-header">
        <h2 className="section-title">
          {activeView === "liked" ? "❤️ Liked Songs" :
           searchQuery ? `Results for "${searchQuery}"` : "All Songs"}
        </h2>
        <span className="section-count">{displaySongs.length} songs</span>
      </div>

      {/* Table Header */}
      {displaySongs.length > 0 && (
        <div className="song-table-header">
          <span>#</span>
          <span>Title</span>
          <span>Album</span>
          <span>Genre</span>
          <span>Duration</span>
        </div>
      )}

      {/* Songs List */}
      <div className="songs-list">
        {displaySongs.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon">🎵</div>
            <p>{activeView === "liked" ? "No liked songs yet. Heart a song!" : "No songs found."}</p>
          </div>
        ) : (
          displaySongs.map((song, i) => (
            <SongRow key={song.id} song={song} index={i} />
          ))
        )}
      </div>
    </main>
  );
}