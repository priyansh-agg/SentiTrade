const { getCorrelationInsight } = require("../services/correlationService");
const { getLatestSentiment } = require("../services/newsService");
const { generateTradeSignal } = require("../services/signalService");

const getCorrelation = async (req, res, next) => {
  try {
    const asset = req.query.asset || "BTC";
    const range = req.query.range || "1h";
    const [insight, sentiment] = await Promise.all([
      getCorrelationInsight(asset, range),
      getLatestSentiment(asset, 20, false)
    ]);
    const signal = generateTradeSignal({ sentiment, correlation: insight });

    res.json({ ...insight, signal });
  } catch (error) {
    next(error);
  }
};

module.exports = { getCorrelation };
