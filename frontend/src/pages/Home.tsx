"use client"

import { useState } from "react"
import { useWallet } from "../hooks/useWallet"
import { useLottery } from "../hooks/useLottery"
import { Ticket, Trophy, Users, Timer, Gift } from "lucide-react"

export function Home() {
  const { provider, account } = useWallet()
  const { lotteryId, players, lastWinner, loading, winners, buyTickets, entryFee } = useLottery(provider)
  const [ticketCount, setTicketCount] = useState(1)

  const handleBuyTickets = async () => {
    if (!account) return
    await buyTickets(ticketCount)
  }

  const formatTimeAgo = (timestamp: number) => {
    const seconds = Math.floor((Date.now() - timestamp) / 1000)
    if (seconds < 60) return "just now"
    const minutes = Math.floor(seconds / 60)
    if (minutes < 60) return `${minutes}m ago`
    const hours = Math.floor(minutes / 60)
    if (hours < 24) return `${hours}h ago`
    const days = Math.floor(hours / 24)
    return `${days}d ago`
  }

  return (
    <div className="space-y-8">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">Welcome to Crypto Lottery</h1>
        <p className="text-xl text-gray-600">Try your luck in the decentralized lottery!</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-xl shadow-md">
          <div className="flex items-center space-x-3 mb-4">
            <Trophy className="h-6 w-6 text-yellow-500" />
            <h2 className="text-xl font-semibold">Current Round</h2>
          </div>
          <p className="text-3xl font-bold text-primary">#{lotteryId}</p>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-md">
          <div className="flex items-center space-x-3 mb-4">
            <Users className="h-6 w-6 text-blue-500" />
            <h2 className="text-xl font-semibold">Players</h2>
          </div>
          <p className="text-3xl font-bold text-primary">{players.length}</p>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-md">
          <div className="flex items-center space-x-3 mb-4">
            <Trophy className="h-6 w-6 text-purple-500" />
            <h2 className="text-xl font-semibold">Last Winner</h2>
          </div>
          <p className="text-lg font-medium text-primary">
            {lastWinner ? `${lastWinner.slice(0, 6)}...${lastWinner.slice(-4)}` : "No winner yet"}
          </p>
        </div>
      </div>

      <div className="bg-white p-8 rounded-xl shadow-md">
        <div className="flex items-center space-x-3 mb-6">
          <Ticket className="h-6 w-6 text-green-500" />
          <h2 className="text-2xl font-semibold">Buy Tickets</h2>
        </div>

        <div className="flex flex-col md:flex-row md:items-center space-y-4 md:space-y-0 md:space-x-4">
          <div>
            <p className="text-sm text-gray-600 mb-1">Ticket Price: {Number.parseFloat(entryFee).toFixed(6)} ETH</p>
            <input
              type="number"
              min="1"
              value={ticketCount}
              onChange={(e) => setTicketCount(Math.max(1, Number.parseInt(e.target.value)))}
              className="w-32 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary"
            />
          </div>
          <button
            onClick={handleBuyTickets}
            disabled={!account || loading}
            className={`px-6 py-2 rounded-lg font-medium transition-colors ${account ? "bg-indigo-600 text-white hover:bg-indigo-700" : "bg-gray-400 text-white cursor-not-allowed"
              }`}
          >
            {loading ? "Buying..." : `Buy ${ticketCount} Ticket${ticketCount > 1 ? "s" : ""}`}
          </button>
          <div className="text-sm text-gray-600">
            Total: {(Number.parseFloat(entryFee) * ticketCount).toFixed(6)} ETH
          </div>
        </div>

        {!account && <p className="mt-4 text-sm text-gray-600">Please connect your wallet to buy tickets</p>}
      </div>

      <div className="bg-white p-8 rounded-xl shadow-md">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-3">
            <Gift className="h-6 w-6 text-pink-500" />
            <h2 className="text-2xl font-semibold">Recent Winners</h2>
          </div>
        </div>

        <div className="space-y-4">
          {winners.length > 0 ? (
            winners.map((winner) => (
              <div
                key={winner.lotteryId}
                className="flex items-center justify-between p-4 bg-gray-50 rounded-lg transform transition-all duration-300 hover:scale-[1.02] hover:shadow-md"
              >
                <div className="flex items-center space-x-4">
                  <div className="bg-primary/10 p-2 rounded-full">
                    <Trophy className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900">Round #{winner.lotteryId}</p>
                    <p className="text-sm text-gray-600">
                      {winner.address.slice(0, 6)}...{winner.address.slice(-4)}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-bold text-primary">{Number.parseFloat(winner.prize).toFixed(4)} ETH</p>
                  <div className="flex items-center text-sm text-gray-500">
                    <Timer className="h-4 w-4 mr-1" />
                    {formatTimeAgo(winner.timestamp)}
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-8 text-gray-500">
              <Trophy className="h-12 w-12 mx-auto mb-3 text-gray-400" />
              <p>No winners yet. Be the first one!</p>
            </div>
          )}
        </div>
      </div>

    </div>
  )
}
