import { ERC20Token, Transfer, CallBuilder, TokenAmount } from "@mimicprotocol/lib-ts";

import { inputs } from "./types";
import { ERC20 } from "./types/ERC20";

export default function main(): void {
  const token = new ERC20(inputs.collateralToken, inputs.chainId);
  const balance = token.balanceOf(inputs.smartAccount);

  if (balance.gt(inputs.threshold)) {
    const toSupply = balance.sub(inputs.maxFee);
    CallBuilder multiCall = CallBuilder.forChain(inputs.chainId).addUser(inputs.smartAccount).addMaxFee(TokenAmount.fromBigInt(token, inputs.maxFee));

    Pconst approveCall = token.approve(inputs.morphoAddress, toSupply);

  approveCall``

  Transfer.create(token, inputs.amount, inputs.recipient, inputs.maxFee).send();

  }

}
