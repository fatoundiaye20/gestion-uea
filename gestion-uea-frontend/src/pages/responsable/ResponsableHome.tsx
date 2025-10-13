import React, { useEffect, useState } from 'react';
import ReactModal from 'react-modal';
import AddSeanceForm from './AddSeanceForm';
import AddEnseignantForm from './AddEnseignantForm';
import AddResponsableForm from './AddResponsableForm';
import AddAssistantForm from './AddAssistantForm';

import BarChartIcon from '@mui/icons-material/BarChart';
import EventIcon from '@mui/icons-material/Event';
import SchoolIcon from '@mui/icons-material/School';
import BusinessCenterIcon from '@mui/icons-material/BusinessCenter';
import BuildIcon from '@mui/icons-material/Build';
import NotificationsIcon from '@mui/icons-material/Notifications';

type Seance = { nom: string; date: string; heure: string };
type Responsable = { nom: string; filiere: string };
type Assistant = { nom: string; specialite: string };
type Notification = { message: string };
type Enseignant = { nom: string; email: string; filiere: string };

const ResponsableHome = () => {
  const [theme, setTheme] = useState<'light' | 'dark'>('light');
  const [stats, setStats] = useState({ reussite: 0, echec: 0 });
  const [seances, setSeances] = useState<Seance[]>([]);
  const [responsables, setResponsables] = useState<Responsable[]>([]);
  const [assistants, setAssistants] = useState<Assistant[]>([]);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [enseignants, setEnseignants] = useState<Enseignant[]>([]);
  const [modal, setModal] = useState<'seance' | 'enseignant' | 'responsable' | 'assistant' | null>(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [s1, s2, s3, s4, s5, s6] = await Promise.all([
        fetch('/api/statistiques-uea').then(res => res.json()),
        fetch('/api/seances').then(res => res.json()),
        fetch('/api/responsables-metier').then(res => res.json()),
        fetch('/api/assistants-techniques').then(res => res.json()),
        fetch('/api/notifications-chef').then(res => res.json()),
        fetch('/api/enseignants').then(res => res.json())
      ]);
      setStats(s1);
      setSeances(s2);
      setResponsables(s3);
      setAssistants(s4);
      setNotifications(s5);
      setEnseignants(s6);
    } catch (err) {
      console.error('Erreur chargement données:', err);
    }
  };

  const logout = async () => {
    await fetch('/api/logout', { method: 'POST' });
    window.location.href = '/login';
  };

  const toggleTheme = () => {
    setTheme(prev => (prev === 'light' ? 'dark' : 'light'));
  };

  const colors = {
    bg: theme === 'light' ? '#f9f9f9' : '#121212',
    card: theme === 'light' ? '#ffffff' : '#1e1e1e',
    text: theme === 'light' ? '#222' : '#f0f0f0',
    shadow: theme === 'light' ? '0 2px 8px rgba(0,0,0,0.1)' : '0 0 12px rgba(0,0,0,0.4)'
  };

  return (
    <div style={{ display: 'flex', minHeight: '100vh', backgroundColor: colors.bg, color: colors.text }}>
      {/* Sidebar */}
      <aside style={{ width: '220px', backgroundColor: colors.card, padding: '1.5rem', boxShadow: colors.shadow }}>
        <h2 style={{ marginBottom: '2rem' }}>Tableau de bord</h2>
        <nav style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <button><BarChartIcon /> Statistiques</button>
          <button><EventIcon /> Séances</button>
          <button><SchoolIcon /> Enseignants</button>
          <button><BusinessCenterIcon /> Responsables</button>
          <button><BuildIcon /> Assistants</button>
          <button><NotificationsIcon /> Notifications</button>
        </nav>
      </aside>

      {/* Main */}
      <main style={{ flex: 1, padding: '2rem' }}>
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '2rem' }}>
          <h1>Responsable de metier – ISEP Thiès</h1>
          <div>
            <button onClick={toggleTheme} style={{ marginRight: '1rem' }}>
              {theme === 'light' ? 'Mode sombre' : 'Mode clair'}
            </button>
            <button onClick={logout}>Déconnexion</button>
          </div>
        </div>

        {/* Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.5rem' }}>
          <div style={card(colors)}>
            <BarChartIcon style={iconStyle} />
            <h3>Statistiques UEA</h3>
            <p>Taux de réussite : {stats.reussite}%</p>
            <p>Taux d’échec : {stats.echec}%</p>
          </div>

          <div style={card(colors)}>
            <EventIcon style={iconStyle} />
            <h3>Séances</h3>
            <p>Total : {seances.length}</p>
            <button onClick={() => setModal('seance')}>Ajouter une séance</button>
          </div>

          <div style={card(colors)}>
            <SchoolIcon style={iconStyle} />
            <h3>Enseignants</h3>
            <p>Total : {enseignants.length}</p>
            <button onClick={() => setModal('enseignant')}>Ajouter un enseignant</button>
          </div>

          <div style={card(colors)}>
            <BusinessCenterIcon style={iconStyle} />
            <h3>Responsables Métier</h3>
            <p>Total : {responsables.length}</p>
            <button onClick={() => setModal('responsable')}>Ajouter un responsable</button>
          </div>

          <div style={card(colors)}>
            <BuildIcon style={iconStyle} />
            <h3>Assistants Techniques</h3>
            <p>Total : {assistants.length}</p>
            <button onClick={() => setModal('assistant')}>Ajouter un assistant</button>
          </div>

          <div style={card(colors)}>
            <NotificationsIcon style={iconStyle} />
            <h3>Notifications</h3>
            <p>Non lues : {notifications.length}</p>
          </div>
        </div>
      </main>

      {/* Modales */}
      <ReactModal isOpen={modal !== null} onRequestClose={() => setModal(null)} style={modalStyle}>
        {modal === 'seance' && <AddSeanceForm />}
        {modal === 'enseignant' && <AddEnseignantForm />}
        {modal === 'responsable' && <AddResponsableForm />}
        {modal === 'assistant' && <AddAssistantForm />}
      </ReactModal>
    </div>
  );
};

const card = (colors: any): React.CSSProperties => ({
  backgroundColor: colors.card,
  padding: '1.5rem',
  borderRadius: '8px',
  boxShadow: colors.shadow,
  position: 'relative'
});

const iconStyle: React.CSSProperties = {
  position: 'absolute',
  top: '1rem',
  right: '1rem',
  fontSize: '1.5rem',
  opacity: 0.6
};

const modalStyle = {
  content: {
    top: '50%',
    left: '50%',
    right: 'auto',
    bottom: 'auto',
    transform: 'translate(-50%, -50%)',
    borderRadius: '12px',
    padding: '2rem',
    backgroundColor: '#fff',
    boxShadow: '0 4px 20px rgba(0,0,0,0.2)'
  }
};

export default ResponsableHome;
