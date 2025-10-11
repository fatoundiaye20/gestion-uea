import { useEffect, useState } from 'react';
import { apiClient } from '../../api/client';
import BarChartIcon from '@mui/icons-material/BarChart';
import EventIcon from '@mui/icons-material/Event';
import SchoolIcon from '@mui/icons-material/School';
import DescriptionIcon from '@mui/icons-material/Description';
import SettingsIcon from '@mui/icons-material/Settings';
import MenuBookIcon from '@mui/icons-material/MenuBook';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';

type Props = {
  active: string;
  onNavigate: (section: any) => void;
  children: React.ReactNode;
};

const EnseignantLayout = ({ active, onNavigate, children }: Props) => {
  const [enseignantName, setEnseignantName] = useState('');

  useEffect(() => {
    const fetchEnseignant = async () => {
      try {
        const data = await apiClient('/me');
        setEnseignantName(data?.user?.name || 'Enseignant');
      } catch (err) {
        console.error('Erreur récupération enseignant:', err);
      }
    };
    fetchEnseignant();
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
    { key: 'accueil', label: 'Accueil', icon: <BarChartIcon /> },
    { key: 'seances', label: 'Mes Séances', icon: <EventIcon /> },
    { key: 'ueas', label: 'Mes UEAs', icon: <MenuBookIcon /> },
    { key: 'fiches', label: 'Fiches de Séance', icon: <DescriptionIcon /> },
    { key: 'statistiques', label: 'Statistiques', icon: <SchoolIcon /> },
    { key: 'parametres', label: 'Paramètres', icon: <SettingsIcon /> }
  ];

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
            <AccountCircleIcon /> {enseignantName}
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
          <button onClick={() => {
            localStorage.clear();
            window.location.href = '/';
          }} style={{
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

export default EnseignantLayout;