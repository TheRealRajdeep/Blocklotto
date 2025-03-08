import React, { useState } from 'react';
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import Header from './components/Header';
import Home from './pages/Home';
import HowItWorks from './pages/HowItWorks';
import BuyTickets from './pages/BuyTickets';
import PastWinners from './pages/PastWinners';
import FAQ from './pages/FAQ';

function App() {
  const [connected, setConnected] = useState(false);

  const handleConnect = () => {
    setConnected(true);
  };

  return (
    <BrowserRouter>
      <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800 text-white">
        <Header connected={connected} onConnect={handleConnect} />
        <AnimatedRoutes connected={connected} />
      </div>
    </BrowserRouter>
  );
}

function AnimatedRoutes({ connected }: { connected: boolean }) {
  const location = useLocation();

  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route path="/" element={<Home connected={connected} />} />
        <Route path="/how-it-works" element={<HowItWorks />} />
        <Route path="/buy-tickets" element={<BuyTickets connected={connected} />} />
        <Route path="/winners" element={<PastWinners />} />
        <Route path="/faq" element={<FAQ />} />
      </Routes>
    </AnimatePresence>
  );
}

export default App;