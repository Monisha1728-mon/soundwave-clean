import React from "react";
import { usePlayer } from "../context/PlayerContext";
import { RiSearchLine, RiCloseLine } from "react-icons/ri";

export default function TopBar() {
  const { searchQuery, setSearchQuery, setActiveView } = usePlayer();

  const handleSearch = (e) => {
    setSearchQuery(e.target.value);
    if (e.target.value) setActiveView("search");
    else setActiveView("home");
  };

  return (
    <header className="topbar">
      <div className="search-box">
        <RiSearchLine className="search-icon" />
        <input
          type="text"
          className="search-input"
          placeholder="Search songs, artists, albums..."
          value={searchQuery}
          onChange={handleSearch}
        />
        {searchQuery && (
          <button className="clear-btn" onClick={() => { setSearchQuery(""); setActiveView("home"); }}>
            <RiCloseLine />
          </button>
        )}
      </div>
      <div className="topbar-right">
        <div className="user-avatar">SW</div>
      </div>
    </header>
  );
}