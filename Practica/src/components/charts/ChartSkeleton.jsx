export default function ChartSkeleton({ height = "h-64" }) {
  return (
    <div className={`${height} animate-pulse rounded-xl bg-gray-100 dark:bg-gray-800`}>
      <div className="flex h-full items-center justify-center">
        <div className="space-y-3 w-3/4">
          <div className="h-3 w-full rounded bg-gray-200 dark:bg-gray-700" />
          <div className="h-3 w-5/6 rounded bg-gray-200 dark:bg-gray-700" />
          <div className="h-3 w-4/6 rounded bg-gray-200 dark:bg-gray-700" />
          <div className="h-3 w-3/6 rounded bg-gray-200 dark:bg-gray-700" />
        </div>
      </div>
    </div>
  );
}
