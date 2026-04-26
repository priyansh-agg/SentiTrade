const { analyzeHeadline } = require("./sentimentService");

const headlineBank = {
  BTC: [
    ["Bitcoin spot ETF inflows accelerate as institutional demand improves", "CoinDesk", 14],
    ["Analysts warn crypto traders remain cautious before inflation data", "Reuters", 11],
    ["Bitcoin miners rally after network fees rebound", "The Block", 8],
    ["Digital asset funds see strongest weekly demand in two months", "Bloomberg", 5],
    ["Crypto market pauses as investors weigh rate outlook", "MarketWatch", 2],
    ["Bitcoin volatility climbs after derivatives liquidations", "CryptoBriefing", 1]
  ],
  ETH: [
    ["Ethereum staking activity rises as layer two usage expands", "CoinTelegraph", 13],
    ["Developers highlight Ethereum scaling progress after network upgrade", "Decrypt", 10],
    ["Ether traders stay neutral ahead of macro data", "Reuters", 7],
    ["Ethereum ecosystem funding improves despite choppy market", "The Block", 4],
    ["Gas fees edge higher as on-chain demand returns", "CoinDesk", 2],
    ["Ether slips as risk appetite cools across crypto markets", "MarketWatch", 1]
  ],
  AAPL: [
    ["Apple shares gain as services revenue outlook strengthens", "CNBC", 16],
    ["Analysts stay mixed on Apple hardware cycle before earnings", "Reuters", 12],
    ["Apple expands AI features across devices to boost upgrade demand", "Bloomberg", 9],
    ["Investors watch iPhone demand signals as Apple stock consolidates", "MarketWatch", 6],
    ["Supply chain checks show stable Apple component orders", "Barron's", 3],
    ["Apple faces pressure from cautious consumer spending", "The Wall Street Journal", 1]
  ]
};

const makeMockNews = (assetConfig, limit = 12) => {
  const rows = headlineBank[assetConfig.symbol] || headlineBank.BTC;
  const now = Date.now();
  const repeated = Array.from({ length: Math.ceil(limit / rows.length) }, () => rows).flat();

  return repeated.slice(0, limit).map(([text, source, minutesAgo], index) => {
    const sentiment = analyzeHeadline(text);

    return {
      _id: `mock-${assetConfig.symbol}-${index}`,
      text,
      source,
      asset: assetConfig.symbol,
      timestamp: new Date(now - minutesAgo * 60 * 1000).toISOString(),
      ...sentiment
    };
  });
};

const makeMockTrend = (assetConfig, minutes = 60) => {
  const now = Date.now();
  const points = [];
  const symbolBias = assetConfig.symbol === "AAPL" ? 0.08 : assetConfig.symbol === "ETH" ? 0.03 : 0.05;

  for (let index = minutes - 1; index >= 0; index -= 1) {
    const wave = Math.sin((minutes - index) / 5) * 0.22;
    const micro = Math.cos((minutes - index) / 3) * 0.09;
    const sentiment_avg = Number((symbolBias + wave + micro).toFixed(4));
    const timestamp = new Date(now - index * 60 * 1000).toISOString();

    points.push({
      timestamp,
      sentiment_avg,
      sentiment_percent: Math.round(((sentiment_avg + 1) / 2) * 100),
      count: 3 + ((minutes - index) % 4)
    });
  }

  return points;
};

const makeMockPriceSeries = (assetConfig, minutes = 60) => {
  const now = Date.now();
  const series = [];

  for (let index = minutes - 1; index >= 0; index -= 1) {
    const step = minutes - index;
    const move = Math.sin(step / 6) * 0.018 + Math.cos(step / 11) * 0.011 + step * 0.00012;
    const price = Number((assetConfig.mockBase * (1 + move)).toFixed(assetConfig.type === "stock" ? 2 : 2));

    series.push({
      timestamp: new Date(now - index * 60 * 1000).toISOString(),
      price
    });
  }

  return series;
};

module.exports = { makeMockNews, makeMockTrend, makeMockPriceSeries };
