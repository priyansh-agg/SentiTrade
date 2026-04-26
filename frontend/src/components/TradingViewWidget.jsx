import Card from "./Card.jsx";

const symbolMap = {
  BTC: "BINANCE:BTCUSDT",
  ETH: "BINANCE:ETHUSDT",
  AAPL: "NASDAQ:AAPL"
};

const TradingViewWidget = ({ asset = "BTC" }) => {
  const widgetConfig = {
    autosize: true,
    symbol: symbolMap[asset] || symbolMap.BTC,
    interval: "15",
    timezone: "Etc/UTC",
    theme: "dark",
    style: "1",
    locale: "en",
    allow_symbol_change: true,
    calendar: false,
    support_host: "https://www.tradingview.com",
    hide_side_toolbar: false,
    withdateranges: true
  };

  const src = `https://www.tradingview-widget.com/embed-widget/advanced-chart/?locale=en#${encodeURIComponent(
    JSON.stringify(widgetConfig)
  )}`;

  return (
    <Card className="h-[560px] overflow-hidden p-2 lg:h-[690px]">
      <iframe
        key={asset}
        title={`${asset} TradingView chart`}
        src={src}
        className="h-full w-full rounded-md border-0"
        allowFullScreen
      />
    </Card>
  );
};

export default TradingViewWidget;
