"use client"
import { Sparkles, Shield, Zap, Clock, Users, Trophy } from "lucide-react"

export function About() {
  return (
    <div className="space-y-12">
      <div className="text-center max-w-3xl mx-auto">
        <h1 className="text-4xl font-bold text-gray-900 mb-6">About Crypto Lottery</h1>
        <p className="text-xl text-gray-600">
          Welcome to the future of decentralized lottery systems. Our platform combines blockchain technology with fair
          play to create a transparent and exciting lottery experience.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        <div className="bg-white p-6 rounded-xl shadow-md">
          <div className="flex items-center space-x-3 mb-4">
            <div className="bg-blue-100 p-2 rounded-full">
              <Shield className="h-6 w-6 text-blue-600" />
            </div>
            <h3 className="text-xl font-semibold">Secure & Transparent</h3>
          </div>
          <p className="text-gray-600">
            Built on blockchain technology, ensuring complete transparency and security for all participants.
          </p>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-md">
          <div className="flex items-center space-x-3 mb-4">
            <div className="bg-purple-100 p-2 rounded-full">
              <Sparkles className="h-6 w-6 text-purple-600" />
            </div>
            <h3 className="text-xl font-semibold">Fair Play</h3>
          </div>
          <p className="text-gray-600">Powered by Chainlink VRF for truly random and verifiable winner selection.</p>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-md">
          <div className="flex items-center space-x-3 mb-4">
            <div className="bg-green-100 p-2 rounded-full">
              <Zap className="h-6 w-6 text-green-600" />
            </div>
            <h3 className="text-xl font-semibold">Instant Payouts</h3>
          </div>
          <p className="text-gray-600">Winners receive their prizes automatically through smart contracts.</p>
        </div>
      </div>

      <div className="bg-white p-8 rounded-xl shadow-md">
        <h2 className="text-2xl font-bold mb-6">How It Works</h2>
        <div className="space-y-6">
          <div className="flex items-start space-x-4">
            <div className="bg-indigo-100 p-2 rounded-full">
              <Users className="h-6 w-6 text-indigo-600" />
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-2">1. Connect & Play</h3>
              <p className="text-gray-600">
                Connect your Web3 wallet and purchase tickets for the current lottery round. Each ticket costs 0.0001
                ETH.
              </p>
            </div>
          </div>

          <div className="flex items-start space-x-4">
            <div className="bg-pink-100 p-2 rounded-full">
              <Clock className="h-6 w-6 text-pink-600" />
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-2">2. Wait for Draw</h3>
              <p className="text-gray-600">
                The lottery automatically draws when either the minimum number of players is reached or the time
                interval has passed.
              </p>
            </div>
          </div>

          <div className="flex items-start space-x-4">
            <div className="bg-yellow-100 p-2 rounded-full">
              <Trophy className="h-6 w-6 text-yellow-600" />
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-2">3. Win & Collect</h3>
              <p className="text-gray-600">
                If you win, the prize is automatically sent to your wallet. The more tickets you buy, the higher your
                chances of winning!
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-gradient-to-r from-primary to-purple-600 text-white p-8 rounded-xl shadow-md">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to Try Your Luck?</h2>
          <p className="text-lg mb-6">
            Join thousands of players in the most transparent lottery system on the blockchain.
          </p>
          <button
            onClick={() => (window.location.href = "/")}
            className="bg-white text-primary px-8 py-3 rounded-lg font-semibold hover:bg-opacity-90 transition-colors"
          >
            Play Now
          </button>
        </div>
      </div>
    </div>
  )
}

