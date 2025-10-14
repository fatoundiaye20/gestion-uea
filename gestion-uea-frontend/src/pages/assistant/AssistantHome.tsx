import React, { useState, useEffect } from 'react';
import { Home, Calendar, BarChart3, Bell, Users, LogOut, User, Settings } from 'lucide-react';
import { toast } from 'react-hot-toast';

// ============= TYPES =============
interface Seance {
  id: number;
  date: string;
  heure_debut: string;
  heure_fin: string;
  duree: string;
  statut: string;
  salle_id: number;
  uea_id: number;
  enseignant_id: number;
  uea?: { nom: string; code: string; filiere?: { nom: string } };
  enseignant?: { nom: string; name?: string };
  salle?: { nom: string };
}

// interface UEA removed (not used here) — UEA type is available in `src/types` if needed

interface Statistiques {
  total_seances: number;
  seances_validees: number;
  seances_realisees: number;
  seances_en_attente: number;
}

interface Notification {
  id: number;
  message: string;
  date: string;
  type: string;
  lu: boolean;
}

// ============= API CLIENT =============
const API_BASE = 'http://localhost:8000/api';

const apiClient = async (endpoint: string, options?: RequestInit) => {
  const token = localStorage.getItem('token');
  const response = await fetch(`${API_BASE}${endpoint}`, {
    ...options,
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
      ...options?.headers
    }
  });

  if (!response.ok) {
    // Try to read response body for a more informative error
    let bodyText: string | null = null;
    try {
      bodyText = await response.text();
    } catch (e) {
      /* ignore */
    }
    const err: any = new Error(`Erreur API ${response.status}${bodyText ? `: ${bodyText}` : ''}`);
    err.status = response.status;
    err.body = bodyText;
    throw err;
  }

  // If response has no content (204) return null
  if (response.status === 204) return null;
  return response.json();
};

// ============= SIDEBAR COMPONENT =============
const Sidebar: React.FC<{ theme: string; currentPage: string; onNavigate: (page: string) => void }> = ({ theme, currentPage, onNavigate }) => {
  const menuItems = [
    { id: 'home', icon: Home, label: 'Accueil' },
    { id: 'seances', icon: Calendar, label: 'Séances' },
    { id: 'statistiques', icon: BarChart3, label: 'Statistiques' },
    { id: 'notifications', icon: Bell, label: 'Notifications' },
    { id: 'parametres', icon: Settings, label: 'Paramètres' },
    { id: 'logout', icon: LogOut, label: 'Déconnexion' }
  ];

  return (
    <aside style={{
      position: 'fixed',
      left: 0,
      top: 0,
      width: '280px',
      height: '100vh',
      backgroundColor: theme === 'light' ? '#ffffff' : '#1f2937',
      borderRight: `1px solid ${theme === 'light' ? '#e5e7eb' : '#374151'}`,
      display: 'flex',
      flexDirection: 'column',
      zIndex: 100,
      overflowY: 'auto',
      transition: 'background-color 0.3s ease, border-color 0.3s ease'
    }}>
      <div style={{
        padding: '2rem 1.5rem',
        borderBottom: `1px solid ${theme === 'light' ? '#e5e7eb' : '#374151'}`
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <div style={{
            width: '50px',
            height: '50px',
            background: 'linear-gradient(135deg, #8b5cf6 0%, #3b82f6 100%)',
            borderRadius: '12px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 4px 6px rgba(139, 92, 246, 0.3)'
          }}>
            <Users style={{ width: '28px', height: '28px', color: 'white' }} />
          </div>
          <div>
            <h2 style={{
              fontSize: '1.25rem',
              fontWeight: 700,
              color: theme === 'light' ? '#111827' : '#f9fafb',
              margin: 0
            }}>Assistant</h2>
            <p style={{
              fontSize: '0.75rem',
              color: theme === 'light' ? '#6b7280' : '#9ca3af',
              margin: 0
            }}>ISEP Thiès</p>
          </div>
        </div>
      </div>

      <nav style={{ flex: 1, padding: '1.5rem 1rem' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
          {menuItems.map(item => {
            const Icon = item.icon;
            const isActive = currentPage === item.id;
            const isLogout = item.id === 'logout';
            return (
              <button
                key={item.id}
                onClick={() => onNavigate(item.id)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.75rem',
                  padding: '0.875rem 1rem',
                  borderRadius: '10px',
                  fontSize: '0.95rem',
                  fontWeight: isActive ? 600 : 500,
                  color: isLogout ? (theme === 'light' ? '#1e3a8a' : '#bfdbfe') : (isActive ? 'white' : (theme === 'light' ? '#4b5563' : '#d1d5db')),
                  backgroundColor: isLogout ? (theme === 'light' ? '#eff6ff' : 'transparent') : (isActive ? '#3b82f6' : 'transparent'),
                  border: 'none',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                  width: '100%',
                  textAlign: 'left',
                  boxShadow: isActive ? '0 2px 4px rgba(59, 130, 246, 0.3)' : 'none'
                }}
                onMouseEnter={(e) => {
                  if (!isActive) {
                    if (isLogout) {
                      e.currentTarget.style.backgroundColor = theme === 'light' ? '#e0f2fe' : '#1e293b';
                      e.currentTarget.style.color = theme === 'light' ? '#0ea5e9' : '#c7eaff';
                    } else {
                      e.currentTarget.style.backgroundColor = theme === 'light' ? '#f3f4f6' : '#374151';
                      e.currentTarget.style.color = theme === 'light' ? '#111827' : '#f9fafb';
                    }
                  }
                }}
                onMouseLeave={(e) => {
                  if (!isActive) {
                    e.currentTarget.style.backgroundColor = 'transparent';
                    e.currentTarget.style.color = isLogout ? (theme === 'light' ? '#1e3a8a' : '#bfdbfe') : (theme === 'light' ? '#4b5563' : '#d1d5db');
                  }
                }}
              >
                <Icon style={{ width: '20px', height: '20px', flexShrink: 0 }} />
                <span>{item.label}</span>
              </button>
            );
          })}
        </div>
      </nav>

      <div style={{
        padding: '1.5rem 1rem',
        borderTop: `1px solid ${theme === 'light' ? '#e5e7eb' : '#374151'}`
      }}>
        <div style={{
          padding: '1rem',
          backgroundColor: theme === 'light' ? '#eff6ff' : 'rgba(55, 65, 81, 0.5)',
          borderRadius: '10px'
        }}>
          <p style={{
            fontSize: '0.75rem',
            color: theme === 'light' ? '#1f2937' : '#d1d5db',
            lineHeight: 1.5
          }}>
            💡 <strong>Astuce:</strong> Utilisez les filtres pour affiner votre recherche
          </p>
        </div>
      </div>
    </aside>
  );
};

// ============= HEADER COMPONENT =============
const Header: React.FC<{ theme: string }> = ({ theme }) => {
  const [userName, setUserName] = useState('Assistant');

  useEffect(() => {
    const userString = localStorage.getItem('user');
    if (userString) {
      try {
        const user = JSON.parse(userString);
        setUserName(user.name || 'Assistant');
      } catch (error) {
        console.error('Erreur parsing user:', error);
      }
    }
  }, []);

  return (
    <div style={{
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'flex-start',
      marginBottom: '2.5rem',
      paddingBottom: '1.5rem',
      borderBottom: `1px solid ${theme === 'light' ? '#e5e7eb' : '#374151'}`
    }}>
      <div>
        <h1 style={{
          fontSize: '2rem',
          fontWeight: 700,
          color: theme === 'light' ? '#111827' : '#f9fafb',
          marginBottom: '0.75rem'
        }}>
          Tableau de bord Assistant
        </h1>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', flexWrap: 'wrap' }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            color: theme === 'light' ? '#6b7280' : '#9ca3af',
            fontSize: '0.875rem'
          }}>
            <User style={{ width: '16px', height: '16px' }} />
            <span>{userName}</span>
          </div>
          <span style={{ color: theme === 'light' ? '#d1d5db' : '#4b5563' }}>•</span>
          <div style={{
            color: theme === 'light' ? '#6b7280' : '#9ca3af',
            fontSize: '0.875rem'
          }}>
            {new Date().toLocaleDateString('fr-FR', { 
              weekday: 'long', 
              year: 'numeric', 
              month: 'long', 
              day: 'numeric' 
            })}
          </div>
        </div>
      </div>

      
    </div>
  );
};

// ============= HOME PAGE =============
const HomePage: React.FC<{ theme: string }> = ({ theme }) => {
  const [seances, setSeances] = useState<Seance[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchSeances();
  }, []);

  const fetchSeances = async () => {
    try {
      setLoading(true);
      const [seancesData, enseignantsData, ueasData, sallesData] = await Promise.all([
        apiClient('/seances'),
        apiClient('/users?role=enseignant'),
        apiClient('/ueas'),
        apiClient('/salles')
      ]);

      const seancesComplete = seancesData.map((s: Seance) => ({
        ...s,
        enseignant: enseignantsData.find((e: any) => e.id === s.enseignant_id),
        uea: ueasData.find((u: any) => u.id === s.uea_id),
        salle: sallesData.find((salle: any) => salle.id === s.salle_id)
      }));

      setSeances(seancesComplete);
    } catch (err) {
      console.error('Erreur lors du chargement des séances:', err);
    } finally {
      setLoading(false);
    }
  };

  const getStatusStyle = (statut: string) => {
    const styles: any = {
      realisee: { backgroundColor: '#dbeafe', color: '#1e40af' },
      validee: { backgroundColor: '#d1fae5', color: '#065f46' },
      prevue: { backgroundColor: '#fef3c7', color: '#92400e' }
    };
    return styles[statut] || styles.prevue;
  };

  if (loading) {
    return (
      <div style={{ textAlign: 'center', padding: '3rem', color: theme === 'light' ? '#6b7280' : '#9ca3af' }}>
        Chargement des séances...
      </div>
    );
  }

  return (
    <div style={{
      backgroundColor: theme === 'light' ? 'white' : '#1f2937',
      borderRadius: '16px',
      padding: '2rem',
      boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
      border: `1px solid ${theme === 'light' ? '#e5e7eb' : '#374151'}`
    }}>
      <h2 style={{
        fontSize: '1.25rem',
        fontWeight: 700,
        color: theme === 'light' ? '#111827' : '#f9fafb',
        marginBottom: '1.5rem'
      }}>
        📚 Détail des UEA
      </h2>

      <div style={{ width: '100%', overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: '800px' }}>
          <thead>
            <tr style={{
              backgroundColor: theme === 'light' ? '#f9fafb' : '#374151',
              borderBottom: `2px solid ${theme === 'light' ? '#e5e7eb' : '#4b5563'}`
            }}>
              {['Date', 'Heure', 'UEA', 'Filière', 'Enseignant', 'Salle', 'Durée', 'Statut'].map(header => (
                <th key={header} style={{
                  padding: '1rem 1.25rem',
                  textAlign: 'left',
                  fontWeight: 600,
                  fontSize: '0.875rem',
                  color: theme === 'light' ? '#6b7280' : '#9ca3af',
                  textTransform: 'uppercase',
                  letterSpacing: '0.05em'
                }}>
                  {header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {seances.length === 0 ? (
              <tr>
                <td colSpan={8} style={{
                  textAlign: 'center',
                  padding: '2rem',
                  color: theme === 'light' ? '#6b7280' : '#9ca3af'
                }}>
                  Aucune séance disponible
                </td>
              </tr>
            ) : (
              seances.map((s) => (
                <tr key={s.id} style={{
                  borderBottom: `1px solid ${theme === 'light' ? '#f3f4f6' : '#374151'}`,
                  transition: 'background-color 0.15s ease'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = theme === 'light' ? '#f9fafb' : '#374151';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = 'transparent';
                }}>
                  <td style={{
                    padding: '1rem 1.25rem',
                    color: theme === 'light' ? '#374151' : '#d1d5db'
                  }}>
                    {new Date(s.date).toLocaleDateString('fr-FR')}
                  </td>
                  <td style={{
                    padding: '1rem 1.25rem',
                    color: theme === 'light' ? '#374151' : '#d1d5db'
                  }}>
                    {s.heure_debut} - {s.heure_fin}
                  </td>
                  <td style={{
                    padding: '1rem 1.25rem',
                    color: theme === 'light' ? '#374151' : '#d1d5db'
                  }}>
                    {s.uea?.code} - {s.uea?.nom}
                  </td>
                  <td style={{
                    padding: '1rem 1.25rem',
                    color: theme === 'light' ? '#374151' : '#d1d5db'
                  }}>
                    {s.uea?.filiere?.nom}
                  </td>
                  <td style={{
                    padding: '1rem 1.25rem',
                    color: theme === 'light' ? '#374151' : '#d1d5db'
                  }}>
                    {s.enseignant?.nom || s.enseignant?.name || 'Non assigné'}
                  </td>
                  <td style={{
                    padding: '1rem 1.25rem',
                    color: theme === 'light' ? '#374151' : '#d1d5db'
                  }}>
                    {s.salle?.nom}
                  </td>
                  <td style={{
                    padding: '1rem 1.25rem',
                    color: theme === 'light' ? '#374151' : '#d1d5db'
                  }}>
                    {s.duree}
                  </td>
                  <td style={{ padding: '1rem 1.25rem' }}>
                    <span style={{
                      ...getStatusStyle(s.statut),
                      display: 'inline-block',
                      padding: '0.375rem 0.875rem',
                      borderRadius: '9999px',
                      fontSize: '0.75rem',
                      fontWeight: 600,
                      textTransform: 'capitalize'
                    }}>
                      {s.statut}
                    </span>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

// ============= SEANCES PAGE =============
const SeancesPage: React.FC<{ theme: string }> = ({ theme }) => {
  const [seances, setSeances] = useState<Seance[]>([]);
  const [loading, setLoading] = useState(true);
  const [filtreStatut, setFiltreStatut] = useState('all');

  useEffect(() => {
    fetchSeances();
  }, []);

  const fetchSeances = async () => {
    try {
      const data = await apiClient('/seances');
      const sortedData = data.sort((a: Seance, b: Seance) => {
        return new Date(b.date).getTime() - new Date(a.date).getTime();
      });
      setSeances(sortedData);
    } catch (error) {
      console.error('Erreur chargement séances:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatutStyle = (statut: string) => {
    const styles: any = {
      validee: { backgroundColor: theme === 'light' ? '#d1fae5' : 'rgba(16, 185, 129, 0.2)', color: theme === 'light' ? '#065f46' : '#6ee7b7' },
      realisee: { backgroundColor: theme === 'light' ? '#dbeafe' : 'rgba(59, 130, 246, 0.2)', color: theme === 'light' ? '#1e40af' : '#93c5fd' },
      prevue: { backgroundColor: theme === 'light' ? '#fef3c7' : 'rgba(251, 191, 36, 0.2)', color: theme === 'light' ? '#92400e' : '#fcd34d' }
    };
    return styles[statut] || styles.prevue;
  };

  const seancesFiltrees = filtreStatut === 'all' ? seances : seances.filter(s => s.statut === filtreStatut);

  if (loading) {
    return (
      <div style={{ textAlign: 'center', padding: '3rem', color: theme === 'light' ? '#6b7280' : '#9ca3af' }}>
        Chargement des séances...
      </div>
    );
  }

  return (
    <div style={{
      backgroundColor: theme === 'light' ? 'white' : '#1f2937',
      borderRadius: '16px',
      padding: '2rem',
      boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
      border: `1px solid ${theme === 'light' ? '#e5e7eb' : '#374151'}`
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
        <h2 style={{
          fontSize: '1.25rem',
          fontWeight: 700,
          color: theme === 'light' ? '#111827' : '#f9fafb'
        }}>
          📋 Toutes les Séances ({seancesFiltrees.length})
        </h2>

        <div style={{ display: 'flex', gap: '0.5rem' }}>
          {[
            { value: 'all', label: 'Toutes' },
            { value: 'prevue', label: 'Prévues' },
            { value: 'validee', label: 'Validées' },
            { value: 'realisee', label: 'Réalisées' }
          ].map(filtre => (
            <button
              key={filtre.value}
              onClick={() => setFiltreStatut(filtre.value)}
              style={{
                padding: '0.5rem 1rem',
                borderRadius: '8px',
                fontSize: '0.875rem',
                fontWeight: 500,
                border: 'none',
                cursor: 'pointer',
                transition: 'all 0.2s ease',
                backgroundColor: filtreStatut === filtre.value ? '#3b82f6' : (theme === 'light' ? '#f3f4f6' : '#374151'),
                color: filtreStatut === filtre.value ? 'white' : (theme === 'light' ? '#374151' : '#d1d5db')
              }}
              onMouseEnter={(e) => {
                if (filtreStatut !== filtre.value) {
                  e.currentTarget.style.backgroundColor = theme === 'light' ? '#e5e7eb' : '#4b5563';
                }
              }}
              onMouseLeave={(e) => {
                if (filtreStatut !== filtre.value) {
                  e.currentTarget.style.backgroundColor = theme === 'light' ? '#f3f4f6' : '#374151';
                }
              }}
            >
              {filtre.label}
            </button>
          ))}
        </div>
      </div>

      {seancesFiltrees.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '3rem' }}>
          <Calendar style={{ width: '64px', height: '64px', margin: '0 auto 1rem', color: theme === 'light' ? '#9ca3af' : '#4b5563' }} />
          <p style={{ color: theme === 'light' ? '#6b7280' : '#9ca3af', fontSize: '1.125rem' }}>
            Aucune séance trouvée
          </p>
        </div>
      ) : (
        <div style={{ width: '100%', overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ borderBottom: `2px solid ${theme === 'light' ? '#e5e7eb' : '#4b5563'}` }}>
                {['Date', 'UEA', 'Enseignant', 'Salle', 'Horaire', 'Statut'].map(header => (
                  <th key={header} style={{
                    padding: '0.75rem 1rem',
                    textAlign: 'left',
                    fontWeight: 600,
                    color: theme === 'light' ? '#111827' : '#f9fafb'
                  }}>
                    {header}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {seancesFiltrees.map(seance => (
                <tr key={seance.id} style={{
                  borderBottom: `1px solid ${theme === 'light' ? '#e5e7eb' : '#374151'}`,
                  transition: 'background-color 0.15s ease'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = theme === 'light' ? '#f9fafb' : '#374151';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = 'transparent';
                }}>
                  <td style={{
                    padding: '0.75rem 1rem',
                    color: theme === 'light' ? '#111827' : '#f9fafb',
                    fontWeight: 500
                  }}>
                    {new Date(seance.date).toLocaleDateString('fr-FR')}
                  </td>
                  <td style={{ padding: '0.75rem 1rem' }}>
                    <div style={{
                      fontWeight: 600,
                      color: theme === 'light' ? '#111827' : '#f9fafb'
                    }}>
                      {seance.uea?.code}
                    </div>
                    <div style={{
                      fontSize: '0.75rem',
                      color: theme === 'light' ? '#6b7280' : '#9ca3af'
                    }}>
                      {seance.uea?.nom}
                    </div>
                  </td>
                  <td style={{
                    padding: '0.75rem 1rem',
                    color: theme === 'light' ? '#6b7280' : '#9ca3af'
                  }}>
                    {seance.enseignant?.name || seance.enseignant?.nom}
                  </td>
                  <td style={{
                    padding: '0.75rem 1rem',
                    color: theme === 'light' ? '#111827' : '#f9fafb'
                  }}>
                    {seance.salle?.nom}
                  </td>
                  <td style={{
                    padding: '0.75rem 1rem',
                    color: theme === 'light' ? '#6b7280' : '#9ca3af'
                  }}>
                    {seance.heure_debut} - {seance.heure_fin}
                  </td>
                  <td style={{ padding: '0.75rem 1rem' }}>
                    <span style={{
                      ...getStatutStyle(seance.statut),
                      padding: '0.375rem 0.75rem',
                      borderRadius: '9999px',
                      fontSize: '0.75rem',
                      fontWeight: 600,
                      textTransform: 'capitalize'
                    }}>
                      {seance.statut}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

// ============= STATISTIQUES PAGE =============
const StatistiquesPage: React.FC<{ theme: string }> = ({ theme }) => {
  const [statistiques, setStatistiques] = useState<Statistiques>({
    total_seances: 0,
    seances_validees: 0,
    seances_realisees: 0,
    seances_en_attente: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStatistiques();
  }, []);

  const fetchStatistiques = async () => {
    try {
      const data = await apiClient('/statistiques');
      if (data.resume_global) {
        setStatistiques(data.resume_global);
      }
    } catch (error) {
      console.error('Erreur chargement statistiques:', error);
    } finally {
      setLoading(false);
    }
  };

    const getPercentage = (part: number, total: number) => {
    return total === 0 ? 0 : Math.round((part / total) * 100);
  };

  if (loading) {
    return (
      <div style={{ textAlign: 'center', padding: '3rem', color: theme === 'light' ? '#6b7280' : '#9ca3af' }}>
        Chargement des statistiques...
      </div>
    );
  }

  return (
    <div style={{
      backgroundColor: theme === 'light' ? 'white' : '#1f2937',
      borderRadius: '16px',
      padding: '2rem',
      boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
      border: `1px solid ${theme === 'light' ? '#e5e7eb' : '#374151'}`,
      display: 'grid',
      gap: '1.5rem',
      gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))'
    }}>
      <div style={{
        background: theme === 'light' ? '#eff6ff' : 'rgba(59,130,246,0.2)',
        borderRadius: '12px',
        padding: '1.5rem'
      }}>
        <h3 style={{ color: theme === 'light' ? '#1e3a8a' : '#93c5fd', fontWeight: 600 }}>Total Séances</h3>
        <p style={{ fontSize: '2rem', fontWeight: 700, color: theme === 'light' ? '#111827' : '#f9fafb' }}>
          {statistiques.total_seances}
        </p>
      </div>

      <div style={{
        background: theme === 'light' ? '#ecfdf5' : 'rgba(16,185,129,0.2)',
        borderRadius: '12px',
        padding: '1.5rem'
      }}>
        <h3 style={{ color: theme === 'light' ? '#065f46' : '#6ee7b7', fontWeight: 600 }}>Validées</h3>
        <p style={{ fontSize: '2rem', fontWeight: 700 }}>{statistiques.seances_validees}</p>
        <p style={{ fontSize: '0.875rem', color: theme === 'light' ? '#10b981' : '#a7f3d0' }}>
          {getPercentage(statistiques.seances_validees, statistiques.total_seances)}%
        </p>
      </div>

      <div style={{
        background: theme === 'light' ? '#f0f9ff' : 'rgba(59,130,246,0.2)',
        borderRadius: '12px',
        padding: '1.5rem'
      }}>
        <h3 style={{ color: theme === 'light' ? '#1e40af' : '#60a5fa', fontWeight: 600 }}>Réalisées</h3>
        <p style={{ fontSize: '2rem', fontWeight: 700 }}>{statistiques.seances_realisees}</p>
        <p style={{ fontSize: '0.875rem', color: theme === 'light' ? '#3b82f6' : '#93c5fd' }}>
          {getPercentage(statistiques.seances_realisees, statistiques.total_seances)}%
        </p>
      </div>

      <div style={{
        background: theme === 'light' ? '#fffbeb' : 'rgba(251,191,36,0.2)',
        borderRadius: '12px',
        padding: '1.5rem'
      }}>
        <h3 style={{ color: theme === 'light' ? '#92400e' : '#fcd34d', fontWeight: 600 }}>En attente</h3>
        <p style={{ fontSize: '2rem', fontWeight: 700 }}>{statistiques.seances_en_attente}</p>
        <p style={{ fontSize: '0.875rem', color: theme === 'light' ? '#f59e0b' : '#fde68a' }}>
          {getPercentage(statistiques.seances_en_attente, statistiques.total_seances)}%
        </p>
      </div>
    </div>
  );
};
// ============= NOTIFICATIONS PAGE =============
const NotificationsPage: React.FC<{ theme: string }> = ({ theme }) => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchNotifications();
  }, []);

  const fetchNotifications = async () => {
    try {
      const data = await apiClient('/notifications');
      setNotifications(data || []);
    } catch (error) {
      console.error('Erreur chargement notifications:', error);
      // If our apiClient attached status/body, show it
      const anyErr: any = error;
      if (anyErr.status) {
        toast.error(`Notifications API ${anyErr.status}${anyErr.body ? `: ${anyErr.body}` : ''}`);
      } else {
        toast.error(anyErr.message || 'Erreur lors du chargement des notifications');
      }
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div style={{ textAlign: 'center', padding: '2rem', color: theme === 'light' ? '#6b7280' : '#9ca3af' }}>Chargement...</div>;
  }

  return (
    <div style={{
      backgroundColor: theme === 'light' ? 'white' : '#1f2937',
      borderRadius: '16px',
      padding: '2rem',
      border: `1px solid ${theme === 'light' ? '#e5e7eb' : '#374151'}`
    }}>
      <h2 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '1rem' }}>🔔 Notifications</h2>

      {notifications.length === 0 ? (
        <p style={{ color: theme === 'light' ? '#6b7280' : '#9ca3af', textAlign: 'center', padding: '2rem' }}>Aucune notification.</p>
      ) : (
        <ul style={{ listStyle: 'none', margin: 0, padding: 0 }}>
          {notifications.map((n) => (
            <li key={n.id} style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              backgroundColor: n.lu ? 'transparent' : (theme === 'light' ? '#f0f9ff' : '#374151'),
              borderRadius: '8px',
              padding: '1rem',
              marginBottom: '0.75rem',
              border: `1px solid ${theme === 'light' ? '#e5e7eb' : '#4b5563'}`
            }}>
              <div>
                <p style={{ margin: 0, fontWeight: n.lu ? 400 : 600, color: theme === 'light' ? '#111827' : '#f9fafb' }}>{n.message}</p>
                <small style={{ color: theme === 'light' ? '#6b7280' : '#9ca3af' }}>{new Date(n.date).toLocaleString('fr-FR')}</small>
              </div>
              <span style={{
                padding: '0.25rem 0.75rem',
                borderRadius: '9999px',
                fontSize: '0.75rem',
                backgroundColor: n.type === 'alerte' ? '#fee2e2' : '#dbeafe',
                color: n.type === 'alerte' ? '#b91c1c' : '#1e3a8a'
              }}>
                {n.type}
              </span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};
const ParametresPage: React.FC<{ theme: string }> = ({ theme }) => {
  const [nom, setNom] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [specialite, setSpecialite] = useState('');

  useEffect(() => {
    const userString = localStorage.getItem('user');
    if (userString) {
      const user = JSON.parse(userString);
      setNom(user.name || '');
      setEmail(user.email || '');
      setMessage('');
      setSpecialite(user.specialite || '');
    } else {
      setNom(''); 
      setEmail('');
      setSpecialite('');
    }
  }, []);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setMessage('✅ Informations mises à jour avec succès !');
    // Ici, vous pouvez également envoyer les données mises à jour à votre API
    const userString = localStorage.getItem('user');
    if (userString) {
      const user = JSON.parse(userString);
      user.name = nom;
      user.email = email;
      user.specialite = specialite;
      localStorage.setItem('user', JSON.stringify(user));

    }
  };

  return (
    <div style={{
      backgroundColor: theme === 'light' ? 'white' : '#1f2937',
      borderRadius: '16px',
      padding: '2rem',
      border: `1px solid ${theme === 'light' ? '#e5e7eb' : '#374151'}`
    }}>
      <h2 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '1.5rem' }}>⚙️ Paramètres du profil</h2>
      <form onSubmit={handleSave} style={{ display: 'flex', flexDirection: 'column', gap: '1rem', maxWidth: '400px' }}>
        <label>
          Nom :
          <input type="text" value={nom} onChange={(e) => setNom(e.target.value)}
            style={{
              width: '100%',
              padding: '0.75rem',
              borderRadius: '8px',
              border: `1px solid ${theme === 'light' ? '#d1d5db' : '#4b5563'}`,
              backgroundColor: theme === 'light' ? '#f9fafb' : '#374151',
              color: theme === 'light' ? '#111827' : '#f9fafb'
            }} />
        </label>
        <label>
          Email :
          <input type="email" value={email} onChange={(e) => setEmail(e.target.value)}
            style={{
              width: '100%',
              padding: '0.75rem',
              borderRadius: '8px',
              border: `1px solid ${theme === 'light' ? '#d1d5db' : '#4b5563'}`,
              backgroundColor: theme === 'light' ? '#f9fafb' : '#374151',
              color: theme === 'light' ? '#111827' : '#f9fafb'
            }} />
        </label>


        <label>
          specialite :
          <input type="text" value={specialite} onChange={(e) => setSpecialite(e.target.value)}
            style={{
              width: '100%',
              padding: '0.75rem',
              borderRadius: '8px',
              border: `1px solid ${theme === 'light' ? '#d1d5db' : '#4b5563'}`,
              backgroundColor: theme === 'light' ? '#f9fafb' : '#374151',
              color: theme === 'light' ? '#111827' : '#f9fafb'
            }} />
        </label>
        <button type="submit" style={{
          backgroundColor: '#3b82f6',
          color: 'white',
          padding: '0.75rem',
          border: 'none',
          borderRadius: '8px',
          fontWeight: 600,
          cursor: 'pointer'
        }}>💾 Enregistrer</button>
        {message && <p style={{ color: '#10b981', marginTop: '0.5rem' }}>{message}</p>}
      </form>
    </div>
  );
};
// ============= SIDEBAR COMPONENT =============
const AssistantDashboard: React.FC = () => {
  const [theme] = useState<'light' | 'dark'>('light');
  const [currentPage, setCurrentPage] = useState('home');

  // theme toggling removed — theme kept in state but no top-right toggle
  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    window.location.href = '/';
  };

  const renderPage = () => {
    switch (currentPage) {
      case 'home': return <HomePage theme={theme} />;
      case 'seances': return <SeancesPage theme={theme} />;
      case 'statistiques': return <StatistiquesPage theme={theme} />;
      case 'notifications': return <NotificationsPage theme={theme} />;
      case 'parametres': return <ParametresPage theme={theme} />;
      default: return <HomePage theme={theme} />;
    }
  };

  return (
    <div style={{
      display: 'flex',
      backgroundColor: theme === 'light' ? '#f9fafb' : '#111827',
      minHeight: '100vh'
    }}>
      <Sidebar
        theme={theme}
        currentPage={currentPage}
        onNavigate={(id: string) => {
          if (id === 'logout') return handleLogout();
          setCurrentPage(id);
        }}
      />
      <main style={{
        marginLeft: '280px',
        flex: 1,
        padding: '2rem',
        minHeight: '100vh'
      }}>
        
  <Header theme={theme} />
        {renderPage()}

         
      </main>
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
        {/* Theme toggle removed per request */}
        {/* Le bouton Déconnexion a été déplacé dans la sidebar */}
      </div>  

      
      
    </div>
  );
                                                                                                                                                                                           
};
export default AssistantDashboard;
