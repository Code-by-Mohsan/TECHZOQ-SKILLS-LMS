export default function DashboardLoading() {
  return (
    <div className="flex items-center justify-center h-96">
      <div className="flex flex-col items-center gap-4">
        <div className="w-10 h-10 border-3 border-blue-600 border-t-transparent rounded-full animate-spin" />
        <span className="text-sm text-gray-500">Loading dashboard...</span>
      </div>
    </div>
  );
}
