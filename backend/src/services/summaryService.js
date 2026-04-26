const createMarketSummary = ({ sentiment, correlation }) => {
  const label = sentiment.sentiment_label;
  const score = sentiment.score_percent;
  const priceMove = correlation.price_change;
  const direction = priceMove >= 0 ? "higher" : "lower";

  if (label === "positive" && priceMove >= 0) {
    return `${sentiment.asset} headlines are constructive at ${score}% sentiment while price trades ${direction}, reinforcing bullish momentum.`;
  }

  if (label === "negative" && priceMove < 0) {
    return `${sentiment.asset} sentiment is weak and price is following ${direction}, suggesting risk-off pressure is still active.`;
  }

  if (label === "positive" && priceMove < 0) {
    return `${sentiment.asset} news tone is improving, but price is still lagging. Watch for a delayed reversal or failed follow-through.`;
  }

  return `${sentiment.asset} sentiment is ${label} with muted price confirmation, so the market signal is mixed rather than decisive.`;
};

module.exports = { createMarketSummary };
