import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { AlertTriangle, CheckCircle, Clock, Layers, TrendingUp, ExternalLink } from 'lucide-react';
import { useAppStore } from '../context/AppStore';
import { StatCard } from '../components/StatCard';
import { ChartSkeleton, LoadingSkeleton } from '../components/LoadingSkeleton';
import { getStats, getTrends, getTopics, getRecentActivity, Claim, Stats, Trend, Topic } from '../api/agentService';
import { format } from 'date-fns';

export const HomePage = () => {
  const { darkMode } = useAppStore();
  const [stats, setStats] = useState<Stats | null>(null);
  const [trends, setTrends] = useState<Trend[]>([]);
  const [topics, setTopics] = useState<Topic[]>([]);
  const [recentActivity, setRecentActivity] = useState<Claim[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      try {
        const [statsData, trendsData, topicsData, activityData] = await Promise.all([
          getStats(),
          getTrends(),
          getTopics(),
          getRecentActivity(),
        ]);
        setStats(statsData);
        setTrends(trendsData);
        setTopics(topicsData.slice(0, 5));
        setRecentActivity(activityData);
      } catch (error) {
        console.error('Failed to load dashboard data:', error);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  const getVeracityColor = (veracity: string) => {
    if (veracity.includes('False')) {
      return darkMode ? 'text-red-400' : 'text-red-600';
    } else if (veracity.includes('True')) {
      return darkMode ? 'text-green-400' : 'text-green-600';
    }
    return darkMode ? 'text-yellow-400' : 'text-yellow-600';
  };

  const getVeracityBg = (veracity: string) => {
    if (veracity.includes('False')) {
      return darkMode ? 'bg-red-500/20' : 'bg-red-50';
    } else if (veracity.includes('True')) {
      return darkMode ? 'bg-green-500/20' : 'bg-green-50';
    }
    return darkMode ? 'bg-yellow-500/20' : 'bg-yellow-50';
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[1, 2, 3, 4].map((i) => (
            <ChartSkeleton key={i} />
          ))}
        </div>
        <ChartSkeleton />
        <LoadingSkeleton />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className={`text-3xl font-bold mb-2 ${
          darkMode ? 'text-white' : 'text-gray-900'
        }`}>
          Dashboard Overview
        </h1>
        <p className={darkMode ? 'text-gray-400' : 'text-gray-600'}>
          Real-time misinformation detection and monitoring
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Total Claims Detected"
          value={stats?.totalClaims || 0}
          icon={<Layers className={darkMode ? 'text-blue-400' : 'text-blue-600'} />}
          trend="up"
          trendValue="12% this week"
          delay={0}
        />
        <StatCard
          title="Verified Claims"
          value={stats?.verifiedClaims || 0}
          icon={<CheckCircle className={darkMode ? 'text-green-400' : 'text-green-600'} />}
          trend="stable"
          trendValue="94% verified"
          delay={0.1}
        />
        <StatCard
          title="Misinformation Clusters"
          value={stats?.misinformationClusters || 0}
          icon={<AlertTriangle className={darkMode ? 'text-red-400' : 'text-red-600'} />}
          trend="up"
          trendValue="5 new today"
          delay={0.2}
        />
        <StatCard
          title="Active Crises"
          value={stats?.activeCrises || 0}
          icon={<Clock className={darkMode ? 'text-orange-400' : 'text-orange-600'} />}
          trend="down"
          trendValue="2 resolved"
          delay={0.3}
        />
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Trend Chart */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.4 }}
          className={`p-6 rounded-xl border ${
            darkMode
              ? 'bg-gray-800/50 border-gray-700'
              : 'bg-white border-gray-200'
          }`}
        >
          <div className="flex items-center justify-between mb-4">
            <h2 className={`text-xl font-semibold ${
              darkMode ? 'text-white' : 'text-gray-900'
            }`}>
              Misinformation Trends
            </h2>
            <TrendingUp className={`w-5 h-5 ${
              darkMode ? 'text-gray-400' : 'text-gray-600'
            }`} />
          </div>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={trends}>
              <CartesianGrid strokeDasharray="3 3" stroke={darkMode ? '#374151' : '#e5e7eb'} />
              <XAxis
                dataKey="date"
                tick={{ fill: darkMode ? '#9ca3af' : '#6b7280', fontSize: 12 }}
                tickFormatter={(value) => format(new Date(value), 'MM/dd')}
              />
              <YAxis tick={{ fill: darkMode ? '#9ca3af' : '#6b7280', fontSize: 12 }} />
              <Tooltip
                contentStyle={{
                  backgroundColor: darkMode ? '#1f2937' : '#ffffff',
                  border: `1px solid ${darkMode ? '#374151' : '#e5e7eb'}`,
                  borderRadius: '8px',
                  color: darkMode ? '#ffffff' : '#000000',
                }}
              />
              <Line
                type="monotone"
                dataKey="totalClaims"
                stroke="#3b82f6"
                strokeWidth={2}
                dot={{ fill: '#3b82f6' }}
                name="Total Claims"
              />
              <Line
                type="monotone"
                dataKey="verifiedFalse"
                stroke="#ef4444"
                strokeWidth={2}
                dot={{ fill: '#ef4444' }}
                name="False Claims"
              />
            </LineChart>
          </ResponsiveContainer>
        </motion.div>

        {/* Topics Chart */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.5 }}
          className={`p-6 rounded-xl border ${
            darkMode
              ? 'bg-gray-800/50 border-gray-700'
              : 'bg-white border-gray-200'
          }`}
        >
          <h2 className={`text-xl font-semibold mb-4 ${
            darkMode ? 'text-white' : 'text-gray-900'
          }`}>
            Top 5 Trending Topics
          </h2>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={topics}>
              <CartesianGrid strokeDasharray="3 3" stroke={darkMode ? '#374151' : '#e5e7eb'} />
              <XAxis
                dataKey="name"
                tick={{ fill: darkMode ? '#9ca3af' : '#6b7280', fontSize: 11 }}
                angle={-45}
                textAnchor="end"
                height={80}
              />
              <YAxis tick={{ fill: darkMode ? '#9ca3af' : '#6b7280', fontSize: 12 }} />
              <Tooltip
                contentStyle={{
                  backgroundColor: darkMode ? '#1f2937' : '#ffffff',
                  border: `1px solid ${darkMode ? '#374151' : '#e5e7eb'}`,
                  borderRadius: '8px',
                  color: darkMode ? '#ffffff' : '#000000',
                }}
              />
              <Bar dataKey="count" fill="#8b5cf6" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </motion.div>
      </div>

      {/* Recent Activity Feed */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.6 }}
        className={`p-6 rounded-xl border ${
          darkMode
            ? 'bg-gray-800/50 border-gray-700'
            : 'bg-white border-gray-200'
        }`}
      >
        <div className="flex items-center justify-between mb-6">
          <h2 className={`text-xl font-semibold ${
            darkMode ? 'text-white' : 'text-gray-900'
          }`}>
            Recent Claim Detections
          </h2>
          <Link
            to="/claims"
            className={`flex items-center gap-2 text-sm font-medium transition-colors ${
              darkMode
                ? 'text-blue-400 hover:text-blue-300'
                : 'text-blue-600 hover:text-blue-700'
            }`}
          >
            View All <ExternalLink className="w-4 h-4" />
          </Link>
        </div>

        <div className="space-y-4">
          {recentActivity.map((claim, index) => (
            <motion.div
              key={claim.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3, delay: 0.7 + index * 0.1 }}
            >
              <Link
                to={`/claim/${claim.id}`}
                className={`block p-4 rounded-lg border transition-all hover:shadow-md ${
                  darkMode
                    ? 'bg-gray-700/30 border-gray-600 hover:bg-gray-700/50'
                    : 'bg-gray-50 border-gray-200 hover:bg-gray-100'
                }`}
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    <p className={`font-medium mb-2 ${
                      darkMode ? 'text-white' : 'text-gray-900'
                    }`}>
                      {claim.text}
                    </p>
                    <div className="flex flex-wrap items-center gap-3 text-sm">
                      <span className={`px-2 py-1 rounded-full ${getVeracityBg(claim.veracity)} ${getVeracityColor(claim.veracity)} font-medium`}>
                        {claim.veracity}
                      </span>
                      <span className={darkMode ? 'text-gray-400' : 'text-gray-600'}>
                        {claim.region}
                      </span>
                      <span className={darkMode ? 'text-gray-400' : 'text-gray-600'}>
                        Confidence: {(claim.confidence * 100).toFixed(0)}%
                      </span>
                      <span className={darkMode ? 'text-gray-500' : 'text-gray-500'}>
                        {format(new Date(claim.date), 'MMM dd, yyyy')}
                      </span>
                    </div>
                  </div>
                  <div className={`flex-shrink-0 text-4xl font-bold ${
                    darkMode ? 'text-gray-700' : 'text-gray-200'
                  }`}>
                    {(claim.confidence * 100).toFixed(0)}%
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </div>
  );
};
