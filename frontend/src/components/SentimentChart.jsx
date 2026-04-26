import {
  CategoryScale,
  Chart as ChartJS,
  Filler,
  Legend,
  LinearScale,
  LineElement,
  PointElement,
  Tooltip
} from "chart.js";
import { Line } from "react-chartjs-2";
import Card from "./Card.jsx";

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Tooltip, Legend, Filler);

const timeLabel = (timestamp) =>
  new Intl.DateTimeFormat(undefined, {
    hour: "2-digit",
    minute: "2-digit"
  }).format(new Date(timestamp));

const SentimentChart = ({ points = [] }) => {
  const labels = points.map((point) => timeLabel(point.timestamp));
  const values = points.map((point) => point.sentiment_percent);

  const data = {
    labels,
    datasets: [
      {
        label: "Sentiment %",
        data: values,
        borderColor: "#39FF88",
        backgroundColor: "rgba(57, 255, 136, 0.12)",
        pointBackgroundColor: "#58D5FF",
        pointRadius: 0,
        pointHoverRadius: 4,
        fill: true,
        tension: 0.35,
        borderWidth: 2
      }
    ]
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      tooltip: {
        mode: "index",
        intersect: false,
        backgroundColor: "rgba(5,7,10,0.94)",
        borderColor: "rgba(255,255,255,0.12)",
        borderWidth: 1
      }
    },
    scales: {
      x: {
        grid: { color: "rgba(255,255,255,0.05)" },
        ticks: { color: "rgba(226,232,240,0.5)", maxTicksLimit: 6 }
      },
      y: {
        min: 0,
        max: 100,
        grid: { color: "rgba(255,255,255,0.06)" },
        ticks: { color: "rgba(226,232,240,0.5)" }
      }
    }
  };

  return (
    <Card className="p-5">
      <div className="mb-4">
        <p className="text-xs font-semibold uppercase tracking-[0.22em] text-slate-500">Trend</p>
        <h2 className="mt-1 text-xl font-bold text-white">Sentiment Momentum</h2>
      </div>
      <div className="h-[300px]">
        <Line data={data} options={options} />
      </div>
    </Card>
  );
};

export default SentimentChart;
