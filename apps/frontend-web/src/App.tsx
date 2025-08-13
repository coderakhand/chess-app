import "./App.css";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Game from "./pages/Game";
import Home from "./pages/Home";
import Settings from "./pages/Settings";
import Error from "./pages/Error";
import Analyze from "./pages/Analyze";
import ViewGame from "./pages/ViewGame";
import ViewStandings from "./pages/ViewStandings";
import SignedInUserHome from "./components/SignedInUserHome";
import GameHistory from "./pages/GameHistory";

function App() {
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/play" element={<Game />} />
          <Route path="/game/:id" element={<ViewGame />} />
          <Route path="/home" element={<Home />} />
          <Route path="/fide/ratings" element={<ViewStandings />} />
          <Route path="/settings" element={<Settings />} />
          <Route path="/analyze" element={<Analyze />} />
          <Route path="/player/:username" element={<SignedInUserHome />} />
          <Route path="/games/history" element={<GameHistory />} />
          <Route path="*" element={<Error />}></Route>
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
