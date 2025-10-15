import { runTask, Call } from "@mimicprotocol/test-ts";
import { expect } from "chai";

describe("Task", () => {
  const taskDir = "./";

  const context = {
    user: "0x756f45e3fa69347a9a973a725e3c98bc4db0b5a0",
    settlers: [
      { address: "0xdcf1d9d12a0488dfb70a8696f44d6d3bc303963d", chainId: 10 },
      { address: "0x609d831c0068844e11ef85a273c7f356212fd6d1", chainId: 42161 },
    ],
    timestamp: Date.now(),
  };

  const buildCalls = (balance: string): ContractCallMock[] => [
    {
      request: {
        to: inputs.collateralToken,
        chainId: inputs.chainId,
        data: "0x70a08231", // `balanceOf` fn selector
      },
      response: {
        value: balance,
        abiType: "uint256",
      },
    },
    {
      request: {
        to: inputs.collateralToken,
        chainId: inputs.chainId,
        data: "0x313ce567", // `decimals` fn selector
      },
      response: {
        value: "18",
        abiType: "uint8",
      },
    },
    {
      request: {
        to: inputs.morphoAddress,
        chainId: inputs.chainId,
        data: "0x2c3c9157",
      },
      response: {
        value: [
          "0xaf88d065e77c8cC2239327C5EDb3A432268e5831",
          "0x82aF49447D8a07e3bd95BD0d56f35241523fBab1",
          "0x282FEB10549fde52bD61A6979424Ddf18A4971A2",
          "0x66F30587FB8D4206918deb78ecA7d5eBbafD06DA",
          "860000000000000000",
        ],
        abiType: "(address,address,address,address,uint256)",
      },
    },
  ];

  const inputs = {
    chainId: 42161, // Arbitrum
    collateralToken: "0x82aF49447D8a07e3bd95BD0d56f35241523fBab1", // WETH
    morphoAddress: "0x6c247b1F6182318877311737BaC0844bAa518F5e",
    borrowMarket:
      "0xca83d02be579485cc10945c9597a6141e772f1cf0e0aa28d09a327b6cbd8642c", // /weth-usdc,
    smartAccount: "0xA15A054DD1ceB68945010c2D3f25FfB7aEc664eF",
    threshold: "0.001", // 4 USD
    maxFee: "0.0001", // ~0.40 USD
  };

  it("produces the expected intents", async () => {
    const ethBalance = "1000000000000000000"; // 1 ETH
    const calls = buildCalls(ethBalance);
    const intents = (await runTask(taskDir, context, {
      inputs,
      calls,
    })) as Call[];

    expect(intents).to.be.an("array");
    expect(intents).to.have.lengthOf(1);

    expect(intents[0].type).to.be.equal("call");
    expect(intents[0].settler).to.be.equal(context.settlers[1].address);
    expect(intents[0].user).to.be.equal(inputs.smartAccount.toLowerCase());
    expect(intents[0].chainId).to.be.equal(inputs.chainId);
    expect(intents[0].maxFees).to.have.lengthOf(1);
    expect(intents[0].maxFees[0].token).to.be.equal(
      inputs.collateralToken.toLowerCase(),
    );
    expect(intents[0].maxFees[0].amount).to.be.equal("100000000000000");
  });
});
