import React, { useState } from 'react';
import { Ticket } from 'lucide-react';

interface BuyTicketsProps {
  connected: boolean;
}

const BuyTickets: React.FC<BuyTicketsProps> = ({ connected }) => {
  const [ticketCount, setTicketCount] = useState(1);
  const ticketPrice = 0.01; // ETH

  const handleBuyTickets = () => {
    if (!connected) {
      alert('Please connect your wallet first');
      return;
    }
    // Implement blockchain interaction here
    console.log(`Buying ${ticketCount} tickets`);
  };

  return (
    <section id="buy-tickets" className="py-20 px-4 bg-gray-800/50">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-4xl font-bold text-center mb-12">Buy Tickets</h2>
        
        <div className="max-w-md mx-auto bg-gray-800 p-8 rounded-xl border border-gray-700">
          <div className="flex items-center gap-4 mb-8">
            <Ticket className="w-8 h-8 text-blue-500" />
            <div>
              <h3 className="text-xl font-semibold">Lottery Tickets</h3>
              <p className="text-gray-400">1 Ticket = {ticketPrice} ETH</p>
            </div>
          </div>

          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-400 mb-2">
              Number of Tickets
            </label>
            <div className="flex gap-4">
              <button
                onClick={() => setTicketCount(Math.max(1, ticketCount - 1))}
                className="px-4 py-2 bg-gray-700 rounded-lg"
              >
                -
              </button>
              <input
                type="number"
                value={ticketCount}
                onChange={(e) => setTicketCount(Math.max(1, parseInt(e.target.value) || 1))}
                className="flex-1 bg-gray-700 rounded-lg px-4 text-center"
              />
              <button
                onClick={() => setTicketCount(ticketCount + 1)}
                className="px-4 py-2 bg-gray-700 rounded-lg"
              >
                +
              </button>
            </div>
          </div>

          <div className="mb-6 p-4 bg-gray-700/50 rounded-lg">
            <div className="flex justify-between mb-2">
              <span>Price per ticket</span>
              <span>{ticketPrice} ETH</span>
            </div>
            <div className="flex justify-between font-semibold">
              <span>Total</span>
              <span>{(ticketPrice * ticketCount).toFixed(3)} ETH</span>
            </div>
          </div>

          <button
            onClick={handleBuyTickets}
            disabled={!connected}
            className="w-full py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 rounded-lg font-semibold"
          >
            {connected ? 'Buy Tickets' : 'Connect Wallet to Buy'}
          </button>
        </div>
      </div>
    </section>
  );
};

export default BuyTickets;