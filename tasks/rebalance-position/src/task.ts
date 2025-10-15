import { BigInt, ERC20Token, Transfer } from "@mimicprotocol/lib-ts";

import { inputs } from "./types";

import { Morpho, MarketParams } from "./types/Morpho";
import { ERC4626 } from "./types/ERC4626";

const VIRTUAL_ASSETS = BigInt.fromString("1");
const VIRTUAL_SHARES = BigInt.fromString("1000000");

function toAssets(shares: BigInt, totalAssets: BigInt, totalShares: BigInt): BigInt {
  return shares.times(totalAssets.plus(VIRTUAL_ASSETS)).div(totalShares.plus(VIRTUAL_SHARES));
}

export default function main(): void {
  const morpho = Morpho(inputs.morpho, inputs.chainId);
  const vault = ERC4626(inputs.vault, inputs.chainId);
  const market: Market = morpho.market(inputs.market);

  const marketParams: MarketParams = morpho.idToMarketParams(inputs.market);
  const currentBorrowShares = morpho.position(inputs.market, inputs.account).borrowShares;
  const currentBorrowed = toAssets(currentBorrowShares, market.totalBorrowAssets, market.totalBorrowShares);

  // const maxBorrow =

  // If maxBorrow * threshBorrowMin > currentBorrowed: borrow up to threshBorrowTarget and supply on vault
  // If maxBorrow * threshBorrowMax < currentBorrowed: withdraw from vault and repay up to threshBorrowTarget

  //   uint256 borrowed = uint256(position[id][borrower].borrowShares).toAssetsUp(
  //     market[id].totalBorrowAssets, market[id].totalBorrowShares
  // );
}
