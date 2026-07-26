import React, { useState, useEffect } from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import RestaurantManagerDashboard from './pages/dashboard.jsx'
import VolunteerMapFeed from './pages/map.jsx'
import WasteLogAnalytics from './pages/wastelog.jsx'
import ActiveClaimNavigation from './pages/active-claim.jsx'
import ProfileLeaderboard from './pages/Leaderboard.jsx'
import AuthPage from './pages/auth.jsx'
import './index.css'

function Router() {
  const [currentPath, setCurrentPath] = useState(window.location.pathname);

  useEffect(() => {
    const handleLocationChange = () => {
      setCurrentPath(window.location.pathname);
    };
    
    // Listen to popstate and custom pushState events
    window.addEventListener('popstate', handleLocationChange);
    window.addEventListener('pushstate', handleLocationChange);
    
    return () => {
      window.removeEventListener('popstate', handleLocationChange);
      window.removeEventListener('pushstate', handleLocationChange);
    };
  }, []);

  const navigate = (path) => {
    window.history.pushState({}, '', path);
    window.dispatchEvent(new Event('pushstate'));
  };

  return (
    <>
      <div className="fixed bottom-6 right-6 z-50 flex gap-3 bg-white/80 backdrop-blur-md border border-gray-200 p-2 rounded-full shadow-xl">
        <button 
          onClick={() => navigate('/')} 
          className={`text-xs font-semibold px-4 py-2.5 rounded-full transition-all ${
            currentPath === '/' 
              ? 'bg-emerald-700 text-white shadow-sm' 
              : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
          }`}
        >
          Landing Page
        </button>
        <button 
          onClick={() => navigate('/dashboard')} 
          className={`text-xs font-semibold px-4 py-2.5 rounded-full transition-all ${
            currentPath === '/dashboard' 
              ? 'bg-emerald-700 text-white shadow-sm' 
              : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
          }`}
        >
          Manager Dashboard
        </button>
        <button 
          onClick={() => navigate('/map')} 
          className={`text-xs font-semibold px-4 py-2.5 rounded-full transition-all ${
            currentPath === '/map' 
              ? 'bg-emerald-700 text-white shadow-sm' 
              : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
          }`}
        >
          Volunteer Map
        </button>
        <button 
          onClick={() => navigate('/wastelog')} 
          className={`text-xs font-semibold px-4 py-2.5 rounded-full transition-all ${
            currentPath === '/wastelog' 
              ? 'bg-emerald-700 text-white shadow-sm' 
              : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
          }`}
        >
          Waste Log
        </button>
        <button 
          onClick={() => navigate('/active-claim')} 
          className={`text-xs font-semibold px-4 py-2.5 rounded-full transition-all ${
            currentPath === '/active-claim' 
              ? 'bg-emerald-700 text-white shadow-sm' 
              : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
          }`}
        >
          Active Claim
        </button>
        <button 
          onClick={() => navigate('/leaderboard')} 
          className={`text-xs font-semibold px-4 py-2.5 rounded-full transition-all ${
            currentPath === '/leaderboard' 
              ? 'bg-emerald-700 text-white shadow-sm' 
              : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
          }`}
        >
          Leaderboard
        </button>
        <button 
          onClick={() => navigate('/auth')} 
          className={`text-xs font-semibold px-4 py-2.5 rounded-full transition-all ${
            currentPath === '/auth' 
              ? 'bg-emerald-700 text-white shadow-sm' 
              : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
          }`}
        >
          Auth Page
        </button>
      </div>
      {currentPath === '/dashboard' ? (
        <RestaurantManagerDashboard />
      ) : currentPath === '/map' ? (
        <VolunteerMapFeed />
      ) : currentPath === '/wastelog' ? (
        <WasteLogAnalytics />
      ) : currentPath === '/active-claim' ? (
        <ActiveClaimNavigation />
      ) : currentPath === '/leaderboard' ? (
        <ProfileLeaderboard />
      ) : currentPath === '/auth' ? (
        <AuthPage />
      ) : (
        <App />
      )}
    </>
  );
}

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <Router />
  </React.StrictMode>,
)
