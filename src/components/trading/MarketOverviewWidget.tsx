import React, { useState, useMemo, useEffect } from 'react';
import { useStore } from '../../lib/store';
import { TrendingUp, TrendingDown, RefreshCw } from 'lucide-react';

export function MarketOverviewWidget() {
  const { assets } = useStore();
  const [selectedCategory, setSelectedCategory] = useState<'forex' | 'crypto' | 'commodities' | 'indices'>('forex');
  const [sortBy, setSortBy] = useState<'change' | 'symbol'>('symbol');
  const [hoveredRow, setHoveredRow] = useState<string | null>(null);

  const categories = {
    forex: [
      'EURUSD', 'GBPUSD', 'USDJPY', 'USDCHF', 'AUDUSD', 'USDCAD', 'NZDUSD', 'EURGBP', 
      'EURJPY', 'GBPJPY', 'AUDJPY', 'EURAUD', 'AUDCAD', 'AUDCHF', 'AUDNZD', 'CADCHF',
      'CADJPY', 'CHFJPY'
    ],
    crypto: [
      'BTCUSD', 'ETHUSD', 'BNBUSD', 'SOLUSD', 'ADAUSD', 'XRPUSD', 'DOGEUSD', 'AVAXUSD',
      'MATICUSD', 'LINKUSD', 'UNIUSD', 'LTCUSD', 'BCHUSD', 'ATOMUSD', 'LTCETH', 'BTCEUR',
      'BTCGBP', 'AAVEUSD', 'ADAETH', 'ALGOUSD', 'BATUSD', 'EOSUSD', 'ETCUSD', 'FILUSD'
    ],
    commodities: [
      'XAUUSD', 'XAGUSD', 'USOIL', 'UKOIL', 'NGAS', 'COPPER', 'XPTUSD', 'XPDUSD'
    ],
    indices: ['SPX500', 'NAS100', 'US30', 'GER40', 'UK100', 'JPN225']
  };

  const displayAssets = useMemo(() => {
    const symbols = categories[selectedCategory];
    let filtered = assets.filter(a => symbols.includes(a.symbol));
    
    if (sortBy === 'symbol') {
      filtered.sort((a, b) => symbols.indexOf(a.symbol) - symbols.indexOf(b.symbol));
    } else if (sortBy === 'change') {
      filtered.sort((a, b) => Math.abs(b.change) - Math.abs(a.change));
    }
    
    return filtered;
  }, [selectedCategory, assets, sortBy]);

  return (
    <div className="bg-[#0d1117] rounded-lg overflow-hidden flex flex-col h-full">
      {/* Header */}
      <div className="px-6 py-4 border-b border-[#21262d] space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold text-white">Live Market Prices</h2>
          <div className="flex items-center gap-2">
            <RefreshCw className="h-4 w-4 text-[#8b949e] animate-spin" />
            <span className="text-xs text-[#26a69a]">Real-time Updates</span>
          </div>
        </div>
        
        {/* Category Filter */}
        <div className="flex gap-2 overflow-x-auto no-scrollbar">
          {(['forex', 'crypto', 'commodities', 'indices'] as const).map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-4 py-2 rounded font-bold text-sm whitespace-nowrap transition-all ${
                selectedCategory === cat
                  ? 'bg-[#2962ff] text-white shadow-lg'
                  : 'bg-[#161b22] text-[#8b949e] border border-[#21262d] hover:text-white'
              }`}
            >
              {cat.charAt(0).toUpperCase() + cat.slice(1)} ({categories[cat].length})
            </button>
          ))}
        </div>

        {/* Sort Options */}
        <div className="flex gap-2">
          <button
            onClick={() => setSortBy('symbol')}
            className={`px-3 py-1 text-xs rounded font-bold transition-all ${
              sortBy === 'symbol'
                ? 'bg-[#26a69a] text-white'
                : 'bg-[#161b22] text-[#8b949e] border border-[#21262d] hover:text-white'
            }`}
          >
            By Symbol
          </button>
          <button
            onClick={() => setSortBy('change')}
            className={`px-3 py-1 text-xs rounded font-bold transition-all ${
              sortBy === 'change'
                ? 'bg-[#26a69a] text-white'
                : 'bg-[#161b22] text-[#8b949e] border border-[#21262d] hover:text-white'
            }`}
          >
            By Change
          </button>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto flex-1">
        <table className="w-full text-sm min-w-[700px]">
          <thead className="sticky top-0 text-[#8b949e] text-xs uppercase border-b border-[#21262d] bg-[#161b22]">
            <tr>
              <th className="text-left px-6 py-3 font-bold">Pair</th>
              <th className="text-right px-4 py-3 font-bold">Bid</th>
              <th className="text-right px-4 py-3 font-bold">Ask</th>
              <th className="text-right px-4 py-3 font-bold">Spread</th>
              <th className="text-right px-4 py-3 font-bold">24h Change</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#21262d]">
            {displayAssets.length > 0 ? (
              displayAssets.map((asset) => {
                const changeColor = asset.change >= 0 ? 'text-[#26a69a]' : 'text-[#ef5350]';
                const bgHover = hoveredRow === asset.symbol ? 'bg-[#1c2128]' : '';
                
                return (
                  <tr 
                    key={asset.symbol} 
                    className={`border-b border-[#21262d] transition-colors cursor-pointer ${bgHover}`}
                    onMouseEnter={() => setHoveredRow(asset.symbol)}
                    onMouseLeave={() => setHoveredRow(null)}
                  >
                    <td className="px-6 py-4 text-white font-bold">{asset.symbol}</td>
                    <td className="px-4 py-4 text-right font-mono text-white">
                      {asset.bid.toFixed(asset.digits)}
                    </td>
                    <td className="px-4 py-4 text-right font-mono text-white">
                      {asset.ask.toFixed(asset.digits)}
                    </td>
                    <td className="px-4 py-4 text-right font-mono text-[#8b949e] text-xs">
                      {(asset.spread * Math.pow(10, -asset.digits)).toFixed(asset.digits)}
                    </td>
                    <td className={`px-4 py-4 text-right font-bold flex items-center justify-end gap-2 ${changeColor}`}>
                      {asset.change >= 0 ? (
                        <TrendingUp className="h-4 w-4" />
                      ) : (
                        <TrendingDown className="h-4 w-4" />
                      )}
                      <span className="font-mono">{Math.abs(asset.change).toFixed(2)}%</span>
                    </td>
                  </tr>
                );
              })
            ) : (
              <tr>
                <td colSpan={5} className="px-6 py-8 text-center text-[#8b949e]">
                  Loading market data...
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Footer */}
      <div className="px-6 py-3 border-t border-[#21262d] bg-[#161b22] flex items-center justify-between text-xs text-[#8b949e]">
        <span>Showing {displayAssets.length} of {categories[selectedCategory].length} pairs</span>
        <span>Updates every second</span>
      </div>
    </div>
  );
}
