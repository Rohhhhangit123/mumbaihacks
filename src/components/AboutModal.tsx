import { motion, AnimatePresence } from 'framer-motion';
import { useAppStore } from '../context/AppStore';
import { X, Shield, Search, Zap, Globe } from 'lucide-react';

export const AboutModal = () => {
  const { showAboutModal, setShowAboutModal, darkMode } = useAppStore();

  if (!showAboutModal) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={() => setShowAboutModal(false)}
          className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        />

        {/* Modal */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className={`relative max-w-2xl w-full max-h-[90vh] overflow-y-auto rounded-2xl shadow-2xl ${
            darkMode ? 'bg-gray-800' : 'bg-white'
          }`}
        >
          {/* Header */}
          <div className={`sticky top-0 flex items-center justify-between p-6 border-b ${
            darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
          }`}>
            <div className="flex items-center gap-3">
              <div className={`p-2 rounded-lg ${
                darkMode ? 'bg-blue-500/20' : 'bg-blue-50'
              }`}>
                <Shield className={`w-6 h-6 ${
                  darkMode ? 'text-blue-400' : 'text-blue-600'
                }`} />
              </div>
              <h2 className={`text-2xl font-bold ${
                darkMode ? 'text-white' : 'text-gray-900'
              }`}>
                About TruthLens
              </h2>
            </div>
            <button
              onClick={() => setShowAboutModal(false)}
              className={`p-2 rounded-lg transition-colors ${
                darkMode
                  ? 'hover:bg-gray-700 text-gray-400'
                  : 'hover:bg-gray-100 text-gray-600'
              }`}
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Content */}
          <div className="p-6 space-y-6">
            <div>
              <p className={`text-lg leading-relaxed ${
                darkMode ? 'text-gray-300' : 'text-gray-700'
              }`}>
                TruthLens is an advanced AI-powered platform designed to detect, analyze, and
                combat misinformation in real-time. Built for journalists, analysts, and the
                public, it provides comprehensive tools to verify claims and track emerging
                misinformation trends.
              </p>
            </div>

            <div className="space-y-4">
              <h3 className={`text-xl font-semibold ${
                darkMode ? 'text-white' : 'text-gray-900'
              }`}>
                How It Works
              </h3>

              <div className="grid gap-4">
                <div className="flex gap-4">
                  <div className={`flex-shrink-0 p-3 rounded-lg ${
                    darkMode ? 'bg-blue-500/20' : 'bg-blue-50'
                  }`}>
                    <Search className={`w-6 h-6 ${
                      darkMode ? 'text-blue-400' : 'text-blue-600'
                    }`} />
                  </div>
                  <div>
                    <h4 className={`font-semibold mb-1 ${
                      darkMode ? 'text-white' : 'text-gray-900'
                    }`}>
                      Claim Detection & Clustering
                    </h4>
                    <p className={`text-sm ${
                      darkMode ? 'text-gray-400' : 'text-gray-600'
                    }`}>
                      Our AI continuously monitors multiple sources to detect potential
                      misinformation claims and groups related claims into clusters for
                      efficient analysis.
                    </p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className={`flex-shrink-0 p-3 rounded-lg ${
                    darkMode ? 'bg-green-500/20' : 'bg-green-50'
                  }`}>
                    <Zap className={`w-6 h-6 ${
                      darkMode ? 'text-green-400' : 'text-green-600'
                    }`} />
                  </div>
                  <div>
                    <h4 className={`font-semibold mb-1 ${
                      darkMode ? 'text-white' : 'text-gray-900'
                    }`}>
                      Evidence Retrieval & Ranking
                    </h4>
                    <p className={`text-sm ${
                      darkMode ? 'text-gray-400' : 'text-gray-600'
                    }`}>
                      The system automatically retrieves relevant evidence from credible sources
                      and ranks them based on reliability and relevance to provide comprehensive
                      fact-checking.
                    </p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className={`flex-shrink-0 p-3 rounded-lg ${
                    darkMode ? 'bg-purple-500/20' : 'bg-purple-50'
                  }`}>
                    <Shield className={`w-6 h-6 ${
                      darkMode ? 'text-purple-400' : 'text-purple-600'
                    }`} />
                  </div>
                  <div>
                    <h4 className={`font-semibold mb-1 ${
                      darkMode ? 'text-white' : 'text-gray-900'
                    }`}>
                      Veracity Scoring
                    </h4>
                    <p className={`text-sm ${
                      darkMode ? 'text-gray-400' : 'text-gray-600'
                    }`}>
                      Advanced ML models analyze evidence to assign confidence scores and
                      veracity ratings, helping you quickly assess the truthfulness of claims.
                    </p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className={`flex-shrink-0 p-3 rounded-lg ${
                    darkMode ? 'bg-orange-500/20' : 'bg-orange-50'
                  }`}>
                    <Globe className={`w-6 h-6 ${
                      darkMode ? 'text-orange-400' : 'text-orange-600'
                    }`} />
                  </div>
                  <div>
                    <h4 className={`font-semibold mb-1 ${
                      darkMode ? 'text-white' : 'text-gray-900'
                    }`}>
                      AI Explanation Generation
                    </h4>
                    <p className={`text-sm ${
                      darkMode ? 'text-gray-400' : 'text-gray-600'
                    }`}>
                      Get both plain-language explanations for the public and technical notes
                      for journalists, making complex fact-checks accessible to all audiences.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className={`p-4 rounded-lg border ${
              darkMode
                ? 'bg-blue-500/10 border-blue-500/30'
                : 'bg-blue-50 border-blue-200'
            }`}>
              <p className={`text-sm ${
                darkMode ? 'text-blue-300' : 'text-blue-900'
              }`}>
                <strong>Note:</strong> This is a demonstration interface. In production, TruthLens
                connects to backend AI pipelines that process claims in real-time and integrate
                with live data sources.
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
