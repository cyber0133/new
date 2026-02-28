import React, { useEffect, useState } from 'react';
import { useStore } from '../../lib/store';
import { TradeType } from '../../lib/types';
interface OrderPanelProps {
  symbol: string;
}
export function OrderPanel({ symbol }: OrderPanelProps) {
  const { executeTrade, assets, account } = useStore();
  const [lots, setLots] = useState(0.1);
  const [sl, setSl] = useState('');
  const [tp, setTp] = useState('');
  const asset = assets.find((a) => a.symbol === symbol);
  // Reset inputs when symbol changes
  useEffect(() => {
    setSl('');
    setTp('');
  }, [symbol]);
  if (!asset) return null;
  const handleTrade = (type: TradeType) => {
    executeTrade(
      symbol,
      type,
      lots,
      sl ? parseFloat(sl) : undefined,
      tp ? parseFloat(tp) : undefined
    );
  };
  const marginRequired = asset.bid * lots * 100000 / account.leverage;
  // Helper to calculate price from pips
  const calculatePipPrice = (pips: number, type: 'SL' | 'TP') => {
    // Determine pip size based on digits
    // 5 digits (Forex) -> 0.0001
    // 3 digits (JPY) -> 0.01
    // 2 digits (Crypto/Gold) -> 0.1 (approx for this app's logic)
    let pipSize = 0.0001;
    if (asset.digits === 3) pipSize = 0.01;
    if (asset.digits === 2) pipSize = 0.1; // For XAU/BTC in this specific app context
    // For SL/TP quick buttons, we usually base it on current price
    // But since we don't know if it's BUY or SELL yet, we'll just use the BID price as reference
    // In a real app, this would be dynamic based on selected direction or just fill the offset
    // Here we'll assume a BUY scenario for simplicity of the button logic (SL below, TP above)
    // Or better: just fill the input with the offset value? No, inputs expect price.
    // Let's assume BUY for the calculation reference:
    const basePrice = asset.bid;
    const change = pips * pipSize;
    // If type is SL, we subtract pips (assuming buy). If TP, we add.
    // This is a simplification. Real apps might have "Buy SL" vs "Sell SL".
    // We'll just implement "Distance from current price" logic
    // Actually, let's just make them set the price relative to current Bid
    // SL = Bid - Pips
    // TP = Bid + Pips
    if (type === 'SL') {
      const price = basePrice - change;
      setSl(price.toFixed(asset.digits));
    } else {
      const price = basePrice + change;
      setTp(price.toFixed(asset.digits));
    }
  };
  return (
    <div className="h-full flex flex-col bg-[#161b22] md:border-l border-[#21262d] p-4 overflow-y-auto">
      <div className="mb-6 text-center">
        <h3 className="text-xl font-bold text-white mb-1">{symbol}</h3>
        <span className="text-xs text-[#8b949e] uppercase">
          Spread: {(asset.spread / Math.pow(10, asset.digits - 1)).toFixed(1)}
        </span>
      </div>

      {/* Big Price Display */}
      <div className="flex justify-between items-center mb-6 bg-[#0d1117] p-3 rounded border border-[#21262d]">
        <div className="text-center w-1/2 border-r border-[#21262d]">
          <span className="block text-xs text-[#ef5350] font-bold mb-1">
            SELL
          </span>
          <span className="block text-xl font-mono text-white font-bold">
            {asset.bid.toFixed(asset.digits)}
          </span>
        </div>
        <div className="text-center w-1/2">
          <span className="block text-xs text-[#26a69a] font-bold mb-1">
            BUY
          </span>
          <span className="block text-xl font-mono text-white font-bold">
            {asset.ask.toFixed(asset.digits)}
          </span>
        </div>
      </div>

      {/* Controls */}
      <div className="space-y-4 mb-6">
        <div>
          <label className="block text-xs text-[#8b949e] mb-1.5">Volume</label>
          <div className="flex items-center gap-1">
            <button
              onClick={() =>
              setLots(Math.max(0.01, parseFloat((lots - 0.01).toFixed(2))))
              }
              className="h-10 px-3 bg-[#21262d] text-white hover:bg-[#30363d] rounded-l flex items-center justify-center md:h-9 md:w-10">

              -
            </button>
            <input
              type="number"
              value={lots}
              onChange={(e) => setLots(parseFloat(e.target.value))}
              className="flex-1 h-10 bg-[#0d1117] border-y border-[#21262d] text-center text-white font-mono text-sm focus:outline-none md:h-9"
              step="0.01" />

            <button
              onClick={() => setLots(parseFloat((lots + 0.01).toFixed(2)))}
              className="h-10 px-3 bg-[#21262d] text-white hover:bg-[#30363d] rounded-r flex items-center justify-center md:h-9 md:w-10">

              +
            </button>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-xs text-[#8b949e] mb-1.5">
              Stop Loss
            </label>
            <input
              type="number"
              value={sl}
              onChange={(e) => setSl(e.target.value)}
              placeholder="0.0000"
              className="w-full h-10 bg-[#0d1117] border border-[#21262d] rounded px-3 text-white font-mono text-sm focus:border-[#2962ff] focus:outline-none md:h-9" />

            <div className="flex gap-1 mt-1.5">
              {[10, 20, 50].map((pips) =>
              <button
                key={pips}
                onClick={() => calculatePipPrice(pips, 'SL')}
                className="flex-1 py-2 text-xs bg-[#21262d] text-[#8b949e] hover:text-white hover:bg-[#30363d] rounded min-h-[40px] md:py-1 md:text-[10px] md:min-h-auto">

                  -{pips}p
                </button>
              )}
            </div>
          </div>
          <div>
            <label className="block text-xs text-[#8b949e] mb-1.5">
              Take Profit
            </label>
            <input
              type="number"
              value={tp}
              onChange={(e) => setTp(e.target.value)}
              placeholder="0.0000"
              className="w-full h-10 bg-[#0d1117] border border-[#21262d] rounded px-3 text-white font-mono text-sm focus:border-[#2962ff] focus:outline-none md:h-9" />

            <div className="flex gap-1 mt-1.5">
              {[10, 20, 50].map((pips) =>
              <button
                key={pips}
                onClick={() => calculatePipPrice(pips, 'TP')}
                className="flex-1 py-2 text-xs bg-[#21262d] text-[#8b949e] hover:text-white hover:bg-[#30363d] rounded min-h-[40px] md:py-1 md:text-[10px] md:min-h-auto">

                  +{pips}p
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="grid grid-cols-2 gap-3 mb-4">
        <button
          onClick={() => handleTrade('SELL')}
          className="h-14 bg-[#ef5350] hover:bg-red-600 text-white rounded flex flex-col items-center justify-center transition-colors md:h-12">

          <span className="text-xs font-bold">SELL</span>
          <span className="text-sm font-mono font-bold">
            {asset.bid.toFixed(asset.digits)}
          </span>
        </button>
        <button
          onClick={() => handleTrade('BUY')}
          className="h-14 bg-[#26a69a] hover:bg-teal-600 text-white rounded flex flex-col items-center justify-center transition-colors md:h-12">

          <span className="text-xs font-bold">BUY</span>
          <span className="text-sm font-mono font-bold">
            {asset.ask.toFixed(asset.digits)}
          </span>
        </button>
      </div>

      <div className="mt-auto pt-4 border-t border-[#21262d] text-center">
        <p className="text-xs text-[#8b949e]">
          Margin Required:{' '}
          <span className="text-white font-mono">
            ${marginRequired.toFixed(2)}
          </span>
        </p>
      </div>
    </div>);

}