import { ethers } from "ethers";
import infuraEndpoints from "../config/dotenv.js";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import { useEffect, useState } from "react";
import { injectedConnector } from "./Web3";

//const require = createRequire(import.meta.url);
const ABI = require("../ABI/USDC_ETH_Uniswap.json");
const poolAddress = "0xB4e16d0168e52d35CaCD2c6185b44281Ec28C9Dc";

const ethersProvider = new ethers.providers.JsonRpcProvider(
  process.env.ALCHEMY
);

export default function BasicTable() {
  const [rows, setRows] = useState([]);
  const [poolContract, setPoolContract] = useState(null);

  const [mintListener, setMintListener] = useState(false);
  const [burnListener, setBurnListener] = useState(false);
  const [time, setTime] = useState(Date.now());

  const eventQueue = {
    storage: [],
    tx: 0,
  };

  const deQueueSetState = (queue) => {
    console.log("dequeueing", queue);
    console.log("rows preSlice:", rows);
    const newRows = rows.slice();

    while (queue.storage.length > 0) {
      const current = queue.storage.shift();
      console.log("current", current);
      newRows.push(current);
    }
    console.log("ROWS B4 STATE CHANGE:", rows);
    console.log("NEWROWS  :", newRows);
    //setRows(newRows);
    Promise.resolve(setRows(newRows)).then(() =>
      console.log("rows post mutate:", rows)
    );
  };

  const enqueue = (queue, eventObj) => {
    queue.storage.push(eventObj);
    queue.tx = queue.tx + 1;

    console.log("enqueued");
    console.log("currrent queue", queue.storage);
    console.log("current txs:", queue.tx);
    if (queue.storage.length > 3) {
      deQueueSetState(queue);
    }
  };
  useEffect(() => {
    ethersProvider.on("network", (newNetwork, oldNetwork) => {
      ethersProvider
        .getNetwork()
        .then((network) => console.log("connected to ", network));

      // poolContract = new ethers.Contract(poolAddress, ABI, ethersProvider);
      // When a Provider makes its initial connection, it emits a "network"
      // event with a null oldNetwork along with the newNetwork. So, if the
      // oldNetwork exists, it represents a changing network
      setPoolContract(new ethers.Contract(poolAddress, ABI, ethersProvider));
      //   poolContract.on("Mint", (sender, amount0, amount1, event) => {
      //     console.log(mint);
      //   });

      //   poolContract.on("Burn", (sender, amount0, amount1, to, event) => {
      //     console.log(Burn);
      //   });

      if (oldNetwork) {
        window.location.reload();
      }
    });
  }, []);
  const [swapListener, setSwapListener] = useState(false);
  useEffect(() => {
    poolContract.on(
      "Swap",
      (sender, amount0In, amount1In, amount0Out, amount1Out, to, event) => {
        if (!swapListener) setSwapListener(true);

        const bigNumAmount0In = ethers.BigNumber.from(amount0In);
        const bigNumAmount1In = ethers.BigNumber.from(amount1In);
        const tokenAmountA = parseInt(bigNumAmount0In._hex, 16);
        const tokenAmountB = parseInt(bigNumAmount1In._hex, 16);

        const swapObj = {
          action: "Swap",
          totalValue: null,
          tokenAmountA,
          tokenAmountB,
          account: to,
          time: Date.now(),
        };
        console.log("Swap in contract from:", sender);
        console.log("swapObj", swapObj);
        enqueue(eventQueue, swapObj);
      }
    );
  }, [poolContract]);

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
                  <TableCell component="th" scope="row">
                    {row.action}
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
