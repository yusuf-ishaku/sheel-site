export const contractAddress = "0xA77408DA2fe59FA027F2EFc6fB298894478A2A86";
import contractABI from '../constants/presaleAbi.json';


// export async function fetchStats() {
//   const res = await fetch("http://localhost:5000/api/stats"); // ✅ for local dev
//   if (!res.ok) throw new Error("Failed to fetch stats");
//   return await res.json();
// }

// --- Small helper wrappers to read/write the contract on-chain ---
/**
 * Read the `raised` value from the contract using a viem-style publicClient
 * @param publicClient - a wagmi/viem publicClient from usePublicClient()
 */
export async function readRaised(publicClient: any) {
  if (!publicClient) throw new Error('publicClient is required')
  const res = await publicClient.readContract({
    address: contractAddress,
    abi: contractABI,
    functionName: 'totalRaised',
    args: [],
  })
  console.log("Raised: ", res);
  return res
}

/**
 * Read the `TARGET_RAISE_BNB` value from the contract using a viem-style publicClient
 */
export async function readTarget(publicClient: any) {
  if (!publicClient) throw new Error('publicClient is required')
  const res = await publicClient.readContract({
    address: contractAddress,
    abi: contractABI,
    functionName: 'TARGET_RAISE_BNB',
    args: [],
  })
  console.log("Target: ", res);
  return res
}

/**
 * Check if an address is whitelisted
 */
export async function readWhitelisted(publicClient: any, address: any) {
  if (!publicClient) throw new Error('publicClient is required')
  if (!address) throw new Error('address is required')
  const res = await publicClient.readContract({
    address: contractAddress,
    abi: contractABI,
    functionName: 'whitelisted',
    args: [address],
  });
  console.log("White listed: ", res);
  return res
}

/**
 * Read user contributions
 */
export async function readContributions(publicClient: any, address: any) {
  if (!publicClient) throw new Error('publicClient is required')
  if (!address) throw new Error('address is required')
  const res = await publicClient.readContract({
    address: contractAddress,
    abi: contractABI,
    functionName: 'contributions',
    args: [address],
  });
  console.log("Contributions: ", res);
  return res
}

/**
 * Check if presale is active
 */
export async function readPresaleActive(publicClient: any) {
  if (!publicClient) throw new Error('publicClient is required')
  const res = await publicClient.readContract({
    address: contractAddress,
    abi: contractABI,
    functionName: 'presaleActive',
    args: [],
  });

  console.log("Presale Active: ", res);
  return res
}

/**
 * Check if presale is sold out
 */
export async function readSoldOut(publicClient: any) {
  if (!publicClient) throw new Error('publicClient is required')
  const res = await publicClient.readContract({
    address: contractAddress,
    abi: contractABI,
    functionName: 'soldOut',
    args: [],
  });
  console.log("Sold Out: ", res);
  return res
}

/**
 * Check if presale is paused
 */
export async function readPaused(publicClient: any) {
  if (!publicClient) throw new Error('publicClient is required')
  const res = await publicClient.readContract({
    address: contractAddress,
    abi: contractABI,
    functionName: 'paused',
    args: [],
  });

  console.log("Paused: ", res);
  return res
}

/**
 * Send a payable buy transaction using a walletClient (from useWalletClient)
 * @param walletClient - wallet client returned by wagmi's useWalletClient()
 * @param amount - string or BigInt amount in ether (e.g., '0.05')
 */
export async function buyWithWallet(walletClient: any, amount: any) {
  if (!walletClient) throw new Error('walletClient is required')
  if (!amount) throw new Error('amount is required')

  // Use viem's parseEther to turn a decimal string into wei
  // Dynamically import parseEther to avoid additional top-level deps in this file
  const { parseEther } = await import('viem')

  try {
    const txHash = await walletClient.writeContract({
      address: contractAddress,
      abi: contractABI,
      functionName: 'buyTokens',
      args: [],
      value: parseEther(amount),
    })
    return txHash
  } catch (err: any) {
    // Normalize error message to surface useful info to UI
    let msg = 'Transaction failed'
    
    // Extract meaningful error messages from contract reverts
    if (err?.shortMessage?.includes('Presale not active')) {
      msg = 'Presale is not currently active'
    } else if (err?.shortMessage?.includes('Not whitelisted')) {
      msg = 'Your wallet is not whitelisted for this presale'
    } else if (err?.shortMessage?.includes('Presale sold out')) {
      msg = 'Presale has sold out'
    } else if (err?.shortMessage?.includes('Below min')) {
      msg = 'Minimum contribution is 0.05 BNB'
    } else if (err?.shortMessage?.includes('Above max')) {
      msg = 'Maximum contribution is 0.1 BNB'
    } else if (err?.shortMessage?.includes('Wallet limit')) {
      msg = 'Maximum 0.1 BNB per wallet'
    } else if (err?.shortMessage?.includes('Hard cap reached')) {
      msg = 'Presale hard cap has been reached'
    } else if (err?.shortMessage?.includes('Presale paused')) {
      msg = 'Presale is currently paused'
    } else {
      msg = err?.shortMessage || err?.reason || err?.message || 'Transaction failed'
    }
    
    const e = new Error(msg)
    // attach original error for debugging
    ;(e as any).original = err
    throw e
  }
}

