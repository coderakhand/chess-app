import "./App.css";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Play from "./pages/Play";
import Home from "./pages/Home";
import Settings from "./pages/Settings";
import Error from "./pages/Error";
import Profile from "./pages/Profile";

function App() {
  return (
    <>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/play" element={<Play />} />
            <Route path="/home" element={<Home />} />
            <Route path="/home" element={<Home />} />
            <Route path="/settings" element={<Settings />} />
            <Route path="/profile" element={<Profile/>} />
            <Route path="*" element={<Error />}></Route>
          </Routes>
        </BrowserRouter>
    </>
  );
}

export default App;
