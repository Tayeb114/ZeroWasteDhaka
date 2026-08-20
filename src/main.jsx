import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter, Routes, Route, useNavigate, useLocation } from 'react-router-dom'
import App from './App.jsx'
import RestaurantManagerDashboard from './pages/dashboard.jsx'
import VolunteerMapFeed from './pages/map.jsx'
import WasteLogAnalytics from './pages/wastelog.jsx'
import ActiveClaimNavigation from './pages/active-claim.jsx'
import ProfileLeaderboard from './pages/Leaderboard.jsx'
import AuthPage from './pages/auth.jsx'
import './index.css'


ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<App />} />
        <Route path="/dashboard" element={<RestaurantManagerDashboard />} />
        <Route path="/map" element={<VolunteerMapFeed />} />
        <Route path="/wastelog" element={<WasteLogAnalytics />} />
        <Route path="/active-claim" element={<ActiveClaimNavigation />} />
        <Route path="/leaderboard" element={<ProfileLeaderboard />} />
        <Route path="/auth" element={<AuthPage />} />
      </Routes>
    </BrowserRouter>
  </React.StrictMode>,
)
