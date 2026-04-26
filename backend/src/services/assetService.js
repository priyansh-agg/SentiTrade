const ASSETS = {
  BTC: {
    symbol: "BTC",
    query: "bitcoin OR BTC crypto",
    displayName: "Bitcoin",
    tradingViewSymbol: "BINANCE:BTCUSDT",
    coingeckoId: "bitcoin",
    type: "crypto",
    mockBase: 67350
  },
  ETH: {
    symbol: "ETH",
    query: "ethereum OR ETH crypto",
    displayName: "Ethereum",
    tradingViewSymbol: "BINANCE:ETHUSDT",
    coingeckoId: "ethereum",
    type: "crypto",
    mockBase: 3420
  },
  AAPL: {
    symbol: "AAPL",
    query: "Apple stock OR AAPL earnings",
    displayName: "Apple",
    tradingViewSymbol: "NASDAQ:AAPL",
    type: "stock",
    mockBase: 189
  }
};

const normalizeAsset = (asset = "BTC") => {
  const key = String(asset).trim().toUpperCase();
  return ASSETS[key] || ASSETS.BTC;
};

const listAssets = () => Object.values(ASSETS);

module.exports = { ASSETS, normalizeAsset, listAssets };
