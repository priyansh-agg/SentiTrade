const vader = require("vader-sentiment");

const getSentimentLabel = (score) => {
  if (score >= 0.05) return "positive";
  if (score <= -0.05) return "negative";
  return "neutral";
};

const analyzeHeadline = (text) => {
  const result = vader.SentimentIntensityAnalyzer.polarity_scores(text || "");
  const score = Number(result.compound.toFixed(4));

  return {
    sentiment_score: score,
    sentiment_label: getSentimentLabel(score)
  };
};

const averageSentiment = (items = []) => {
  if (!items.length) {
    return {
      score: 0,
      scorePercent: 0,
      label: "neutral"
    };
  }

  const score = items.reduce((sum, item) => sum + item.sentiment_score, 0) / items.length;
  const rounded = Number(score.toFixed(4));

  return {
    score: rounded,
    scorePercent: Math.round(((rounded + 1) / 2) * 100),
    label: getSentimentLabel(rounded)
  };
};

module.exports = { analyzeHeadline, averageSentiment, getSentimentLabel };
