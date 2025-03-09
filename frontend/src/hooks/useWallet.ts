"use client"

import { useState, useEffect, useCallback } from "react"
import { ethers } from "ethers"
import { toast } from "react-hot-toast"

export function useWallet() {
  const [account, setAccount] = useState<string | null>(null)
  const [balance, setBalance] = useState<string>("0")
  const [provider, setProvider] = useState<ethers.BrowserProvider | null>(null)
  const [chainId, setChainId] = useState<number | null>(null)

  const updateAccountInfo = useCallback(async (provider: ethers.BrowserProvider, address: string) => {
    try {
      const balance = await provider.getBalance(address)
      const network = await provider.getNetwork()

      setAccount(address)
      setBalance(ethers.formatEther(balance))
      setChainId(Number(network.chainId))
    } catch (error) {
      console.error("Error updating account info:", error)
    }
  }, [])

  const connectWallet = useCallback(async () => {
    if (!window.ethereum) {
      toast.error("Please install MetaMask to use this app")
      return
    }

    try {
      const provider = new ethers.BrowserProvider(window.ethereum)
      const accounts = await provider.send("eth_requestAccounts", [])

      if (accounts.length === 0) {
        toast.error("No accounts found. Please create an account in MetaMask")
        return
      }

      await updateAccountInfo(provider, accounts[0])
      setProvider(provider)
      toast.success("Wallet connected successfully!")
    } catch (error) {
      console.error("Error connecting wallet:", error)
      toast.error("Failed to connect wallet")
    }
  }, [updateAccountInfo])

  const disconnectWallet = useCallback(() => {
    setAccount(null)
    setBalance("0")
    setProvider(null)
    setChainId(null)
    toast.success("Wallet disconnected")
  }, [])

  // Check if wallet is already connected on component mount
  useEffect(() => {
    const checkConnection = async () => {
      if (window.ethereum) {
        try {
          const provider = new ethers.BrowserProvider(window.ethereum)
          const accounts = await provider.listAccounts()

          if (accounts.length > 0) {
            await updateAccountInfo(provider, accounts[0].address)
            setProvider(provider)
          }
        } catch (error) {
          console.error("Error checking wallet connection:", error)
        }
      }
    }

    checkConnection()
  }, [updateAccountInfo])

  // Listen for account and chain changes
  useEffect(() => {
    if (!window.ethereum) return

    const handleAccountsChanged = async (accounts: string[]) => {
      if (accounts.length === 0) {
        disconnectWallet()
      } else if (provider) {
        await updateAccountInfo(provider, accounts[0])
      }
    }

    const handleChainChanged = () => {
      window.location.reload()
    }

    window.ethereum.on("accountsChanged", handleAccountsChanged)
    window.ethereum.on("chainChanged", handleChainChanged)

    return () => {
      if (window.ethereum) {
        window.ethereum.removeListener("accountsChanged", handleAccountsChanged)
        window.ethereum.removeListener("chainChanged", handleChainChanged)
      }
    }
  }, [disconnectWallet, provider, updateAccountInfo])

  return {
    account,
    balance,
    provider,
    chainId,
    connectWallet,
    disconnectWallet,
  }
}

