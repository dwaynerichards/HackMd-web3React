import { readFile } from 'fs/promises';
import { Contract } from 'ethers';
import infuraEndpoints from '../config/dotenv';
import { Route } from '@uniswap/v3-sdk';
import { getPoolImmutables, provider as mainnetProvider } from './uniswap';
/**creates an object in our javascript environment that models the quoter interface,
 * which can be called to return a swap quote.
 * */

import { main as originalMain } from './uniswap';

const quoterABI = JSON.parse(
  await readFile(
    '@uniswap/v3-periphery/artifacts/contracts/lens/Quoter.sol/Quoter.json'
  )
).abi;
const quoterAddress = '0xb27308f9F90D607463bb33eA1BeBb41C27CE5AB6';
const quoterContract = new Contract(quoterAddress, quoterABI, mainnetProvider);
/**tcallStatic is a useful method that submits a state-changing transaction to an Ethereum node,
 *   the node to simulate the state change, rather than to execute it.
 *  Our script can then return the result of the simulated state change. */

/**
 * solidity function signature
 * function quoteExactInputSingle(
        address tokenIn,
        address tokenOut,
        uint24 fee,
        uint256 amountIn,
        uint160 sqrtPriceLimitX96
    ) external returns (uint256 amountOut);
 */
const main = new originalMain();
main.amountIn = 1500;
main.quotedAmountOut = await quoterContract.callStatic.quoteExactInputSingle(
  this.immutables.token0,
  this.immutables.token1,
  this.immutables.fee,
  this.amountIn.toString(),
  0
);

const swapRoute = new Route([]);
