import { useState } from "react";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import ChartSkeleton from "./ChartSkeleton";

const COLORS = [
  "#6366f1", "#8b5cf6", "#ec4899", "#f43f5e",
  "#f97316", "#eab308", "#22c55e", "#14b8a6",
  "#06b6d4", "#3b82f6",
];

const CustomTooltip = ({ active, payload }) => {
  if (!active || !payload?.length) return null;
  const d = payload[0];
  return (
    <div className="rounded-lg border bg-white p-3 shadow-lg dark:border-gray-700 dark:bg-gray-800">
      <p className="text-sm font-medium text-gray-900 dark:text-white">{d.name}</p>
      <p className="text-sm" style={{ color: d.color }}>
        {d.value} ({typeof d.payload.porcentaje !== "undefined" ? d.payload.porcentaje : ""})
      </p>
    </div>
  );
};

export default function PieChartCard({
  title,
  data,
  dataKey,
  nameKey = "nombre",
  loading,
  error,
  height = 300,
  donut = true,
}) {
  const [activeIndex, setActiveIndex] = useState(null);

  if (loading) return <ChartSkeleton height={`h-${Math.floor(height / 4)}`} />;
  if (error) return <ErrorState message={error} />;
  if (!data?.length) return <EmptyState />;

  const total = data.reduce((s, d) => s + (Number(d[dataKey]) || 0), 0);
  const withPct = data.map((d) => ({
    ...d,
    porcentaje: total > 0 ? `${((Number(d[dataKey]) / total) * 100).toFixed(1)}%` : "0%",
  }));

  const renderLabel = ({ name, value, percent }) => {
    const pct = (percent * 100).toFixed(1);
    const shortName = name?.length > 12 ? name.slice(0, 12) + "…" : name;
    return `${shortName}: ${value} (${pct}%)`;
  };

  return (
    <div className="rounded-xl border border-gray-200 bg-white p-5 dark:border-gray-700 dark:bg-gray-900">
      <h3 className="mb-4 text-base font-semibold text-gray-800 dark:text-gray-200">{title}</h3>
      <ResponsiveContainer width="100%" height={height}>
        <PieChart>
          <Pie
            data={withPct}
            dataKey={dataKey}
            nameKey={nameKey}
            cx="50%"
            cy="50%"
            innerRadius={donut ? 60 : 0}
            outerRadius={100}
            paddingAngle={2}
            label={renderLabel}
            labelLine={true}
            onMouseEnter={(_, i) => setActiveIndex(i)}
            onMouseLeave={() => setActiveIndex(null)}
          >
            {withPct.map((_, i) => (
              <Cell
                key={i}
                fill={COLORS[i % COLORS.length]}
                opacity={activeIndex === null || activeIndex === i ? 1 : 0.6}
              />
            ))}
          </Pie>
          <Tooltip content={<CustomTooltip />} />
          <Legend
            wrapperStyle={{ fontSize: 12 }}
            formatter={(value) => (
              <span className="text-gray-600 dark:text-gray-400">{value}</span>
            )}
          />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}

function ErrorState({ message }) {
  return (
    <div className="flex h-64 items-center justify-center rounded-xl border border-red-200 bg-red-50 dark:border-red-800 dark:bg-red-900/20">
      <p className="text-sm text-red-600 dark:text-red-400">{message}</p>
    </div>
  );
}

function EmptyState() {
  return (
    <div className="flex h-64 items-center justify-center rounded-xl border border-gray-200 bg-gray-50 dark:border-gray-700 dark:bg-gray-800">
      <p className="text-sm text-gray-400">Sin datos disponibles</p>
    </div>
  );
}
