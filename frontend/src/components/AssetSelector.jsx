import { Bitcoin, Building2 } from "lucide-react";

const AssetSelector = ({ assets, selected, onChange }) => (
  <div className="flex flex-wrap gap-2">
    {assets.map((asset) => {
      const active = selected === asset.symbol;
      const Icon = asset.type === "crypto" ? Bitcoin : Building2;

      return (
        <button
          key={asset.symbol}
          type="button"
          onClick={() => onChange(asset.symbol)}
          className={`flex h-10 items-center gap-2 rounded-lg border px-3 text-sm font-semibold transition ${
            active
              ? "border-neon/70 bg-neon/15 text-neon shadow-glow"
              : "border-white/10 bg-white/[0.04] text-slate-300 hover:border-white/25 hover:text-white"
          }`}
          title={asset.displayName}
        >
          <Icon size={16} />
          {asset.symbol}
        </button>
      );
    })}
  </div>
);

export default AssetSelector;
