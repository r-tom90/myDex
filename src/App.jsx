import { Routes, Route } from "react-router-dom";

import Header from "./components/Header";
import Swap from "./components/Swap";
import Tokens from "./components/Tokens";

// Connections and provider accounts
import { useConnect, useAccount } from "wagmi";
import { MetaMaskConnector } from "wagmi/connectors/metaMask";

import "./App.css";

function App() {
  // destructure useAccount and useConnect Connectors and Provider
  const { address, isConnected } = useAccount();
  const { connect } = useConnect({
    connector: new MetaMaskConnector(),
  });

  return (
    <div className="text-center">
      {/* Pass connector as props to Header as it has the 'Connect' button */}
      <Header connect={connect} isConnected={isConnected} address={address} />
      <div className="mainWindow">
        <Routes>
          <Route
            path="/"
            // Check isConnected and the address of wallet
            element={<Swap isConnected={isConnected} address={address} />}
          />
          <Route path="/tokens" element={<Tokens />} />
        </Routes>
      </div>
    </div>
  );
}

export default App;
