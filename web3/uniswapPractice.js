import { ethers } from "ethers";
import { Pool, Route, Trade } from "@uniswap/v3-sdk";
import { CurrencyAmount, Token, TradeType } from "@uniswap/sdk-core";
import infuraEndpoints from "../config/dotenv.js";
import { createRequire } from "module";
const require = createRequire(import.meta.url);

const v3PoolABI =
  require("@uniswap/v3-core/artifacts/contracts/interfaces/IUniswapV3Pool.sol/IUniswapV3Pool.json").abi;
const quoterABI =
  require("@uniswap/v3-periphery/artifacts/contracts/lens/Quoter.sol/Quoter.json").abi;
const DIA_USDC_ABI = require("../ABI/DIA_USDC.json");

export const provider = new ethers.providers.JsonRpcProvider(
  infuraEndpoints.MAINNET
);

const DIA_USDC_Address = "0x6c6Bc977E13Df9b0de53b251522280BB72383700";

const poolAddress = "0x8ad599c3A0ff1De082011EFDDc58f1908eb6e6D8";
// USDC-WETH pool address on mainnet for fee tier 0.05%
//const poolAddress = "0x88e6a0c2ddd26feeb64f039a2c41296fcb3f5640";
const poolContract = new ethers.Contract(
  DIA_USDC_Address,
  DIA_USDC_ABI,
  provider
);

const quoterAddress = "0xb27308f9F90D607463bb33eA1BeBb41C27CE5AB6";
const quoterContract = new ethers.Contract(quoterAddress, quoterABI, provider);

export async function getPoolImmutables() {
  try {
    const [factory, token0, token1, fee, tickSpacing, maxLiquidityPerTick] =
      await Promise.all([
        poolContract.factory(),
        poolContract.token0(),
        poolContract.token1(),
        poolContract.fee(),
        poolContract.tickSpacing(),
        poolContract.maxLiquidityPerTick(),
      ]);

    const immutables = {
      factory,
      token0,
      token1,
      fee,
      tickSpacing,
      maxLiquidityPerTick,
    };
    return immutables;
  } catch (error) {
    console.log("error in getPoolImmutables :", { error });
  }
}

async function getPoolState() {
  // note that data here can be desynced if the call executes over the span of two or more blocks.
  try {
    const [liquidity, slot] = await Promise.all([
      poolContract.liquidity(),
      poolContract.slot0(),
    ]);

    const PoolState = {
      liquidity,
      sqrtPriceX96: slot[0],
      tick: slot[1],
      observationIndex: slot[2],
      observationCardinality: slot[3],
      observationCardinalityNext: slot[4],
      feeProtocol: slot[5],
      unlocked: slot[6],
    };
    return PoolState;
  } catch (error) {
    console.log("error in getPoolState:", { error });
  }
}

export async function main() {
  try {
    // query the state and immutable variables of the pool
    const [immutables, state] = await Promise.all([
      getPoolImmutables(),
      getPoolState(),
    ]);
    //// create instances of the Token object to represent the two tokens in the given pool
    // const TokenA = new Token(3, immutables.token0, 6, "USDC", "USD Coin");
    // const TokenB = new Token(3, immutables.token1, 18, "WETH", "Wrapped Ether");

    // const poolExample = new Pool(
    //   TokenA,
    //   TokenB,
    //   immutables.fee,
    //   state.sqrtPriceX96.toString(),
    //   state.liquidity.toString(),
    //   state.tick
    //   );

    //------------------------------------------------------------------
    const DAI = new Token(3, immutables.token0, 6, "DIA", "DIA");
    const USDC = new Token(3, immutables.token1, 6, "USDC", "USD Coin");
    console.log("DAI", DAI);
    console.log("USCD: ", USDC);

    const DAI_USDC_POOL = new Pool(
      DAI,
      USDC,
      immutables.fee,
      state.sqrtPriceX96.toString(),
      state.liquidity.toString(),
      state.tick
    );

    const token0Price = DAI_USDC_POOL.token0Price;
    const token1Price = DAI_USDC_POOL.token1Price;

    const amountIn = 1500;
    const quotedAmountOut =
      await quoterContract.callStatic.quoteExactInputSingle(
        immutables.token0,
        immutables.token1,
        immutables.fee,
        amountIn.toString(),
        0
      );
    console.log("quoted amount out: ", quotedAmountOut);
    const swapRoute = new Route([DAI_USDC_POOL], DAI, USDC);
    //Create an Unchecked Trade, a type of trade that is useful
    //when we have retrieved a quote prior to the construction of the trade object.
    const trade = {
      route: swapRoute,
      inputAmount: CurrencyAmount.fromRawAmount(DAI, amountIn.toString()),
      outputAmount: CurrencyAmount.fromRawAmount(
        USDC,
        quotedAmountOut.toString()
      ),
      tradeType: TradeType.EXACT_INPUT,
    };
    const uncheckedTradeExample = await Trade.createUncheckedTrade(trade);

    // print the quote and the unchecked trade instance in the console
    console.log("trade example unchecked: ", uncheckedTradeExample);
  } catch (error) {
    console.log("Error in Main:", error);
  }
}

main();
