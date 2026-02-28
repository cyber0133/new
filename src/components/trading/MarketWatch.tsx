import React, { useEffect, useRef } from 'react';
import { useStore } from '../../lib/store';
import { cn } from '../../lib/utils';
interface MarketWatchProps {
  onSelectAsset: (symbol: string) => void;
  selectedAsset: string;
}
export function MarketWatch({
  onSelectAsset,
  selectedAsset
}: MarketWatchProps) {
  const { assets } = useStore();
  const prevPrices = useRef<Record<string, number>>({});
  return (
    <div className="h-full flex flex-col bg-[#161b22] md:border-r border-[#21262d]">
      <div className="py-3 px-4 border-b border-[#21262d] bg-[#161b22]">
        <span className="text-xs font-bold text-[#8b949e] uppercase tracking-wider">
          Market Watch
        </span>
      </div>

      <div className="flex-1 overflow-y-auto overflow-x-auto custom-scrollbar">
        <table className="w-full text-xs min-w-max">
          <thead className="text-[#8b949e] bg-[#161b22] sticky top-0 z-10">
            <tr>
              <th className="text-left py-2 px-3 font-medium">Symbol</th>
              <th className="text-right py-2 px-2 font-medium">Bid</th>
              <th className="text-right py-2 px-2 font-medium">Ask</th>
              <th className="text-right py-2 px-2 font-medium">!</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#21262d]">
            {assets.map((asset) => {
              const prevBid = prevPrices.current[asset.symbol] || asset.bid;
              const bidColor =
              asset.bid > prevBid ?
              'text-[#26a69a]' :
              asset.bid < prevBid ?
              'text-[#ef5350]' :
              'text-[#c9d1d9]';
              prevPrices.current[asset.symbol] = asset.bid;
              return (
                <tr
                  key={asset.symbol}
                  onClick={() => onSelectAsset(asset.symbol)}
                  className={cn(
                    'cursor-pointer hover:bg-[#1c2128] transition-colors',
                    selectedAsset === asset.symbol ?
                    'bg-[#1c2128] border-l-2 border-[#2962ff]' :
                    'border-l-2 border-transparent'
                  )}>

                  <td className="py-2 px-3 font-bold text-white">
                    {asset.symbol}
                  </td>
                  <td
                    className={cn('py-2 px-2 text-right font-mono', bidColor)}>

                    {asset.bid.toFixed(asset.digits)}
                  </td>
                  <td
                    className={cn('py-2 px-2 text-right font-mono', bidColor)}>

                    {asset.ask.toFixed(asset.digits)}
                  </td>
                  <td className="py-2 px-2 text-right font-mono text-[#8b949e] text-[10px]">
                    {(asset.spread / Math.pow(10, asset.digits - 1)).toFixed(1)}
                  </td>
                </tr>);

            })}
          </tbody>
        </table>
      </div>
    </div>);

}