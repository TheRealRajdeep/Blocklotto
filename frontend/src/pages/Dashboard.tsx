"use client"

import { useEffect, useState } from "react"
import { useWallet } from "../hooks/useWallet"
import { useLottery } from "../hooks/useLottery"
import { Ticket, Trophy, Wallet } from "lucide-react"
import type { LotteryEvent } from "../types/lottery"

export function Dashboard() {
  const { account, provider } = useWallet()
  const { lotteryId, players, userWinnings } = useLottery(provider)
  const [userTickets, setUserTickets] = useState(0)
  const [events, setEvents] = useState<LotteryEvent[]>([])

  useEffect(() => {
    if (!account || !players) return
    const tickets = players.filter((player) => player.toLowerCase() === account.toLowerCase()).length
    setUserTickets(tickets)
  }, [account, players])

  // Calculate winning chance
  const winningChance = players.length > 0 ? (userTickets / players.length) * 100 : 0

  // Fetch user events from contract (this would be implemented with contract events)
  useEffect(() => {
    if (!account || !provider) return

    // This is a placeholder. In a real implementation, you would fetch events from the contract
    // For example, using contract.queryFilter() to get past events
    const mockEvents: LotteryEvent[] = userWinnings.map((win) => ({
      type: "WinnerPicked",
      data: {
        prize: win.prize,
        lotteryId: win.lotteryId,
      },
      timestamp: win.timestamp,
    }))

    setEvents(mockEvents)
  }, [account, provider, userWinnings])

  return (
    <div className="space-y-8">
      {!account ? (
        <div className="text-center py-12">
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">Connect your wallet to view your dashboard</h2>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white p-6 rounded-xl shadow-md">
              <div className="flex items-center space-x-3 mb-4">
                <Ticket className="h-6 w-6 text-primary" />
                <h2 className="text-xl font-semibold">Your Tickets</h2>
              </div>
              <p className="text-3xl font-bold text-primary">{userTickets}</p>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-md">
              <div className="flex items-center space-x-3 mb-4">
                <Trophy className="h-6 w-6 text-yellow-500" />
                <h2 className="text-xl font-semibold">Winning Chance</h2>
              </div>
              <p className="text-3xl font-bold text-primary">{winningChance.toFixed(2)}%</p>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-md">
              <div className="flex items-center space-x-3 mb-4">
                <Wallet className="h-6 w-6 text-green-500" />
                <h2 className="text-xl font-semibold">Current Round</h2>
              </div>
              <p className="text-3xl font-bold text-primary">#{lotteryId}</p>
            </div>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-md">
            <h2 className="text-2xl font-semibold mb-6">Your Activity</h2>
            {events.length > 0 ? (
              <div className="space-y-4">
                {events.map((event, index) => (
                  <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <div>
                      <p className="font-semibold text-gray-900">{event.type}</p>
                      <p className="text-sm text-gray-600">{new Date(event.timestamp).toLocaleString()}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-gray-600">
                        {event.type === "TicketPurchased"
                          ? `${event.data.numberOfTickets} tickets`
                          : event.type === "WinnerPicked"
                            ? `Won ${event.data.prize} ETH`
                            : ""}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-center text-gray-600">No activity yet</p>
            )}
          </div>
        </>
      )}
    </div>
  )
}

