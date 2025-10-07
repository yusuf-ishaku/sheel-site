/* eslint-env node */
import 'dotenv/config'
import { createPublicClient, http } from 'viem'
import { sepolia } from 'viem/chains'
import { contractAddress, contractABI } from '../src/utils/contract'

async function main() {
  const proc = globalThis.process || { env: {} }
  const rpc = proc.env.SMOKE_RPC || proc.env.VITE_RPC_URL || 'https://sepolia.rpc.thirdweb.com'
  const client = createPublicClient({ chain: sepolia, transport: http(rpc) })

  console.log('Using RPC:', rpc)

  try {
    const [totalRaised, target, presaleActive, soldOut, paused] = await Promise.all([
      client.readContract({ address: contractAddress, abi: contractABI, functionName: 'totalRaised' }),
      client.readContract({ address: contractAddress, abi: contractABI, functionName: 'TARGET_RAISE_BNB' }),
      client.readContract({ address: contractAddress, abi: contractABI, functionName: 'presaleActive' }),
      client.readContract({ address: contractAddress, abi: contractABI, functionName: 'soldOut' }),
      client.readContract({ address: contractAddress, abi: contractABI, functionName: 'paused' })
    ])

    console.log('=== Presale Contract Status ===')
    console.log('Contract Address:', contractAddress)
    console.log('totalRaised (wei):', totalRaised.toString())
    console.log('totalRaised (BNB):', Number(totalRaised) / 1e18)
    console.log('TARGET_RAISE_BNB (wei):', target.toString())
    console.log('TARGET_RAISE_BNB (BNB):', Number(target) / 1e18)
    console.log('Progress:', ((Number(totalRaised) / Number(target)) * 100).toFixed(2) + '%')
    console.log('Presale Active:', presaleActive)
    console.log('Sold Out:', soldOut)
    console.log('Paused:', paused)
    
    // Test whitelist check for a sample address if provided
    if (proc.env.TEST_ADDRESS) {
      const isWhitelisted = await client.readContract({ 
        address: contractAddress, 
        abi: contractABI, 
        functionName: 'whitelisted',
        args: [proc.env.TEST_ADDRESS]
      })
      console.log(`Address ${proc.env.TEST_ADDRESS} whitelisted:`, isWhitelisted)
    }
  } catch (err) {
    console.error('Smoke read failed', err)
    globalThis.process ? (globalThis.process.exitCode = 1) : null
  }
}

main()
