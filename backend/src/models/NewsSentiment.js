const mongoose = require("mongoose");

const newsSentimentSchema = new mongoose.Schema(
  {
    text: {
      type: String,
      required: true,
      trim: true
    },
    source: {
      type: String,
      default: "Unknown"
    },
    sentiment_score: {
      type: Number,
      required: true
    },
    sentiment_label: {
      type: String,
      enum: ["positive", "neutral", "negative"],
      required: true
    },
    asset: {
      type: String,
      required: true,
      uppercase: true,
      index: true
    },
    timestamp: {
      type: Date,
      default: Date.now,
      index: true
    }
  },
  { timestamps: true }
);

newsSentimentSchema.index({ text: 1, asset: 1 }, { unique: true });

module.exports = mongoose.model("NewsSentiment", newsSentimentSchema);
