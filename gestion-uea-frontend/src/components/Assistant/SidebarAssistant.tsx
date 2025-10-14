import React from 'react';
import {
  Home,
  Calendar,
  BarChart3,
  Bell,
  Users,
  Settings,
  LogOut
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface SidebarProps {
  theme: 'light' | 'dark';
}

const SidebarAssistant: React.FC<SidebarProps> = ({ theme }) => {
  const navigate = useNavigate();

  // --- Navigation des pages ---
  const menuItems = [
    { id: 'home', icon: Home, label: 'Accueil' },
    { id: 'seances', icon: Calendar, label: 'Séances' },
    { id: 'statistiques', icon: BarChart3, label: 'Statistiques' },
    { id: 'notifications', icon: Bell, label: 'Notifications' },
    { id: 'parametres', icon: Settings, label: 'Paramètres' },
    { id: 'logout', icon: LogOut, label: 'Déconnexion' }
  ];

  // --- Déconnexion ---
  const handleLogout = () => {
    // Supprimer éventuellement le token ou les infos de session
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/'); // Redirige vers la page d'accueil
  };

  return (
    <aside
      className={`fixed top-0 left-0 h-screen w-64 flex flex-col justify-between border-r transition-colors duration-300 ${
        theme === 'light'
          ? 'bg-white border-gray-200 text-gray-800'
          : 'bg-gray-900 border-gray-700 text-gray-100'
      }`}
    >
      {/* --- Partie haute : Logo + menu --- */}
      <div>
        {/* Logo */}
        <div
          className={`flex items-center gap-3 px-6 py-5 border-b ${
            theme === 'light' ? 'border-gray-200' : 'border-gray-700'
          }`}
        >
          <div className="w-10 h-10 flex items-center justify-center rounded-lg bg-gradient-to-br from-indigo-500 to-blue-500 shadow-md">
            <Users className="w-6 h-6 text-white" />
          </div>
          <div>
            <h2 className="text-lg font-bold">Assistant</h2>
            <p
              className={`text-xs ${
                theme === 'light' ? 'text-gray-500' : 'text-gray-400'
              }`}
            >
              ISEP Thiès
            </p>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-4 py-6 space-y-2">
          {menuItems.map((item) => {
            const Icon = item.icon;
            return (
              <button
                key={item.id}
                onClick={() => navigate(`/assistant/${item.id}`)}
                className={`flex items-center gap-3 w-full px-4 py-2.5 rounded-lg transition-colors text-sm font-medium ${
                  theme === 'light'
                    ? 'hover:bg-gray-100 text-gray-700'
                    : 'hover:bg-gray-800 text-gray-200'
                }`}
              >
                <Icon className="w-5 h-5" />
                {item.label}
              </button>
            );
          })}
        </nav>
      </div>

      {/* espace bas (peut contenir autre chose si besoin) */}
      <div className={`p-4 border-t ${theme === 'light' ? 'border-gray-200' : 'border-gray-700'}`}>
        <p className={`text-xs ${theme === 'light' ? 'text-gray-500' : 'text-gray-400'} text-center`}>
          © ISEP Thiès
        </p>
      </div>
    </aside>
  );
};

export default SidebarAssistant;
