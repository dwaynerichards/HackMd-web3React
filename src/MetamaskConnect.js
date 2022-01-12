import { useWeb3React } from "@web3-react/core";
import { ethers } from "ethers";
import { Web3Provider } from "@ethersproject/providers";
import { InjectedConnector } from "@web3-react/injected-connector";
import infuraEndpoints from "../config/dotenv.js";
import { useState, useEffect, useReducer } from "react";

const MetamaskConnect = () => {
  //In order to connect with the wallet we’ve added,
  //you’ll need to form a handleConnect function,
  //have conenction to an APIinstantiate provider
  const { active, activate, deactivate, account } = useWeb3React;

  const handleConnect = async () => {
    try {
      let ethersProvider = new ethers.providers.JsonRpcProvider(
        infuraEndpoints.MAINNET
      ); //connect activated wallet

      await activate(InjectedConnector);
      // signer
      // console.log(Signer.isSigner(provider));
      // ethersProvider = new Web3Provider(provider);
    } catch (error) {
      console.log(error);
      deactivate();
    }
  };

  const disconnect = () => {
    try {
      if (active) console.log("about to deactivate");
      deactivate();
      if (active) console.log("not deactivated");
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div>
      {active ? (
        <div>
          <span>
            Connected with <b>{account}</b>
          </span>
          <button onClick={disconnect}>Disconnect</button>
        </div>
      ) : (
        <div>
          <span>
            <b>Not Connected</b>
          </span>
          <button onClick={handleConnect}>Connect To Metamask</button>
        </div>
      )}
    </div>
  );
};

export default MetamaskConnect;
