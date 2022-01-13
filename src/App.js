import { render } from "react-dom";
import { StrictMode } from "react";
import { ThemeProvider } from "@emotion/react";
import { Button } from "@mui/material";
import theme from "../config/theme";
import BasicTable from "./uniswapLpUSDC_ETH";
import Fab from "@mui/material/Fab";
import { useState } from "react";
import { useWeb3React, Web3ReactProvider } from "@web3-react/core";

import { getLibrary, getSigner } from "../config/Web3";

export const active = {
  signer: null,
};
const App = () => {
  const [activeSigner, setActiveSigner] = useState(null);

  const handleConnect = async () => {
    try {
      active.signer = await getSigner();
      setActiveSigner(active.signer);
    } catch (err) {
      console.log("error in handleConnect:", err);
    }
  };
  const disconnect = () => {
    try {
      console.log("Yea, good luck with that");
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div>
      {active.signer ? (
        <Web3ReactProvider getLibrary={getLibrary}>
          <ThemeProvider theme={theme}>
            <div>
              <BasicTable></BasicTable>
            </div>
          </ThemeProvider>
        </Web3ReactProvider>
      ) : (
        <div>
          <Web3ReactProvider getLibrary={getLibrary}>
            <Fab
              variant="extended"
              size="medium"
              color="secondary"
              onClick={handleConnect}
            >
              Connect Wallet
            </Fab>
            <div>
              <Button onClick={disconnect}>Disconnect</Button>
            </div>
          </Web3ReactProvider>
        </div>
      )}
    </div>
  );
};

render(
  <StrictMode>
    <App />
  </StrictMode>,
  document.getElementById("root")
);
