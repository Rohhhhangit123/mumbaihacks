import { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, ExternalLink, CheckCircle, AlertTriangle, FileText, Brain, Lightbulb, ChevronDown, ChevronUp } from 'lucide-react';
import { useAppStore } from '../context/AppStore';
import { LoadingSkeleton } from '../components/LoadingSkeleton';
import { getClaimById, verifyClaim, Claim } from '../api/agentService';
import { format } from 'date-fns';

export const ClaimDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { darkMode, addNotification } = useAppStore();
  const [claim, setClaim] = useState<Claim | null>(null);
  const [loading, setLoading] = useState(true);
  const [showSources, setShowSources] = useState(false);

  useEffect(() => {
    const loadClaim = async () => {
      if (!id) return;
      setLoading(true);
      try {
        const data = await getClaimById(id);
        setClaim(data);
      } catch (error) {
        console.error('Failed to load claim:', error);
        addNotification('Failed to load claim details', 'error');
      } finally {
        setLoading(false);
      }
    };

    loadClaim();
  }, [id, addNotification]);

  const handleVerifyAction = async (status: string) => {
    if (!id) return;
    try {
      const result = await verifyClaim(id, status);
      if (result.success) {
        addNotification(result.message, 'success');
      }
    } catch (error) {
      addNotification('Failed to update claim status', 'error');
    }
  };

  if (loading) {
    return <LoadingSkeleton />;
  }

  if (!claim) {
    return (
      <div className={`text-center py-12 px-4 rounded-xl border ${
        darkMode ? 'bg-gray-800/50 border-gray-700' : 'bg-gray-50 border-gray-200'
      }`}>
        <p className={`text-lg font-medium mb-4 ${
          darkMode ? 'text-gray-300' : 'text-gray-600'
        }`}>
          Claim not found
        </p>
        <Link
          to="/claims"
          className={`inline-flex items-center gap-2 text-sm font-medium ${
            darkMode ? 'text-blue-400 hover:text-blue-300' : 'text-blue-600 hover:text-blue-700'
          }`}
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Claims Explorer
        </Link>
      </div>
    );
  }

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
      {/* Back Button */}
      <button
        onClick={() => navigate(-1)}
        className={`flex items-center gap-2 text-sm font-medium transition-colors ${
          darkMode ? 'text-gray-400 hover:text-gray-300' : 'text-gray-600 hover:text-gray-700'
        }`}
      >
        <ArrowLeft className="w-4 h-4" />
        Back
      </button>

      {/* Claim Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className={`p-6 rounded-xl border ${
          darkMode ? 'bg-gray-800/50 border-gray-700' : 'bg-white border-gray-200'
        }`}
      >
        <div className="flex items-start justify-between mb-4">
          <div className={`px-3 py-1 rounded-full text-sm font-bold ${
            darkMode ? 'bg-gray-700 text-gray-300' : 'bg-gray-100 text-gray-600'
          }`}>
            {claim.id}
          </div>
          {claim.flagged && (
            <span className={`px-3 py-1 rounded-full text-sm font-medium ${
              darkMode ? 'bg-orange-500/20 text-orange-400' : 'bg-orange-50 text-orange-600'
            }`}>
              Flagged for Review
            </span>
          )}
        </div>

        <h1 className={`text-2xl font-bold mb-4 ${
          darkMode ? 'text-white' : 'text-gray-900'
        }`}>
          {claim.text}
        </h1>

        <div className="flex flex-wrap items-center gap-3 mb-4">
          <span className={`px-3 py-1 rounded-full border text-sm font-medium ${getVeracityBg(claim.veracity)} ${getVeracityColor(claim.veracity)}`}>
            {claim.veracity}
          </span>
          <span className={`px-3 py-1 rounded-full text-sm font-medium ${
            darkMode ? 'bg-blue-500/20 text-blue-400' : 'bg-blue-50 text-blue-600'
          }`}>
            {claim.topic}
          </span>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-4 border-t" style={{
          borderColor: darkMode ? '#374151' : '#e5e7eb'
        }}>
          <div>
            <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
              Region
            </p>
            <p className={`font-semibold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
              {claim.region}
            </p>
          </div>
          <div>
            <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
              Confidence
            </p>
            <p className={`font-semibold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
              {(claim.confidence * 100).toFixed(0)}%
            </p>
          </div>
          <div>
            <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
              Date Detected
            </p>
            <p className={`font-semibold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
              {format(new Date(claim.date), 'MMM dd, yyyy')}
            </p>
          </div>
          <div>
            <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
              Cluster
            </p>
            <p className={`font-semibold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
              {claim.cluster}
            </p>
          </div>
        </div>
      </motion.div>

      {/* Veracity Score */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className={`p-6 rounded-xl border ${
          darkMode ? 'bg-gray-800/50 border-gray-700' : 'bg-white border-gray-200'
        }`}
      >
        <h2 className={`text-xl font-semibold mb-4 ${
          darkMode ? 'text-white' : 'text-gray-900'
        }`}>
          AI Veracity Score
        </h2>
        <div className="mb-2">
          <div className="flex items-center justify-between mb-2">
            <span className={`text-sm font-medium ${
              darkMode ? 'text-gray-300' : 'text-gray-700'
            }`}>
              Confidence Level
            </span>
            <span className={`text-lg font-bold ${getVeracityColor(claim.veracity)}`}>
              {(claim.confidence * 100).toFixed(0)}%
            </span>
          </div>
          <div className={`w-full h-3 rounded-full overflow-hidden ${
            darkMode ? 'bg-gray-700' : 'bg-gray-200'
          }`}>
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${claim.confidence * 100}%` }}
              transition={{ duration: 1, delay: 0.3 }}
              className="h-full rounded-full"
              style={{
                backgroundColor: claim.veracity.includes('False')
                  ? '#ef4444'
                  : claim.veracity.includes('True')
                  ? '#10b981'
                  : '#f59e0b'
              }}
            />
          </div>
        </div>
      </motion.div>

      {/* AI Outputs */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className={`p-6 rounded-xl border ${
          darkMode ? 'bg-gray-800/50 border-gray-700' : 'bg-white border-gray-200'
        }`}
      >
        <div className="flex items-center gap-3 mb-6">
          <div className={`p-2 rounded-lg ${
            darkMode ? 'bg-purple-500/20' : 'bg-purple-50'
          }`}>
            <Brain className={`w-6 h-6 ${
              darkMode ? 'text-purple-400' : 'text-purple-600'
            }`} />
          </div>
          <h2 className={`text-xl font-semibold ${
            darkMode ? 'text-white' : 'text-gray-900'
          }`}>
            AI-Generated Analysis
          </h2>
        </div>

        <div className="space-y-6">
          {/* Short Label */}
          <div>
            <div className="flex items-center gap-2 mb-2">
              <CheckCircle className={`w-5 h-5 ${getVeracityColor(claim.veracity)}`} />
              <h3 className={`font-semibold ${
                darkMode ? 'text-white' : 'text-gray-900'
              }`}>
                Fact Label
              </h3>
            </div>
            <p className={`text-lg font-medium ${getVeracityColor(claim.veracity)}`}>
              {claim.short_label}
            </p>
          </div>

          {/* Plain Explanation */}
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Lightbulb className={`w-5 h-5 ${
                darkMode ? 'text-blue-400' : 'text-blue-600'
              }`} />
              <h3 className={`font-semibold ${
                darkMode ? 'text-white' : 'text-gray-900'
              }`}>
                Plain-Language Explanation
              </h3>
            </div>
            <p className={`leading-relaxed ${
              darkMode ? 'text-gray-300' : 'text-gray-700'
            }`}>
              {claim.plain_explanation}
            </p>
          </div>

          {/* Technical Note */}
          <div className={`p-4 rounded-lg border ${
            darkMode ? 'bg-gray-700/30 border-gray-600' : 'bg-gray-50 border-gray-200'
          }`}>
            <div className="flex items-center gap-2 mb-2">
              <FileText className={`w-5 h-5 ${
                darkMode ? 'text-gray-400' : 'text-gray-600'
              }`} />
              <h3 className={`font-semibold ${
                darkMode ? 'text-white' : 'text-gray-900'
              }`}>
                Technical Note (For Journalists)
              </h3>
            </div>
            <p className={`text-sm font-mono leading-relaxed ${
              darkMode ? 'text-gray-400' : 'text-gray-600'
            }`}>
              {claim.technical_note}
            </p>
          </div>
        </div>
      </motion.div>

      {/* Evidence Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className={`p-6 rounded-xl border ${
          darkMode ? 'bg-gray-800/50 border-gray-700' : 'bg-white border-gray-200'
        }`}
      >
        <h2 className={`text-xl font-semibold mb-4 ${
          darkMode ? 'text-white' : 'text-gray-900'
        }`}>
          Evidence Analysis
        </h2>

        {/* Supporting Evidence */}
        {claim.supporting_evidence.length > 0 && (
          <div className="mb-6">
            <h3 className={`font-semibold mb-3 flex items-center gap-2 ${
              darkMode ? 'text-green-400' : 'text-green-600'
            }`}>
              <CheckCircle className="w-5 h-5" />
              Supporting Evidence
            </h3>
            <div className="space-y-3">
              {claim.supporting_evidence.map((evidence, index) => (
                <div
                  key={index}
                  className={`p-4 rounded-lg border ${
                    darkMode ? 'bg-green-500/10 border-green-500/30' : 'bg-green-50 border-green-200'
                  }`}
                >
                  <div className="flex items-start justify-between gap-3 mb-2">
                    <p className={`font-semibold ${
                      darkMode ? 'text-white' : 'text-gray-900'
                    }`}>
                      {evidence.source}
                    </p>
                    <span className={`text-xs px-2 py-1 rounded-full whitespace-nowrap ${
                      darkMode ? 'bg-green-500/20 text-green-400' : 'bg-green-100 text-green-700'
                    }`}>
                      {(evidence.credibility * 100).toFixed(0)}% credible
                    </span>
                  </div>
                  <p className={`text-sm mb-2 ${
                    darkMode ? 'text-gray-300' : 'text-gray-700'
                  }`}>
                    {evidence.excerpt}
                  </p>
                  <a
                    href={evidence.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`inline-flex items-center gap-1 text-sm font-medium ${
                      darkMode ? 'text-blue-400 hover:text-blue-300' : 'text-blue-600 hover:text-blue-700'
                    }`}
                  >
                    View Source <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Refuting Evidence */}
        {claim.refuting_evidence.length > 0 && (
          <div>
            <h3 className={`font-semibold mb-3 flex items-center gap-2 ${
              darkMode ? 'text-red-400' : 'text-red-600'
            }`}>
              <AlertTriangle className="w-5 h-5" />
              Refuting Evidence
            </h3>
            <div className="space-y-3">
              {claim.refuting_evidence.map((evidence, index) => (
                <div
                  key={index}
                  className={`p-4 rounded-lg border ${
                    darkMode ? 'bg-red-500/10 border-red-500/30' : 'bg-red-50 border-red-200'
                  }`}
                >
                  <div className="flex items-start justify-between gap-3 mb-2">
                    <p className={`font-semibold ${
                      darkMode ? 'text-white' : 'text-gray-900'
                    }`}>
                      {evidence.source}
                    </p>
                    <span className={`text-xs px-2 py-1 rounded-full whitespace-nowrap ${
                      darkMode ? 'bg-red-500/20 text-red-400' : 'bg-red-100 text-red-700'
                    }`}>
                      {(evidence.credibility * 100).toFixed(0)}% credible
                    </span>
                  </div>
                  <p className={`text-sm mb-2 ${
                    darkMode ? 'text-gray-300' : 'text-gray-700'
                  }`}>
                    {evidence.excerpt}
                  </p>
                  <a
                    href={evidence.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`inline-flex items-center gap-1 text-sm font-medium ${
                      darkMode ? 'text-blue-400 hover:text-blue-300' : 'text-blue-600 hover:text-blue-700'
                    }`}
                  >
                    View Source <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
              ))}
            </div>
          </div>
        )}
      </motion.div>

      {/* Sources Used */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className={`rounded-xl border overflow-hidden ${
          darkMode ? 'bg-gray-800/50 border-gray-700' : 'bg-white border-gray-200'
        }`}
      >
        <button
          onClick={() => setShowSources(!showSources)}
          className={`w-full p-6 flex items-center justify-between transition-colors ${
            darkMode ? 'hover:bg-gray-700/30' : 'hover:bg-gray-50'
          }`}
        >
          <h2 className={`text-xl font-semibold ${
            darkMode ? 'text-white' : 'text-gray-900'
          }`}>
            All Sources Used ({claim.sources.length})
          </h2>
          {showSources ? (
            <ChevronUp className={darkMode ? 'text-gray-400' : 'text-gray-600'} />
          ) : (
            <ChevronDown className={darkMode ? 'text-gray-400' : 'text-gray-600'} />
          )}
        </button>
        {showSources && (
          <div className="px-6 pb-6 space-y-2">
            {claim.sources.map((source, index) => (
              <a
                key={index}
                href={source}
                target="_blank"
                rel="noopener noreferrer"
                className={`block p-3 rounded-lg border transition-colors ${
                  darkMode
                    ? 'bg-gray-700/30 border-gray-600 hover:bg-gray-700/50'
                    : 'bg-gray-50 border-gray-200 hover:bg-gray-100'
                }`}
              >
                <span className={`text-sm font-medium ${
                  darkMode ? 'text-blue-400' : 'text-blue-600'
                }`}>
                  {source}
                </span>
              </a>
            ))}
          </div>
        )}
      </motion.div>

      {/* Action Buttons */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="flex flex-wrap gap-3"
      >
        <button
          onClick={() => handleVerifyAction('Verified as True')}
          className={`px-6 py-3 rounded-lg font-medium transition-colors ${
            darkMode
              ? 'bg-green-500/20 text-green-400 hover:bg-green-500/30'
              : 'bg-green-50 text-green-600 hover:bg-green-100'
          }`}
        >
          Approve as True
        </button>
        <button
          onClick={() => handleVerifyAction('Flagged for Review')}
          className={`px-6 py-3 rounded-lg font-medium transition-colors ${
            darkMode
              ? 'bg-orange-500/20 text-orange-400 hover:bg-orange-500/30'
              : 'bg-orange-50 text-orange-600 hover:bg-orange-100'
          }`}
        >
          Flag for Review
        </button>
        <button
          onClick={() => handleVerifyAction('Marked as False')}
          className={`px-6 py-3 rounded-lg font-medium transition-colors ${
            darkMode
              ? 'bg-red-500/20 text-red-400 hover:bg-red-500/30'
              : 'bg-red-50 text-red-600 hover:bg-red-100'
          }`}
        >
          Mark as False
        </button>
      </motion.div>
    </div>
  );
};
