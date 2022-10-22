import * as dotenv from "dotenv";

import { HardhatUserConfig, task } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox";
import "@openzeppelin/hardhat-upgrades";
import "hardhat-abi-exporter";
import "@nomicfoundation/hardhat-chai-matchers";
dotenv.config();

task("accounts", "Prints the list of accounts", async (taskArgs, hre) => {
    const accounts = await hre.ethers.getSigners();

    for (const account of accounts) {
        console.log(account.address);
    }
});

const rinkebyAccount: string = process.env.RINKEBY_PRIVATE_KEY ?? "";
const mainnetAccount: string = process.env.MAINNET_PRIVATE_KEY ?? "";

const config: HardhatUserConfig = {
    solidity: "0.8.17",
    networks: {
        rinkeby: {
            url: process.env.RINKEBY_RPC,
            accounts: [rinkebyAccount]
        },
        mainnet: {
            url: process.env.MAINNET_RPC,
            accounts: [mainnetAccount]
        },
    },
    gasReporter: {
        currency: "USD",
        token: "ETH",
        gasPriceApi: "https://api.etherscan.io/api?module=proxy&action=eth_gasPrice",
        coinmarketcap: process.env.COINMARKETCAP_API_KEY,
        showTimeSpent: true
    },
    abiExporter: {
        path: "./data/abi",
        runOnCompile: true,
        clear: true,
        flat: true,
        spacing: 2,
        pretty: false,
    },
    etherscan: {
        apiKey: process.env.ETHERSCAN_API_KEY,
    }
};

export default config;