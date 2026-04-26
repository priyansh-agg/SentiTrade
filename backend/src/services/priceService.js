const axios = require("axios");
const { normalizeAsset } = require("./assetService");
const { makeMockPriceSeries } = require("./mockDataService");
const { toMinutes } = require("./newsService");

const priceCache = new Map();

const fetchCryptoSeries = async (assetConfig, range) => {
  const minutes = toMinutes(range);
  const days = range === "24h" ? 1 : 1;
  const url = `https://api.coingecko.com/api/v3/coins/${assetConfig.coingeckoId}/market_chart`;

  const response = await axios.get(url, {
    timeout: 8000,
    params: {
      vs_currency: "usd",
      days
    }
  });

  const prices = response.data?.prices || [];
  const since = Date.now() - minutes * 60 * 1000;

  return prices
    .filter(([timestamp]) => timestamp >= since)
    .map(([timestamp, price]) => ({
      timestamp: new Date(timestamp).toISOString(),
      price: Number(price.toFixed(2))
    }));
};

const getPriceSeries = async (asset = "BTC", range = "1h") => {
  const assetConfig = normalizeAsset(asset);
  const minutes = toMinutes(range);
  const livePricesEnabled = process.env.ENABLE_LIVE_PRICE_API === "true";
  const cacheKey = `${assetConfig.symbol}:${range}`;
  const cached = priceCache.get(cacheKey);

  if (cached && Date.now() - cached.timestamp < 60000) {
    return cached.series;
  }

  if (livePricesEnabled && assetConfig.type === "crypto" && assetConfig.coingeckoId) {
    try {
      const series = await fetchCryptoSeries(assetConfig, range);
      if (series.length >= 2) {
        priceCache.set(cacheKey, { timestamp: Date.now(), series });
        return series;
      }
    } catch (error) {
      console.warn(`Price API unavailable for ${assetConfig.symbol}; using mock series.`);
    }
  }

  const fallback = makeMockPriceSeries(assetConfig, Math.min(minutes, 240));
  priceCache.set(cacheKey, { timestamp: Date.now(), series: fallback });

  return fallback;
};

const getPriceChange = async (asset = "BTC", range = "1h") => {
  const series = await getPriceSeries(asset, range);
  const first = series[0]?.price || 0;
  const last = series[series.length - 1]?.price || first;
  const change = first ? ((last - first) / first) * 100 : 0;

  return {
    series,
    current_price: last,
    price_change: Number(change.toFixed(2))
  };
};

module.exports = { getPriceSeries, getPriceChange };
