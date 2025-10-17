import { useEffect, useState } from 'react';
import { apiClient } from '../../api/client';
import BarChartIcon from '@mui/icons-material/BarChart';
import EventIcon from '@mui/icons-material/Event';
import SchoolIcon from '@mui/icons-material/School';
import BuildIcon from '@mui/icons-material/Build';
import NotificationsIcon from '@mui/icons-material/Notifications';
import SettingsIcon from '@mui/icons-material/Settings';
import MenuBookIcon from '@mui/icons-material/MenuBook';
import MeetingRoomIcon from '@mui/icons-material/MeetingRoom';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';

type Props = {
  active: string;
  onNavigate: (section: any) => void;
  children: React.ReactNode;
};

const ResponsableLayout = ({ active, onNavigate, children }: Props) => {
  const [chefName, setChefName] = useState('');
  const [showConfirm, setShowConfirm] = useState(false);

  useEffect(() => {
    const fetchChef = async () => {
      try {
        const data = await apiClient('/me');
        setChefName(data?.name || 'Responsable de métier');
      } catch (err) {
        console.error('Erreur récupération chef:', err);
      }
    };
    fetchChef();
  }, []);

  const colors = {
    bg: '#e6f0ff',
    text: '#003366',
    card: '#ffffff',
    shadow: '0 2px 8px rgba(0,0,0,0.1)',
    activeBg: '#0077cc',
    hoverBg: '#cce6ff'
  };

  const navItems = [
    { key: 'statistiques', label: 'Statistiques', icon: <BarChartIcon /> },
    { key: 'seances', label: 'Séances', icon: <EventIcon /> },
    { key: 'ueas', label: 'UEA', icon: <MenuBookIcon /> },
    { key: 'salles', label: 'Salles', icon: <MeetingRoomIcon /> },
    { key: 'enseignants', label: 'Enseignants', icon: <SchoolIcon /> },
    { key: 'assistants', label: 'Assistants', icon: <BuildIcon /> },
    { key: 'notifications', label: 'Notifications', icon: <NotificationsIcon /> },
    { key: 'parametres', label: 'Paramètres', icon: <SettingsIcon /> }
  ];

  const handleLogout = () => {
    localStorage.clear();
    window.location.href = '/';
  };

  return (
    <div style={{ backgroundColor: colors.bg, color: colors.text }}>
      <aside style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '240px',
        height: '100vh',
        backgroundColor: colors.card,
        padding: '1.5rem',
        boxShadow: colors.shadow,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        overflowY: 'auto',
        zIndex: 1000
      }}>
        <div>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.75rem',
            marginBottom: '2rem',
            fontWeight: 'bold',
            fontSize: '1rem',
            color: colors.text
          }}>
            <AccountCircleIcon /> {chefName}
          </div>
          <nav style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {navItems.map(item => (
              <button
                key={item.key}
                onClick={() => onNavigate(item.key)}
                style={{
                  backgroundColor: active === item.key ? colors.activeBg : 'transparent',
                  color: colors.text,
                  border: 'none',
                  padding: '0.75rem 1rem',
                  textAlign: 'left',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.75rem',
                  cursor: 'pointer',
                  borderRadius: '6px',
                  fontWeight: 'bold',
                  transition: 'background 0.2s ease'
                }}
                onMouseEnter={e => (e.currentTarget.style.backgroundColor = colors.hoverBg)}
                onMouseLeave={e => (e.currentTarget.style.backgroundColor = active === item.key ? colors.activeBg : 'transparent')}
              >
                {item.icon} {item.label}
              </button>
            ))}
          </nav>
        </div>

        <div style={{ marginTop: '2rem' }}>
          <button onClick={() => setShowConfirm(true)} style={{
            backgroundColor: colors.hoverBg,
            color: colors.text,
            border: 'none',
            padding: '0.5rem 1rem',
            borderRadius: '6px',
            cursor: 'pointer',
            fontWeight: 'bold'
          }}>
            Déconnexion
          </button>

          {showConfirm && (
            <div style={{
              marginTop: '1rem',
              backgroundColor: '#fff',
              padding: '1rem',
              borderRadius: '8px',
              boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
              textAlign: 'center'
            }}>
              <p style={{ marginBottom: '1rem', color: '#003366' }}>Voulez-vous  déconnecter ?</p>
              <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem' }}>
                <button onClick={handleLogout} style={{
                  backgroundColor: '#dc3545',
                  color: '#fff',
                  border: 'none',
                  padding: '0.5rem 1rem',
                  borderRadius: '6px',
                  cursor: 'pointer',
                  fontWeight: 'bold'
                }}>
                  Oui
                </button>
                <button onClick={() => setShowConfirm(false)} style={{
                  backgroundColor: '#0077cc',
                  color: '#fff',
                  border: 'none',
                  padding: '0.5rem 1rem',
                  borderRadius: '6px',
                  cursor: 'pointer',
                  fontWeight: 'bold'
                }}>
                  Non
                </button>
              </div>
            </div>
          )}
        </div>
      </aside>

      <main style={{
        marginLeft: '240px',
        padding: '2rem',
        transition: 'margin-left 0.3s ease'
      }}>
        {children}
      </main>
    </div>
  );
};

export default ResponsableLayout;
