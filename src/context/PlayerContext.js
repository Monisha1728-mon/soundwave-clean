import React, { createContext, useContext, useState, useRef, useCallback } from "react";
import { Howl } from "howler";

const PlayerContext = createContext();

export function PlayerProvider({ children }) {
  const [songs, setSongs] = useState([]);
  const [currentSong, setCurrentSong] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(0.7);
  const [isShuffle, setIsShuffle] = useState(false);
  const [isRepeat, setIsRepeat] = useState(false);
  const [likedSongs, setLikedSongs] = useState(new Set());
  const [searchQuery, setSearchQuery] = useState("");
  const [activeView, setActiveView] = useState("home");
  const [isLoading, setIsLoading] = useState(false);

  const howlRef = useRef(null);
  const intervalRef = useRef(null);

  const stopInterval = () => {
    if (intervalRef.current) clearInterval(intervalRef.current);
  };

  const startInterval = (howl) => {
    stopInterval();
    intervalRef.current = setInterval(() => {
      if (howl && howl.playing()) {
        setCurrentTime(howl.seek());
      }
    }, 500);
  };

  const playSong = useCallback((song) => {
    if (howlRef.current) {
      howlRef.current.stop();
      howlRef.current.unload();
    }
    stopInterval();
    setIsLoading(true);
    setCurrentSong(song);
    setCurrentTime(0);

    const howl = new Howl({
      src: [song.audioUrl],
      html5: true,
      volume: 0.7,
      onload: () => {
        setDuration(howl.duration());
        setIsLoading(false);
        howl.play();
        setIsPlaying(true);
        startInterval(howl);
      },
      onend: () => {
        setIsPlaying(false);
        stopInterval();
      },
      onloaderror: () => {
        setIsLoading(false);
        setIsPlaying(false);
      }
    });

    howlRef.current = howl;
  }, []);

  const togglePlay = () => {
    if (!howlRef.current) return;
    if (isPlaying) {
      howlRef.current.pause();
      stopInterval();
      setIsPlaying(false);
    } else {
      howlRef.current.play();
      startInterval(howlRef.current);
      setIsPlaying(true);
    }
  };

  const playNext = useCallback(() => {
    if (!songs.length) return;
    const idx = songs.findIndex(s => s.id === currentSong?.id);
    const nextIdx = isShuffle
      ? Math.floor(Math.random() * songs.length)
      : (idx + 1) % songs.length;
    playSong(songs[nextIdx]);
  }, [songs, currentSong, isShuffle, playSong]);

  const playPrev = useCallback(() => {
    if (!songs.length) return;
    const idx = songs.findIndex(s => s.id === currentSong?.id);
    const prevIdx = (idx - 1 + songs.length) % songs.length;
    playSong(songs[prevIdx]);
  }, [songs, currentSong, playSong]);

  const seek = (time) => {
    if (howlRef.current) {
      howlRef.current.seek(time);
      setCurrentTime(time);
    }
  };

  const changeVolume = (val) => {
    setVolume(val);
    if (howlRef.current) howlRef.current.volume(val);
  };

  const toggleLike = (songId) => {
    setLikedSongs(prev => {
      const next = new Set(prev);
      next.has(songId) ? next.delete(songId) : next.add(songId);
      return next;
    });
  };

  const formatTime = (secs) => {
    if (!secs || isNaN(secs)) return "0:00";
    const m = Math.floor(secs / 60);
    const s = Math.floor(secs % 60);
    return `${m}:${s.toString().padStart(2, "0")}`;
  };

  return (
    <PlayerContext.Provider value={{
      songs, setSongs,
      currentSong, isPlaying, currentTime, duration,
      volume, isShuffle, isRepeat, likedSongs,
      searchQuery, setSearchQuery,
      activeView, setActiveView,
      isLoading,
      playSong, togglePlay, playNext, playPrev,
      seek, changeVolume,
      setIsShuffle, setIsRepeat,
      toggleLike, formatTime
    }}>
      {children}
    </PlayerContext.Provider>
  );
}

export const usePlayer = () => useContext(PlayerContext);