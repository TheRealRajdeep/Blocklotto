import React from 'react';
import { motion } from 'framer-motion';
import PageTransition from '../components/PageTransition';

const FAQ: React.FC = () => {
  const faqs = [
    {
      question: "How does the lottery work?",
      answer: "Our decentralized lottery uses blockchain technology to ensure fairness. Tickets are purchased with ETH, and winners are selected using Chainlink VRF for true randomness."
    },
    {
      question: "How are winners selected?",
      answer: "Winners are selected using Chainlink's Verifiable Random Function (VRF), which provides cryptographically proven randomness. This ensures that the selection process is fair and cannot be manipulated."
    },
    {
      question: "How do I claim my winnings?",
      answer: "Winnings are automatically sent to your connected wallet address if you win. There's no need to manually claim them!"
    },
    {
      question: "Is it safe?",
      answer: "Yes! Our smart contracts are audited and the entire process is transparent on the blockchain. You can verify all transactions and outcomes."
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
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 }
  };

  return (
    <PageTransition>
      <section className="px-4 pt-32 pb-20">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-4xl font-bold text-center mb-12">Frequently Asked Questions</h1>
          
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="show"
            className="space-y-6"
          >
            {faqs.map((faq, index) => (
              <motion.div
                key={index}
                variants={itemVariants}
                className="bg-gray-800/50 rounded-lg p-6 hover:bg-gray-800/70 transition-colors"
              >
                <h3 className="text-xl font-semibold mb-3">{faq.question}</h3>
                <p className="text-gray-300">{faq.answer}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>
    </PageTransition>
  );
};

export default FAQ;