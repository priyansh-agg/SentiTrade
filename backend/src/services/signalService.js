const getHeadlineStats = (items = []) => {
  const total = items.length;
  const counts = items.reduce(
    (acc, item) => {
      acc[item.sentiment_label] = (acc[item.sentiment_label] || 0) + 1;
      return acc;
    },
    { positive: 0, neutral: 0, negative: 0 }
  );

  return {
    total,
    positiveRatio: total ? Math.round((counts.positive / total) * 100) : 0,
    negativeRatio: total ? Math.round((counts.negative / total) * 100) : 0
  };
};

const pushReason = (reasons, condition, text) => {
  if (condition) reasons.push(text);
};

const getSignalTone = (signal) => {
  if (signal === "BUY") return "bullish";
  if (signal === "SELL") return "bearish";
  return "neutral";
};

const generateTradeSignal = ({ sentiment, correlation }) => {
  const stats = getHeadlineStats(sentiment?.items || []);
  const sentimentPercent = sentiment?.score_percent || 50;
  const sentimentChange = correlation?.sentiment_change || 0;
  const priceChange = correlation?.price_change || 0;
  const reasons = [];
  let score = 0;

  if (sentimentPercent >= 62) score += 2;
  else if (sentimentPercent >= 55) score += 1;
  else if (sentimentPercent <= 38) score -= 2;
  else if (sentimentPercent <= 45) score -= 1;

  if (stats.positiveRatio >= 65) score += 2;
  else if (stats.positiveRatio >= 55) score += 1;

  if (stats.negativeRatio >= 60) score -= 2;
  else if (stats.negativeRatio >= 45) score -= 1;

  if (sentimentChange >= 8) score += 2;
  else if (sentimentChange >= 3) score += 1;
  else if (sentimentChange <= -8) score -= 2;
  else if (sentimentChange <= -3) score -= 1;

  if (priceChange >= 0.75) score += 1;
  else if (priceChange <= -0.75) score -= 1;

  if (correlation?.insight === "Positive correlation detected") {
    if (sentimentChange > 0 && priceChange > 0) score += 2;
    if (sentimentChange < 0 && priceChange < 0) score -= 2;
  }

  let signal = "HOLD";
  if (score >= 4) signal = "BUY";
  if (score <= -4) signal = "SELL";

  const conflictPenalty =
    (signal === "BUY" && sentimentPercent <= 50) || (signal === "SELL" && sentimentPercent >= 50) ? 10 : 0;
  const confidence = Math.round(
    Math.min(92, Math.max(45, 45 + Math.abs(score) * 7 + Math.min(stats.total, 20) * 0.6 - conflictPenalty))
  );

  pushReason(reasons, sentimentPercent >= 55, `Overall sentiment is constructive at ${sentimentPercent}%.`);
  pushReason(reasons, sentimentPercent <= 45, `Overall sentiment is weak at ${sentimentPercent}%.`);
  pushReason(reasons, stats.positiveRatio >= 55, `${stats.positiveRatio}% of recent headlines are positive.`);
  pushReason(reasons, stats.negativeRatio >= 45, `${stats.negativeRatio}% of recent headlines are negative.`);
  pushReason(reasons, sentimentChange >= 3, `Sentiment momentum improved by ${sentimentChange} points.`);
  pushReason(reasons, sentimentChange <= -3, `Sentiment momentum fell by ${Math.abs(sentimentChange)} points.`);
  pushReason(reasons, priceChange >= 0.75, `Price is up ${priceChange}% in the selected window.`);
  pushReason(reasons, priceChange <= -0.75, `Price is down ${Math.abs(priceChange)}% in the selected window.`);
  pushReason(reasons, signal === "HOLD", "Signals are mixed or not strong enough, so waiting is safer.");

  return {
    signal,
    tone: getSignalTone(signal),
    confidence,
    score,
    reasons: reasons.slice(0, 4),
    disclaimer: "Educational signal only. Not financial advice."
  };
};

module.exports = { generateTradeSignal };
