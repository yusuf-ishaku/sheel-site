import { useCallback, useEffect, useState } from 'react'
import { usePublicClient, useWalletClient, useAccount } from 'wagmi'
import { 
  readRaised, 
  readTarget, 
  buyWithWallet, 
  readWhitelisted, 
  readContributions, 
  readPresaleActive, 
  readSoldOut, 
  readPaused 
} from '../utils/contract'

export default function usePresaleContract() {
  const publicClient = usePublicClient()
  const walletClient = useWalletClient()
  const { address } = useAccount()

  const [raised, setRaised] = useState(0)
  const [target, setTarget] = useState(0)
  const [loading, setLoading] = useState(false)
  const [isWhitelisted, setIsWhitelisted] = useState(false)
  const [userContributions, setUserContributions] = useState(0)
  const [presaleActive, setPresaleActive] = useState(false)
  const [soldOut, setSoldOut] = useState(false)
  const [paused, setPaused] = useState(false)

  const refresh = useCallback(async () => {
    if (!publicClient) return
    try {
      const [r, t, active, sold, pausedState] = await Promise.all([
        readRaised(publicClient),
        readTarget(publicClient),
        readPresaleActive(publicClient),
        readSoldOut(publicClient),
        readPaused(publicClient)
      ])
      
      setRaised(Number(r) / 1e18)
      setTarget(Number(t) / 1e18)
      setPresaleActive(active)
      setSoldOut(sold)
      setPaused(pausedState)

      // User-specific data
      if (address) {
        const [whitelisted, contributions] = await Promise.all([
          readWhitelisted(publicClient, address),
          readContributions(publicClient, address)
        ])
        setIsWhitelisted(whitelisted)
        setUserContributions(Number(contributions) / 1e18)
      }
    } catch (err) {
      console.error('usePresaleContract refresh failed', err)
    }
  }, [publicClient, address])

  useEffect(() => {
    refresh()
  }, [refresh])

  const buy = useCallback(async (amount) => {
    if (!walletClient?.data) throw new Error('Wallet client not ready')
    if (!address) throw new Error('No wallet address')
    
    // Pre-flight validations
    if (!presaleActive) throw new Error('Presale is not currently active')
    if (soldOut) throw new Error('Presale has sold out')
    if (paused) throw new Error('Presale is currently paused')
    if (!isWhitelisted) throw new Error('Your wallet is not whitelisted for this presale')
    
    const amountNum = Number(amount)
    if (amountNum < 0.05) throw new Error('Minimum contribution is 0.05 BNB')
    if (amountNum > 0.1) throw new Error('Maximum contribution is 0.1 BNB')
    if (userContributions + amountNum > 0.1) throw new Error('Maximum 0.1 BNB per wallet')
    
    setLoading(true)
    try {
      const txHash = await buyWithWallet(walletClient.data, amount)
      await publicClient.waitForTransactionReceipt({ hash: txHash })
      await refresh()
      return txHash
    } finally {
      setLoading(false)
    }
  }, [walletClient, publicClient, refresh, address, presaleActive, soldOut, paused, isWhitelisted, userContributions])

  return { 
    raised, 
    target, 
    loading, 
    refresh, 
    buy,
    isWhitelisted,
    userContributions,
    presaleActive,
    soldOut,
    paused
  }
}
