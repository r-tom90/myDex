import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";

import "./index.css";
import "./App.css";

import { BrowserRouter } from "react-router-dom";

// WAGMI library to connect wallet to decentralized exchange, configure chains, using mainnet(Ethereum, see docs for details)
import { configureChains, mainnet, createClient, WagmiConfig } from "wagmi";
import { publicProvider } from "wagmi/providers/public";

// configureChains to use mainnet(eth) and publicProvider
const { provider, webSocketProvider } = configureChains(
  [mainnet],
  [publicProvider()]
);

// Web3 client
const client = createClient({
  autoConnect: true,
  provider,
  webSocketProvider,
});

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <WagmiConfig client={client}>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </WagmiConfig>
  </React.StrictMode>
);
