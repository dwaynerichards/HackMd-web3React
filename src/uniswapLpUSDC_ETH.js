import { ethers } from "ethers";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import Link from "@mui/material/Link";
import { useEffect, useState } from "react";
import { ethersProvider, getSigner, pool } from "../config/Web3.js";
import { active } from "./App";

export default function BasicTable({ prevRows }) {
  const [rows, setRows] = useState([]);

  const time = Date.now();
  let tx = 0;

  //check is wallet connected
  //if not connect provider, get signer,
  //if connected get signer change only for pool
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
          onClick: () => window.open(`https://etherscan.io/tx/${txhash}`),
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
    <TableContainer component={Paper}>
      <Table sx={{ minWidth: 650 }} aria-label="simple table">
        <TableHead>
          <TableRow>
            <TableCell>Action</TableCell>
            <TableCell align="right">Total Value</TableCell>
            <TableCell align="right">Token Amount</TableCell>
            <TableCell align="right">Token Amount</TableCell>
            <TableCell align="right">Account</TableCell>
            <TableCell align="right">Time</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {rows.length
            ? rows.map((row) => (
                <TableRow
                  key={row.time + row.account + Date.now()}
                  sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                >
                  <TableCell component="th" scope="row" onClick={row.onClick}>
                    <Link href="#">{row.action}</Link>
                  </TableCell>
                  <TableCell align="right">{row.totalValue}</TableCell>
                  <TableCell align="right">{row.tokenAmountA}</TableCell>
                  <TableCell align="right">{row.tokenAmountB}</TableCell>
                  <TableCell align="right">{row.account}</TableCell>
                  <TableCell align="right">{row.time}</TableCell>
                </TableRow>
              ))
            : null}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
