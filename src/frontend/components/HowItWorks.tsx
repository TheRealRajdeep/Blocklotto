import React from 'react';
import { Ticket, Trophy, ArrowRight, Wallet } from 'lucide-react';

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

  return (
    <section id="how-it-works" className="py-20 px-4 bg-gray-800/50">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-4xl font-bold text-center mb-12">How It Works</h2>
        
        <div className="grid md:grid-cols-3 gap-8">
          {steps.map((step, index) => (
            <div key={index} className="relative">
              <div className="bg-gray-800 p-8 rounded-xl border border-gray-700 hover:border-blue-500 transition-all">
                <div className="mb-6">{step.icon}</div>
                <h3 className="text-xl font-semibold mb-4">{step.title}</h3>
                <p className="text-gray-400">{step.description}</p>
              </div>
              {index < steps.length - 1 && (
                <div className="hidden md:block absolute top-1/2 -right-4 transform -translate-y-1/2">
                  <ArrowRight className="w-8 h-8 text-gray-600" />
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;