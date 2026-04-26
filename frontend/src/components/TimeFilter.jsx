import { Clock3 } from "lucide-react";

const ranges = [
  { value: "5m", label: "5m" },
  { value: "1h", label: "1h" },
  { value: "24h", label: "24h" }
];

const TimeFilter = ({ value, onChange }) => (
  <div className="flex items-center gap-2 rounded-lg border border-white/10 bg-white/[0.04] p-1">
    <Clock3 size={16} className="ml-2 text-slate-400" />
    {ranges.map((range) => (
      <button
        key={range.value}
        type="button"
        onClick={() => onChange(range.value)}
        className={`h-8 rounded-md px-3 text-sm font-semibold transition ${
          value === range.value ? "bg-white/12 text-white" : "text-slate-400 hover:text-white"
        }`}
      >
        {range.label}
      </button>
    ))}
  </div>
);

export default TimeFilter;
