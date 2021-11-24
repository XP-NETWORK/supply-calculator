import { ethers, providers, Contract, BigNumber } from "ethers";
import abi from "erc-20-abi";
import express from "express";
import Config from "./config";
import console from "console";

let circulating = BigNumber.from(0);

const updater = async (
  totalSupply: BigNumber,
  addresses: string[],
  token: any
) => {
  for (;;) {
    let balanceOfSc = BigNumber.from(0);
    await Promise.all(
      addresses.map(async (address) => {
        const balance = await token.balanceOf(address);
        balanceOfSc = balanceOfSc.add(balance);
      })
    );
    circulating = totalSupply.sub(balanceOfSc);
    //@ts-ignore
    await Promise.resolve((r) => setTimeout(r, 5000));
  }
};

(async () => {
  const app = express();
  const bsc = new providers.JsonRpcProvider(
    "https://bsc-dataseed.binance.org/"
  );
  const XPNET = new Contract(Config.tokenAddress, abi, bsc);
  const totalSupply = await XPNET.totalSupply();
  updater(totalSupply, Config.smartContractAddresses, XPNET);
  app.get("/circulating", (_req, res) => {
    res.json({
      smartContracts: Config.smartContractAddresses,
      circulating: circulating.toString(),
    });
  });
  app.listen(Config.port, () => {
    console.log(`listening on port ${Config.port}`);
  });
})();
