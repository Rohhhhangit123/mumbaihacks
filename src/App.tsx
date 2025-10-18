import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Layout } from './components/Layout';
import { Toast } from './components/Toast';
import { AboutModal } from './components/AboutModal';
import { HomePage } from './pages/HomePage';
import { ClaimsExplorerPage } from './pages/ClaimsExplorerPage';
import { ClaimDetailPage } from './pages/ClaimDetailPage';
import { ModeratorPage } from './pages/ModeratorPage';
import { MapPage } from './pages/MapPage';
import { useAppStore } from './context/AppStore';

function App() {
  const { darkMode } = useAppStore();

  return (
    <Router>
      <div className={darkMode ? 'dark' : ''}>
        <Layout>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/claims" element={<ClaimsExplorerPage />} />
            <Route path="/claim/:id" element={<ClaimDetailPage />} />
            <Route path="/moderator" element={<ModeratorPage />} />
            <Route path="/map" element={<MapPage />} />
          </Routes>
        </Layout>
        <Toast />
        <AboutModal />
      </div>
    </Router>
  );
}

export default App;
