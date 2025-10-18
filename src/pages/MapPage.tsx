import { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import { motion, AnimatePresence } from 'framer-motion';
import L from 'leaflet';
import { X, AlertCircle, MapPin } from 'lucide-react';
import { useAppStore } from '../context/AppStore';
import { LoadingSkeleton } from '../components/LoadingSkeleton';
import { getHotspots, Claim } from '../api/agentService';
import { Link } from 'react-router-dom';
import { format } from 'date-fns';

// Fix Leaflet default icon issue
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
});

export const MapPage = () => {
  const { darkMode } = useAppStore();
  const [hotspots, setHotspots] = useState<Claim[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedRegion, setSelectedRegion] = useState<string | null>(null);
  const [showSidebar, setShowSidebar] = useState(false);

  useEffect(() => {
    const loadHotspots = async () => {
      setLoading(true);
      try {
        const data = await getHotspots();
        setHotspots(data);
      } catch (error) {
        console.error('Failed to load hotspots:', error);
      } finally {
        setLoading(false);
      }
    };

    loadHotspots();
  }, []);

  const groupByRegion = (claims: Claim[]) => {
    const grouped: { [key: string]: Claim[] } = {};
    claims.forEach((claim) => {
      if (!grouped[claim.region]) {
        grouped[claim.region] = [];
      }
      grouped[claim.region].push(claim);
    });
    return grouped;
  };

  const regionGroups = groupByRegion(hotspots);

  const handleMarkerClick = (region: string) => {
    setSelectedRegion(region);
    setShowSidebar(true);
  };

  const getMarkerColor = (claims: Claim[]) => {
    const avgConfidence = claims.reduce((sum, c) => sum + c.confidence, 0) / claims.length;
    if (avgConfidence > 0.8) return 'red';
    if (avgConfidence > 0.6) return 'orange';
    return 'yellow';
  };

  const createCustomIcon = (color: string, count: number) => {
    return L.divIcon({
      className: 'custom-marker',
      html: `
        <div style="
          background-color: ${color === 'red' ? '#ef4444' : color === 'orange' ? '#f97316' : '#eab308'};
          width: 40px;
          height: 40px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          color: white;
          font-weight: bold;
          font-size: 14px;
          border: 3px solid white;
          box-shadow: 0 2px 8px rgba(0,0,0,0.3);
        ">
          ${count}
        </div>
      `,
      iconSize: [40, 40],
      iconAnchor: [20, 20],
    });
  };

  if (loading) {
    return <LoadingSkeleton />;
  }

  const selectedClaims = selectedRegion ? regionGroups[selectedRegion] : [];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className={`text-3xl font-bold mb-2 ${
          darkMode ? 'text-white' : 'text-gray-900'
        }`}>
          Geographic Hotspots
        </h1>
        <p className={darkMode ? 'text-gray-400' : 'text-gray-600'}>
          Visualize misinformation clusters by location
        </p>
      </div>

      {/* Legend */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className={`p-4 rounded-xl border ${
          darkMode ? 'bg-gray-800/50 border-gray-700' : 'bg-white border-gray-200'
        }`}
      >
        <div className="flex flex-wrap items-center gap-6">
          <h3 className={`font-semibold ${
            darkMode ? 'text-white' : 'text-gray-900'
          }`}>
            Severity Legend:
          </h3>
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-full bg-red-500 border-2 border-white" />
            <span className={`text-sm ${
              darkMode ? 'text-gray-300' : 'text-gray-700'
            }`}>
              High (80%+ confidence)
            </span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-full bg-orange-500 border-2 border-white" />
            <span className={`text-sm ${
              darkMode ? 'text-gray-300' : 'text-gray-700'
            }`}>
              Medium (60-80%)
            </span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-full bg-yellow-500 border-2 border-white" />
            <span className={`text-sm ${
              darkMode ? 'text-gray-300' : 'text-gray-700'
            }`}>
              Low (&lt;60%)
            </span>
          </div>
        </div>
      </motion.div>

      {/* Map Container */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="relative"
      >
        <div className={`rounded-xl overflow-hidden border ${
          darkMode ? 'border-gray-700' : 'border-gray-200'
        }`} style={{ height: '600px' }}>
          <MapContainer
            center={[20.5937, 78.9629]}
            zoom={5}
            style={{ height: '100%', width: '100%' }}
          >
            <TileLayer
              url={darkMode
                ? 'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png'
                : 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png'
              }
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            />
            {Object.entries(regionGroups).map(([region, claims]) => {
              const firstClaim = claims[0];
              const color = getMarkerColor(claims);
              const icon = createCustomIcon(color, claims.length);

              return (
                <Marker
                  key={region}
                  position={[firstClaim.latitude, firstClaim.longitude]}
                  icon={icon}
                  eventHandlers={{
                    click: () => handleMarkerClick(region),
                  }}
                >
                  <Popup>
                    <div className="p-2">
                      <h3 className="font-bold text-lg mb-1">{region}</h3>
                      <p className="text-sm text-gray-600">
                        {claims.length} claim{claims.length !== 1 ? 's' : ''} detected
                      </p>
                      <button
                        onClick={() => handleMarkerClick(region)}
                        className="mt-2 text-sm text-blue-600 hover:text-blue-700 font-medium"
                      >
                        View Details →
                      </button>
                    </div>
                  </Popup>
                </Marker>
              );
            })}
          </MapContainer>
        </div>

        {/* Sidebar Panel */}
        <AnimatePresence>
          {showSidebar && selectedRegion && (
            <motion.div
              initial={{ x: 400, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: 400, opacity: 0 }}
              transition={{ type: 'spring', damping: 25 }}
              className={`absolute top-0 right-0 w-full md:w-96 h-full rounded-xl border shadow-2xl overflow-hidden ${
                darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
              }`}
            >
              {/* Sidebar Header */}
              <div className={`flex items-center justify-between p-4 border-b ${
                darkMode ? 'border-gray-700 bg-gray-800' : 'border-gray-200 bg-white'
              }`}>
                <div className="flex items-center gap-2">
                  <MapPin className={`w-5 h-5 ${
                    darkMode ? 'text-blue-400' : 'text-blue-600'
                  }`} />
                  <h2 className={`text-lg font-bold ${
                    darkMode ? 'text-white' : 'text-gray-900'
                  }`}>
                    {selectedRegion}
                  </h2>
                </div>
                <button
                  onClick={() => setShowSidebar(false)}
                  className={`p-2 rounded-lg transition-colors ${
                    darkMode
                      ? 'hover:bg-gray-700 text-gray-400'
                      : 'hover:bg-gray-100 text-gray-600'
                  }`}
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Sidebar Content */}
              <div className="p-4 overflow-y-auto" style={{ height: 'calc(100% - 64px)' }}>
                <div className={`mb-4 p-3 rounded-lg ${
                  darkMode ? 'bg-blue-500/10' : 'bg-blue-50'
                }`}>
                  <div className="flex items-center gap-2 mb-1">
                    <AlertCircle className={`w-4 h-4 ${
                      darkMode ? 'text-blue-400' : 'text-blue-600'
                    }`} />
                    <span className={`text-sm font-semibold ${
                      darkMode ? 'text-blue-400' : 'text-blue-600'
                    }`}>
                      {selectedClaims.length} Claim{selectedClaims.length !== 1 ? 's' : ''} Detected
                    </span>
                  </div>
                  <p className={`text-xs ${
                    darkMode ? 'text-gray-400' : 'text-gray-600'
                  }`}>
                    Click on any claim to view full details
                  </p>
                </div>

                <div className="space-y-3">
                  {selectedClaims.map((claim) => (
                    <Link
                      key={claim.id}
                      to={`/claim/${claim.id}`}
                      className={`block p-4 rounded-lg border transition-all hover:shadow-md ${
                        darkMode
                          ? 'bg-gray-700/30 border-gray-600 hover:bg-gray-700/50'
                          : 'bg-gray-50 border-gray-200 hover:bg-gray-100'
                      }`}
                    >
                      <div className="flex items-start gap-2 mb-2">
                        <span className={`flex-shrink-0 px-2 py-1 rounded text-xs font-bold ${
                          darkMode ? 'bg-gray-700 text-gray-300' : 'bg-gray-200 text-gray-600'
                        }`}>
                          {claim.id}
                        </span>
                        <span className={`flex-shrink-0 px-2 py-1 rounded text-xs font-medium ${
                          claim.veracity.includes('False')
                            ? darkMode ? 'bg-red-500/20 text-red-400' : 'bg-red-50 text-red-600'
                            : claim.veracity.includes('True')
                            ? darkMode ? 'bg-green-500/20 text-green-400' : 'bg-green-50 text-green-600'
                            : darkMode ? 'bg-yellow-500/20 text-yellow-400' : 'bg-yellow-50 text-yellow-600'
                        }`}>
                          {claim.veracity}
                        </span>
                      </div>
                      <p className={`text-sm font-medium mb-2 line-clamp-2 ${
                        darkMode ? 'text-white' : 'text-gray-900'
                      }`}>
                        {claim.text}
                      </p>
                      <div className="flex items-center gap-3 text-xs">
                        <span className={darkMode ? 'text-gray-400' : 'text-gray-600'}>
                          {(claim.confidence * 100).toFixed(0)}% confidence
                        </span>
                        <span className={darkMode ? 'text-gray-500' : 'text-gray-500'}>
                          {format(new Date(claim.date), 'MMM dd')}
                        </span>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

      {/* Stats Summary */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="grid grid-cols-1 md:grid-cols-3 gap-4"
      >
        <div className={`p-4 rounded-xl border ${
          darkMode ? 'bg-gray-800/50 border-gray-700' : 'bg-white border-gray-200'
        }`}>
          <p className={`text-sm mb-1 ${
            darkMode ? 'text-gray-400' : 'text-gray-600'
          }`}>
            Total Regions
          </p>
          <p className={`text-2xl font-bold ${
            darkMode ? 'text-white' : 'text-gray-900'
          }`}>
            {Object.keys(regionGroups).length}
          </p>
        </div>
        <div className={`p-4 rounded-xl border ${
          darkMode ? 'bg-gray-800/50 border-gray-700' : 'bg-white border-gray-200'
        }`}>
          <p className={`text-sm mb-1 ${
            darkMode ? 'text-gray-400' : 'text-gray-600'
          }`}>
            Total Claims
          </p>
          <p className={`text-2xl font-bold ${
            darkMode ? 'text-white' : 'text-gray-900'
          }`}>
            {hotspots.length}
          </p>
        </div>
        <div className={`p-4 rounded-xl border ${
          darkMode ? 'bg-gray-800/50 border-gray-700' : 'bg-white border-gray-200'
        }`}>
          <p className={`text-sm mb-1 ${
            darkMode ? 'text-gray-400' : 'text-gray-600'
          }`}>
            Highest Alert
          </p>
          <p className={`text-2xl font-bold ${
            darkMode ? 'text-white' : 'text-gray-900'
          }`}>
            {Object.entries(regionGroups).sort((a, b) => b[1].length - a[1].length)[0]?.[0] || 'N/A'}
          </p>
        </div>
      </motion.div>
    </div>
  );
};
