import { ethers } from "ethers";
import { Web3Provider } from "@ethersproject/providers";
import { InjectedConnector } from "@web3-react/injected-connector";
import infuraEndpoints from "../config/dotenv.js";
import { useWeb3React } from "@web3-react/core";

//close is a custom function that most, but not all, wallets have.
//MetaMask and the injected connectors do not have a close function

//below hook can only be called in function component
//const { activate, active, deactivate, error } = useWeb3React();

export const injectedConnector = new InjectedConnector([1, 2, 3, 4, 5]);

/**
 *
 * @param provider import a provider (generally via Ethers or Web3.js in the JavaScript/TypeScript space),
 * and then instantiate and return it in the getLibrary function.} provider
 * @param connector
 * @returns
 */

export const handleConnect = async () => {
  try {
    let { provider } = await injectedConnector.activate();
    const signer = provider.getSigner();

    ethersProvider = new Web3Provider(signer);
  } catch (error) {
    console.log(error);
    deactivate();
  }
};
