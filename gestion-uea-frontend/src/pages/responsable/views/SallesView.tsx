import { useEffect, useState } from 'react';
import { apiClient } from '../../../api/client';
import MeetingRoomIcon from '@mui/icons-material/MeetingRoom';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import ListAltIcon from '@mui/icons-material/ListAlt';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import PeopleIcon from '@mui/icons-material/People';
import DescriptionIcon from '@mui/icons-material/Description';
import EventIcon from '@mui/icons-material/Event';
import SchoolIcon from '@mui/icons-material/School';
import PersonIcon from '@mui/icons-material/Person';
import AccessTimeIcon from '@mui/icons-material/AccessTime';

type Salle = {
  id: number;
  nom: string;
  capacite?: number;
  description?: string;
  seances?: Array<{
    id: number;
    date: string;
    heure_debut: string;
    heure_fin: string;
    uea?: { nom: string };
    enseignant?: { name: string };
  }>;
};

const SallesView = () => {
  const [salles, setSalles] = useState<Salle[]>([]);
  const [form, setForm] = useState({ nom: '', capacite: '', description: '' });
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);
  const [mode, setMode] = useState<'form' | 'list'>('list');
  const [deleting, setDeleting] = useState<number | null>(null);

  useEffect(() => {
    fetchSalles();
  }, []);

  const fetchSalles = async () => {
    try {
      const data = await apiClient('/salles');
      setSalles(data);
    } catch (err) {
      console.error('Erreur chargement salles:', err);
    } finally {
      setLoading(false);
    }
  };

  const validate = () => {
    if (!form.nom.trim()) return 'Nom requis';
    if (form.capacite && parseInt(form.capacite) <= 0) return 'Capacité invalide';
    return null;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    
    const validationError = validate();
    if (validationError) {
      setError(validationError);
      setTimeout(() => setError(''), 5000);
      return;
    }

    try {
      const response = await apiClient('/salles', {
        method: 'POST',
        body: JSON.stringify({
          ...form,
          capacite: form.capacite ? parseInt(form.capacite) : null
        })
      });

      setSalles(prev => [...prev, response.salle]);
      setForm({ nom: '', capacite: '', description: '' });
      setSuccess('Salle créée avec succès');
      setTimeout(() => {
        setSuccess('');
        setMode('list');
      }, 2000);
      fetchSalles();
    } catch (err: any) {
      let errorMessage = 'Une erreur est survenue lors de la création';
      
      if (err.message) {
        if (err.message.includes('nom:')) {
          errorMessage = 'Ce nom de salle existe déjà. Veuillez en choisir un autre.';
        } else {
          errorMessage = err.message;
        }
      }
      
      setError(errorMessage);
      setTimeout(() => setError(''), 5000);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Êtes-vous sûr de vouloir supprimer cette salle ?')) return;
    
    setDeleting(id);
    try {
      await apiClient(`/salles/${id}`, { method: 'DELETE' });
      setSalles(prev => prev.filter(s => s.id !== id));
      setSuccess('Salle supprimée avec succès');
      setTimeout(() => setSuccess(''), 3000);
    } catch (err: any) {
      setError('Erreur lors de la suppression: ' + err.message);
      setTimeout(() => setError(''), 5000);
    } finally {
      setDeleting(null);
    }
  };

  if (loading) {
    return (
      <div style={{ 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center', 
        minHeight: '60vh',
        flexDirection: 'column',
        gap: '1rem'
      }}>
        <div style={{
          width: '50px',
          height: '50px',
          border: '4px solid #f3f3f3',
          borderTop: '4px solid #003366',
          borderRadius: '50%',
          animation: 'spin 1s linear infinite'
        }} />
        <p style={{ color: '#666', fontSize: '1.1rem' }}>Chargement des salles...</p>
        <style>{`
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
        `}</style>
      </div>
    );
  }

  return (
    <div style={{ 
      padding: '2rem',
      background: 'linear-gradient(to bottom, #f8f9fa 0%, #ffffff 100%)',
      minHeight: '100vh'
    }}>
      {/* Header */}
      <div style={{ 
        marginBottom: '2.5rem',
        background: 'linear-gradient(135deg, #003366 0%, #004080 100%)',
        padding: '2rem',
        borderRadius: '20px',
        color: '#fff',
        boxShadow: '0 8px 24px rgba(0, 51, 102, 0.2)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <MeetingRoomIcon style={{ fontSize: '3rem' }} />
            <div>
              <h1 style={{ margin: 0, fontSize: '2rem', fontWeight: 700 }}>
                Gestion des Salles
              </h1>
              <p style={{ margin: '0.5rem 0 0 0', opacity: 0.9, fontSize: '1.1rem' }}>
                Gestion et réservation des espaces
              </p>
            </div>
          </div>
          <button 
            onClick={() => setMode(mode === 'form' ? 'list' : 'form')}
            style={{
              padding: '1rem 1.5rem',
              background: 'rgba(255, 255, 255, 0.2)',
              color: '#fff',
              border: '2px solid rgba(255, 255, 255, 0.3)',
              borderRadius: '12px',
              cursor: 'pointer',
              fontSize: '1rem',
              fontWeight: 600,
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              transition: 'all 0.3s',
              backdropFilter: 'blur(10px)'
            }}
            onMouseOver={(e) => {
              e.currentTarget.style.background = 'rgba(255, 255, 255, 0.3)';
              e.currentTarget.style.transform = 'translateY(-2px)';
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.background = 'rgba(255, 255, 255, 0.2)';
              e.currentTarget.style.transform = 'translateY(0)';
            }}
          >
            {mode === 'form' ? (
              <>
                <ListAltIcon />
                Voir la liste
              </>
            ) : (
              <>
                <AddCircleOutlineIcon />
                Ajouter une salle
              </>
            )}
          </button>
        </div>
      </div>

      {/* Messages de succès et d'erreur globaux */}
      {success && (
        <div style={{ 
          background: 'linear-gradient(135deg, #4caf50 0%, #45a049 100%)',
          color: '#fff',
          padding: '1rem',
          borderRadius: '12px',
          marginBottom: '1.5rem',
          display: 'flex',
          alignItems: 'center',
          gap: '0.75rem',
          boxShadow: '0 4px 12px rgba(76, 175, 80, 0.3)',
          animation: 'slideIn 0.3s ease-out'
        }}>
          <CheckCircleIcon />
          <span style={{ fontWeight: 600 }}>{success}</span>
        </div>
      )}

      {error && (
        <div style={{ 
          background: 'linear-gradient(135deg, #f44336 0%, #d32f2f 100%)',
          color: '#fff',
          padding: '1rem',
          borderRadius: '12px',
          marginBottom: '1.5rem',
          display: 'flex',
          alignItems: 'center',
          gap: '0.75rem',
          boxShadow: '0 4px 12px rgba(244, 67, 54, 0.3)',
          animation: 'slideIn 0.3s ease-out'
        }}>
          <DeleteOutlineIcon />
          <span style={{ fontWeight: 600 }}>{error}</span>
        </div>
      )}

      {mode === 'form' ? (
        <div style={{ maxWidth: '700px', margin: '0 auto' }}>
          <div style={{ 
            display: 'flex', 
            alignItems: 'center', 
            gap: '0.75rem',
            marginBottom: '1.5rem'
          }}>
            <AddCircleOutlineIcon style={{ color: '#003366', fontSize: '1.75rem' }} />
            <h2 style={{ 
              margin: 0, 
              color: '#003366',
              fontSize: '1.5rem',
              fontWeight: 600
            }}>
              Ajouter une nouvelle salle
            </h2>
          </div>

          <div style={{
            display: 'grid',
            gap: '1.5rem',
            background: '#fff',
            padding: '2.5rem',
            borderRadius: '20px',
            boxShadow: '0 4px 16px rgba(0,0,0,0.08)',
            border: '1px solid rgba(0,0,0,0.04)'
          }}>
            <div>
              <label style={labelStyle}>
                <MeetingRoomIcon style={{ fontSize: '1.2rem', color: '#666' }} />
                Nom de la salle *
              </label>
              <input 
                name="nom" 
                value={form.nom} 
                onChange={handleChange} 
                style={inputStyle} 
                placeholder="Ex: Salle A101" 
              />
            </div>

            <div>
              <label style={labelStyle}>
                <PeopleIcon style={{ fontSize: '1.2rem', color: '#666' }} />
                Capacité (optionnel)
              </label>
              <input 
                name="capacite" 
                type="number" 
                value={form.capacite} 
                onChange={handleChange} 
                style={inputStyle} 
                placeholder="Ex: 50 personnes" 
              />
            </div>

            <div>
              <label style={labelStyle}>
                <DescriptionIcon style={{ fontSize: '1.2rem', color: '#666' }} />
                Description (optionnel)
              </label>
              <textarea 
                name="description" 
                value={form.description} 
                onChange={handleChange} 
                style={{...inputStyle, minHeight: '100px', resize: 'vertical'}} 
                placeholder="Description de la salle, équipements disponibles..." 
              />
            </div>

            <button 
              onClick={handleSubmit}
              style={{
                padding: '1rem',
                background: 'linear-gradient(135deg, #2196f3 0%, #1976d2 100%)',
                color: '#fff',
                border: 'none',
                borderRadius: '12px',
                cursor: 'pointer',
                fontSize: '1.05rem',
                fontWeight: 600,
                boxShadow: '0 4px 12px rgba(33, 150, 243, 0.3)',
                transition: 'all 0.3s ease',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '0.5rem',
                marginTop: '1rem'
              }}
              onMouseOver={(e) => {
                e.currentTarget.style.transform = 'translateY(-2px)';
                e.currentTarget.style.boxShadow = '0 6px 16px rgba(33, 150, 243, 0.4)';
              }}
              onMouseOut={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = '0 4px 12px rgba(33, 150, 243, 0.3)';
              }}
            >
              <AddCircleOutlineIcon />
              Créer la salle
            </button>
          </div>
        </div>
      ) : (
        <>
          <div style={{ 
            display: 'flex', 
            alignItems: 'center', 
            gap: '0.75rem',
            marginBottom: '1.5rem'
          }}>
            <ListAltIcon style={{ color: '#003366', fontSize: '1.75rem' }} />
            <h2 style={{ 
              margin: 0, 
              color: '#003366',
              fontSize: '1.5rem',
              fontWeight: 600
            }}>
              Liste des salles
            </h2>
            <div style={{
              marginLeft: 'auto',
              background: '#2196f3',
              color: '#fff',
              padding: '0.5rem 1rem',
              borderRadius: '20px',
              fontSize: '0.9rem',
              fontWeight: 600
            }}>
              {salles.length} salle{salles.length > 1 ? 's' : ''}
            </div>
          </div>

          <div style={{ 
            overflowX: 'auto',
            background: '#fff',
            borderRadius: '20px',
            boxShadow: '0 4px 16px rgba(0,0,0,0.08)',
            border: '1px solid rgba(0,0,0,0.04)',
            marginBottom: '3rem'
          }}>
            <table style={{
              width: '100%',
              borderCollapse: 'collapse'
            }}>
              <thead>
                <tr style={{ background: 'linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%)' }}>
                  <th style={thStyle}>Nom</th>
                  <th style={thStyle}>Capacité</th>
                  <th style={thStyle}>Description</th>
                  <th style={thStyle}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {salles.length === 0 ? (
                  <tr>
                    <td colSpan={4} style={{ 
                      textAlign: 'center', 
                      padding: '3rem', 
                      color: '#999',
                      fontSize: '1.1rem'
                    }}>
                      <MeetingRoomIcon style={{ fontSize: '3rem', opacity: 0.3, marginBottom: '1rem' }} />
                      <div>Aucune salle enregistrée</div>
                    </td>
                  </tr>
                ) : (
                  salles.map((s, index) => (
                    <tr 
                      key={s.id}
                      style={{ 
                        backgroundColor: index % 2 === 0 ? '#fff' : '#fafbfc',
                        transition: 'background-color 0.2s'
                      }}
                      onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#f0f7ff'}
                      onMouseOut={(e) => e.currentTarget.style.backgroundColor = index % 2 === 0 ? '#fff' : '#fafbfc'}
                    >
                      <td style={tdStyle}>
                        <div style={{ 
                          display: 'flex', 
                          alignItems: 'center', 
                          justifyContent: 'center', 
                          gap: '0.5rem',
                          fontWeight: 600,
                          color: '#003366'
                        }}>
                          <MeetingRoomIcon style={{ fontSize: '1.2rem' }} />
                          {s.nom}
                        </div>
                      </td>
                      <td style={tdStyle}>
                        {s.capacite ? (
                          <div style={{ 
                            display: 'flex', 
                            alignItems: 'center', 
                            justifyContent: 'center', 
                            gap: '0.25rem'
                          }}>
                            <PeopleIcon style={{ fontSize: '1rem', color: '#666' }} />
                            <span style={{
                              background: '#e3f2fd',
                              color: '#1976d2',
                              padding: '0.25rem 0.75rem',
                              borderRadius: '12px',
                              fontSize: '0.85rem',
                              fontWeight: 600
                            }}>
                              {s.capacite} pers.
                            </span>
                          </div>
                        ) : (
                          <span style={{ color: '#999' }}>-</span>
                        )}
                      </td>
                      <td style={tdStyle}>
                        {s.description ? (
                          <div style={{ fontSize: '0.9rem', color: '#666', maxWidth: '300px', margin: '0 auto' }}>
                            {s.description.length > 60 ? `${s.description.substring(0, 60)}...` : s.description}
                          </div>
                        ) : (
                          <span style={{ color: '#999' }}>-</span>
                        )}
                      </td>
                      <td style={tdStyle}>
                        <button 
                          onClick={() => handleDelete(s.id)}
                          disabled={deleting === s.id}
                          style={{
                            padding: '0.5rem 1rem',
                            background: deleting === s.id ? '#ccc' : 'linear-gradient(135deg, #f44336 0%, #d32f2f 100%)',
                            color: '#fff',
                            border: 'none',
                            borderRadius: '8px',
                            cursor: deleting === s.id ? 'not-allowed' : 'pointer',
                            fontSize: '0.9rem',
                            fontWeight: 600,
                            display: 'flex',
                            alignItems: 'center',
                            gap: '0.5rem',
                            transition: 'all 0.2s',
                            opacity: deleting === s.id ? 0.5 : 1
                          }}
                          onMouseOver={(e) => {
                            if (deleting !== s.id) {
                              e.currentTarget.style.transform = 'scale(1.05)';
                            }
                          }}
                          onMouseOut={(e) => {
                            e.currentTarget.style.transform = 'scale(1)';
                          }}
                          title="Supprimer"
                        >
                          <DeleteOutlineIcon style={{ fontSize: '1.1rem' }} />
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* Tableau des séances programmées */}
          <div style={{ 
            display: 'flex', 
            alignItems: 'center', 
            gap: '0.75rem',
            marginBottom: '1.5rem'
          }}>
            <EventIcon style={{ color: '#003366', fontSize: '1.75rem' }} />
            <h2 style={{ 
              margin: 0, 
              color: '#003366',
              fontSize: '1.5rem',
              fontWeight: 600
            }}>
              Séances programmées
            </h2>
          </div>

          <div style={{ 
            overflowX: 'auto',
            background: '#fff',
            borderRadius: '20px',
            boxShadow: '0 4px 16px rgba(0,0,0,0.08)',
            border: '1px solid rgba(0,0,0,0.04)'
          }}>
            <table style={{
              width: '100%',
              borderCollapse: 'collapse'
            }}>
              <thead>
                <tr style={{ background: 'linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%)' }}>
                  <th style={thStyle}>Salle</th>
                  <th style={thStyle}>Date</th>
                  <th style={thStyle}>Horaire</th>
                  <th style={thStyle}>UEA</th>
                  <th style={thStyle}>Enseignant</th>
                </tr>
              </thead>
              <tbody>
                {salles.flatMap(s =>
                  s.seances?.map((seance, idx) => (
                    <tr 
                      key={seance.id}
                      style={{ 
                        backgroundColor: idx % 2 === 0 ? '#fff' : '#fafbfc',
                        transition: 'background-color 0.2s'
                      }}
                      onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#f0f7ff'}
                      onMouseOut={(e) => e.currentTarget.style.backgroundColor = idx % 2 === 0 ? '#fff' : '#fafbfc'}
                    >
                      <td style={tdStyle}>
                        <div style={{ fontWeight: 600, color: '#003366' }}>
                          {s.nom}
                        </div>
                      </td>
                      <td style={tdStyle}>
                        {new Date(seance.date).toLocaleDateString('fr-FR')}
                      </td>
                      <td style={tdStyle}>
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.25rem' }}>
                          <AccessTimeIcon style={{ fontSize: '1rem', color: '#666' }} />
                          {seance.heure_debut} - {seance.heure_fin}
                        </div>
                      </td>
                      <td style={tdStyle}>
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.25rem' }}>
                          <SchoolIcon style={{ fontSize: '1rem', color: '#666' }} />
                          {seance.uea?.nom || '-'}
                        </div>
                      </td>
                      <td style={tdStyle}>
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.25rem' }}>
                          <PersonIcon style={{ fontSize: '1rem', color: '#666' }} />
                          {seance.enseignant?.name || '-'}
                        </div>
                      </td>
                    </tr>
                  )) || []
                )}
                {salles.every(s => !s.seances || s.seances.length === 0) && (
                  <tr>
                    <td colSpan={5} style={{ 
                      textAlign: 'center', 
                      padding: '2rem', 
                      color: '#999',
                      fontSize: '1rem'
                    }}>
                      <EventIcon style={{ fontSize: '2.5rem', opacity: 0.3, marginBottom: '0.5rem' }} />
                      <div>Aucune séance programmée</div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </>
      )}

      <style>{`
        @keyframes slideIn {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </div>
  );
};

const labelStyle: React.CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  gap: '0.5rem',
  marginBottom: '0.5rem',
  fontSize: '0.95rem',
  fontWeight: 600,
  color: '#333'
};

const inputStyle: React.CSSProperties = {
  width: '100%',
  padding: '0.75rem',
  borderRadius: '10px',
  border: '2px solid #e0e0e0',
  fontSize: '1rem',
  transition: 'all 0.2s',
  outline: 'none'
};

const thStyle: React.CSSProperties = {
  textAlign: 'center',
  padding: '1rem',
  fontWeight: 600,
  fontSize: '0.95rem',
  color: '#003366',
  textTransform: 'uppercase',
  letterSpacing: '0.5px',
  borderBottom: '2px solid #e0e0e0'
};

const tdStyle: React.CSSProperties = {
  textAlign: 'center',
  padding: '1rem',
  fontSize: '0.95rem',
  color: '#333',
  borderBottom: '1px solid #f0f0f0'
};

export default SallesView;