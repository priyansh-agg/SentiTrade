const { getLatestSentiment, getSentimentTrend } = require("../services/newsService");
const { getCorrelationInsight } = require("../services/correlationService");
const { createMarketSummary } = require("../services/summaryService");
const { generateTradeSignal } = require("../services/signalService");

const getSentiment = async (req, res, next) => {
  try {
    const asset = req.query.asset || "BTC";
    const limit = Number(req.query.limit || 20);
    const refresh = req.query.refresh !== "false";
    const snapshot = await getLatestSentiment(asset, limit, refresh);
    const correlation = await getCorrelationInsight(snapshot.asset, req.query.range || "1h");
    const signal = generateTradeSignal({ sentiment: snapshot, correlation });

    res.json({
      ...snapshot,
      signal,
      summary: createMarketSummary({ sentiment: snapshot, correlation })
    });
  } catch (error) {
    next(error);
  }
};

const getTrend = async (req, res, next) => {
  try {
    const trend = await getSentimentTrend(req.query.asset || "BTC", req.query.range || "1h");
    res.json(trend);
  } catch (error) {
    next(error);
  }
};

module.exports = { getSentiment, getTrend };
