import { ReactNode } from 'react';
import { motion } from 'framer-motion';
import { useAppStore } from '../context/AppStore';

interface StatCardProps {
  title: string;
  value: string | number;
  icon: ReactNode;
  trend?: 'up' | 'down' | 'stable';
  trendValue?: string;
  delay?: number;
}

export const StatCard = ({ title, value, icon, trend, trendValue, delay = 0 }: StatCardProps) => {
  const { darkMode } = useAppStore();

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay }}
      whileHover={{ y: -4, transition: { duration: 0.2 } }}
      className={`p-6 rounded-xl border backdrop-blur-sm ${
        darkMode
          ? 'bg-gray-800/50 border-gray-700 hover:bg-gray-800/70'
          : 'bg-white/80 border-gray-200 hover:bg-white'
      } transition-all shadow-sm hover:shadow-lg`}
    >
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <p className={`text-sm font-medium mb-1 ${
            darkMode ? 'text-gray-400' : 'text-gray-600'
          }`}>
            {title}
          </p>
          <p className={`text-3xl font-bold ${
            darkMode ? 'text-white' : 'text-gray-900'
          }`}>
            {value}
          </p>
          {trend && trendValue && (
            <div className="flex items-center gap-2 mt-2">
              <span className={`text-xs px-2 py-1 rounded-full ${
                trend === 'up'
                  ? darkMode
                    ? 'bg-red-500/20 text-red-400'
                    : 'bg-red-50 text-red-600'
                  : trend === 'down'
                  ? darkMode
                    ? 'bg-green-500/20 text-green-400'
                    : 'bg-green-50 text-green-600'
                  : darkMode
                  ? 'bg-gray-700 text-gray-300'
                  : 'bg-gray-100 text-gray-600'
              }`}>
                {trend === 'up' ? '↑' : trend === 'down' ? '↓' : '→'} {trendValue}
              </span>
            </div>
          )}
        </div>
        <div className={`p-3 rounded-lg ${
          darkMode ? 'bg-blue-500/20' : 'bg-blue-50'
        }`}>
          {icon}
        </div>
      </div>
    </motion.div>
  );
};
