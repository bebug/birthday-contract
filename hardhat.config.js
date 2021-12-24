require("@nomiclabs/hardhat-waffle");
require('@nomiclabs/hardhat-ethers');
const { mnemonic } = "favorite awake already reveal light long twin minute jungle spray throw gravity";
/**
 * @type import('hardhat/config').HardhatUserConfig
 */
module.exports = {
  defaultNetwork: "hardhat",
  networks: {
    localhost: {
      url: "http://127.0.0.1:8545"
    },
    hardhat: {
    },
    bnbtestnet: {
      url: "https://data-seed-prebsc-1-s1.binance.org:8545",
      chainId: 97,
      gasPrice: 20000000000,
      accounts: {mnemonic: "mnemonic here"}
    },
    bnbmainnet: {
      url: "https://bsc-dataseed.binance.org/",
      chainId: 56,
      gasPrice: 20000000000,
      accounts: {mnemonic: "mnemonic here"}
    }
  },
  solidity: "0.7.3",
  settings: {
    optimizer: {
      enabled: true,
      runs: 200
    }
   }
};
