const { getSentimentTrend } = require("./newsService");
const { getPriceChange } = require("./priceService");

const toSentimentPercent = (score) => ((score + 1) / 2) * 100;

const getCorrelationInsight = async (asset = "BTC", range = "1h") => {
  const [trend, price] = await Promise.all([getSentimentTrend(asset, range), getPriceChange(asset, range)]);
  const points = trend.points || [];
  const firstSentiment = points[0]?.sentiment_avg || 0;
  const lastSentiment = points[points.length - 1]?.sentiment_avg || firstSentiment;
  const sentiment_change = Number((toSentimentPercent(lastSentiment) - toSentimentPercent(firstSentiment)).toFixed(2));
  const sentimentDirection = sentiment_change >= 0 ? 1 : -1;
  const priceDirection = price.price_change >= 0 ? 1 : -1;
  const aligned = Math.abs(sentiment_change) >= 2 && Math.abs(price.price_change) >= 0.15 && sentimentDirection === priceDirection;
  const opposed = Math.abs(sentiment_change) >= 2 && Math.abs(price.price_change) >= 0.15 && sentimentDirection !== priceDirection;

  let insight = "Sentiment and price are moving sideways";
  if (aligned) insight = "Positive correlation detected";
  if (opposed) insight = "Negative correlation detected";

  return {
    asset: trend.asset,
    range,
    sentiment_change,
    price_change: price.price_change,
    current_price: price.current_price,
    insight,
    trend: points,
    price_series: price.series
  };
};

module.exports = { getCorrelationInsight };
