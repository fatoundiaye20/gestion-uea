import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import { Toaster } from 'react-hot-toast';


// Pages
import Home from './pages/Home';
import Login from './pages/auth/Login';
import ChefDashboard from './pages/chef/Dashboard';
import ResponsableDashboard from './pages/responsable/Dashboard';
import EnseignantDashboard from './pages/enseignant/Dashboard';
import AssistantDashboard from './pages/assistant/Dashboard';
import Unauthorized from './pages/Unauthorized';
import NotFound from './pages/NotFound';
import About from './pages/about';
import SuiviRegistres from './pages/assistant/SuiviRegistre';
import SuiviRegistre from "./pages/assistant/SuiviRegistre";

import Messages from './pages/assistant/Message';

function App() {
  return (
    <Router>
      <AuthProvider>
        <Toaster />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/unauthorized" element={<Unauthorized />} />

          {/* ✅ Route pour chef de département */}
          <Route
            path="/chef/*"
            element={
              <ProtectedRoute allowedRoles={['chef_dep']}>
                <ChefDashboard />
              </ProtectedRoute>
            }
          />

          {/* ✅ Route pour responsable de métier */}
          <Route
            path="/responsable/*"
            element={
              <ProtectedRoute allowedRoles={['responsable_metier']}>
                <ResponsableDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/assistant/messages"
            element={
              <ProtectedRoute allowedRoles={['assistant']}>
                <Messages />
              </ProtectedRoute>
            }
          />

          {/* ✅ Route pour le suivi des registres (accessible uniquement aux assistants) */}
<Route
  path="/assistant/suivi-registre"
  element={
    <ProtectedRoute allowedRoles={['assistant']}>
      <SuiviRegistre />
    </ProtectedRoute>
  }
/>


          {/* ✅ Route pour enseignant */}
          <Route
            path="/enseignant/*"
            element={
              <ProtectedRoute allowedRoles={['enseignant']}>
                <EnseignantDashboard />
              </ProtectedRoute>
            }
          />
           
          

          {/* ✅ Route pour assistant */}
          <Route
            path="/assistant/*"
            element={
              <ProtectedRoute allowedRoles={['assistant']}>
                <AssistantDashboard />
              </ProtectedRoute>
            }
          />

          {/* Redirection automatique selon le rôle */}
          <Route path="/dashboard" element={<RoleBasedRedirect />} />
          <Route path="*" element={<NotFound />} />

          {/* Page Découvrir plus */}
          <Route path="/about" element={<About />} />
        </Routes>
      </AuthProvider>
    </Router>
  );
}

const RoleBasedRedirect = () => {
  const { user, isAuthenticated, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!isAuthenticated || !user || !user.role) {
    return <Navigate to="/login" replace />;
  }

  const role = user.role.trim().toLowerCase();

  const redirectMap: Record<string, string> = {
    chef_dep: '/chef/home',
    responsable_metier: '/responsable/home',
    enseignant: '/enseignant/home',
    assistant: '/assistant/home',
  };

  const target = redirectMap[role];

  if (target) {
    return <Navigate to={target} replace />;
  }

  return <Navigate to="/unauthorized" replace />;
};






export default App;
