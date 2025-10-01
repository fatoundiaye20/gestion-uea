// src/App.tsx
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';

// Pages
import Home from './pages/Home';
import Login from './pages/auth/Login';
import ChefDashboard from './pages/chef/Dashboard';
import ResponsableDashboard from './pages/responsable/Dashboard';
import EnseignantDashboard from './pages/enseignant/Dashboard';
import AssistantDashboard from './pages/assistant/Dashboard';
import Unauthorized from './pages/Unauthorized';
import NotFound from './pages/NotFound';

function App() {
  return (
    <Router>
      <AuthProvider>
        <Routes>
          {/* Route par défaut : Home */}
          <Route path="/" element={<Home />} />

          {/* Routes publiques */}
          <Route path="/login" element={<Login />} />
          <Route path="/unauthorized" element={<Unauthorized />} />

          {/* Dashboard Chef de Département */}
          <Route
            path="/chef/*"
            element={
              <ProtectedRoute allowedRoles={['chef_dep']}>
                <ChefDashboard />
              </ProtectedRoute>
            }
          />

          {/* Dashboard Responsable de Métier */}
          <Route
            path="/responsable/*"
            element={
              <ProtectedRoute allowedRoles={['responsable_metier']}>
                <ResponsableDashboard />
              </ProtectedRoute>
            }
          />

          {/* Dashboard Enseignant */}
          <Route
            path="/enseignant/*"
            element={
              <ProtectedRoute allowedRoles={['enseignant']}>
                <EnseignantDashboard />
              </ProtectedRoute>
            }
          />

          {/* Dashboard Assistant */}
          <Route
            path="/assistant/*"
            element={
              <ProtectedRoute allowedRoles={['assistant']}>
                <AssistantDashboard />
              </ProtectedRoute>
            }
          />

          {/* Redirection automatique si déjà connecté */}
          <Route path="/dashboard" element={<RoleBasedRedirect />} />

          {/* Page 404 */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </AuthProvider>
    </Router>
  );
}

// Redirection selon rôle
const RoleBasedRedirect = () => {
  const userStr = localStorage.getItem('user');
  const token = localStorage.getItem('token');

  if (!token || !userStr) {
    return <Navigate to="/login" replace />;
  }

  const user = JSON.parse(userStr);
  const redirectMap: Record<string, string> = {
    chef_dep: '/chef',
    responsable_metier: '/responsable',
    enseignant: '/enseignant',
    assistant: '/assistant',
  };

  return <Navigate to={redirectMap[user.role] || '/login'} replace />;
};

export default App;
