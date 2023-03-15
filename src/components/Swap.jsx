import { useEffect, useState } from "react";

import tokenList from "../tokenList.json";

import { Input, Popover, Radio, Modal, message } from "antd";
import {
  ArrowDownOutlined,
  DownOutlined,
  SettingOutlined,
} from "@ant-design/icons";
import axios from "axios";
import { useSendTransaction, useWaitForTransaction } from "wagmi";

function Swap({ address, isConnected }) {
  const [slippage, setSlippage] = useState(2.5);
  const [tokenOneAmount, setTokenOneAmount] = useState(null);
  const [tokenTwoAmount, setTokenTwoAmount] = useState(null);
  // Extracting and populating tokenList to where it is required.
  const [tokenOne, setTokenOne] = useState(tokenList[0]);
  const [tokenTwo, setTokenTwo] = useState(tokenList[1]);
  const [isOpen, setIsOpen] = useState(false);
  const [changeToken, setChangeToken] = useState(1);
  const [prices, setPrices] = useState(null);
  const [txDetails, setTxDetails] = useState({
    to: null,
    data: null,
    value: null,
  });

  const { data, sendTransaction } = useSendTransaction({
    // Send transactions with these details in the format below
    request: {
      from: address,
      to: String(txDetails.to),
      data: String(txDetails.data),
      value: String(txDetails.value),
    },
  });

  useEffect(() => {
    fetchPrices(tokenList[0].address, tokenList[1].address);
  }, []);

  useEffect(() => {
    if (txDetails.to && isConnected) {
      sendTransaction();
    }
  }, [txDetails]);

  const handleSlippageChange = (e) => {
    setSlippage(e.target.value);
  };

  // Changes ratio of input2
  const changeAmount = (e) => {
    setTokenOneAmount(e.target.value);
    if (e.target.value && prices) {
      // .toFixed(2) is fixing it to 2 decimal points
      setTokenTwoAmount((e.target.value * prices.ratio).toFixed(8));
    } else {
      setTokenTwoAmount(null);
    }
  };

  const switchTokens = () => {
    setPrices(null);
    setTokenOneAmount(null);
    setTokenTwoAmount(null);

    const one = tokenOne;
    const two = tokenTwo;
    setTokenOne(two);
    setTokenTwo(one);

    fetchPrices(two.address, one.address);
  };

  const openModal = (asset) => {
    setChangeToken(asset);
    setIsOpen(true);
  };

  const modifyToken = (i) => {
    setPrices(null);
    setTokenOneAmount(null);
    setTokenTwoAmount(null);

    if (changeToken === 1) {
      setTokenOne(tokenList[i]);
      fetchPrices(tokenList[i].address, tokenTwo.address);
    } else {
      setTokenTwo(tokenList[i]);
      fetchPrices(tokenOne.address, tokenList[i].address);
    }
    // closes modal after selected
    setIsOpen(false);
  };

  const fetchPrices = async (one, two) => {
    const response = await axios.get(`http://localhost:3001/tokenPrice`, {
      params: { addressOne: one, addressTwo: two },
    });

    // console.log(response.data);
    setPrices(response.data);
  };

  const fetchDexSwap = async () => {
    // Check the allowances of tokens that can be swapped through 1Inch api (https://docs.1inch.io/docs/aggregation-protocol/api/swagger/)
    const allowance = await axios.get(
      `https://api.1inch.io/v5.0/1/approve/allowance?tokenAddress=${tokenOne.address}&walletAddress=${address}`
    );

    // Checks what the allowance is, if not approved, it will ask to approve transaction
    if (allowance.data.allowance === "0") {
      const approve = await axios.get(
        `https://api.1inch.io/v5.0/1/approve/transaction?tokenAddress=${tokenOne.address}`
      );

      setTxDetails(approve.data);
      console.log("not approved");
      return;
    }

    // console.log("make swap");
    const tx = await axios.get(
      // check 1:19:00 and 1:24:00 for explanation of padEnd, challenge to allow for decimal swaps
      `https://api.1inch.io/v5.0/1/swap?fromTokenAddress=${
        tokenOne.address
      }&toTokenAddress=${tokenTwo.address}&amount=${tokenOneAmount.padEnd(
        tokenOne.decimals + tokenOneAmount.length,
        "0"
      )}&fromAddress=${address}&slippage=${slippage}`
    );

    let decimals = Number(`1E${tokenTwo.decimals}`);
    setTokenTwoAmount((Number(tx.data.toTokenAmount) / decimals).toFixed(2));

    setTxDetails(tx.data.tx);
  };

  const settings = (
    <>
      <div>Slippage Tolerance</div>
      <div>
        <Radio.Group value={slippage} onChange={handleSlippageChange}>
          <Radio.Button value={0.5}>0.5%</Radio.Button>
          <Radio.Button value={2.5}>2.5%</Radio.Button>
          <Radio.Button value={5}>5.0%</Radio.Button>
        </Radio.Group>
      </div>
    </>
  );

  return (
    // TODO: Fix layout
    <>
      <Modal
        open={isOpen}
        footer={null}
        onCancel={() => setIsOpen(false)}
        title="Select a token"
      >
        <div className="modalContent">
          {tokenList?.map((token, idx) => {
            return (
              <div
                className="tokenChoice"
                key={token.address}
                onClick={() => modifyToken(idx)}
              >
                <img src={token.img} alt={token.ticker} className="tokenLogo" />
                <div className="tokenChoiceNames">
                  <div className="tokenName">{token.name}</div>
                  <div className="tokenTicker">{token.ticker}</div>
                </div>
              </div>
            );
          })}
        </div>
      </Modal>
      <div className="flex min-h-[300px] w-[400px] flex-col items-start justify-between rounded-2xl border-[2px] border-[#21273a] bg-[#0e111b] px-[30px] py-0">
        <div className="flex w-[98%] items-center justify-between">
          <h4 className="my-5 font-bold">Swap</h4>
          <Popover
            content={settings}
            title="Settings"
            trigger="click"
            placement="bottomRight"
          >
            <SettingOutlined className="cog" />
          </Popover>
        </div>
        <div className="inputs">
          {/* TODO: Ensure no negative numbers to be selected */}
          <Input
            placeholder="0"
            value={tokenOneAmount}
            onChange={changeAmount}
            disabled={!prices}
            // TODO: type="number" remove arrow pointers
          />
          <Input placeholder="0" value={tokenTwoAmount} disabled={true} />
          <div className="switchButton" onClick={switchTokens}>
            <ArrowDownOutlined className="switchArrow" />
          </div>
          <div className="assetOne" onClick={() => openModal(1)}>
            <img src={tokenOne.img} alt="assetOneLogo" className="assetLogo" />
            {tokenOne.ticker}
            <DownOutlined />
          </div>
          <div className="assetTwo" onClick={() => openModal(2)}>
            <img src={tokenTwo.img} alt="assetTwoLogo" className="assetLogo" />
            {tokenTwo.ticker}
            <DownOutlined />
          </div>
        </div>
        <div
          className="swapButton"
          disabled={!tokenOneAmount || !isConnected}
          onClick={fetchDexSwap}
        >
          Swap
        </div>
      </div>
    </>
  );
}

export default Swap;
