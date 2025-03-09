"use client"

import { useState, useEffect, useCallback } from "react"
import { ethers } from "ethers"
import { LOTTERY_ABI, LOTTERY_ADDRESS, type Winner } from "../types/lottery"
import { toast } from "react-hot-toast"

export function useLottery(provider: ethers.BrowserProvider | null) {
  const [contract, setContract] = useState<ethers.Contract | null>(null)
  const [lotteryId, setLotteryId] = useState<number>(0)
  const [players, setPlayers] = useState<string[]>([])
  const [lastWinner, setLastWinner] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [winners, setWinners] = useState<Winner[]>([])
  const [userWinnings, setUserWinnings] = useState<Winner[]>([])
  const [entryFee, setEntryFee] = useState<string>("0")

  useEffect(() => {
    const initContract = async () => {
      if (!provider) return

      try {
        const signer = await provider.getSigner()
        const userAddress = await signer.getAddress()
        const lotteryContract = new ethers.Contract(LOTTERY_ADDRESS, LOTTERY_ABI, signer)

        setContract(lotteryContract)

        // Initialize state
        const currentLotteryId = await lotteryContract.lotteryId()
        const currentPlayers = await lotteryContract.getPlayers()
        const lastWinner = await lotteryContract.lotteryWinners(currentLotteryId - 1n)
        const fee = await lotteryContract.ENTRY_FEE()

        setEntryFee(ethers.formatEther(fee))

        // Fetch past winners
        const pastWinners: Winner[] = []
        const userWins: Winner[] = []

        for (let i = Number(currentLotteryId) - 1; i >= Math.max(0, Number(currentLotteryId) - 10); i--) {
          const winner = await lotteryContract.lotteryWinners(i)
          if (winner !== ethers.ZeroAddress) {
            const prize = await provider.getBalance(winner)
            const winnerData: Winner = {
              address: winner,
              prize: ethers.formatEther(prize),
              lotteryId: i,
              timestamp: Date.now() - (Number(currentLotteryId) - i) * 24 * 60 * 60 * 1000,
            }
            pastWinners.push(winnerData)

            if (winner.toLowerCase() === userAddress.toLowerCase()) {
              userWins.push(winnerData)
            }
          }
        }

        setWinners(pastWinners)
        setUserWinnings(userWins)
        setLotteryId(Number(currentLotteryId))
        setPlayers(currentPlayers)
        setLastWinner(lastWinner === ethers.ZeroAddress ? null : lastWinner)
      } catch (error) {
        console.error("Error initializing lottery contract:", error)
        toast.error("Failed to initialize lottery contract")
      }
    }

    initContract()
  }, [provider])

  const buyTickets = useCallback(
    async (numberOfTickets: number) => {
      if (!contract) {
        toast.error("Contract not initialized")
        return
      }

      try {
        setLoading(true)
        const ticketPrice = await contract.ENTRY_FEE()
        const totalCost = ticketPrice * BigInt(numberOfTickets)

        const tx = await contract.enterLottery(numberOfTickets, {
          value: totalCost,
        })

        toast.loading("Purchasing tickets...", { id: "buying-tickets" })
        await tx.wait()

        // Update state
        const updatedPlayers = await contract.getPlayers()
        setPlayers(updatedPlayers)

        toast.success(`Successfully purchased ${numberOfTickets} ticket(s)!`, { id: "buying-tickets" })
      } catch (error: any) {
        console.error("Error buying tickets:", error)
        toast.error(error.reason || "Failed to purchase tickets", { id: "buying-tickets" })
      } finally {
        setLoading(false)
      }
    },
    [contract],
  )

  useEffect(() => {
    if (!contract || !provider) return

    const handleWinnerPicked = async (winner: string, prize: bigint, id: bigint) => {
      setLastWinner(winner)
      setLotteryId(Number(id) + 1)
      setPlayers([])

      const newWinner: Winner = {
        address: winner,
        prize: ethers.formatEther(prize),
        lotteryId: Number(id),
        timestamp: Date.now(),
      }

      setWinners((prev) => [newWinner, ...prev.slice(0, 9)])

      try {
        const signer = await provider.getSigner()
        const userAddress = await signer.getAddress()

        if (winner.toLowerCase() === userAddress.toLowerCase()) {
          setUserWinnings((prev) => [newWinner, ...prev])
          toast.success("Congratulations! You won the lottery! 🎉")
        } else {
          toast.success(`Winner picked! Address: ${winner.slice(0, 6)}...${winner.slice(-4)}`)
        }
      } catch (error) {
        console.error("Error handling winner event:", error)
      }
    }

    const handleTicketPurchased = async (buyer: string, numberOfTickets: bigint) => {
      try {
        const updatedPlayers = await contract.getPlayers()
        setPlayers(updatedPlayers)
      } catch (error) {
        console.error("Error updating players after ticket purchase:", error)
      }
    }

    // Set up event listeners
    const winnerFilter = contract.filters.WinnerPicked()
    const ticketFilter = contract.filters.TicketPurchased()

    contract.on(winnerFilter, handleWinnerPicked)
    contract.on(ticketFilter, handleTicketPurchased)

    return () => {
      contract.off(winnerFilter, handleWinnerPicked)
      contract.off(ticketFilter, handleTicketPurchased)
    }
  }, [contract, provider])

  return {
    lotteryId,
    players,
    lastWinner,
    loading,
    winners,
    userWinnings,
    entryFee,
    buyTickets,
  }
}

