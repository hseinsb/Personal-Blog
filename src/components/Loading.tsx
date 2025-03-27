export default function Loading() {
  return (
    <div className="min-h-screen flex items-center justify-center p-6 pt-20 md:p-12 md:pt-24 bg-gradient-to-br from-gray-50 to-purple-100/20 dark:from-gray-900 dark:to-purple-900/20">
      <div className="text-center">
        <div className="w-16 h-16 border-4 border-purple-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
        <p className="text-lg text-gray-600 dark:text-gray-300">Loading...</p>
      </div>
    </div>
  );
}
