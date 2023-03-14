import { Routes, Route } from "react-router-dom";

import Header from "./components/Header";
import Swap from "./components/Swap";
import Tokens from "./components/Tokens";

import "./App.css";

function App() {
  return (
    <div className="text-center">
      <Header />
      <div className="mainWindow">
        <Routes>
          <Route path="/" element={<Swap />} />
          <Route path="/tokens" element={<Tokens />} />
        </Routes>
      </div>
    </div>
  );
}

export default App;
