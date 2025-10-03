import { useState } from "react";
import { ethers } from "ethers";

export default function useWallet() {
  const [account, setAccount] = useState(null);
  const [provider, setProvider] = useState(null);

  async function connectWallet() {
    if (!window.ethereum) {
      alert("Please install MetaMask to continue.");
      return;
    }

    try {
      const ethProvider = new ethers.BrowserProvider(window.ethereum);
      const signer = await ethProvider.getSigner();
      const address = await signer.getAddress();

      setAccount(address);
      setProvider(ethProvider);
    } catch (err) {
      console.error("Wallet connection failed:", err);
    }
  }

  return { account, provider, connectWallet };
}
