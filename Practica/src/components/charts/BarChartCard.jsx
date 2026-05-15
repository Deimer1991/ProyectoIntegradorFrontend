import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import ChartSkeleton from "./ChartSkeleton";

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="rounded-lg border bg-white p-3 shadow-lg dark:border-gray-700 dark:bg-gray-800">
      <p className="mb-1 text-sm font-medium text-gray-900 dark:text-white">{label}</p>
      {payload.map((entry, i) => (
        <p key={i} className="text-sm" style={{ color: entry.color }}>
          {entry.name}: {typeof entry.value === "number" ? entry.value.toFixed(2) : entry.value}
        </p>
      ))}
    </div>
  );
};

export default function BarChartCard({
  title,
  data,
  dataKey,
  nameKey = "nombre",
  loading,
  error,
  color = "#6366f1",
  height = 300,
  layout = "vertical",
  formatValue,
}) {
  if (loading) return <ChartSkeleton height={`h-${Math.floor(height / 4)}`} />;
  if (error) return <ErrorState message={error} />;
  if (!data?.length) return <EmptyState />;

  const formatted = data.map((item) => ({
    ...item,
    [nameKey]:
      item[nameKey]?.length > 20 ? item[nameKey].slice(0, 20) + "..." : item[nameKey],
  }));

  const isVertical = layout === "vertical";

  return (
    <div className="rounded-xl border border-gray-200 bg-white p-5 dark:border-gray-700 dark:bg-gray-900">
      <h3 className="mb-4 text-base font-semibold text-gray-800 dark:text-gray-200">{title}</h3>
      <ResponsiveContainer width="100%" height={height}>
        <BarChart
          data={formatted}
          layout={layout}
          margin={{ top: 5, right: 20, left: 10, bottom: 5 }}
        >
          <CartesianGrid strokeDasharray="3 3" stroke="#374151" opacity={0.3} />
          {isVertical ? (
            <>
              <XAxis
                dataKey={nameKey}
                tick={{ fontSize: 11, fill: "#9CA3AF" }}
                axisLine={{ stroke: "#374151" }}
              />
              <YAxis tick={{ fontSize: 11, fill: "#9CA3AF" }} axisLine={{ stroke: "#374151" }} />
            </>
          ) : (
            <>
              <XAxis
                type="number"
                tick={{ fontSize: 11, fill: "#9CA3AF" }}
                axisLine={{ stroke: "#374151" }}
              />
              <YAxis
                dataKey={nameKey}
                type="category"
                tick={{ fontSize: 11, fill: "#9CA3AF" }}
                axisLine={{ stroke: "#374151" }}
                width={140}
              />
            </>
          )}
          <Tooltip content={<CustomTooltip />} />
          <Bar
            dataKey={dataKey}
            fill={color}
            radius={[4, 4, 0, 0]}
            maxBarSize={50}
          />
        </BarChart>
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
