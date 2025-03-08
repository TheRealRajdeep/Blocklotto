import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Ticket } from 'lucide-react';
import PageTransition from '../components/PageTransition';

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
    <PageTransition>
      <section className="px-4 pt-32 pb-20">
        <div className="max-w-6xl mx-auto">
          <motion.h2 
            className="text-4xl font-bold text-center mb-12"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            Buy Tickets
          </motion.h2>
          
          <motion.div 
            className="max-w-md mx-auto"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <motion.div 
              className="bg-gray-800 p-8 rounded-xl border border-gray-700"
              whileHover={{ scale: 1.02 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              <div className="flex items-center gap-4 mb-8">
                <motion.div
                  whileHover={{ rotate: 360 }}
                  transition={{ duration: 0.5 }}
                >
                  <Ticket className="w-8 h-8 text-blue-500" />
                </motion.div>
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
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => setTicketCount(Math.max(1, ticketCount - 1))}
                    className="px-4 py-2 bg-gray-700 rounded-lg"
                  >
                    -
                  </motion.button>
                  <input
                    type="number"
                    value={ticketCount}
                    onChange={(e) => setTicketCount(Math.max(1, parseInt(e.target.value) || 1))}
                    className="flex-1 bg-gray-700 rounded-lg px-4 text-center"
                  />
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => setTicketCount(ticketCount + 1)}
                    className="px-4 py-2 bg-gray-700 rounded-lg"
                  >
                    +
                  </motion.button>
                </div>
              </div>

              <motion.div 
                className="mb-6 p-4 bg-gray-700/50 rounded-lg"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 }}
              >
                <div className="flex justify-between mb-2">
                  <span>Price per ticket</span>
                  <span>{ticketPrice} ETH</span>
                </div>
                <div className="flex justify-between font-semibold">
                  <span>Total</span>
                  <span>{(ticketPrice * ticketCount).toFixed(3)} ETH</span>
                </div>
              </motion.div>

              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleBuyTickets}
                disabled={!connected}
                className="w-full py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 rounded-lg font-semibold"
              >
                {connected ? 'Buy Tickets' : 'Connect Wallet to Buy'}
              </motion.button>
            </motion.div>
          </motion.div>
        </div>
      </section>
    </PageTransition>
  );
};

export default BuyTickets;