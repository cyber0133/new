import React, { useEffect, useRef } from 'react';

interface ChartProps {
  symbol: string;
}

export function Chart({ symbol }: ChartProps) {
  const container = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!container.current) return;
    const script = document.createElement('script');
    script.src = 'https://s3.tradingview.com/tv.js';
    script.type = 'text/javascript';
    script.async = true;
    script.onload = () => {
      if (typeof window.TradingView !== 'undefined' && container.current) {
        new window.TradingView.widget({
          "autosize": true,
          "symbol": symbol.includes('USD') || symbol.includes('EUR') || symbol.includes('GBP') ? `FX:${symbol}` : symbol,
          "interval": "D",
          "timezone": "Etc/UTC",
          "theme": "dark",
          "style": "1",
          "locale": "en",
          "toolbar_bg": "#f1f3f6",
          "enable_publishing": false,
          "allow_symbol_change": true,
          "container_id": "tradingview_widget",
          "hide_side_toolbar": false,
          "backgroundColor": "rgba(13, 17, 23, 1)",
          "gridColor": "rgba(33, 38, 45, 1)"
        });
      }
    };
    container.current.appendChild(script);
    return () => {
      if (container.current) {
        container.current.innerHTML = '';
      }
    };
  }, [symbol]);

  return (
    <div className="flex flex-col h-48 md:h-full bg-[#0d1117]">
      <div id="tradingview_widget" ref={container} className="flex-1" />
    </div>
  );
}
