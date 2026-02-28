import React, { useState } from 'react';
import { useStore } from '../../lib/store';
import { X, Edit2, Check } from 'lucide-react';
import { cn, formatCurrency, formatDate } from '../../lib/utils';
export function TradeList() {
  const { trades, history, closeTrade, account, modifyTradeSLTP } = useStore();
  const [activeTab, setActiveTab] = useState<'open' | 'history' | 'account'>(
    'open'
  );
  const totalProfit = trades.reduce((sum, t) => sum + t.profit, 0);
  // Editing state
  const [editingTradeId, setEditingTradeId] = useState<string | null>(null);
  const [editingField, setEditingField] = useState<'sl' | 'tp' | null>(null);
  const [editValue, setEditValue] = useState('');
  const startEditing = (
  tradeId: string,
  field: 'sl' | 'tp',
  currentValue: number | null) =>
  {
    setEditingTradeId(tradeId);
    setEditingField(field);
    setEditValue(currentValue ? currentValue.toString() : '');
  };
  const saveEdit = () => {
    if (editingTradeId && editingField) {
      const trade = trades.find((t) => t.id === editingTradeId);
      if (trade) {
        const newVal = editValue ? parseFloat(editValue) : null;
        modifyTradeSLTP(
          editingTradeId,
          editingField === 'sl' ? newVal : trade.sl,
          editingField === 'tp' ? newVal : trade.tp
        );
      }
    }
    setEditingTradeId(null);
    setEditingField(null);
  };
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') saveEdit();
    if (e.key === 'Escape') {
      setEditingTradeId(null);
      setEditingField(null);
    }
  };
  return (
    <div className="flex flex-col h-full bg-[#161b22] border-t border-[#21262d]">
      {/* Tabs */}
      <div className="flex items-center border-b border-[#21262d] bg-[#0d1117]">
        {['open', 'history', 'account'].map((tab) =>
        <button
          key={tab}
          onClick={() => setActiveTab(tab as any)}
          className={cn(
            'px-4 py-2 text-xs font-bold uppercase tracking-wide transition-colors border-r border-[#21262d] min-h-[44px] flex items-center md:py-1.5 md:min-h-auto',
            activeTab === tab ?
            'bg-[#161b22] text-[#2962ff] border-t-2 border-t-[#2962ff]' :
            'text-[#8b949e] hover:text-white hover:bg-[#161b22] border-t-2 border-t-transparent'
          )}>

            {tab === 'open' ? 'Trade' : tab}
          </button>
        )}
      </div>

      {/* Content */}
      <div className="flex-1 overflow-auto custom-scrollbar bg-[#161b22]">
        {activeTab === 'account' ?
        <div className="p-4 grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
          {
            label: 'Balance',
            value: formatCurrency(account.balance)
          },
          {
            label: 'Equity',
            value: formatCurrency(account.equity)
          },
          {
            label: 'Margin',
            value: formatCurrency(account.margin)
          },
          {
            label: 'Free Margin',
            value: formatCurrency(account.freeMargin)
          },
          {
            label: 'Margin Level',
            value: `${account.marginLevel.toFixed(2)}%`
          },
          {
            label: 'Leverage',
            value: `1:${account.leverage}`
          },
          {
            label: 'Type',
            value: account.type
          },
          {
            label: 'Currency',
            value: account.currency
          }].
          map((item) =>
          <div
            key={item.label}
            className="p-3 bg-[#0d1117] border border-[#21262d] rounded">

                <span className="block text-xs text-[#8b949e] mb-1">
                  {item.label}
                </span>
                <span className="block text-lg font-mono text-white font-bold">
                  {item.value}
                </span>
              </div>
          )}
          </div> :

        <>
            {/* Desktop Table View */}
            <table className="w-full text-xs text-left hidden md:table">
              <thead className="text-[#8b949e] bg-[#161b22] sticky top-0 z-10">
                <tr>
                  <th className="px-3 py-1.5 font-medium border-b border-[#21262d]">
                    Time
                  </th>
                  <th className="px-3 py-1.5 font-medium border-b border-[#21262d]">
                    Symbol
                  </th>
                  <th className="px-3 py-1.5 font-medium border-b border-[#21262d]">
                    Type
                  </th>
                  <th className="px-3 py-1.5 font-medium border-b border-[#21262d] text-right">
                    Volume
                  </th>
                  <th className="px-3 py-1.5 font-medium border-b border-[#21262d] text-right">
                    Price
                  </th>
                  {activeTab === 'open' &&
                <th className="px-3 py-1.5 font-medium border-b border-[#21262d] text-right">
                      Current
                    </th>
                }
                  <th className="px-3 py-1.5 font-medium border-b border-[#21262d] text-right">
                    S/L
                  </th>
                  <th className="px-3 py-1.5 font-medium border-b border-[#21262d] text-right">
                    T/P
                  </th>
                  <th className="px-3 py-1.5 font-medium border-b border-[#21262d] text-right">
                    Profit
                  </th>
                  {activeTab === 'open' &&
                <th className="px-3 py-1.5 font-medium border-b border-[#21262d] text-center">
                      X
                    </th>
                }
                </tr>
              </thead>
              <tbody className="divide-y divide-[#21262d]">
                {(activeTab === 'open' ? trades : history).map((trade) =>
              <tr key={trade.id} className="hover:bg-[#1c2128]">
                    <td className="px-3 py-1 text-[#8b949e] whitespace-nowrap">
                      {formatDate(trade.openTime)}
                    </td>
                    <td className="px-3 py-1 font-bold text-white">
                      {trade.symbol}
                    </td>
                    <td
                  className={cn(
                    'px-3 py-1 font-bold',
                    trade.type === 'BUY' ?
                    'text-[#26a69a]' :
                    'text-[#ef5350]'
                  )}>

                      {trade.type}
                    </td>
                    <td className="px-3 py-1 text-right font-mono text-white">
                      {trade.lots.toFixed(2)}
                    </td>
                    <td className="px-3 py-1 text-right font-mono text-[#c9d1d9]">
                      {trade.entryPrice}
                    </td>
                    {activeTab === 'open' &&
                <td className="px-3 py-1 text-right font-mono text-white">
                        {trade.currentPrice}
                      </td>
                }

                    {/* Editable SL */}
                    <td
                  className="px-3 py-1 text-right font-mono text-[#8b949e] cursor-pointer hover:text-white hover:bg-[#21262d]"
                  onClick={() =>
                  activeTab === 'open' &&
                  startEditing(trade.id, 'sl', trade.sl)
                  }>

                      {editingTradeId === trade.id && editingField === 'sl' ?
                  <input
                    autoFocus
                    type="number"
                    className="w-16 bg-[#0d1117] border border-[#2962ff] text-white px-1 py-0.5 text-right outline-none"
                    value={editValue}
                    onChange={(e) => setEditValue(e.target.value)}
                    onBlur={saveEdit}
                    onKeyDown={handleKeyDown} /> :


                  trade.sl || '-'
                  }
                    </td>

                    {/* Editable TP */}
                    <td
                  className="px-3 py-1 text-right font-mono text-[#8b949e] cursor-pointer hover:text-white hover:bg-[#21262d]"
                  onClick={() =>
                  activeTab === 'open' &&
                  startEditing(trade.id, 'tp', trade.tp)
                  }>

                      {editingTradeId === trade.id && editingField === 'tp' ?
                  <input
                    autoFocus
                    type="number"
                    className="w-16 bg-[#0d1117] border border-[#2962ff] text-white px-1 py-0.5 text-right outline-none"
                    value={editValue}
                    onChange={(e) => setEditValue(e.target.value)}
                    onBlur={saveEdit}
                    onKeyDown={handleKeyDown} /> :


                  trade.tp || '-'
                  }
                    </td>

                    <td
                  className={cn(
                    'px-3 py-1 text-right font-mono font-bold',
                    trade.profit >= 0 ? 'text-[#26a69a]' : 'text-[#ef5350]'
                  )}>

                      {formatCurrency(trade.profit)}
                    </td>
                    {activeTab === 'open' &&
                <td className="px-3 py-1 text-center">
                        <button
                    onClick={() => closeTrade(trade.id)}
                    className="w-10 h-10 text-[#8b949e] hover:text-[#ef5350] transition-colors flex items-center justify-center hover:bg-[#21262d] rounded md:w-auto md:h-auto">

                          <X className="h-5 w-5 md:h-3.5 md:w-3.5" />
                        </button>
                      </td>
                }
                  </tr>
              )}
              </tbody>
            </table>

            {/* Mobile Card View */}
            <div className="md:hidden space-y-2 p-2">
              {(activeTab === 'open' ? trades : history).map((trade) =>
            <div
              key={trade.id}
              className="bg-[#0d1117] border border-[#21262d] rounded p-3">

                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-white">
                          {trade.symbol}
                        </span>
                        <span
                      className={cn(
                        'text-xs font-bold px-1.5 py-0.5 rounded',
                        trade.type === 'BUY' ?
                        'bg-[#26a69a]/20 text-[#26a69a]' :
                        'bg-[#ef5350]/20 text-[#ef5350]'
                      )}>

                          {trade.type}
                        </span>
                      </div>
                      <span className="text-xs text-[#8b949e]">
                        {formatDate(trade.openTime)}
                      </span>
                    </div>
                    <div className="text-right">
                      <span
                    className={cn(
                      'block font-mono font-bold',
                      trade.profit >= 0 ?
                      'text-[#26a69a]' :
                      'text-[#ef5350]'
                    )}>

                        {formatCurrency(trade.profit)}
                      </span>
                      <span className="text-xs text-[#8b949e]">
                        {trade.lots} lots
                      </span>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-2 text-xs mb-2">
                    <div className="flex justify-between">
                      <span className="text-[#8b949e]">Entry:</span>
                      <span className="text-white font-mono">
                        {trade.entryPrice}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-[#8b949e]">Current:</span>
                      <span className="text-white font-mono">
                        {trade.currentPrice}
                      </span>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-2 text-xs border-t border-[#21262d] pt-2">
                    <div
                  className="flex justify-between items-center p-1 rounded hover:bg-[#161b22]"
                  onClick={() =>
                  activeTab === 'open' &&
                  startEditing(trade.id, 'sl', trade.sl)
                  }>

                      <span className="text-[#8b949e]">SL:</span>
                      {editingTradeId === trade.id && editingField === 'sl' ?
                  <input
                    autoFocus
                    type="number"
                    className="w-16 bg-[#161b22] border border-[#2962ff] text-white px-1 py-0 text-right text-xs outline-none"
                    value={editValue}
                    onChange={(e) => setEditValue(e.target.value)}
                    onBlur={saveEdit}
                    onKeyDown={handleKeyDown} /> :


                  <span className="text-white font-mono">
                          {trade.sl || '-'}
                        </span>
                  }
                    </div>
                    <div
                  className="flex justify-between items-center p-1 rounded hover:bg-[#161b22]"
                  onClick={() =>
                  activeTab === 'open' &&
                  startEditing(trade.id, 'tp', trade.tp)
                  }>

                      <span className="text-[#8b949e]">TP:</span>
                      {editingTradeId === trade.id && editingField === 'tp' ?
                  <input
                    autoFocus
                    type="number"
                    className="w-16 bg-[#161b22] border border-[#2962ff] text-white px-1 py-0 text-right text-xs outline-none"
                    value={editValue}
                    onChange={(e) => setEditValue(e.target.value)}
                    onBlur={saveEdit}
                    onKeyDown={handleKeyDown} /> :


                  <span className="text-white font-mono">
                          {trade.tp || '-'}
                        </span>
                  }
                    </div>
                  </div>

                  {activeTab === 'open' &&
              <button
                onClick={() => closeTrade(trade.id)}
                className="w-full mt-2 py-2.5 bg-[#21262d] hover:bg-[#ef5350] text-[#8b949e] hover:text-white rounded text-xs font-bold transition-colors flex items-center justify-center gap-1 md:py-1.5">

                      <X className="h-4 w-4 md:h-3 md:w-3" /> Close Trade
                    </button>
              }
                </div>
            )}
            </div>
          </>
        }
      </div>

      {/* Status Bar */}
      <div className="bg-[#0d1117] border-t border-[#21262d] px-3 py-1 flex flex-wrap gap-x-4 gap-y-1 items-center text-xs font-mono text-[#8b949e]">
        <span>
          Balance:{' '}
          <span className="text-white">{formatCurrency(account.balance)}</span>
        </span>
        <span>
          Equity:{' '}
          <span className="text-white font-bold">
            {formatCurrency(account.equity)}
          </span>
        </span>
        <span>
          Margin:{' '}
          <span className="text-white">{formatCurrency(account.margin)}</span>
        </span>
        <span>
          Free:{' '}
          <span className="text-white">
            {formatCurrency(account.freeMargin)}
          </span>
        </span>
        <span>
          Lvl:{' '}
          <span className="text-white">{account.marginLevel.toFixed(2)}%</span>
        </span>
      </div>
    </div>);

}