import React from "react";
import { PlayerProvider } from "./context/PlayerContext";
import Sidebar from "./components/Sidebar";
import TopBar from "./components/TopBar";
import MainContent from "./components/MainContent";
import PlayerBar from "./components/PlayerBar";
import "./App.css";

export default function App() {
  return (
    <PlayerProvider>
      <div className="app-shell">
        <Sidebar />
        <div className="app-main">
          <TopBar />
          <MainContent />
        </div>
        <PlayerBar />
      </div>
    </PlayerProvider>
  );
}