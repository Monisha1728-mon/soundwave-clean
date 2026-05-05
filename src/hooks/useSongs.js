import { useEffect, useState } from "react";
import { songs as fallbackSongs } from "../firebase/seedSongs";

export function useSongs() {
  const [songs, setSongs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Load songs directly from seedSongs (demo mode)
    setTimeout(() => {
      setSongs(fallbackSongs);
      setLoading(false);
    }, 800);
  }, []);

  return { songs, loading, isDemo: true };
}