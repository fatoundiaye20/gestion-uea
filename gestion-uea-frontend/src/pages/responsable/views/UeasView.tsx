import { useEffect, useState } from 'react';
import { apiClient } from '../../../api/client';
import SchoolIcon from '@mui/icons-material/School';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import ListAltIcon from '@mui/icons-material/ListAlt';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import PersonIcon from '@mui/icons-material/Person';
import CodeIcon from '@mui/icons-material/Code';
import DescriptionIcon from '@mui/icons-material/Description';
import CategoryIcon from '@mui/icons-material/Category';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';

type Enseignant = { id: number; name: string };
type Filiere = { id: number; nom: string };
type Uea = {
  id: number;
  nom: string;
  code: string;
  description?: string;
  volume_horaire_total: number;
  semestre: string;
  niveau: string;
  filiere?: Filiere;
  enseignants?: Array<{ name: string }>;
  created_by?: { name: string; role: string };
};

const UeasView = () => {
  const [ueas, setUeas] = useState<Uea[]>([]);
  const [enseignants, setEnseignants] = useState<Enseignant[]>([]);
  const [filieres, setFilieres] = useState<Filiere[]>([]);
  const [form, setForm] = useState({
    nom: '',
    code: '',
    description: '',
    volume_horaire_total: '',
    filiere_id: '',
    semestre: '',
    niveau: ''
  });
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);
  const [mode, setMode] = useState<'form' | 'list'>('list');
  const [deleting, setDeleting] = useState<number | null>(null);

  useEffect(() => {
    fetchUeas();
    fetchEnseignants();
    fetchFilieres();
  }, []);

  const fetchUeas = async () => {
    try {
      const data = await apiClient('/ueas');
      setUeas(data);
    } catch (err) {
      console.error('Erreur chargement UEA:', err);
    } finally {
      setLoading(false);
    }
  };

  const fetchEnseignants = async () => {
    try {
      const data = await apiClient('/users?role=enseignant');
      setEnseignants(data);
    } catch (err) {
      console.error('Erreur chargement enseignants:', err);
    }
  };

  const fetchFilieres = async () => {
    try {
      const data = await apiClient('/filieres');
      setFilieres(data);
    } catch (err) {
      console.error('Erreur chargement filières:', err);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const { nom, code, volume_horaire_total, filiere_id, semestre, niveau } = form;
    
    if (!nom || !code || !volume_horaire_total || !filiere_id || !semestre || !niveau) {
      return alert('Tous les champs requis doivent être remplis');
    }

    if (!['S1', 'S2', 'S3', 'S4'].includes(semestre)) {
      return alert('Semestre invalide. Utilisez S1, S2, S3 ou S4');
    }

    if (!['1re_annee', '2e_annee'].includes(niveau)) {
      return alert('Niveau invalide. Utilisez 1re_annee ou 2e_annee');
    }

    try {
      const response: { uea: Uea } = await apiClient('/ueas', {
        method: 'POST',
        body: JSON.stringify({
          nom,
          code,
          description: form.description || null,
          volume_horaire_total: parseInt(volume_horaire_total),
          filiere_id: parseInt(filiere_id),
          semestre,
          niveau
        })
      });

      setUeas(prev => [...prev, response.uea]);
      setForm({
        nom: '',
        code: '',
        description: '',
        volume_horaire_total: '',
        filiere_id: '',
        semestre: '',
        niveau: ''
      });
      setSuccess('UEA créée avec succès');
      setTimeout(() => setSuccess(''), 3000);
      fetchUeas();
      setMode('list');
    } catch (err: any) {
      console.error('❌ Erreur complète:', err);
      alert('Erreur: ' + err.message);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Êtes-vous sûr de vouloir supprimer cette UEA ?')) return;
    
    setDeleting(id);
    try {
      await apiClient(`/ueas/${id}`, { method: 'DELETE' });
      setUeas(prev => prev.filter(u => u.id !== id));
      alert('UEA supprimée avec succès');
    } catch (err: any) {
      alert('Erreur lors de la suppression: ' + err.message);
    } finally {
      setDeleting(null);
    }
  };

  const getStatut = (uea: Uea) => {
    return 'Programmé';
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
        <p style={{ color: '#666', fontSize: '1.1rem' }}>Chargement des UEAs...</p>
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
            <SchoolIcon style={{ fontSize: '3rem' }} />
            <div>
              <h1 style={{ margin: 0, fontSize: '2rem', fontWeight: 700 }}>
                Gestion des UEAs
              </h1>
              <p style={{ margin: '0.5rem 0 0 0', opacity: 0.9, fontSize: '1.1rem' }}>
                Unités d'Enseignement et d'Apprentissage
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
                Créer une UEA
              </>
            )}
          </button>
        </div>
      </div>

      {mode === 'form' ? (
        <div style={{ maxWidth: '800px', margin: '0 auto' }}>
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
              Créer une nouvelle UEA
            </h2>
          </div>
          
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

          <div style={{
            display: 'grid',
            gap: '1.5rem',
            background: '#fff',
            padding: '2.5rem',
            borderRadius: '20px',
            boxShadow: '0 4px 16px rgba(0,0,0,0.08)',
            border: '1px solid rgba(0,0,0,0.04)'
          }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
              <div>
                <label style={labelStyle}>
                  <SchoolIcon style={{ fontSize: '1.2rem', color: '#666' }} />
                  Nom *
                </label>
                <input 
                  name="nom" 
                  value={form.nom} 
                  onChange={handleChange} 
                  style={inputStyle} 
                  placeholder="Ex: Programmation Web" 
                />
              </div>

              <div>
                <label style={labelStyle}>
                  <CodeIcon style={{ fontSize: '1.2rem', color: '#666' }} />
                  Code *
                </label>
                <input 
                  name="code" 
                  value={form.code} 
                  onChange={handleChange} 
                  style={inputStyle} 
                  placeholder="Ex: UEA101" 
                />
              </div>
            </div>

            <div>
              <label style={labelStyle}>
                <DescriptionIcon style={{ fontSize: '1.2rem', color: '#666' }} />
                Description
              </label>
              <textarea 
                name="description" 
                value={form.description} 
                onChange={handleChange} 
                style={{...inputStyle, minHeight: '100px', resize: 'vertical'}} 
                placeholder="Description optionnelle de l'UEA..." 
              />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
              <div>
                <label style={labelStyle}>
                  <AccessTimeIcon style={{ fontSize: '1.2rem', color: '#666' }} />
                  Volume horaire total *
                </label>
                <input 
                  name="volume_horaire_total" 
                  type="number" 
                  value={form.volume_horaire_total} 
                  onChange={handleChange} 
                  style={inputStyle} 
                  placeholder="Ex: 40" 
                />
              </div>

              <div>
                <label style={labelStyle}>
                  <CategoryIcon style={{ fontSize: '1.2rem', color: '#666' }} />
                  Filière *
                </label>
                <select 
                  name="filiere_id" 
                  value={form.filiere_id} 
                  onChange={handleChange} 
                  style={inputStyle}
                >
                  <option value="">-- Choisir une filière --</option>
                  {filieres.map(f => (
                    <option key={f.id} value={f.id}>{f.nom}</option>
                  ))}
                </select>
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
              <div>
                <label style={labelStyle}>
                  <CalendarTodayIcon style={{ fontSize: '1.2rem', color: '#666' }} />
                  Semestre *
                </label>
                <select 
                  name="semestre" 
                  value={form.semestre} 
                  onChange={handleChange} 
                  style={inputStyle}
                >
                  <option value="">-- Choisir --</option>
                  <option value="S1">S1</option>
                  <option value="S2">S2</option>
                  <option value="S3">S3</option>
                  <option value="S4">S4</option>
                </select>
              </div>

              <div>
                <label style={labelStyle}>
                  <TrendingUpIcon style={{ fontSize: '1.2rem', color: '#666' }} />
                  Niveau *
                </label>
                <select 
                  name="niveau" 
                  value={form.niveau} 
                  onChange={handleChange} 
                  style={inputStyle}
                >
                  <option value="">-- Choisir --</option>
                  <option value="1re_annee">1ère année</option>
                  <option value="2e_annee">2ème année</option>
                </select>
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
              Créer l'UEA
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
              Liste des UEAs
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
              {ueas.length} UEA{ueas.length > 1 ? 's' : ''}
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
                  <th style={thStyle}>Code</th>
                  <th style={thStyle}>Nom</th>
                  <th style={thStyle}>Volume horaire</th>
                  <th style={thStyle}>Filière</th>
                  <th style={thStyle}>Semestre</th>
                  <th style={thStyle}>Niveau</th>
                  <th style={thStyle}>Enseignants</th>
                  <th style={thStyle}>Créé par</th>
                  <th style={thStyle}>Statut</th>
                  <th style={thStyle}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {ueas.length === 0 ? (
                  <tr>
                    <td colSpan={10} style={{ 
                      textAlign: 'center', 
                      padding: '3rem', 
                      color: '#999',
                      fontSize: '1.1rem'
                    }}>
                      <SchoolIcon style={{ fontSize: '3rem', opacity: 0.3, marginBottom: '1rem' }} />
                      <div>Aucune UEA enregistrée</div>
                    </td>
                  </tr>
                ) : (
                  ueas.map((u, index) => (
                    <tr 
                      key={u.id}
                      style={{ 
                        backgroundColor: index % 2 === 0 ? '#fff' : '#fafbfc',
                        transition: 'background-color 0.2s'
                      }}
                      onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#f0f7ff'}
                      onMouseOut={(e) => e.currentTarget.style.backgroundColor = index % 2 === 0 ? '#fff' : '#fafbfc'}
                    >
                      <td style={tdStyle}>
                        <span style={{
                          background: '#e3f2fd',
                          color: '#1976d2',
                          padding: '0.25rem 0.75rem',
                          borderRadius: '12px',
                          fontSize: '0.85rem',
                          fontWeight: 600
                        }}>
                          {u.code}
                        </span>
                      </td>
                      <td style={tdStyle}>
                        <div style={{ fontWeight: 600, color: '#003366' }}>{u.nom}</div>
                        {u.description && (
                          <div style={{ fontSize: '0.8rem', color: '#666', marginTop: '0.25rem' }}>
                            {u.description.substring(0, 50)}...
                          </div>
                        )}
                      </td>
                      <td style={tdStyle}>
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.25rem' }}>
                          <AccessTimeIcon style={{ fontSize: '1rem', color: '#666' }} />
                          {u.volume_horaire_total}h
                        </div>
                      </td>
                      <td style={tdStyle}>{u.filiere?.nom || '-'}</td>
                      <td style={tdStyle}>
                        <span style={{
                          background: '#fff3e0',
                          color: '#f57c00',
                          padding: '0.25rem 0.75rem',
                          borderRadius: '12px',
                          fontSize: '0.85rem',
                          fontWeight: 600
                        }}>
                          {u.semestre}
                        </span>
                      </td>
                      <td style={tdStyle}>{u.niveau === '1re_annee' ? '1ère année' : '2ème année'}</td>
                      <td style={tdStyle}>
                        {u.enseignants && u.enseignants.length > 0 ? (
                          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.25rem' }}>
                            <PersonIcon style={{ fontSize: '1rem', color: '#666' }} />
                            {u.enseignants.map(e => e.name).join(', ')}
                          </div>
                        ) : (
                          <span style={{ color: '#999', fontSize: '0.9rem' }}>Aucun</span>
                        )}
                      </td>
                      <td style={tdStyle}>
                        {u.created_by ? (
                          <div>
                            <div style={{ fontWeight: 600 }}>{u.created_by.name}</div>
                            <div style={{ fontSize: '0.8rem', color: '#666' }}>
                              {u.created_by.role === 'chef_dep' ? 'Chef Dép.' : 'Resp. Métier'}
                            </div>
                          </div>
                        ) : (
                          <span style={{ color: '#999' }}>Non défini</span>
                        )}
                      </td>
                      <td style={tdStyle}>
                        <span style={{
                          padding: '0.4rem 1rem',
                          borderRadius: '20px',
                          fontSize: '0.85rem',
                          fontWeight: 600,
                          background: 'linear-gradient(135deg, #2196f3 0%, #1976d2 100%)',
                          color: '#fff',
                          boxShadow: '0 2px 8px rgba(0,0,0,0.15)'
                        }}>
                          {getStatut(u)}
                        </span>
                      </td>
                      <td style={tdStyle}>
                        <button 
                          onClick={() => handleDelete(u.id)}
                          disabled={deleting === u.id}
                          style={{
                            padding: '0.5rem 1rem',
                            background: deleting === u.id ? '#ccc' : 'linear-gradient(135deg, #f44336 0%, #d32f2f 100%)',
                            color: '#fff',
                            border: 'none',
                            borderRadius: '8px',
                            cursor: deleting === u.id ? 'not-allowed' : 'pointer',
                            fontSize: '0.9rem',
                            fontWeight: 600,
                            display: 'flex',
                            alignItems: 'center',
                            gap: '0.5rem',
                            transition: 'all 0.2s',
                            opacity: deleting === u.id ? 0.5 : 1
                          }}
                          onMouseOver={(e) => {
                            if (deleting !== u.id) {
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

export default UeasView;