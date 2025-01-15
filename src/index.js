const ethers = require("ethers");

const main = () => {
  createWallet('11', '99');
};

const createWallet = (prefix = "", suffix = "") => {
  while (true) {
    const wallet = ethers.Wallet.createRandom();
    const address = wallet.address.toLowerCase();
    
    const prefixMatch = prefix.length === 0 || address.startsWith(`0x${prefix.toLowerCase()}`);
    const suffixMatch = suffix.length === 0 || address.endsWith(suffix.toLowerCase());
    
    if (prefixMatch && suffixMatch) {
      console.log(`Address: ${wallet.address}`);
      console.log(`Mnemonic: ${wallet.mnemonic.phrase}`);
      break;
    }
  }
};

main();
