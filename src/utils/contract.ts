export const contractAddress = "YOUR_DEPLOYED_COINSALE_CONTRACT_ADDRESS";

export const contractABI = [
  {
    inputs: [
      { internalType: "address", name: "tokenAddress", type: "address" },
      { internalType: "uint256", name: "_price", type: "uint256" },
    ],
    stateMutability: "nonpayable",
    type: "constructor",
  },
  {
    inputs: [{ internalType: "uint256", name: "amount", type: "uint256" }],
    name: "buy",
    outputs: [],
    stateMutability: "payable",
    type: "function",
  },
  {
    inputs: [],
    name: "price",
    outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "totalSold",
    outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
    stateMutability: "view",
    type: "function",
  },
];


export async function fetchStats() {
  const res = await fetch("http://localhost:5000/api/stats"); // ✅ for local dev
  if (!res.ok) throw new Error("Failed to fetch stats");
  return await res.json();
}

