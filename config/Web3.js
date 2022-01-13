import { ethers } from "ethers";
import { InjectedConnector } from "@web3-react/injected-connector";
import { Web3Provider } from "@ethersproject/providers";
const ABI = require("./USDC_ETH_Uniswap.json");
const contractInterface = new ethers.utils.Interface(ABI);
export const mintSignature = contractInterface.getEvent("Mint");
export const burnSignature = contractInterface.getEvent("Burn");

export const pool = {
  ABI,
  address: "0xB4e16d0168e52d35CaCD2c6185b44281Ec28C9Dc",
};

export const metaMaskInjected = new InjectedConnector({
  supportedChainIds: [1, 3, 4, 5, 42],
});
export const ethersProvider = new ethers.providers.JsonRpcProvider(
  process.env.ALCHEMY
);
export function getLibrary(provider) {
  const library = new Web3Provider(provider);
  library.pollingInterval = 12000;
  return library;
}

export async function getSigner() {
  const metaMask = new ethers.providers.Web3Provider(window.ethereum, "any");
  await metaMask.send("eth_requestAccounts", []);

  const signer = metaMask.getSigner();
  console.log("Accounts:", await signer.getAddress());

  metaMask.on("network", (newNetwork, oldNetwork) => {
    if (oldNetwork) window.location.reload();
  });
  await metaMask.ready;
  await metaMask.getNetwork().then((network) => console.log(network));
  return signer;
}
