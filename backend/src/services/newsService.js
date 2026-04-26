const axios = require("axios");
const mongoose = require("mongoose");
const NewsSentiment = require("../models/NewsSentiment");
const { normalizeAsset } = require("./assetService");
const { analyzeHeadline, averageSentiment } = require("./sentimentService");
const { makeMockNews, makeMockTrend } = require("./mockDataService");

const isMongoReady = () => mongoose.connection.readyState === 1;

const toMinutes = (range = "1h") => {
  const normalized = String(range).toLowerCase();
  if (normalized === "5m") return 5;
  if (normalized === "24h") return 1440;
  return 60;
};

const buildNewsApiUrl = (assetConfig, limit) => {
  const params = new URLSearchParams({
    q: assetConfig.query,
    language: "en",
    pageSize: String(limit),
    sortBy: "publishedAt",
    apiKey: process.env.NEWS_API_KEY
  });

  return `https://newsapi.org/v2/everything?${params.toString()}`;
};

const mapArticle = (article, assetConfig) => {
  const text = article.title || article.description || "";
  const sentiment = analyzeHeadline(text);

  return {
    text,
    source: article.source?.name || "NewsAPI",
    sentiment_score: sentiment.sentiment_score,
    sentiment_label: sentiment.sentiment_label,
    asset: assetConfig.symbol,
    timestamp: article.publishedAt ? new Date(article.publishedAt) : new Date()
  };
};

const persistHeadlines = async (items) => {
  if (!isMongoReady()) return items;

  const saved = await Promise.all(
    items.map((item) =>
      NewsSentiment.findOneAndUpdate(
        { text: item.text, asset: item.asset },
        { $setOnInsert: item },
        { upsert: true, new: true, setDefaultsOnInsert: true }
      ).lean()
    )
  );

  return saved;
};

const fetchAndStoreNews = async (asset = "BTC", limit = 20) => {
  const assetConfig = normalizeAsset(asset);

  if (!process.env.NEWS_API_KEY) {
    return makeMockNews(assetConfig, limit);
  }

  try {
    const response = await axios.get(buildNewsApiUrl(assetConfig, limit), { timeout: 9000 });
    const articles = response.data?.articles || [];
    const mapped = articles.filter((article) => article.title).map((article) => mapArticle(article, assetConfig));

    if (!mapped.length) return makeMockNews(assetConfig, limit);

    return persistHeadlines(mapped);
  } catch (error) {
    console.warn(`NewsAPI fallback for ${assetConfig.symbol}:`, error.message);
    return makeMockNews(assetConfig, limit);
  }
};

const getLatestSentiment = async (asset = "BTC", limit = 20, refresh = true) => {
  const assetConfig = normalizeAsset(asset);
  let items = [];

  if (refresh) {
    items = await fetchAndStoreNews(assetConfig.symbol, limit);
  }

  if (isMongoReady()) {
    const dbItems = await NewsSentiment.find({ asset: assetConfig.symbol })
      .sort({ timestamp: -1 })
      .limit(Number(limit))
      .lean();

    if (dbItems.length) items = dbItems;
  }

  if (!items.length) items = makeMockNews(assetConfig, limit);

  const summary = averageSentiment(items);

  return {
    asset: assetConfig.symbol,
    assetName: assetConfig.displayName,
    score_avg: summary.score,
    score_percent: summary.scorePercent,
    sentiment_label: summary.label,
    updatedAt: new Date().toISOString(),
    items
  };
};

const getSentimentTrend = async (asset = "BTC", range = "1h") => {
  const assetConfig = normalizeAsset(asset);
  const minutes = toMinutes(range);

  if (!isMongoReady()) {
    return {
      asset: assetConfig.symbol,
      range,
      points: makeMockTrend(assetConfig, Math.min(minutes, 240))
    };
  }

  const since = new Date(Date.now() - minutes * 60 * 1000);
  const points = await NewsSentiment.aggregate([
    { $match: { asset: assetConfig.symbol, timestamp: { $gte: since } } },
    {
      $group: {
        _id: {
          $dateToString: {
            date: "$timestamp",
            format: "%Y-%m-%dT%H:%M:00.000Z",
            timezone: "UTC"
          }
        },
        sentiment_avg: { $avg: "$sentiment_score" },
        count: { $sum: 1 }
      }
    },
    { $sort: { _id: 1 } },
    {
      $project: {
        _id: 0,
        timestamp: "$_id",
        sentiment_avg: { $round: ["$sentiment_avg", 4] },
        count: 1
      }
    }
  ]);

  const normalized = points.map((point) => ({
    ...point,
    sentiment_percent: Math.round(((point.sentiment_avg + 1) / 2) * 100)
  }));

  return {
    asset: assetConfig.symbol,
    range,
    points: normalized.length ? normalized : makeMockTrend(assetConfig, Math.min(minutes, 240))
  };
};

module.exports = {
  fetchAndStoreNews,
  getLatestSentiment,
  getSentimentTrend,
  toMinutes
};
