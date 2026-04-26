import Card from "./Card.jsx";
import { GitCompareArrows, MoveDownRight, MoveUpRight } from "lucide-react";

const signalClasses = {
  BUY: "border-neon/25 bg-neon/10 text-neon",
  SELL: "border-danger/25 bg-danger/10 text-danger",
  HOLD: "border-warning/25 bg-warning/10 text-warning"
};

const CorrelationBox = ({ data, summary }) => {
  const sentimentPositive = (data?.sentiment_change || 0) >= 0;
  const pricePositive = (data?.price_change || 0) >= 0;
  const SentimentIcon = sentimentPositive ? MoveUpRight : MoveDownRight;
  const PriceIcon = pricePositive ? MoveUpRight : MoveDownRight;
  const signal = data?.signal;

  return (
    <Card className="p-5">
      <div className="mb-4 flex items-center justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-slate-500">Correlation</p>
          <h2 className="mt-1 text-xl font-bold text-white">Signal Match</h2>
        </div>
        <GitCompareArrows size={20} className="text-neon" />
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div className="rounded-lg border border-white/10 bg-black/20 p-3">
          <div className="mb-2 flex items-center gap-2 text-slate-400">
            <SentimentIcon size={16} />
            <span className="text-xs font-semibold uppercase">Sentiment</span>
          </div>
          <p className={sentimentPositive ? "text-2xl font-bold text-neon" : "text-2xl font-bold text-danger"}>
            {data?.sentiment_change ?? 0}%
          </p>
        </div>
        <div className="rounded-lg border border-white/10 bg-black/20 p-3">
          <div className="mb-2 flex items-center gap-2 text-slate-400">
            <PriceIcon size={16} />
            <span className="text-xs font-semibold uppercase">Price</span>
          </div>
          <p className={pricePositive ? "text-2xl font-bold text-neon" : "text-2xl font-bold text-danger"}>
            {data?.price_change ?? 0}%
          </p>
        </div>
      </div>

      <div className="mt-4 rounded-lg border border-cyanline/20 bg-cyanline/10 p-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <p className="font-semibold text-cyanline">{data?.insight || "Waiting for market signal"}</p>
          <span
            className={`rounded-full border px-3 py-1 text-xs font-extrabold ${
              signalClasses[signal?.signal] || signalClasses.HOLD
            }`}
          >
            {signal?.signal || "HOLD"} {signal?.confidence || 45}%
          </span>
        </div>
        <p className="mt-2 text-sm leading-6 text-slate-300">{summary}</p>
      </div>
    </Card>
  );
};

export default CorrelationBox;
