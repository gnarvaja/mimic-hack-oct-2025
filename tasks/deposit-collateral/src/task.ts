import {
  ERC20Token,
  Transfer,
  CallBuilder,
  TokenAmount,
  Bytes,
} from "@mimicprotocol/lib-ts";

import { inputs } from "./types";
import { ERC20 } from "./types/ERC20";

export default function main(): void {
  const token = new ERC20(inputs.collateralToken, inputs.chainId);
  const tokenForFee = ERC20Token.fromAddress(
    inputs.collateralToken,
    inputs.chainId,
  );
  const balance = TokenAmount.fromBigInt(
    tokenForFee,
    token.balanceOf(inputs.smartAccount),
  );
  const threshold = TokenAmount.fromStringDecimal(
    tokenForFee,
    inputs.threshold,
  );

  if (balance.gt(threshold)) {
    const toSupply = balance.minus(threshold);
    const maxFee = TokenAmount.fromStringDecimal(tokenForFee, inputs.maxFee);
    const threshold = TokenAmount.fromStringDecimal(tokenForFee, inputs.maxFee);
    const multiCall = CallBuilder.forChain(inputs.chainId)
      .addUser(inputs.smartAccount)
      .addMaxFee(maxFee);
    const approveCall = token
      .approve(inputs.morphoAddress, toSupply.amount)
      .addMaxFee(maxFee)
      .build().calls[0];
    multiCall.addCall(
      inputs.morphoAddress,
      Bytes.fromHexString(approveCall.data),
    );
    multiCall.build().send();
  }
}
