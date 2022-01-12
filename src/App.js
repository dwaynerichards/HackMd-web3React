import { render } from "react-dom";
import { StrictMode } from "react";
import { Web3ReactProvider } from "@web3-react/core";
import MetamaskConnect from "./MetamaskConnect";
import { Web3Provider } from "@ethersproject/providers";
import { ethersProvider } from "../web3/Web3";
import BasicTable from "../web3/uniswapLpUSDC_ETH";

const App = () => {
  const getLibrary = (ethersProvider, connector) => {
    return Web3Provider(ethersProvider);
  };

  return (
    <div>
      <BasicTable></BasicTable>
    </div>
  );
};

render(
  <StrictMode>
    <App />
  </StrictMode>,
  document.getElementById("root")
);
