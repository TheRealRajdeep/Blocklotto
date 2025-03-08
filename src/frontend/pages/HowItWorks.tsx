import React from 'react';
import { motion } from 'framer-motion';
import { Ticket, Trophy, ArrowRight, Wallet } from 'lucide-react';
import PageTransition from '../components/PageTransition';

const HowItWorks: React.FC = () => {
  const steps = [
    {
      icon: <Wallet className="w-12 h-12 text-blue-500" />,
      title: 'Connect Wallet',
      description: 'Connect your Web3 wallet to participate in the lottery'
    },
    {
      icon: <Ticket className="w-12 h-12 text-purple-500" />,
      title: 'Buy Tickets',
      description: 'Purchase tickets using ETH. Each ticket has a unique number'
    },
    {
      icon: <Trophy className="w-12 h-12 text-yellow-500" />,
      title: 'Win Prizes',
      description: 'Winners are selected randomly using Chainlink VRF'
    }
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 }
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
            How It Works
          </motion.h2>
          
          <motion.div 
            className="grid md:grid-cols-3 gap-8"
            variants={containerVariants}
            initial="hidden"
            animate="show"
          >
            {steps.map((step, index) => (
              <motion.div 
                key={index} 
                className="relative"
                variants={itemVariants}
              >
                <motion.div 
                  className="bg-gray-800 p-8 rounded-xl border border-gray-700 hover:border-blue-500 transition-all"
                  whileHover={{ y: -5 }}
                >
                  <motion.div 
                    className="mb-6"
                    whileHover={{ rotate: 360, scale: 1.1 }}
                    transition={{ duration: 0.5 }}
                  >
                    {step.icon}
                  </motion.div>
                  <h3 className="text-xl font-semibold mb-4">{step.title}</h3>
                  <p className="text-gray-400">{step.description}</p>
                </motion.div>
                {index < steps.length - 1 && (
                  <div className="hidden md:block absolute top-1/2 -right-4 transform -translate-y-1/2">
                    <ArrowRight className="w-8 h-8 text-gray-600" />
                  </div>
                )}
              </motion.div>
            ))}
          </motion.div>

          <motion.div 
            className="mt-20 text-center"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
          >
            <p className="text-xl text-gray-300 mb-8">
              Our smart contracts are audited and the entire process is transparent on the blockchain.
              You can verify all transactions and outcomes.
            </p>
          </motion.div>
        </div>
      </section>
    </PageTransition>
  );
};

export default HowItWorks;