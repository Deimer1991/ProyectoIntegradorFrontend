const bgMap = {
  blue: "bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800",
  green: "bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800",
  purple: "bg-purple-50 dark:bg-purple-900/20 border-purple-200 dark:border-purple-800",
  amber: "bg-amber-50 dark:bg-amber-900/20 border-amber-200 dark:border-amber-800",
  rose: "bg-rose-50 dark:bg-rose-900/20 border-rose-200 dark:border-rose-800",
  cyan: "bg-cyan-50 dark:bg-cyan-900/20 border-cyan-200 dark:border-cyan-800",
};

const iconMap = {
  blue: "text-blue-600 dark:text-blue-400",
  green: "text-green-600 dark:text-green-400",
  purple: "text-purple-600 dark:text-purple-400",
  amber: "text-amber-600 dark:text-amber-400",
  rose: "text-rose-600 dark:text-rose-400",
  cyan: "text-cyan-600 dark:text-cyan-400",
};

export default function StatCard({ title, value, icon: Icon, color = "blue", subtitle }) {
  return (
    <div
      className={`rounded-xl border p-4 ${bgMap[color] || bgMap.blue} transition-all hover:shadow-md`}
    >
      <div className="flex items-center justify-between">
        <p className="text-sm font-medium text-gray-500 dark:text-gray-400">{title}</p>
        {Icon && <Icon className={`h-5 w-5 ${iconMap[color] || iconMap.blue}`} />}
      </div>
      <p className="mt-2 text-3xl font-bold text-gray-900 dark:text-white">{value}</p>
      {subtitle && (
        <p className="mt-1 text-xs text-gray-400 dark:text-gray-500">{subtitle}</p>
      )}
    </div>
  );
}
