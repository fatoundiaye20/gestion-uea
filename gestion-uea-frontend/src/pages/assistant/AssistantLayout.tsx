import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import BarChartIcon from '@mui/icons-material/BarChart';
import EventIcon from '@mui/icons-material/Event';
import SchoolIcon from '@mui/icons-material/School';
import PeopleIcon from '@mui/icons-material/People';
import DescriptionIcon from '@mui/icons-material/Description';
import SettingsIcon from '@mui/icons-material/Settings';
import MenuBookIcon from '@mui/icons-material/MenuBook';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import NotificationsIcon from '@mui/icons-material/Notifications';

type Props = {
  children: React.ReactNode;
};

const AssistantLayout = ({ children }: Props) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [assistantName, setAssistantName] = useState('Assistant');

  useEffect(() => {
    // Ici tu peux récupérer le nom de l'assistant depuis ton API ou localStorage
    const storedName = localStorage.getItem('userName');
    if (storedName) setAssistantName(storedName);
  }, []);

  const colors = {
    bg: '#f8fafc',
    text: '#1e293b',
    card: '#ffffff',
    shadow: '0 2px 8px rgba(0,0,0,0.1)',
    activeBg: '#3b82f6',
    activeText: '#ffffff',
    hoverBg: '#e0f2fe',
    danger: '#ef4444'
  };

  const navItems = [
    { key: 'home', label: 'Tableau de bord', icon: <BarChartIcon /> },
    { key: 'seances', label: 'Séances', icon: <EventIcon /> },
    { key: 'ueas', label: 'UEAs', icon: <MenuBookIcon /> },
    { key: 'salles', label: 'Salles', icon: <DescriptionIcon /> },
    { key: 'notifications', label: 'Notifications', icon: <NotificationsIcon /> },
    { key: 'statistiques', label: 'Statistiques', icon: <SchoolIcon /> },
    { key: 'parametres', label: 'Paramètres', icon: <SettingsIcon /> }
  ];

  // Détecte la route courante pour le bouton actif
  const currentKey = location.pathname.split('/').pop();

  return (
    <div style={{ backgroundColor: colors.bg, minHeight: '100vh', color: colors.text }}>
      {/* Sidebar */}
      <aside
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '280px',
          height: '100vh',
          backgroundColor: colors.card,
          padding: '2rem 1.5rem',
          boxShadow: colors.shadow,
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          overflowY: 'auto',
          borderRight: '1px solid #e2e8f0',
          zIndex: 1000
        }}
      >
        <div>
          <div style={{ marginBottom: '3rem' }}>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.75rem',
              marginBottom: '0.5rem',
              fontWeight: '700',
              fontSize: '1.5rem',
              color: colors.text
            }}>
              <AccountCircleIcon style={{ fontSize: '2rem' }} />
              Assistant
            </div>
            <p style={{ margin: 0, fontSize: '0.875rem', color: '#64748b', paddingLeft: '2.75rem' }}>
              {assistantName}
            </p>
            <p style={{ margin: 0, fontSize: '0.75rem', color: '#94a3b8', paddingLeft: '2.75rem' }}>
              ISEP Thiès
            </p>
          </div>

          <nav style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            {navItems.map(item => {
              const isActive = currentKey === item.key;
              return (
                <button
                  key={item.key}
                  onClick={() => navigate(`/assistant/${item.key}`)}
                  style={{
                    backgroundColor: isActive ? colors.activeBg : 'transparent',
                    color: isActive ? colors.activeText : colors.text,
                    border: 'none',
                    padding: '0.875rem 1rem',
                    textAlign: 'left',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.75rem',
                    cursor: 'pointer',
                    borderRadius: '0.75rem',
                    fontWeight: isActive ? '600' : '500',
                    fontSize: '0.95rem',
                    transition: 'all 0.2s ease'
                  }}
                  onMouseEnter={e => {
                    if (!isActive) e.currentTarget.style.backgroundColor = colors.hoverBg;
                  }}
                  onMouseLeave={e => {
                    if (!isActive) e.currentTarget.style.backgroundColor = 'transparent';
                  }}
                >
                  {item.icon} {item.label}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Déconnexion */}
        <div style={{ paddingTop: '2rem', borderTop: '1px solid #e2e8f0' }}>
          <button
            onClick={() => {
              localStorage.clear();
              navigate('/login');
            }}
            style={{
              backgroundColor: 'transparent',
              color: colors.danger,
              border: 'none',
              padding: '0.875rem 1rem',
              borderRadius: '0.75rem',
              cursor: 'pointer',
              fontWeight: '500',
              fontSize: '0.95rem',
              width: '100%',
              display: 'flex',
              alignItems: 'center',
              gap: '0.75rem',
              transition: 'all 0.2s ease'
            }}
            onMouseEnter={e => {
              e.currentTarget.style.backgroundColor = 'rgba(239,68,68,0.1)';
            }}
            onMouseLeave={e => {
              e.currentTarget.style.backgroundColor = 'transparent';
            }}
          >
            Déconnexion
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main style={{
        marginLeft: '280px',
        padding: '2rem',
        minHeight: '100vh'
      }}>
        {children}
      </main>
    </div>
  );
};

export default AssistantLayout;
