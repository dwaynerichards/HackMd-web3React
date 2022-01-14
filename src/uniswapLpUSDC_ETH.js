import { ethers } from "ethers";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import Link from "@mui/material/Link";
import Slide from "@mui/material/Slide";
import TableTop from "./TableTop.js";

import { useEffect, useState } from "react";
import { ethersProvider, getSigner, pool } from "../config/Web3.js";
import { active } from "./App";
import DenseAppBar from "./Toolbar.js";

export default function BasicTable({ prevRows }) {
  const [rows, setRows] = useState([]);

  const time = Date.now();
  let tx = 0;

  useEffect(async () => {
    const poolContract = active.signer
      ? new ethers.Contract(pool.address, pool.ABI, ethersProvider)
      : new ethers.Contract(pool.address, pool.ABI, await getSigner());

    poolContract.on(
      "Swap",
      (sender, amount0In, amount1In, amount0Out, amount1Out, to, event) => {
        const bigNumAmount0In = ethers.BigNumber.from(amount0In);
        const bigNumAmount1In = ethers.BigNumber.from(amount1In);
        const tokenAmountA = parseInt(bigNumAmount0In._hex, 16);
        const tokenAmountB = parseInt(bigNumAmount1In._hex, 16);
        const txHash = event.transactionHash;

        const swapObj = {
          txHash,
          tokenAmountA,
          tokenAmountB,
          totalValue: null,
          action: "Swap",
          account: to,
          time: Date.now(),
          onClick: () => window.open(`https://etherscan.io/tx/${txHash}`),
        };
        console.log("event", event);
        console.log("Swap in contract from:", sender);
        console.log("swapObj", swapObj);
        tx++;

        setRows((prevRows) => [swapObj].concat(prevRows.slice()));
      }
    );

    // poolContract.on("Mint", (sender, amount0, amount1));
    // poolContract.on("Burn", (sender, amount0, amount1, to));
  }, []);

  return (
    <div>
      <DenseAppBar></DenseAppBar>
      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 650 }} aria-label="simple table">
          <TableTop></TableTop>
          <TableBody>
            {rows.length
              ? rows.map((row) => (
                  <Slide
                    direction="right"
                    in={rows.length > 0}
                    mountOnEnter
                    unmountOnExit>
                    <TableRow
                      key={row.time + row.account + Date.now()}
                      sx={{
                        "&:last-child td, &:last-child th": { border: 0 },
                      }}>
                      <TableCell
                        component="th"
                        scope="row"
                        onClick={row.onClick}>
                        <Link href="#">{row.action}</Link>
                      </TableCell>
                      <TableCell align="right">{row.totalValue}</TableCell>
                      <TableCell align="right">{row.tokenAmountA}</TableCell>
                      <TableCell align="right">{row.tokenAmountB}</TableCell>
                      <TableCell align="right">{row.account}</TableCell>
                      <TableCell align="right">{row.time}</TableCell>
                    </TableRow>
                  </Slide>
                ))
              : null}
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  );
}
