import React from 'react';
import { Users, Trophy, Timer, Ticket } from 'lucide-react';

const LotteryStats: React.FC = () => {
  const stats = [
    {
      icon: <Users className="w-8 h-8 text-blue-500" />,
      value: '1,234',
      label: 'Total Players'
    },
    {
      icon: <Trophy className="w-8 h-8 text-yellow-500" />,
      value: '156 ETH',
      label: 'Total Prize Pool'
    },
    {
      icon: <Timer className="w-8 h-8 text-purple-500" />,
      value: '24h 13m',
      label: 'Time Remaining'
    },
    {
      icon: <Ticket className="w-8 h-8 text-green-500" />,
      value: '5,678',
      label: 'Tickets Sold'
    }
  ];

  return (
    <section id="stats" className="py-20 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="grid md:grid-cols-4 gap-8">
          {stats.map((stat, index) => (
            <div key={index} className="bg-gray-800/50 p-6 rounded-xl border border-gray-700">
              <div className="flex items-center gap-4">
                {stat.icon}
                <div>
                  <div className="text-2xl font-bold">{stat.value}</div>
                  <div className="text-gray-400">{stat.label}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default LotteryStats;