import React from 'react';
import { Trophy, Wallet } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';

interface HeaderProps {
  connected: boolean;
  onConnect: () => void;
}

const Header: React.FC<HeaderProps> = ({ connected, onConnect }) => {
  const location = useLocation();

  const navItems = [
    { path: '/how-it-works', label: 'How it Works' },
    { path: '/buy-tickets', label: 'Buy Tickets' },
    { path: '/winners', label: 'Past Winners' },
    { path: '/faq', label: 'FAQ' }
  ];

  return (
    <motion.header 
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      className="bg-gray-900/50 backdrop-blur-sm fixed w-full z-50"
    >
      <div className="max-w-6xl mx-auto px-4 py-4 flex justify-between items-center">
        <Link to="/" className="flex items-center gap-2 group">
          <motion.div
            whileHover={{ rotate: 360 }}
            transition={{ duration: 0.5 }}
          >
            <Trophy className="w-8 h-8 text-blue-500" />
          </motion.div>
          <span className="text-xl font-bold group-hover:text-blue-400 transition-colors">
            BlockLotto
          </span>
        </Link>
        
        <nav className="hidden md:flex items-center gap-8">
          {navItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className="relative"
            >
              <span className={`text-gray-300 hover:text-white transition-colors ${
                location.pathname === item.path ? 'text-white' : ''
              }`}>
                {item.label}
              </span>
              {location.pathname === item.path && (
                <motion.div
                  layoutId="underline"
                  className="absolute left-0 right-0 h-0.5 bg-blue-500"
                  initial={false}
                />
              )}
            </Link>
          ))}
        </nav>

        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={onConnect}
          className="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg flex items-center gap-2"
        >
          <Wallet size={18} />
          {connected ? 'Connected' : 'Connect Wallet'}
        </motion.button>
      </div>
    </motion.header>
  );
};

export default Header;