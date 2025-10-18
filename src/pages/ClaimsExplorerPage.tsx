import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Search, Filter, X, ChevronRight } from 'lucide-react';
import { useAppStore } from '../context/AppStore';
import { LoadingSkeleton } from '../components/LoadingSkeleton';
import { getClaims, getRegions, getAllTopics, Claim } from '../api/agentService';
import { format } from 'date-fns';

export const ClaimsExplorerPage = () => {
  const {
    darkMode,
    searchQuery,
    setSearchQuery,
    selectedRegion,
    setSelectedRegion,
    selectedTopic,
    setSelectedTopic,
    confidenceFilter,
    setConfidenceFilter,
    veracityFilter,
    setVeracityFilter,
  } = useAppStore();

  const [claims, setClaims] = useState<Claim[]>([]);
  const [regions, setRegions] = useState<string[]>([]);
  const [topics, setTopics] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    const loadInitialData = async () => {
      const [regionsData, topicsData] = await Promise.all([
        getRegions(),
        getAllTopics(),
      ]);
      setRegions(regionsData);
      setTopics(topicsData);
    };
    loadInitialData();
  }, []);

  useEffect(() => {
    const loadClaims = async () => {
      setLoading(true);
      try {
        const data = await getClaims({
          search: searchQuery,
          region: selectedRegion,
          topic: selectedTopic,
          confidence: confidenceFilter,
          veracity: veracityFilter,
        });
        setClaims(data);
      } catch (error) {
        console.error('Failed to load claims:', error);
      } finally {
        setLoading(false);
      }
    };

    loadClaims();
  }, [searchQuery, selectedRegion, selectedTopic, confidenceFilter, veracityFilter]);

  const clearFilters = () => {
    setSearchQuery('');
    setSelectedRegion('all');
    setSelectedTopic('all');
    setConfidenceFilter(0);
    setVeracityFilter('all');
  };

  const hasActiveFilters =
    searchQuery ||
    selectedRegion !== 'all' ||
    selectedTopic !== 'all' ||
    confidenceFilter > 0 ||
    veracityFilter !== 'all';

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
      return darkMode ? 'bg-red-500/20 border-red-500/50' : 'bg-red-50 border-red-200';
    } else if (veracity.includes('True')) {
      return darkMode ? 'bg-green-500/20 border-green-500/50' : 'bg-green-50 border-green-200';
    }
    return darkMode ? 'bg-yellow-500/20 border-yellow-500/50' : 'bg-yellow-50 border-yellow-200';
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className={`text-3xl font-bold mb-2 ${
          darkMode ? 'text-white' : 'text-gray-900'
        }`}>
          Claims Explorer
        </h1>
        <p className={darkMode ? 'text-gray-400' : 'text-gray-600'}>
          Search and filter through all detected claims
        </p>
      </div>

      {/* Search and Filters */}
      <div className="space-y-4">
        {/* Search Bar */}
        <div className="flex gap-3">
          <div className="flex-1 relative">
            <Search className={`absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 ${
              darkMode ? 'text-gray-400' : 'text-gray-500'
            }`} />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search claims, topics, or clusters..."
              className={`w-full pl-12 pr-4 py-3 rounded-lg border transition-colors ${
                darkMode
                  ? 'bg-gray-800 border-gray-700 text-white placeholder-gray-400 focus:border-blue-500'
                  : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500 focus:border-blue-500'
              } focus:outline-none focus:ring-2 focus:ring-blue-500/20`}
            />
          </div>
          <button
            onClick={() => setShowFilters(!showFilters)}
            className={`flex items-center gap-2 px-6 py-3 rounded-lg border font-medium transition-all ${
              showFilters
                ? darkMode
                  ? 'bg-blue-500/20 border-blue-500 text-blue-400'
                  : 'bg-blue-50 border-blue-500 text-blue-600'
                : darkMode
                ? 'bg-gray-800 border-gray-700 text-gray-300 hover:bg-gray-700'
                : 'bg-white border-gray-300 text-gray-700 hover:bg-gray-50'
            }`}
          >
            <Filter className="w-5 h-5" />
            Filters
          </button>
        </div>

        {/* Filter Panel */}
        {showFilters && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className={`p-4 rounded-lg border ${
              darkMode
                ? 'bg-gray-800/50 border-gray-700'
                : 'bg-gray-50 border-gray-200'
            }`}
          >
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {/* Region Filter */}
              <div>
                <label className={`block text-sm font-medium mb-2 ${
                  darkMode ? 'text-gray-300' : 'text-gray-700'
                }`}>
                  Region
                </label>
                <select
                  value={selectedRegion}
                  onChange={(e) => setSelectedRegion(e.target.value)}
                  className={`w-full px-3 py-2 rounded-lg border transition-colors ${
                    darkMode
                      ? 'bg-gray-800 border-gray-700 text-white'
                      : 'bg-white border-gray-300 text-gray-900'
                  } focus:outline-none focus:ring-2 focus:ring-blue-500/20`}
                >
                  <option value="all">All Regions</option>
                  {regions.map((region) => (
                    <option key={region} value={region}>
                      {region}
                    </option>
                  ))}
                </select>
              </div>

              {/* Topic Filter */}
              <div>
                <label className={`block text-sm font-medium mb-2 ${
                  darkMode ? 'text-gray-300' : 'text-gray-700'
                }`}>
                  Topic
                </label>
                <select
                  value={selectedTopic}
                  onChange={(e) => setSelectedTopic(e.target.value)}
                  className={`w-full px-3 py-2 rounded-lg border transition-colors ${
                    darkMode
                      ? 'bg-gray-800 border-gray-700 text-white'
                      : 'bg-white border-gray-300 text-gray-900'
                  } focus:outline-none focus:ring-2 focus:ring-blue-500/20`}
                >
                  <option value="all">All Topics</option>
                  {topics.map((topic) => (
                    <option key={topic} value={topic}>
                      {topic}
                    </option>
                  ))}
                </select>
              </div>

              {/* Veracity Filter */}
              <div>
                <label className={`block text-sm font-medium mb-2 ${
                  darkMode ? 'text-gray-300' : 'text-gray-700'
                }`}>
                  Veracity
                </label>
                <select
                  value={veracityFilter}
                  onChange={(e) => setVeracityFilter(e.target.value)}
                  className={`w-full px-3 py-2 rounded-lg border transition-colors ${
                    darkMode
                      ? 'bg-gray-800 border-gray-700 text-white'
                      : 'bg-white border-gray-300 text-gray-900'
                  } focus:outline-none focus:ring-2 focus:ring-blue-500/20`}
                >
                  <option value="all">All Status</option>
                  <option value="False">False</option>
                  <option value="Likely False">Likely False</option>
                  <option value="Partially True">Partially True</option>
                  <option value="Unverified">Unverified</option>
                </select>
              </div>

              {/* Confidence Filter */}
              <div>
                <label className={`block text-sm font-medium mb-2 ${
                  darkMode ? 'text-gray-300' : 'text-gray-700'
                }`}>
                  Min Confidence: {(confidenceFilter * 100).toFixed(0)}%
                </label>
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.1"
                  value={confidenceFilter}
                  onChange={(e) => setConfidenceFilter(parseFloat(e.target.value))}
                  className="w-full"
                />
              </div>
            </div>

            {hasActiveFilters && (
              <button
                onClick={clearFilters}
                className={`mt-4 flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  darkMode
                    ? 'bg-gray-700 hover:bg-gray-600 text-gray-300'
                    : 'bg-gray-200 hover:bg-gray-300 text-gray-700'
                }`}
              >
                <X className="w-4 h-4" />
                Clear Filters
              </button>
            )}
          </motion.div>
        )}

        {/* Results Count */}
        <div className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
          Found {claims.length} claim{claims.length !== 1 ? 's' : ''}
        </div>
      </div>

      {/* Claims List */}
      {loading ? (
        <LoadingSkeleton />
      ) : claims.length === 0 ? (
        <div className={`text-center py-12 px-4 rounded-xl border ${
          darkMode
            ? 'bg-gray-800/50 border-gray-700'
            : 'bg-gray-50 border-gray-200'
        }`}>
          <p className={`text-lg font-medium ${
            darkMode ? 'text-gray-300' : 'text-gray-600'
          }`}>
            No claims found matching your criteria
          </p>
          {hasActiveFilters && (
            <button
              onClick={clearFilters}
              className={`mt-4 text-sm font-medium ${
                darkMode
                  ? 'text-blue-400 hover:text-blue-300'
                  : 'text-blue-600 hover:text-blue-700'
              }`}
            >
              Clear filters to see all claims
            </button>
          )}
        </div>
      ) : (
        <div className="space-y-4">
          {claims.map((claim, index) => (
            <motion.div
              key={claim.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.05 }}
            >
              <Link
                to={`/claim/${claim.id}`}
                className={`block p-6 rounded-xl border transition-all hover:shadow-lg group ${
                  darkMode
                    ? 'bg-gray-800/50 border-gray-700 hover:bg-gray-800/70'
                    : 'bg-white border-gray-200 hover:border-gray-300'
                }`}
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start gap-3 mb-3">
                      <div className={`flex-shrink-0 px-3 py-1 rounded-full text-xs font-bold ${
                        darkMode ? 'bg-gray-700 text-gray-300' : 'bg-gray-100 text-gray-600'
                      }`}>
                        {claim.id}
                      </div>
                      <p className={`font-semibold text-lg flex-1 ${
                        darkMode ? 'text-white' : 'text-gray-900'
                      }`}>
                        {claim.text}
                      </p>
                    </div>

                    <div className="flex flex-wrap items-center gap-3 mb-3">
                      <span className={`px-3 py-1 rounded-full border text-sm font-medium ${getVeracityBg(claim.veracity)} ${getVeracityColor(claim.veracity)}`}>
                        {claim.veracity}
                      </span>
                      <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                        darkMode ? 'bg-blue-500/20 text-blue-400' : 'bg-blue-50 text-blue-600'
                      }`}>
                        {claim.topic}
                      </span>
                      {claim.flagged && (
                        <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                          darkMode ? 'bg-orange-500/20 text-orange-400' : 'bg-orange-50 text-orange-600'
                        }`}>
                          Flagged
                        </span>
                      )}
                    </div>

                    <div className="flex flex-wrap items-center gap-4 text-sm">
                      <span className={darkMode ? 'text-gray-400' : 'text-gray-600'}>
                        <strong>Region:</strong> {claim.region}
                      </span>
                      <span className={darkMode ? 'text-gray-400' : 'text-gray-600'}>
                        <strong>Confidence:</strong> {(claim.confidence * 100).toFixed(0)}%
                      </span>
                      <span className={darkMode ? 'text-gray-400' : 'text-gray-600'}>
                        <strong>Date:</strong> {format(new Date(claim.date), 'MMM dd, yyyy')}
                      </span>
                      <span className={darkMode ? 'text-gray-400' : 'text-gray-600'}>
                        <strong>Cluster:</strong> {claim.cluster}
                      </span>
                    </div>
                  </div>

                  <ChevronRight className={`flex-shrink-0 w-6 h-6 transition-transform group-hover:translate-x-1 ${
                    darkMode ? 'text-gray-500' : 'text-gray-400'
                  }`} />
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
};
