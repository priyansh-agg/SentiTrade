import { BellRing, CircleAlert } from "lucide-react";

const AlertBanner = ({ sentiment }) => {
  const score = sentiment?.score_percent ?? 50;

  if (score < 35) {
    return (
      <div className="flex items-center gap-3 rounded-lg border border-danger/25 bg-danger/10 px-4 py-3 text-danger">
        <CircleAlert size={18} />
        <p className="text-sm font-semibold">Risk alert: sentiment has crossed below 35%.</p>
      </div>
    );
  }

  if (score > 68) {
    return (
      <div className="flex items-center gap-3 rounded-lg border border-neon/25 bg-neon/10 px-4 py-3 text-neon">
        <BellRing size={18} />
        <p className="text-sm font-semibold">Momentum alert: sentiment has crossed above 68%.</p>
      </div>
    );
  }

  return null;
};

export default AlertBanner;
