import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import Dashboard from './pages/Dashboard';
import Customers from './pages/Customers/List';
import CustomerView from './pages/Customers/View';
import CampaignBuilder from './pages/Campaigns/Builder';
import CampaignHistory from './pages/Campaigns/History';
import Login from './pages/Auth/Login';
import Settings from './pages/Settings';
import { AuthProvider } from './services/auth';
import PrivateRoute from './components/common/PrivateRoute';

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route element={<Layout />}>
            <Route path="/" element={<PrivateRoute><Dashboard /></PrivateRoute>} />
            <Route path="/dashboard" element={<PrivateRoute><Dashboard /></PrivateRoute>} />
            <Route path="/customers" element={<PrivateRoute><Customers /></PrivateRoute>} />
            <Route path="/customers/:id" element={<PrivateRoute><CustomerView /></PrivateRoute>} />
            <Route path="/campaigns" element={<PrivateRoute><CampaignBuilder /></PrivateRoute>} />
            <Route path="/campaigns/history" element={<PrivateRoute><CampaignHistory /></PrivateRoute>} />
            <Route path="/settings" element={<PrivateRoute><Settings /></PrivateRoute>} />
          </Route>
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;