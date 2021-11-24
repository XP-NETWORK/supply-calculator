import { config } from "dotenv";

config();

export default {
  port: process.env.PORT || 3000,
  tokenAddress: process.env.TOKEN_ADDRESS!,
  smartContractAddresses: process.env
    .SMART_CONTRACT_ADDRESSES!.split(",")
    .filter((e) => e !== ""),
};
