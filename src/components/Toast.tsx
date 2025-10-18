import { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAppStore } from '../context/AppStore';
import { X, CheckCircle, AlertCircle, Info, AlertTriangle } from 'lucide-react';

export const Toast = () => {
  const { notifications, removeNotification, darkMode } = useAppStore();

  useEffect(() => {
    const timers = notifications.map((notification) => {
      return setTimeout(() => {
        removeNotification(notification.id);
      }, 5000);
    });

    return () => {
      timers.forEach((timer) => clearTimeout(timer));
    };
  }, [notifications, removeNotification]);

  const getIcon = (type: string) => {
    switch (type) {
      case 'success':
        return <CheckCircle className="w-5 h-5" />;
      case 'error':
        return <AlertCircle className="w-5 h-5" />;
      case 'warning':
        return <AlertTriangle className="w-5 h-5" />;
      default:
        return <Info className="w-5 h-5" />;
    }
  };

  const getColors = (type: string) => {
    switch (type) {
      case 'success':
        return darkMode
          ? 'bg-green-500/20 text-green-400 border-green-500/50'
          : 'bg-green-50 text-green-800 border-green-200';
      case 'error':
        return darkMode
          ? 'bg-red-500/20 text-red-400 border-red-500/50'
          : 'bg-red-50 text-red-800 border-red-200';
      case 'warning':
        return darkMode
          ? 'bg-yellow-500/20 text-yellow-400 border-yellow-500/50'
          : 'bg-yellow-50 text-yellow-800 border-yellow-200';
      default:
        return darkMode
          ? 'bg-blue-500/20 text-blue-400 border-blue-500/50'
          : 'bg-blue-50 text-blue-800 border-blue-200';
    }
  };

  return (
    <div className="fixed top-20 right-4 z-50 flex flex-col gap-2 max-w-sm">
      <AnimatePresence>
        {notifications.map((notification) => (
          <motion.div
            key={notification.id}
            initial={{ opacity: 0, x: 50, scale: 0.9 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{ opacity: 0, x: 50, scale: 0.9 }}
            className={`flex items-start gap-3 p-4 rounded-lg border shadow-lg backdrop-blur-sm ${getColors(
              notification.type
            )}`}
          >
            <div className="flex-shrink-0 mt-0.5">
              {getIcon(notification.type)}
            </div>
            <p className="flex-1 text-sm font-medium">
              {notification.message}
            </p>
            <button
              onClick={() => removeNotification(notification.id)}
              className="flex-shrink-0 hover:opacity-70 transition-opacity"
            >
              <X className="w-4 h-4" />
            </button>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
};
