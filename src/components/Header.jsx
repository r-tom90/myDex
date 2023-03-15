import Logo from "../moralis-logo.svg";
import Eth from "../eth.svg";
import { Link } from "react-router-dom";

function Header({ connect, isConnected, address }) {
  return (
    <header className=" flex h-[100px] content-between items-center px-12">
      <div className="flex items-center gap-5">
        <img src={Logo} alt="logo" className=" mr-5 h-10 w-10" />
        <Link to="/" className="link">
          <div className="flex items-center rounded-md p-2.5 px-3.5 font-medium transition">
            Swap
          </div>
        </Link>
        <Link to="/tokens" className="link">
          <div className="flex items-center rounded-md p-2.5 px-3.5 font-medium transition">
            Tokens
          </div>
        </Link>
      </div>
      <div className="flex content-end items-center gap-5">
        <div className="flex items-center rounded-md p-2.5 px-3.5 font-medium transition">
          <img src={Eth} alt="eth" className="mr-2.5 h-5 w-5" />
          Ethereum
        </div>
        <div className="connectButton" onClick={connect}>
          {/* if connected display addresses first 4 digits and last 4 characters */}
          {isConnected
            ? address.slice(0, 4) + "..." + address.slice(38)
            : "Connect"}
        </div>
      </div>
    </header>
  );
}

export default Header;
