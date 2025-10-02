// src/components/ProtectedRoute.tsx
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import type { ReactNode } from "react";

interface ProtectedRouteProps {
  children: ReactNode;
  allowedRoles?: string[];
}

const ProtectedRoute = ({ children, allowedRoles }: ProtectedRouteProps) => {
  const { user, loading, isAuthenticated } = useAuth();

  if (loading) {
    console.log("🔄 Chargement en cours...");
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!isAuthenticated || !user) {
    console.log("🚫 Utilisateur non authentifié");
    return <Navigate to="/login" replace />;
  }

  const userRole = user.role?.trim().toLowerCase();
  const allowed = allowedRoles?.map(role => role.trim().toLowerCase());

  console.log("👤 Rôle utilisateur :", userRole);
  console.log("✅ Rôles autorisés :", allowed);

  // ✅ Si aucun rôle n’est requis, autoriser
  if (!allowed || allowed.length === 0) {
    return <>{children}</>;
  }

  // ✅ Si le rôle est reconnu, autoriser
  if (userRole && allowed.includes(userRole)) {
    return <>{children}</>;
  }

  console.warn("❌ Rôle non autorisé :", userRole);
  return <Navigate to="/unauthorized" replace />;
};

export default ProtectedRoute;
