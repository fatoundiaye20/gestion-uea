// AssistantSeances.tsx
import React, { useState, useEffect } from 'react';
import { Calendar, Clock, User, MapPin, FileText, Filter, Search, ChevronRight } from 'lucide-react';

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

interface AssistantSeancesProps {
  theme: string;
}

// ============= API CLIENT =============
const API_BASE = 'http://localhost:8000/api';

const apiClient = async (endpoint: string) => {
  const token = localStorage.getItem('token');
  const response = await fetch(`${API_BASE}${endpoint}`, {
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    }
  });
  if (!response.ok) throw new Error('Erreur API');
  return response.json();
};

const AssistantSeances: React.FC<AssistantSeancesProps> = ({ theme }) => {
  const [seances, setSeances] = useState<Seance[]>([]);
  const [filteredSeances, setFilteredSeances] = useState<Seance[]>([]);
  const [loading, setLoading] = useState(true);
  const [filtreStatut, setFiltreStatut] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSeance, setSelectedSeance] = useState<Seance | null>(null);

  useEffect(() => {
    fetchSeances();
  }, []);

  useEffect(() => {
    filterSeances();
  }, [searchTerm, filtreStatut, seances]);

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

      // Trier par date décroissante
      const sortedSeances = seancesComplete.sort((a: Seance, b: Seance) => {
        return new Date(b.date).getTime() - new Date(a.date).getTime();
      });

      setSeances(sortedSeances);
      setFilteredSeances(sortedSeances);
    } catch (err) {
      console.error('Erreur lors du chargement des séances:', err);
    } finally {
      setLoading(false);
    }
  };

  const filterSeances = () => {
    let filtered = [...seances];

    // Filtrer par recherche
    if (searchTerm) {
      filtered = filtered.filter(seance =>
        seance.uea?.nom.toLowerCase().includes(searchTerm.toLowerCase()) ||
        seance.uea?.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
        seance.enseignant?.nom?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        seance.enseignant?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        seance.salle?.nom.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Filtrer par statut
    if (filtreStatut !== 'all') {
      filtered = filtered.filter(seance => seance.statut === filtreStatut);
    }

    setFilteredSeances(filtered);
  };

  const getStatutStyle = (statut: string) => {
    const styles: any = {
      realisee: { 
        backgroundColor: theme === 'light' ? '#dbeafe' : 'rgba(59, 130, 246, 0.2)', 
        color: theme === 'light' ? '#1e40af' : '#93c5fd',
        borderColor: '#3b82f6'
      },
      validee: { 
        backgroundColor: theme === 'light' ? '#d1fae5' : 'rgba(16, 185, 129, 0.2)', 
        color: theme === 'light' ? '#065f46' : '#6ee7b7',
        borderColor: '#10b981'
      },
      prevue: { 
        backgroundColor: theme === 'light' ? '#fef3c7' : 'rgba(251, 191, 36, 0.2)', 
        color: theme === 'light' ? '#92400e' : '#fcd34d',
        borderColor: '#fbbf24'
      }
    };
    return styles[statut] || styles.prevue;
  };

  const getStatutLabel = (statut: string) => {
    const labels: any = {
      realisee: 'Réalisée',
      validee: 'Validée',
      prevue: 'Prévue'
    };
    return labels[statut] || statut;
  };

  if (loading) {
    return (
      <div style={{ textAlign: 'center', padding: '3rem', color: theme === 'light' ? '#6b7280' : '#9ca3af' }}>
        Chargement des séances...
      </div>
    );
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      {/* Header avec filtres et recherche */}
      <div style={{
        backgroundColor: theme === 'light' ? 'white' : '#1f2937',
        borderRadius: '16px',
        padding: '2rem',
        boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
        border: `1px solid ${theme === 'light' ? '#e5e7eb' : '#374151'}`
      }}>
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '1.5rem',
          flexWrap: 'wrap',
          gap: '1rem'
        }}>
          <h2 style={{
            fontSize: '1.25rem',
            fontWeight: 700,
            color: theme === 'light' ? '#111827' : '#f9fafb',
            margin: 0,
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem'
          }}>
            <Calendar style={{ width: '24px', height: '24px' }} />
            Mes Séances ({filteredSeances.length})
          </h2>

          {/* Filtres par statut */}
          <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
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
                  backgroundColor: filtreStatut === filtre.value 
                    ? '#3b82f6' 
                    : (theme === 'light' ? '#f3f4f6' : '#374151'),
                  color: filtreStatut === filtre.value 
                    ? 'white' 
                    : (theme === 'light' ? '#374151' : '#d1d5db'),
                  boxShadow: filtreStatut === filtre.value ? '0 2px 4px rgba(59, 130, 246, 0.3)' : 'none'
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

        {/* Barre de recherche */}
        <div style={{ position: 'relative' }}>
          <Search style={{
            position: 'absolute',
            left: '12px',
            top: '50%',
            transform: 'translateY(-50%)',
            width: '20px',
            height: '20px',
            color: theme === 'light' ? '#9ca3af' : '#6b7280'
          }} />
          <input
            type="text"
            placeholder="Rechercher par UEA, enseignant ou salle..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{
              width: '100%',
              padding: '0.75rem 0.75rem 0.75rem 2.75rem',
              borderRadius: '8px',
              border: `1px solid ${theme === 'light' ? '#d1d5db' : '#4b5563'}`,
              backgroundColor: theme === 'light' ? 'white' : '#374151',
              color: theme === 'light' ? '#111827' : '#f9fafb',
              fontSize: '0.875rem',
              outline: 'none',
              transition: 'all 0.2s'
            }}
            onFocus={(e) => {
              e.currentTarget.style.borderColor = '#3b82f6';
              e.currentTarget.style.boxShadow = '0 0 0 3px rgba(59, 130, 246, 0.1)';
            }}
            onBlur={(e) => {
              e.currentTarget.style.borderColor = theme === 'light' ? '#d1d5db' : '#4b5563';
              e.currentTarget.style.boxShadow = 'none';
            }}
          />
        </div>
      </div>

      {/* Liste des séances */}
      <div style={{
        backgroundColor: theme === 'light' ? 'white' : '#1f2937',
        borderRadius: '16px',
        padding: '2rem',
        boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
        border: `1px solid ${theme === 'light' ? '#e5e7eb' : '#374151'}`
      }}>
        {filteredSeances.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '3rem' }}>
            <Calendar style={{ 
              width: '64px', 
              height: '64px', 
              margin: '0 auto 1rem', 
              color: theme === 'light' ? '#9ca3af' : '#4b5563' 
            }} />
            <p style={{ 
              color: theme === 'light' ? '#6b7280' : '#9ca3af', 
              fontSize: '1.125rem',
              margin: 0 
            }}>
              {searchTerm || filtreStatut !== 'all' 
                ? 'Aucune séance trouvée avec ces critères'
                : 'Aucune séance disponible'}
            </p>
          </div>
        ) : (
          <div style={{ display: 'grid', gap: '1rem' }}>
            {filteredSeances.map((seance) => (
              <div
                key={seance.id}
                onClick={() => setSelectedSeance(seance)}
                style={{
                  padding: '1.5rem',
                  backgroundColor: theme === 'light' ? '#f9fafb' : '#111827',
                  borderRadius: '12px',
                  border: `1px solid ${theme === 'light' ? '#e5e7eb' : '#374151'}`,
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                  position: 'relative'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = theme === 'light' ? '#f3f4f6' : '#1f2937';
                  e.currentTarget.style.transform = 'translateY(-2px)';
                  e.currentTarget.style.boxShadow = '0 4px 6px rgba(0, 0, 0, 0.1)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = theme === 'light' ? '#f9fafb' : '#111827';
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = 'none';
                }}
              >
                {/* Statut badge */}
                <div style={{
                  position: 'absolute',
                  top: '1rem',
                  right: '1rem'
                }}>
                  <span style={{
                    ...getStatutStyle(seance.statut),
                    padding: '0.375rem 0.875rem',
                    borderRadius: '9999px',
                    fontSize: '0.75rem',
                    fontWeight: 600,
                    border: `1px solid ${getStatutStyle(seance.statut).borderColor}`,
                    display: 'inline-block'
                  }}>
                    {getStatutLabel(seance.statut)}
                  </span>
                </div>

                {/* Contenu */}
                <div style={{ marginRight: '120px' }}>
                  {/* UEA */}
                  <div style={{ marginBottom: '1rem' }}>
                    <div style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.5rem',
                      marginBottom: '0.25rem'
                    }}>
                      <FileText style={{ 
                        width: '20px', 
                        height: '20px', 
                        color: '#3b82f6' 
                      }} />
                      <h3 style={{
                        fontSize: '1.125rem',
                        fontWeight: 700,
                        color: theme === 'light' ? '#111827' : '#f9fafb',
                        margin: 0
                      }}>
                        {seance.uea?.code}
                      </h3>
                    </div>
                    <p style={{
                      fontSize: '0.875rem',
                      color: theme === 'light' ? '#6b7280' : '#9ca3af',
                      marginLeft: '1.75rem',
                      margin: 0
                    }}>
                      {seance.uea?.nom}
                    </p>
                    {seance.uea?.filiere?.nom && (
                      <p style={{
                        fontSize: '0.75rem',
                        color: theme === 'light' ? '#9ca3af' : '#6b7280',
                        marginLeft: '1.75rem',
                        marginTop: '0.25rem',
                        margin: 0,
                        
                      }}>
                        {seance.uea.filiere.nom}
                      </p>
                    )}
                  </div>

                  {/* Détails */}
                  <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                    gap: '1rem',
                    fontSize: '0.875rem'
                  }}>
                    {/* Date */}
                    <div style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.5rem',
                      color: theme === 'light' ? '#374151' : '#d1d5db'
                    }}>
                      <Calendar style={{ 
                        width: '16px', 
                        height: '16px',
                        color: theme === 'light' ? '#6b7280' : '#9ca3af'
                      }} />
                      <span style={{ fontWeight: 500 }}>
                        {new Date(seance.date).toLocaleDateString('fr-FR', {
                          weekday: 'long',
                          day: 'numeric',
                          month: 'long',
                          year: 'numeric'
                        })}
                      </span>
                    </div>

                    {/* Horaire */}
                    <div style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.5rem',
                      color: theme === 'light' ? '#374151' : '#d1d5db'
                    }}>
                      <Clock style={{ 
                        width: '16px', 
                        height: '16px',
                        color: theme === 'light' ? '#6b7280' : '#9ca3af'
                      }} />
                      <span>
                        {seance.heure_debut} - {seance.heure_fin}
                        <span style={{ 
                          marginLeft: '0.5rem',
                          color: theme === 'light' ? '#6b7280' : '#9ca3af'
                        }}>
                          ({seance.duree})
                        </span>
                      </span>
                    </div>

                    {/* Enseignant */}
                    <div style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.5rem',
                      color: theme === 'light' ? '#374151' : '#d1d5db'
                    }}>
                      <User style={{ 
                        width: '16px', 
                        height: '16px',
                        color: theme === 'light' ? '#6b7280' : '#9ca3af'
                      }} />
                      <span>
                        {seance.enseignant?.nom || seance.enseignant?.name || 'Non assigné'}
                      </span>
                    </div>

                    {/* Salle */}
                    <div style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.5rem',
                      color: theme === 'light' ? '#374151' : '#d1d5db'
                    }}>
                      <MapPin style={{ 
                        width: '16px', 
                        height: '16px',
                        color: theme === 'light' ? '#6b7280' : '#9ca3af'
                      }} />
                      <span>{seance.salle?.nom || 'Salle non définie'}</span>
                    </div>
                  </div>
                </div>

                {/* Flèche */}
                <ChevronRight style={{
                  position: 'absolute',
                  bottom: '1.5rem',
                  right: '1rem',
                  width: '20px',
                  height: '20px',
                  color: theme === 'light' ? '#9ca3af' : '#6b7280'
                }} />
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Modal détails séance */}
      {selectedSeance && (
        <div
          onClick={() => setSelectedSeance(null)}
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1000,
            padding: '1rem'
          }}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              backgroundColor: theme === 'light' ? 'white' : '#1f2937',
              borderRadius: '16px',
              padding: '2rem',
              maxWidth: '600px',
              width: '100%',
              maxHeight: '90vh',
              overflowY: 'auto',
              boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)'
            }}
          >
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'start',
              marginBottom: '2rem'
            }}>
              <h2 style={{
                fontSize: '1.5rem',
                fontWeight: 700,
                color: theme === 'light' ? '#111827' : '#f9fafb',
                margin: 0
              }}>
                Détails de la séance
              </h2>
              <span style={{
                ...getStatutStyle(selectedSeance.statut),
                padding: '0.5rem 1rem',
                borderRadius: '9999px',
                fontSize: '0.875rem',
                fontWeight: 600,
                border: `1px solid ${getStatutStyle(selectedSeance.statut).borderColor}`
              }}>
                {getStatutLabel(selectedSeance.statut)}
              </span>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
              {/* UEA */}
              <div>
                <label style={{
                  display: 'block',
                  fontSize: '0.875rem',
                  fontWeight: 600,
                  color: theme === 'light' ? '#6b7280' : '#9ca3af',
                  marginBottom: '0.5rem',
                  textTransform: 'uppercase',
                  letterSpacing: '0.05em'
                }}>
                  UEA
                </label>
                <p style={{
                  fontSize: '1rem',
                  fontWeight: 600,
                  color: theme === 'light' ? '#111827' : '#f9fafb',
                  margin: 0,
                  marginBottom: '0.25rem'
                }}>
                  {selectedSeance.uea?.code}
                </p>
                <p style={{
                  fontSize: '0.875rem',
                  color: theme === 'light' ? '#6b7280' : '#9ca3af',
                  margin: 0
                }}>
                  {selectedSeance.uea?.nom}
                </p>
                {selectedSeance.uea?.filiere?.nom && (
                  <p style={{
                    fontSize: '0.875rem',
                    color: theme === 'light' ? '#9ca3af' : '#6b7280',
                    margin: 0,
                    marginTop: '0.25rem'
                  }}>
                    Filière: {selectedSeance.uea.filiere.nom}
                  </p>
                )}
              </div>

              <div style={{
                height: '1px',
                backgroundColor: theme === 'light' ? '#e5e7eb' : '#374151'
              }} />

              {/* Informations */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
                <div>
                  <label style={{
                    display: 'block',
                    fontSize: '0.75rem',
                    fontWeight: 600,
                    color: theme === 'light' ? '#6b7280' : '#9ca3af',
                    marginBottom: '0.5rem',
                    textTransform: 'uppercase',
                    letterSpacing: '0.05em'
                  }}>
                    Date
                  </label>
                  <p style={{
                    fontSize: '0.875rem',
                    color: theme === 'light' ? '#111827' : '#f9fafb',
                    margin: 0
                  }}>
                    {new Date(selectedSeance.date).toLocaleDateString('fr-FR', {
                      weekday: 'long',
                      day: 'numeric',
                      month: 'long',
                      year: 'numeric'
                    })}
                  </p>
                </div>

                <div>
                  <label style={{
                    display: 'block',
                    fontSize: '0.75rem',
                    fontWeight: 600,
                    color: theme === 'light' ? '#6b7280' : '#9ca3af',
                    marginBottom: '0.5rem',
                    textTransform: 'uppercase',
                    letterSpacing: '0.05em'
                  }}>
                    Horaire
                  </label>
                  <p style={{
                    fontSize: '0.875rem',
                    color: theme === 'light' ? '#111827' : '#f9fafb',
                    margin: 0
                  }}>
                    {selectedSeance.heure_debut} - {selectedSeance.heure_fin}
                  </p>
                  <p style={{
                    fontSize: '0.75rem',
                    color: theme === 'light' ? '#6b7280' : '#9ca3af',
                    margin: 0,
                    marginTop: '0.25rem'
                  }}>
                    Durée: {selectedSeance.duree}
                  </p>
                </div>

                <div>
                  <label style={{
                    display: 'block',
                    fontSize: '0.75rem',
                    fontWeight: 600,
                    color: theme === 'light' ? '#6b7280' : '#9ca3af',
                    marginBottom: '0.5rem',
                    textTransform: 'uppercase',
                    letterSpacing: '0.05em'
                  }}>
                    Enseignant
                  </label>
                  <p style={{
                    fontSize: '0.875rem',
                    color: theme === 'light' ? '#111827' : '#f9fafb',
                    margin: 0
                  }}>
                    {selectedSeance.enseignant?.nom || selectedSeance.enseignant?.name || 'Non assigné'}
                  </p>
                </div>

                <div>
                  <label style={{
                    display: 'block',
                    fontSize: '0.75rem',
                    fontWeight: 600,
                    color: theme === 'light' ? '#6b7280' : '#9ca3af',
                    marginBottom: '0.5rem',
                    textTransform: 'uppercase',
                    letterSpacing: '0.05em'
                  }}>
                    Salle
                  </label>
                  <p style={{
                    fontSize: '0.875rem',
                    color: theme === 'light' ? '#111827' : '#f9fafb',
                    margin: 0
                  }}>
                    {selectedSeance.salle?.nom || 'Salle non définie'}
                  </p>
                </div>
              </div>

              <button
                onClick={() => setSelectedSeance(null)}
                style={{
                  marginTop: '1rem',
                  padding: '0.75rem',
                  borderRadius: '8px',
                  border: 'none',
                  backgroundColor: '#3b82f6',
                  color: 'white',
                  fontWeight: 500,
                  fontSize: '0.875rem',
                  cursor: 'pointer',
                  transition: 'all 0.2s',
                  width: '100%'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = '#2563eb';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = '#3b82f6';
                }}
              >
                Fermer
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AssistantSeances;