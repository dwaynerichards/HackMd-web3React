import { render } from "react-dom";
import { StrictMode, useEffect } from "react";
import { ThemeProvider } from "@emotion/react";
import { Button } from "@mui/material";
import Slide from "@mui/material/Slide";
import theme from "../config/theme";
import BasicTable from "./uniswapLpUSDC_ETH";
import Fab from "@mui/material/Fab";
import { useState } from "react";
import { getSigner } from "../config/Web3";

export const active = {
  signer: null,
  wallet: null,
};
const App = () => {
  const [activeSigner, setActiveSigner] = useState(null);
  const [hasWallet, setHasWallet] = useState();
  const [appearBttn, setAppearBttns] = useState(false);

  const handleConnect = async () => {
    try {
      active.signer = await getSigner();
      if (active.signer) setActiveSigner(active.signer);
    } catch (err) {
      console.log("error in handleConnect:", err);
    }
  };
  const noWallet = () => {
    setHasWallet(false);
  };

  useEffect(() => {
    setAppearBttns(true);
  }, []);

  return (
    <div>
      {activeSigner || hasWallet === false ? (
        <div>
          <ThemeProvider theme={theme}>
            <div>
              <BasicTable></BasicTable>
            </div>
          </ThemeProvider>
        </div>
      ) : (
        <div>
          <div align="right">
            <Slide
              direction="right"
              in={appearBttn}
              timeout={2000}
              mountOnEnter
              unmountOnExit>
              <Fab
                variant="extended"
                size="medium"
                color="secondary"
                onClick={handleConnect}>
                Connect Wallet
              </Fab>
            </Slide>
          </div>
          <div align="left">
            <Slide
              direction="right"
              in={appearBttn}
              timeout={3000}
              mountOnEnter
              unmountOnExit>
              <Fab
                variant="extended"
                size="medium"
                color="primary"
                onClick={noWallet}>
                View Transactions
              </Fab>
            </Slide>
          </div>
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
