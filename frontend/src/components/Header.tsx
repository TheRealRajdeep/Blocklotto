"use client"
import { Link } from "react-router-dom"
import { Ticket, Home, User, Info } from "lucide-react"
import { useWallet } from "../hooks/useWallet"

export function Header() {
  const { account, balance, connectWallet, disconnectWallet } = useWallet()

  return (
    <header className="bg-white shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          <div className="flex items-center space-x-8">
            <Link to="/" className="flex items-center space-x-2 text-primary font-bold text-xl">
              <Ticket className="h-6 w-6" />
              <span>BlockLotto</span>
            </Link>

            <nav className="hidden md:flex space-x-4">
              <Link to="/" className="flex items-center space-x-1 text-gray-700 hover:text-primary">
                <Home className="h-4 w-4" />
                <span>Home</span>
              </Link>
              <Link to="/dashboard" className="flex items-center space-x-1 text-gray-700 hover:text-primary">
                <User className="h-4 w-4" />
                <span>Dashboard</span>
              </Link>
              <Link to="/about" className="flex items-center space-x-1 text-gray-700 hover:text-primary">
                <Info className="h-4 w-4" />
                <span>About</span>
              </Link>
            </nav>
          </div>

          <div className="flex items-center space-x-4">
            {account ? (
              <div className="flex items-center space-x-4">
                <div className="text-sm text-gray-600">
                  <div>
                    {account.slice(0, 6)}...{account.slice(-4)}
                  </div>
                  <div>{Number.parseFloat(balance).toFixed(4)} ETH</div>
                </div>
                <button
                  onClick={disconnectWallet}
                  className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition-colors"
                >
                  Disconnect
                </button>
              </div>
            ) : (
              <button
                onClick={connectWallet}
                className="bg-indigo-600 text-white px-6 py-2 rounded-lg hover:bg-indigo-700 transition-colors"
              >
                Connect Wallet
              </button>
            )}
          </div>
        </div>
      </div>
    </header>
  )
}

