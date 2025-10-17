import { useEffect, useState } from 'react';
import { apiClient } from '../../../api/client';
import PersonIcon from '@mui/icons-material/Person';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import ListAltIcon from '@mui/icons-material/ListAlt';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import EmailIcon from '@mui/icons-material/Email';
import SchoolIcon from '@mui/icons-material/School';
import BadgeIcon from '@mui/icons-material/Badge';

type Enseignant = {
  id: number;
  name: string;
  email: string;
  specialite?: string;
};

const EnseignantsView = () => {
  const [enseignants, setEnseignants] = useState<Enseignant[]>([]);
  const [form, setForm] = useState({ name: '', email: '', specialite: '' });
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);
  const [mode, setMode] = useState<'form' | 'list'>('list');
  const [deleting, setDeleting] = useState<number | null>(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const data = await apiClient('/users?role=enseignant');
      setEnseignants(data);
    } catch (err) {
      console.error('Erreur chargement enseignants:', err);
    } finally {
      setLoading(false);
    }
  };

  const validate = () => {
    if (!form.name.trim()) return 'Nom requis';
    if (!form.email.includes('@isep-thies.edu.sn')) return 'Email doit être @isep-thies.edu.sn';
    return null;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
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
      const response = await apiClient('/create-user', {
        method: 'POST',
        body: JSON.stringify({
          name: form.name,
          email: form.email,
          specialite: form.specialite || null,
          role: 'enseignant'
        })
      });

      setForm({ name: '', email: '', specialite: '' });
      setSuccess('Enseignant ajouté avec succès. Email envoyé avec identifiants.');
      setTimeout(() => {
        setSuccess('');
        setMode('list');
      }, 3000);
      fetchData();
    } catch (err: any) {
      let errorMessage = 'Une erreur est survenue lors de la création';
      
      if (err.message) {
        if (err.message.includes('email:')) {
          errorMessage = 'Cet email existe déjà. Veuillez en choisir un autre.';
        } else {
          errorMessage = err.message;
        }
      }
      
      setError(errorMessage);
      setTimeout(() => setError(''), 5000);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Êtes-vous sûr de vouloir supprimer cet enseignant ?')) return;
    
    setDeleting(id);
    try {
      await apiClient(`/users/${id}`, { method: 'DELETE' });
      setEnseignants(prev => prev.filter(e => e.id !== id));
      setSuccess('Enseignant supprimé avec succès');
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
        <p style={{ color: '#666', fontSize: '1.1rem' }}>Chargement des enseignants...</p>
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
            <PersonIcon style={{ fontSize: '3rem' }} />
            <div>
              <h1 style={{ margin: 0, fontSize: '2rem', fontWeight: 700 }}>
                Gestion des Enseignants
              </h1>
              <p style={{ margin: '0.5rem 0 0 0', opacity: 0.9, fontSize: '1.1rem' }}>
                Gérer le corps enseignant
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
                Ajouter un enseignant
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
              Ajouter un nouvel enseignant
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
                <BadgeIcon style={{ fontSize: '1.2rem', color: '#666' }} />
                Nom complet *
              </label>
              <input 
                name="name" 
                value={form.name} 
                onChange={handleChange} 
                style={inputStyle} 
                placeholder="Prénom Nom" 
              />
            </div>

            <div>
              <label style={labelStyle}>
                <EmailIcon style={{ fontSize: '1.2rem', color: '#666' }} />
                Adresse email *
              </label>
              <input 
                name="email" 
                type="email"
                value={form.email} 
                onChange={handleChange} 
                style={inputStyle} 
                placeholder="prenom.nom@isep-thies.edu.sn" 
              />
              <p style={{ fontSize: '0.85rem', color: '#666', marginTop: '0.5rem', marginBottom: 0 }}>
                ℹ️ L'email doit se terminer par @isep-thies.edu.sn
              </p>
            </div>

            <div>
              <label style={labelStyle}>
                <SchoolIcon style={{ fontSize: '1.2rem', color: '#666' }} />
                Spécialité (optionnel)
              </label>
              <input 
                name="specialite" 
                value={form.specialite} 
                onChange={handleChange} 
                style={inputStyle} 
                placeholder="Ex: Informatique, Mathématiques, Physique..." 
              />
            </div>

            <div style={{
              background: '#e3f2fd',
              padding: '1rem',
              borderRadius: '12px',
              border: '1px solid #90caf9',
              fontSize: '0.9rem',
              color: '#1565c0',
              display: 'flex',
              gap: '0.5rem'
            }}>
              <EmailIcon style={{ fontSize: '1.2rem' }} />
              <div>
                <strong>Note importante :</strong> Un email contenant les identifiants de connexion sera automatiquement envoyé à l'enseignant.
              </div>
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
              Créer le compte enseignant
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
              Liste des enseignants
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
              {enseignants.length} enseignant{enseignants.length > 1 ? 's' : ''}
            </div>
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
                  <th style={thStyle}>Nom</th>
                  <th style={thStyle}>Email</th>
                  <th style={thStyle}>Spécialité</th>
                  <th style={thStyle}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {enseignants.length === 0 ? (
                  <tr>
                    <td colSpan={4} style={{ 
                      textAlign: 'center', 
                      padding: '3rem', 
                      color: '#999',
                      fontSize: '1.1rem'
                    }}>
                      <PersonIcon style={{ fontSize: '3rem', opacity: 0.3, marginBottom: '1rem' }} />
                      <div>Aucun enseignant enregistré</div>
                    </td>
                  </tr>
                ) : (
                  enseignants.map((e, index) => (
                    <tr 
                      key={e.id}
                      style={{ 
                        backgroundColor: index % 2 === 0 ? '#fff' : '#fafbfc',
                        transition: 'background-color 0.2s'
                      }}
                      onMouseOver={(ev) => ev.currentTarget.style.backgroundColor = '#f0f7ff'}
                      onMouseOut={(ev) => ev.currentTarget.style.backgroundColor = index % 2 === 0 ? '#fff' : '#fafbfc'}
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
                          <PersonIcon style={{ fontSize: '1.2rem' }} />
                          {e.name}
                        </div>
                      </td>
                      <td style={tdStyle}>
                        <div style={{ 
                          display: 'flex', 
                          alignItems: 'center', 
                          justifyContent: 'center', 
                          gap: '0.5rem'
                        }}>
                          <EmailIcon style={{ fontSize: '1rem', color: '#666' }} />
                          {e.email}
                        </div>
                      </td>
                      <td style={tdStyle}>
                        {e.specialite ? (
                          <span style={{
                            background: '#e8f5e9',
                            color: '#2e7d32',
                            padding: '0.25rem 0.75rem',
                            borderRadius: '12px',
                            fontSize: '0.85rem',
                            fontWeight: 600,
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '0.25rem'
                          }}>
                            <SchoolIcon style={{ fontSize: '0.9rem' }} />
                            {e.specialite}
                          </span>
                        ) : (
                          <span style={{ color: '#999' }}>-</span>
                        )}
                      </td>
                      <td style={tdStyle}>
                        <button 
                          onClick={() => handleDelete(e.id)}
                          disabled={deleting === e.id}
                          style={{
                            padding: '0.5rem 1rem',
                            background: deleting === e.id ? '#ccc' : 'linear-gradient(135deg, #f44336 0%, #d32f2f 100%)',
                            color: '#fff',
                            border: 'none',
                            borderRadius: '8px',
                            cursor: deleting === e.id ? 'not-allowed' : 'pointer',
                            fontSize: '0.9rem',
                            fontWeight: 600,
                            display: 'flex',
                            alignItems: 'center',
                            gap: '0.5rem',
                            transition: 'all 0.2s',
                            opacity: deleting === e.id ? 0.5 : 1
                          }}
                          onMouseOver={(ev) => {
                            if (deleting !== e.id) {
                              ev.currentTarget.style.transform = 'scale(1.05)';
                            }
                          }}
                          onMouseOut={(ev) => {
                            ev.currentTarget.style.transform = 'scale(1)';
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

export default EnseignantsView;