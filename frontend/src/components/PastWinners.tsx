import React from 'react';
import { Trophy } from 'lucide-react';

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

  return (
    <section id="winners" className="py-20 px-4">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-4xl font-bold text-center mb-12">Past Winners</h2>
        
        <div className="grid gap-6">
          {winners.map((winner, index) => (
            <div key={index} className="bg-gray-800/50 p-6 rounded-xl border border-gray-700">
              <div className="flex items-center gap-4">
                <Trophy className="w-8 h-8 text-yellow-500" />
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
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default PastWinners;