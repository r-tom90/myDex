import Logo from "../moralis-logo.svg";
import Eth from "../eth.svg";
import { Link } from "react-router-dom";

function Header() {
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
        <div className="connectButton">Connect</div>
      </div>
    </header>
  );
}

export default Header;
