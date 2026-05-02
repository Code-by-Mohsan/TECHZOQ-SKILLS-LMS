export default function AdminLoading() {
  return (
    <div className="flex-1 flex items-center justify-center p-8">
      <div className="flex flex-col items-center gap-4">
        <div className="w-10 h-10 border-3 border-blue-600 border-t-transparent rounded-full animate-spin" />
        <span className="text-sm text-gray-500">Loading admin panel...</span>
      </div>
    </div>
  );
}
