import React, { useState, useEffect } from 'react';
import { HashRouter, Routes, Route, useParams, useNavigate, useLocation } from 'react-router-dom';
import DashboardPage from './pages/DashboardPage.tsx';
import LoginPage from './pages/LoginPage.tsx';

const App: React.FC = () => {
  return (
    <div className="min-h-screen bg-slate-50 text-slate-800">
      <HashRouter>
        <AppContent />
      </HashRouter>
    </div>
  );
};

const AppContent: React.FC = () => {
  const [userId, setUserId] = useState<string | null>(null);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const hash = location.hash;
    const match = hash.match(/^#\/user\/(0x[a-fA-F0-9]+)$/);
    if (match && match[1]) {
      const key = match[1];
      setUserId(key);
      localStorage.setItem('capacity-tracker-key', key);
    } else {
      const storedKey = localStorage.getItem('capacity-tracker-key');
      if (storedKey) {
        navigate(`/user/${storedKey}`);
      } else {
        setUserId(null);
        if (location.pathname !== "/") {
           navigate('/');
        }
      }
    }
  }, [location, navigate]);

  return (
    <Routes>
      <Route path="/user/:userId" element={<DashboardPageWrapper />} />
      <Route path="/" element={<LoginPage />} />
    </Routes>
  );
};

const DashboardPageWrapper: React.FC = () => {
  const { userId } = useParams<{ userId: string }>();
  if (!userId) {
    return <LoginPage />;
  }
  return <DashboardPage userId={userId} />;
};


export default App;