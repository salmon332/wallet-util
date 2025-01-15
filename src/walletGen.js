const { Worker, isMainThread, parentPort, workerData } = require('node:worker_threads');
const ethers = require('ethers');

if (isMainThread) {
  // 主线程逻辑
  const createWallets = (prefix = '', suffix = '', threadCount = 4) => {
    const workers = [];
    for (let i = 0; i < threadCount; i++) {
      const worker = new Worker(__filename, {
        workerData: { prefix, suffix }
      });

      worker.on('message', (data) => {
        console.log(`Address: ${data.address}`);
        console.log(`Mnemonic: ${data.mnemonic}`);
        // 一旦找到匹配项，终止所有线程
        for (const w of workers) {
            w.terminate();
        }
      });

      worker.on('error', (err) => {
        console.error(`Worker ${i} encountered an error:`, err);
      });

      workers.push(worker);
    }
  };

  // 调用多线程创建钱包函数
  createWallets('0x1', 'ab', 8); // 示例，线程数设置为 8
} else {
  // 工作线程逻辑
  const { prefix, suffix } = workerData;

  while (true) {
    const wallet = ethers.Wallet.createRandom();
    const address = wallet.address.toLowerCase();

    const prefixMatch = !prefix || address.startsWith(prefix.toLowerCase());
    const suffixMatch = !suffix || address.endsWith(suffix.toLowerCase());

    if (prefixMatch && suffixMatch) {
      parentPort.postMessage({
        address: wallet.address,
        mnemonic: wallet.mnemonic.phrase
      });
      break; // 停止当前线程
    }
  }
}
