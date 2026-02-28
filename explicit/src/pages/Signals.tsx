import React, { useState } from 'react';
import { useStore } from '../lib/store';
import { Card } from '../components/ui/Card';
import { CheckCircle, TrendingUp, Users, Star, Filter, Zap, Award, X } from 'lucide-react';
import { PaymentModal } from '../components/PaymentModal';

export function SignalsPage() {
  const { signals, executeTrade, account, purchasedSignals, purchaseSignal, user } = useStore();
  const [activeFilter, setActiveFilter] = useState('All');
  const [paymentModal, setPaymentModal] = useState({
    isOpen: false,
    signal: null as any,
    trader: null as any,
    price: 0
  });

  const traders = [
    {
      name: 'AlphaTrader',
      winRate: 87,
      return: 24.5,
      followers: 1240,
      avatar: 'bg-blue-500',
      verified: true,
      totalSignals: 342,
      monthlyAccuracy: 92.4
    },
    {
      name: 'FX_Master',
      winRate: 76,
      return: 18.2,
      followers: 890,
      avatar: 'bg-purple-500',
      verified: true,
      totalSignals: 218,
      monthlyAccuracy: 87.1
    },
    {
      name: 'CryptoKing',
      winRate: 92,
      return: 45.8,
      followers: 3100,
      avatar: 'bg-orange-500',
      verified: true,
      totalSignals: 521,
      monthlyAccuracy: 94.2
    },
    {
      name: 'GoldRush_Pro',
      winRate: 81,
      return: 21.0,
      followers: 650,
      avatar: 'bg-yellow-500',
      verified: false,
      totalSignals: 156,
      monthlyAccuracy: 85.3
    }
  ];

  const handleBuySignal = (signal: any, trader: any, price: number) => {
    setPaymentModal({
      isOpen: true,
      signal,
      trader,
      price
    });
  };

  const handlePaymentComplete = () => {
    if (paymentModal.signal && paymentModal.trader) {
      purchaseSignal(
        `signal_${Date.now()}`,
        paymentModal.trader.name,
        paymentModal.price,
        paymentModal.trader.winRate
      );
      setPaymentModal({ isOpen: false, signal: null, trader: null, price: 0 });
    }
  };

  // Filter logic
  const filteredSignals = signals.filter((s) => {
    if (activeFilter === 'All') return true;
    if (activeFilter === 'Forex')
      return (
        !s.symbol.includes('BTC') &&
        !s.symbol.includes('ETH') &&
        !s.symbol.includes('XAU')
      );
    if (activeFilter === 'Crypto')
      return s.symbol.includes('BTC') || s.symbol.includes('ETH');
    if (activeFilter === 'Commodities') return s.symbol.includes('XAU');
    if (activeFilter === 'Premium') return s.confidence > 85;
    return true;
  });

  return (
    <div className="max-w-7xl mx-auto p-4 md:p-6 space-y-8 pb-20 md:pb-6">
      {/* Hero Section */}
      <div className="relative bg-gradient-to-r from-[#0d1117] via-[#161b22] to-[#0d1117] border border-[#21262d] rounded-lg overflow-hidden p-8">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 right-0 w-96 h-96 bg-[#2962ff] rounded-full blur-3xl" />
        </div>
        <div className="relative z-10 text-center space-y-4">
          <div className="flex items-center justify-center gap-2 mb-2">
            <Zap className="h-6 w-6 text-[#2962ff]" />
            <span className="text-[#2962ff] font-bold text-sm">Premium Signal Marketplace</span>
          </div>
          <h1 className="text-4xl font-bold text-white">Trade Smarter with Expert Signals</h1>
          <p className="text-[#8b949e] max-w-2xl mx-auto">
            Copy verified signals from top-performing traders and execute trades with confidence
          </p>
        </div>
      </div>

      {/* Stats Banner */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-[#161b22] border border-[#21262d] rounded-lg p-4 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs text-[#8b949e] uppercase">Total Signals</span>
            <Zap className="h-4 w-4 text-[#2962ff]" />
          </div>
          <span className="block text-2xl font-bold text-white">{signals.length}</span>
          <span className="text-xs text-[#8b949e]">Available to trade</span>
        </div>
        <div className="bg-[#161b22] border border-[#21262d] rounded-lg p-4 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs text-[#8b949e] uppercase">Active Now</span>
            <Award className="h-4 w-4 text-[#26a69a]" />
          </div>
          <span className="block text-2xl font-bold text-[#26a69a]">12</span>
          <span className="text-xs text-[#8b949e]">Signals in progress</span>
        </div>
        <div className="bg-[#161b22] border border-[#21262d] rounded-lg p-4 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs text-[#8b949e] uppercase">Avg Win Rate</span>
            <TrendingUp className="h-4 w-4 text-[#26a69a]" />
          </div>
          <span className="block text-2xl font-bold text-[#2962ff]">89%</span>
          <span className="text-xs text-[#8b949e]">Success rate</span>
        </div>
        <div className="bg-[#161b22] border border-[#21262d] rounded-lg p-4 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs text-[#8b949e] uppercase">Top Trader</span>
            <Star className="h-4 w-4 text-yellow-500" />
          </div>
          <span className="block text-lg font-bold text-white">CryptoKing</span>
          <span className="text-xs text-yellow-500">92% accuracy</span>
        </div>
      </div>

      {/* Filters */}
      <div className="space-y-4">
        <h3 className="text-sm font-bold text-[#8b949e] uppercase">Filter Signals</h3>
        <div className="flex flex-wrap gap-2">
          {['All', 'Forex', 'Crypto', 'Commodities', 'Premium'].map((filter) => (
            <button
              key={filter}
              onClick={() => setActiveFilter(filter)}
              className={`px-4 py-2 rounded-full border text-sm font-medium transition-all ${
                activeFilter === filter
                  ? 'bg-[#2962ff] text-white border-[#2962ff] shadow-lg shadow-blue-500/20'
                  : 'bg-[#161b22] border-[#21262d] text-[#8b949e] hover:border-[#2962ff] hover:text-white'
              }`}
            >
              {filter}
            </button>
          ))}
        </div>
      </div>

      {/* Signal Performance Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-[#161b22] border border-[#21262d] rounded-lg p-6 space-y-4">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-[#26a69a]/20 rounded-lg">
              <TrendingUp className="h-6 w-6 text-[#26a69a]" />
            </div>
            <div>
              <h3 className="font-bold text-white">Recent Performance</h3>
              <p className="text-xs text-[#8b949e]">Last 24 hours</p>
            </div>
          </div>
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-[#8b949e]">Signal Accuracy</span>
              <span className="font-bold text-[#26a69a]">92.4%</span>
            </div>
            <div className="w-full h-2 bg-[#0d1117] rounded-full overflow-hidden">
              <div className="h-full w-[92.4%] bg-gradient-to-r from-[#26a69a] to-[#2962ff]" />
            </div>
          </div>
        </div>

        <div className="bg-[#161b22] border border-[#21262d] rounded-lg p-6 space-y-4">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-[#2962ff]/20 rounded-lg">
              <Zap className="h-6 w-6 text-[#2962ff]" />
            </div>
            <div>
              <h3 className="font-bold text-white">Profit Potential</h3>
              <p className="text-xs text-[#8b949e]">Average per trade</p>
            </div>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-[#8b949e]">Monthly Return</span>
            <span className="font-bold text-[#26a69a] text-lg">+1,450 pips</span>
          </div>
        </div>
      </div>

      {/* My Purchased Signals Section */}
      {purchasedSignals.length > 0 && (
        <div className="space-y-6">
          <div>
            <h3 className="text-2xl font-bold text-white mb-2">My Signal Subscriptions</h3>
            <p className="text-[#8b949e]">Signals you are subscribed to with real-time performance</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {purchasedSignals.map((signal) => (
              <div
                key={signal.id}
                className="bg-[#161b22] border border-[#21262d] rounded-lg overflow-hidden hover:border-[#26a69a] transition-all"
              >
                <div className="h-2 bg-gradient-to-r from-[#26a69a] to-cyan-500" />
                
                <div className="p-6 space-y-4">
                  <div className="space-y-1">
                    <h4 className="text-lg font-bold text-white">{signal.providerName}</h4>
                    <div className="flex items-center gap-2">
                      <span
                        className={`text-xs font-bold px-2 py-1 rounded-full ${
                          signal.status === 'ACTIVE'
                            ? 'bg-[#26a69a]/20 text-[#26a69a]'
                            : signal.status === 'PENDING_APPROVAL'
                            ? 'bg-yellow-500/20 text-yellow-500'
                            : 'bg-[#8b949e]/20 text-[#8b949e]'
                        }`}
                      >
                        {signal.status === 'PENDING_APPROVAL' ? 'Pending Approval' : signal.status}
                      </span>
                    </div>
                  </div>

                  {signal.status === 'ACTIVE' && (
                    <>
                      <div className="grid grid-cols-2 gap-3">
                        <div className="bg-[#0d1117] p-3 rounded-lg border border-[#21262d] space-y-1">
                          <span className="text-xs text-[#8b949e]">Win Rate</span>
                          <span className="block text-base font-bold text-[#26a69a]">{signal.winRate}%</span>
                        </div>
                        <div className="bg-[#0d1117] p-3 rounded-lg border border-[#21262d] space-y-1">
                          <span className="text-xs text-[#8b949e]">Traded</span>
                          <span className="block text-base font-bold text-white">{signal.tradesFollowed}</span>
                        </div>
                      </div>

                      <div className="bg-[#0d1117] p-3 rounded-lg border border-[#21262d]">
                        <span className="text-xs text-[#8b949e]">Earnings</span>
                        <span className="block text-lg font-bold text-[#26a69a]">${signal.earnings.toFixed(2)}</span>
                      </div>

                      <div className="text-xs text-[#8b949e] text-center py-2">
                        Following this trader's signals in real-time
                      </div>
                    </>
                  )}

                  {signal.status === 'PENDING_APPROVAL' && (
                    <div className="text-center py-4 text-sm text-yellow-500">
                      Waiting for admin approval...
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Signals Grid */}
      <div>
        <h3 className="text-lg font-bold text-white mb-6">Available Signals ({filteredSignals.length})</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredSignals.map((signal, idx) => {
            const trader = traders[idx % traders.length];
            const price = idx % 3 === 0 ? 'FREE' : `$${(Math.random() * 20 + 9).toFixed(2)}`;
            const priceValue = price === 'FREE' ? 0 : parseFloat(price.substring(1));

            return (
              <div
                key={signal.id}
                className="bg-[#161b22] border border-[#21262d] rounded-lg overflow-hidden hover:border-[#2962ff] transition-all group hover:shadow-lg hover:shadow-blue-500/10"
              >
                {/* Top Gradient Bar */}
                <div className="h-1 bg-gradient-to-r from-[#2962ff] to-[#26a69a]" />

                {/* Trader Header */}
                <div className="p-4 border-b border-[#21262d] bg-[#0d1117] space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div
                        className={`w-12 h-12 rounded-full ${trader.avatar} flex items-center justify-center text-white font-bold text-lg shadow-lg`}
                      >
                        {trader.name[0]}
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-white">{trader.name}</span>
                          {trader.verified && <CheckCircle className="h-4 w-4 text-[#2962ff]" />}
                        </div>
                        <p className="text-xs text-[#8b949e]">{trader.totalSignals} signals sent</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-xs text-[#8b949e]">Win Rate</p>
                      <p className="text-lg font-bold text-[#26a69a]">{trader.winRate}%</p>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <div className="bg-[#161b22] p-2 rounded border border-[#21262d]">
                      <p className="text-[#8b949e]">Followers</p>
                      <p className="font-bold text-white">{trader.followers.toLocaleString()}</p>
                    </div>
                    <div className="bg-[#161b22] p-2 rounded border border-[#21262d]">
                      <p className="text-[#8b949e]">Accuracy</p>
                      <p className="font-bold text-[#26a69a]">{trader.monthlyAccuracy}%</p>
                    </div>
                  </div>
                </div>

                {/* Signal Details */}
                <div className="p-6 space-y-4">
                  {/* Symbol and Type */}
                  <div className="flex justify-between items-center">
                    <span className="text-2xl font-bold text-white">{signal.symbol}</span>
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-bold ${
                        signal.type === 'BUY'
                          ? 'bg-[#26a69a]/20 text-[#26a69a]'
                          : 'bg-[#ef5350]/20 text-[#ef5350]'
                      }`}
                    >
                      {signal.type}
                    </span>
                  </div>

                  {/* Price Levels */}
                  <div className="grid grid-cols-3 gap-2">
                    <div className="bg-[#0d1117] p-3 rounded border border-[#21262d] space-y-1">
                      <p className="text-xs text-[#8b949e]">Entry</p>
                      <p className="font-mono font-bold text-white text-sm">{signal.entry}</p>
                    </div>
                    <div className="bg-[#0d1117] p-3 rounded border border-[#21262d] space-y-1">
                      <p className="text-xs text-[#8b949e]">Stop Loss</p>
                      <p className="font-mono font-bold text-[#ef5350] text-sm">{signal.sl}</p>
                    </div>
                    <div className="bg-[#0d1117] p-3 rounded border border-[#21262d] space-y-1">
                      <p className="text-xs text-[#8b949e]">Take Profit</p>
                      <p className="font-mono font-bold text-[#26a69a] text-sm">{signal.tp}</p>
                    </div>
                  </div>

                  {/* Confidence Meter */}
                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-xs text-[#8b949e]">Confidence Level</span>
                      <span className="text-sm font-bold text-white">{signal.confidence}%</span>
                    </div>
                    <div className="w-full h-2 bg-[#0d1117] rounded-full overflow-hidden border border-[#21262d]">
                      <div
                        className={`h-full transition-all ${
                          signal.confidence > 85
                            ? 'bg-[#26a69a]'
                            : signal.confidence > 70
                            ? 'bg-[#2962ff]'
                            : 'bg-yellow-500'
                        }`}
                        style={{ width: `${signal.confidence}%` }}
                      />
                    </div>
                  </div>
                </div>

                {/* Footer */}
                <div className="p-4 border-t border-[#21262d] flex items-center justify-between bg-[#0d1117]">
                  <div>
                    {price === 'FREE' ? (
                      <span className="text-lg font-bold text-[#26a69a]">{price}</span>
                    ) : (
                      <span className="text-lg font-bold text-white">{price}</span>
                    )}
                    {price !== 'FREE' && <p className="text-xs text-[#8b949e]">One-time</p>}
                  </div>
                  <button
                    onClick={() => handleBuySignal(signal, trader, priceValue)}
                    className="px-4 py-2 bg-[#26a69a] hover:bg-teal-600 text-white text-sm font-bold rounded-lg transition-all hover:shadow-lg hover:shadow-teal-500/30"
                  >
                    {price === 'FREE' ? 'Copy Signal' : 'Buy Signal'}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Payment Modal */}
      <PaymentModal
        isOpen={paymentModal.isOpen}
        onClose={() => setPaymentModal({ isOpen: false, signal: null, trader: null, price: 0 })}
        amount={paymentModal.price}
        itemName={
          paymentModal.signal
            ? `${paymentModal.signal.symbol} ${paymentModal.signal.type} Signal from ${paymentModal.trader?.name}`
            : ''
        }
        currentBalance={account.balance}
        onPaymentComplete={handlePaymentComplete}
      />
    </div>
  );
}