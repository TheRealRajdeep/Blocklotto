import React from 'react';
import { motion } from 'framer-motion';
import { Trophy } from 'lucide-react';
import PageTransition from '../components/PageTransition';

const PastWinners: React.FC = () => {
  const winners = [
    {
      address: '0x1234...5678',
      prize: '45.5 ETH',
      date: '2024-03-15',
      ticketNumber: '#12345'
    },
    {
      address: '0x8765...4321',
      prize: '38.2 ETH',
      date: '2024-03-08',
      ticketNumber: '#54321'
    },
    {
      address: '0x9876...1234',
      prize: '42.1 ETH',
      date: '2024-03-01',
      ticketNumber: '#98765'
    }
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, x: -20 },
    show: { opacity: 1, x: 0 }
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
            Past Winners
          </motion.h2>
          
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="show"
            className="grid gap-6"
          >
            {winners.map((winner, index) => (
              <motion.div
                key={index}
                variants={itemVariants}
                whileHover={{ scale: 1.02 }}
                className="bg-gray-800/50 p-6 rounded-xl border border-gray-700 hover:border-yellow-500 transition-colors"
              >
                <div className="flex items-center gap-4">
                  <motion.div
                    whileHover={{ rotate: 360 }}
                    transition={{ duration: 0.5 }}
                  >
                    <Trophy className="w-8 h-8 text-yellow-500" />
                  </motion.div>
                  <div className="flex-1">
                    <div className="flex justify-between items-center mb-2">
                      <span className="font-semibold">{winner.address}</span>
                      <span className="text-yellow-500 font-bold">{winner.prize}</span>
                    </div>
                    <div className="flex justify-between text-sm text-gray-400">
                      <span>Ticket {winner.ticketNumber}</span>
                      <span>{winner.date}</span>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>
    </PageTransition>
  );
};

export default PastWinners;