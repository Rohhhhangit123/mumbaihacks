import { useAppStore } from '../context/AppStore';

export const LoadingSkeleton = () => {
  const { darkMode } = useAppStore();

  return (
    <div className="space-y-4">
      {[1, 2, 3].map((i) => (
        <div
          key={i}
          className={`p-6 rounded-xl animate-pulse ${
            darkMode ? 'bg-gray-800' : 'bg-gray-200'
          }`}
        >
          <div className={`h-4 rounded mb-3 ${
            darkMode ? 'bg-gray-700' : 'bg-gray-300'
          } w-3/4`} />
          <div className={`h-4 rounded mb-3 ${
            darkMode ? 'bg-gray-700' : 'bg-gray-300'
          } w-1/2`} />
          <div className={`h-4 rounded ${
            darkMode ? 'bg-gray-700' : 'bg-gray-300'
          } w-2/3`} />
        </div>
      ))}
    </div>
  );
};

export const ChartSkeleton = () => {
  const { darkMode } = useAppStore();

  return (
    <div className={`p-6 rounded-xl animate-pulse ${
      darkMode ? 'bg-gray-800' : 'bg-gray-200'
    }`}>
      <div className={`h-6 rounded mb-4 ${
        darkMode ? 'bg-gray-700' : 'bg-gray-300'
      } w-1/3`} />
      <div className={`h-64 rounded ${
        darkMode ? 'bg-gray-700' : 'bg-gray-300'
      }`} />
    </div>
  );
};
