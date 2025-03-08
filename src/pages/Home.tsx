import React from 'react';
import { motion } from 'framer-motion';
import { Ticket } from 'lucide-react';
import { Link } from 'react-router-dom';
import PageTransition from '../components/PageTransition';
import LotteryStats from '../components/LotteryStats';

interface HomeProps {
  connected: boolean;
}

const Home: React.FC<HomeProps> = ({ connected }) => {
  return (
    <PageTransition>
      <section className="px-4 pt-32 pb-20">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-center"
          >
            <motion.h1 
              className="text-5xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-blue-400 to-purple-500 text-transparent bg-clip-text"
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              transition={{ duration: 0.5 }}
            >
              Decentralized Lottery System
            </motion.h1>
            <motion.p 
              className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
            >
              Join the future of fair and transparent lottery games. Powered by blockchain technology,
              ensuring complete randomness and automatic payouts.
            </motion.p>
            <motion.div 
              className="flex justify-center gap-4"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
            >
              <Link to="/buy-tickets">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="px-8 py-3 bg-purple-600 hover:bg-purple-700 rounded-lg font-semibold flex items-center gap-2"
                >
                  <Ticket size={20} />
                  Buy Tickets
                </motion.button>
              </Link>
            </motion.div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="mt-20"
          >
            <LotteryStats />
          </motion.div>
        </div>
      </section>
    </PageTransition>
  );
};

export default Home;