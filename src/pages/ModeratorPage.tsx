import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Flag, User, Clock, Filter, ChevronRight } from 'lucide-react';
import { useAppStore } from '../context/AppStore';
import { LoadingSkeleton } from '../components/LoadingSkeleton';
import { getFlaggedClaims, verifyClaim, Claim } from '../api/agentService';
import { format } from 'date-fns';

export const ModeratorPage = () => {
  const { darkMode, addNotification } = useAppStore();
  const [flaggedClaims, setFlaggedClaims] = useState<Claim[]>([]);
  const [loading, setLoading] = useState(true);
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [reviewerName, setReviewerName] = useState('');

  useEffect(() => {
    const loadFlaggedClaims = async () => {
      setLoading(true);
      try {
        const data = await getFlaggedClaims();
        setFlaggedClaims(data);
      } catch (error) {
        console.error('Failed to load flagged claims:', error);
        addNotification('Failed to load flagged claims', 'error');
      } finally {
        setLoading(false);
      }
    };

    loadFlaggedClaims();
  }, [addNotification]);

  const handleStatusUpdate = async (claimId: string, newStatus: string) => {
    if (!reviewerName.trim()) {
      addNotification('Please enter your name before updating status', 'warning');
      return;
    }

    try {
      const result = await verifyClaim(claimId, newStatus, reviewerName);
      if (result.success) {
        addNotification(result.message, 'success');
        // Remove from flagged list
        setFlaggedClaims(flaggedClaims.filter(claim => claim.id !== claimId));
      }
    } catch (error) {
      addNotification('Failed to update claim status', 'error');
    }
  };

  const filteredClaims = categoryFilter === 'all'
    ? flaggedClaims
    : flaggedClaims.filter(claim => claim.topic === categoryFilter);

  const uniqueTopics = Array.from(new Set(flaggedClaims.map(claim => claim.topic)));

  const getUrgencyColor = (confidence: number) => {
    if (confidence > 0.8) {
      return darkMode ? 'border-red-500 bg-red-500/10' : 'border-red-300 bg-red-50';
    } else if (confidence > 0.6) {
      return darkMode ? 'border-orange-500 bg-orange-500/10' : 'border-orange-300 bg-orange-50';
    }
    return darkMode ? 'border-yellow-500 bg-yellow-500/10' : 'border-yellow-300 bg-yellow-50';
  };

  const getUrgencyLabel = (confidence: number) => {
    if (confidence > 0.8) return 'High Priority';
    if (confidence > 0.6) return 'Medium Priority';
    return 'Low Priority';
  };

  if (loading) {
    return <LoadingSkeleton />;
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className={`text-3xl font-bold mb-2 ${
          darkMode ? 'text-white' : 'text-gray-900'
        }`}>
          Moderator Dashboard
        </h1>
        <p className={darkMode ? 'text-gray-400' : 'text-gray-600'}>
          Review and verify flagged claims
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className={`p-6 rounded-xl border ${
            darkMode ? 'bg-gray-800/50 border-gray-700' : 'bg-white border-gray-200'
          }`}
        >
          <div className="flex items-center gap-3 mb-2">
            <Flag className={darkMode ? 'text-orange-400' : 'text-orange-600'} />
            <h3 className={`text-sm font-medium ${
              darkMode ? 'text-gray-400' : 'text-gray-600'
            }`}>
              Pending Review
            </h3>
          </div>
          <p className={`text-3xl font-bold ${
            darkMode ? 'text-white' : 'text-gray-900'
          }`}>
            {flaggedClaims.length}
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className={`p-6 rounded-xl border ${
            darkMode ? 'bg-gray-800/50 border-gray-700' : 'bg-white border-gray-200'
          }`}
        >
          <div className="flex items-center gap-3 mb-2">
            <Clock className={darkMode ? 'text-blue-400' : 'text-blue-600'} />
            <h3 className={`text-sm font-medium ${
              darkMode ? 'text-gray-400' : 'text-gray-600'
            }`}>
              Avg. Review Time
            </h3>
          </div>
          <p className={`text-3xl font-bold ${
            darkMode ? 'text-white' : 'text-gray-900'
          }`}>
            8.5m
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className={`p-6 rounded-xl border ${
            darkMode ? 'bg-gray-800/50 border-gray-700' : 'bg-white border-gray-200'
          }`}
        >
          <div className="flex items-center gap-3 mb-2">
            <User className={darkMode ? 'text-green-400' : 'text-green-600'} />
            <h3 className={`text-sm font-medium ${
              darkMode ? 'text-gray-400' : 'text-gray-600'
            }`}>
              Active Moderators
            </h3>
          </div>
          <p className={`text-3xl font-bold ${
            darkMode ? 'text-white' : 'text-gray-900'
          }`}>
            12
          </p>
        </motion.div>
      </div>

      {/* Reviewer Name Input */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className={`p-6 rounded-xl border ${
          darkMode ? 'bg-gray-800/50 border-gray-700' : 'bg-white border-gray-200'
        }`}
      >
        <label className={`block text-sm font-medium mb-2 ${
          darkMode ? 'text-gray-300' : 'text-gray-700'
        }`}>
          Your Name (Required for Review Actions)
        </label>
        <input
          type="text"
          value={reviewerName}
          onChange={(e) => setReviewerName(e.target.value)}
          placeholder="Enter your name..."
          className={`w-full px-4 py-3 rounded-lg border transition-colors ${
            darkMode
              ? 'bg-gray-800 border-gray-700 text-white placeholder-gray-400 focus:border-blue-500'
              : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500 focus:border-blue-500'
          } focus:outline-none focus:ring-2 focus:ring-blue-500/20`}
        />
      </motion.div>

      {/* Filters */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="flex items-center gap-3"
      >
        <Filter className={`w-5 h-5 ${
          darkMode ? 'text-gray-400' : 'text-gray-600'
        }`} />
        <select
          value={categoryFilter}
          onChange={(e) => setCategoryFilter(e.target.value)}
          className={`px-4 py-2 rounded-lg border transition-colors ${
            darkMode
              ? 'bg-gray-800 border-gray-700 text-white'
              : 'bg-white border-gray-300 text-gray-900'
          } focus:outline-none focus:ring-2 focus:ring-blue-500/20`}
        >
          <option value="all">All Topics ({flaggedClaims.length})</option>
          {uniqueTopics.map((topic) => (
            <option key={topic} value={topic}>
              {topic} ({flaggedClaims.filter(c => c.topic === topic).length})
            </option>
          ))}
        </select>
      </motion.div>

      {/* Flagged Claims List */}
      {filteredClaims.length === 0 ? (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className={`text-center py-12 px-4 rounded-xl border ${
            darkMode ? 'bg-gray-800/50 border-gray-700' : 'bg-gray-50 border-gray-200'
          }`}
        >
          <Flag className={`w-12 h-12 mx-auto mb-4 ${
            darkMode ? 'text-gray-600' : 'text-gray-400'
          }`} />
          <p className={`text-lg font-medium ${
            darkMode ? 'text-gray-300' : 'text-gray-600'
          }`}>
            No flagged claims to review
          </p>
          <p className={`text-sm mt-2 ${
            darkMode ? 'text-gray-500' : 'text-gray-500'
          }`}>
            All claims have been processed
          </p>
        </motion.div>
      ) : (
        <div className="space-y-4">
          {filteredClaims.map((claim, index) => (
            <motion.div
              key={claim.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.5 + index * 0.05 }}
              className={`p-6 rounded-xl border ${
                darkMode ? 'bg-gray-800/50 border-gray-700' : 'bg-white border-gray-200'
              } ${getUrgencyColor(claim.confidence)}`}
            >
              <div className="flex items-start justify-between gap-4 mb-4">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <span className={`px-2 py-1 rounded-full text-xs font-bold ${
                      darkMode ? 'bg-gray-700 text-gray-300' : 'bg-gray-100 text-gray-600'
                    }`}>
                      {claim.id}
                    </span>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      claim.confidence > 0.8
                        ? darkMode ? 'bg-red-500/20 text-red-400' : 'bg-red-100 text-red-700'
                        : claim.confidence > 0.6
                        ? darkMode ? 'bg-orange-500/20 text-orange-400' : 'bg-orange-100 text-orange-700'
                        : darkMode ? 'bg-yellow-500/20 text-yellow-400' : 'bg-yellow-100 text-yellow-700'
                    }`}>
                      {getUrgencyLabel(claim.confidence)}
                    </span>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      darkMode ? 'bg-blue-500/20 text-blue-400' : 'bg-blue-50 text-blue-600'
                    }`}>
                      {claim.topic}
                    </span>
                  </div>
                  <Link
                    to={`/claim/${claim.id}`}
                    className={`text-lg font-semibold hover:underline ${
                      darkMode ? 'text-white' : 'text-gray-900'
                    }`}
                  >
                    {claim.text}
                  </Link>
                </div>
                <Link
                  to={`/claim/${claim.id}`}
                  className={`flex-shrink-0 p-2 rounded-lg transition-colors ${
                    darkMode ? 'hover:bg-gray-700 text-gray-400' : 'hover:bg-gray-100 text-gray-600'
                  }`}
                >
                  <ChevronRight className="w-5 h-5" />
                </Link>
              </div>

              <div className="flex flex-wrap items-center gap-4 mb-4 text-sm">
                <span className={darkMode ? 'text-gray-400' : 'text-gray-600'}>
                  <strong>Region:</strong> {claim.region}
                </span>
                <span className={darkMode ? 'text-gray-400' : 'text-gray-600'}>
                  <strong>Confidence:</strong> {(claim.confidence * 100).toFixed(0)}%
                </span>
                <span className={darkMode ? 'text-gray-400' : 'text-gray-600'}>
                  <strong>Status:</strong> {claim.veracity}
                </span>
                <span className={darkMode ? 'text-gray-400' : 'text-gray-600'}>
                  <strong>Date:</strong> {format(new Date(claim.date), 'MMM dd, yyyy')}
                </span>
              </div>

              <div className={`p-3 rounded-lg mb-4 ${
                darkMode ? 'bg-gray-700/30' : 'bg-gray-100'
              }`}>
                <p className={`text-sm font-medium mb-1 ${
                  darkMode ? 'text-gray-300' : 'text-gray-700'
                }`}>
                  AI Assessment:
                </p>
                <p className={`text-sm ${
                  darkMode ? 'text-gray-400' : 'text-gray-600'
                }`}>
                  {claim.short_label}
                </p>
              </div>

              <div className="flex flex-wrap gap-2">
                <button
                  onClick={() => handleStatusUpdate(claim.id, 'Verified as True')}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                    darkMode
                      ? 'bg-green-500/20 text-green-400 hover:bg-green-500/30'
                      : 'bg-green-50 text-green-600 hover:bg-green-100'
                  }`}
                >
                  Verify as True
                </button>
                <button
                  onClick={() => handleStatusUpdate(claim.id, 'Verified as False')}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                    darkMode
                      ? 'bg-red-500/20 text-red-400 hover:bg-red-500/30'
                      : 'bg-red-50 text-red-600 hover:bg-red-100'
                  }`}
                >
                  Verify as False
                </button>
                <button
                  onClick={() => handleStatusUpdate(claim.id, 'Partially True')}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                    darkMode
                      ? 'bg-yellow-500/20 text-yellow-400 hover:bg-yellow-500/30'
                      : 'bg-yellow-50 text-yellow-600 hover:bg-yellow-100'
                  }`}
                >
                  Mark Partially True
                </button>
                <button
                  onClick={() => handleStatusUpdate(claim.id, 'Misleading')}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                    darkMode
                      ? 'bg-orange-500/20 text-orange-400 hover:bg-orange-500/30'
                      : 'bg-orange-50 text-orange-600 hover:bg-orange-100'
                  }`}
                >
                  Mark Misleading
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
};
