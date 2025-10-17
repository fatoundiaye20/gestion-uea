import { useEffect, useState } from 'react';
import { Calendar, momentLocalizer } from 'react-big-calendar';
import moment from 'moment';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import { apiClient } from '../../../api/client';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import PersonIcon from '@mui/icons-material/Person';
import SchoolIcon from '@mui/icons-material/School';
import MeetingRoomIcon from '@mui/icons-material/MeetingRoom';

const localizer = momentLocalizer(moment);

type Seance = {
  id: number;
  date: string;
  heure_debut: string;
  heure_fin: string;
  duree: string;
  salle_id: number;
  enseignant_id: number;
  uea_id: number;
  statut: string;
  uea?: { nom: string; code: string; filiere: { nom: string } };
  enseignant?: { name: string };
  salle?: { nom: string };
};

type Enseignant = { id: number; name: string; specialite?: string };
type Uea = { id: number; code: string; nom: string; filiere?: { nom: string } };
type Salle = { id: number; nom: string; capacite?: number };

const SeancesView = () => {
  const [seances, setSeances] = useState<Seance[]>([]);
  const [enseignants, setEnseignants] = useState<Enseignant[]>([]);
  const [ueas, setUeas] = useState<Uea[]>([]);
  const [salles, setSalles] = useState<Salle[]>([]);
  const [currentDate, setCurrentDate] = useState(new Date());
  const [form, setForm] = useState({
    date: '',
    heure_debut: '',
    heure_fin: '',
    duree: '4h',
    salle_id: '',
    enseignant_id: '',
    uea_id: ''
  });
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState<number | null>(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [seancesData, enseignantsData, ueasData, sallesData] = await Promise.all([
        apiClient('/seances'),
        apiClient('/users?role=enseignant'),
        apiClient('/ueas'),
        apiClient('/salles')
      ]);
      setSeances(seancesData);
      setEnseignants(enseignantsData);
      setUeas(ueasData);
      setSalles(sallesData);
    } catch (err) {
      console.error('Erreur chargement données:', err);
    } finally {
      setLoading(false);
    }
  };

  const validate = () => {
    if (!form.date) return 'Date requise';
    if (!form.heure_debut || !form.heure_fin) return 'Heures requises';
    if (!form.salle_id) return 'Salle requise';
    if (!form.enseignant_id) return 'Enseignant requis';
    if (!form.uea_id) return 'UEA requise';
    if (!form.duree) return 'Durée requise';
    return null;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const error = validate();
    if (error) return alert(error);

    try {
      const nouvelle = await apiClient('/seances', {
        method: 'POST',
        body: JSON.stringify(form)
      });

      setSeances(prev => [...prev, nouvelle.seance]);
      setForm({
        date: '',
        heure_debut: '',
        heure_fin: '',
        duree: '4h',
        salle_id: '',
        enseignant_id: '',
        uea_id: ''
      });
      setSuccess('Séance créée avec succès');
      setTimeout(() => setSuccess(''), 3000);
      fetchData();
    } catch (err: any) {
      alert('Erreur: ' + err.message);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Êtes-vous sûr de vouloir supprimer cette séance ?')) return;
    
    setDeleting(id);
    try {
      await apiClient(`/seances/${id}`, { method: 'DELETE' });
      setSeances(prev => prev.filter(s => s.id !== id));
      alert('Séance supprimée avec succès');
    } catch (err: any) {
      alert('Erreur lors de la suppression: ' + err.message);
    } finally {
      setDeleting(null);
    }
  };

  const events = seances.map(s => ({
    id: s.id,
    title: `${s.uea?.code || ''} - ${s.enseignant?.name || ''}`,
    start: new Date(`${s.date}T${s.heure_debut}`),
    end: new Date(`${s.date}T${s.heure_fin}`),
    resource: s
  }));

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
        <p style={{ color: '#666', fontSize: '1.1rem' }}>Chargement des séances...</p>
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
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <CalendarTodayIcon style={{ fontSize: '3rem' }} />
          <div>
            <h1 style={{ margin: 0, fontSize: '2rem', fontWeight: 700 }}>
              Gestion des Séances
            </h1>
            <p style={{ margin: '0.5rem 0 0 0', opacity: 0.9, fontSize: '1.1rem' }}>
              Planification et suivi des cours
            </p>
          </div>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '2rem', marginBottom: '2rem' }}>
        {/* Calendrier */}
        <div>
          <div style={{ 
            display: 'flex', 
            alignItems: 'center', 
            gap: '0.75rem',
            marginBottom: '1.5rem'
          }}>
            <CalendarTodayIcon style={{ color: '#003366', fontSize: '1.75rem' }} />
            <h2 style={{ 
              margin: 0, 
              color: '#003366',
              fontSize: '1.5rem',
              fontWeight: 600
            }}>
              Calendrier des séances
            </h2>
          </div>
          <div style={{
            height: 600,
            background: '#fff',
            padding: '1.5rem',
            borderRadius: '20px',
            boxShadow: '0 4px 16px rgba(0,0,0,0.08)',
            border: '1px solid rgba(0,0,0,0.04)'
          }}>
            <Calendar
              localizer={localizer}
              events={events}
              startAccessor="start"
              endAccessor="end"
              date={currentDate}
              onNavigate={(date) => setCurrentDate(date)}
              views={['month', 'week', 'day']}
              toolbar={true}
              messages={{
                month: 'Mois',
                week: 'Semaine',
                day: 'Jour',
                today: 'Aujourd\'hui',
                previous: '←',
                next: '→'
              }}
              eventPropGetter={(event) => {
                return {
                  style: {
                    backgroundColor:
                      event.resource.statut === 'realisee' ? '#4caf50' :
                      event.resource.statut === 'validee' ? '#2196f3' :
                      '#ff9800',
                    color: '#fff',
                    borderRadius: '8px',
                    padding: '4px 8px',
                    fontWeight: 600,
                    border: 'none',
                    fontSize: '0.9rem'
                  }
                };
              }}
              style={{ height: '100%' }}
            />
          </div>
        </div>

        {/* Formulaire */}
        <div>
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
              Créer une séance
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
            gap: '1.25rem',
            background: '#fff',
            padding: '2rem',
            borderRadius: '20px',
            boxShadow: '0 4px 16px rgba(0,0,0,0.08)',
            border: '1px solid rgba(0,0,0,0.04)'
          }}>
            <div>
              <label style={labelStyle}>
                <CalendarTodayIcon style={{ fontSize: '1.2rem', color: '#666' }} />
                Date *
              </label>
              <input 
                type="date" 
                name="date" 
                value={form.date} 
                onChange={handleChange} 
                style={inputStyle} 
                required 
              />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              <div>
                <label style={labelStyle}>
                  <AccessTimeIcon style={{ fontSize: '1.2rem', color: '#666' }} />
                  Heure début *
                </label>
                <input 
                  type="time" 
                  name="heure_debut" 
                  value={form.heure_debut} 
                  onChange={handleChange} 
                  style={inputStyle} 
                  required 
                />
              </div>

              <div>
                <label style={labelStyle}>
                  <AccessTimeIcon style={{ fontSize: '1.2rem', color: '#666' }} />
                  Heure fin *
                </label>
                <input 
                  type="time" 
                  name="heure_fin" 
                  value={form.heure_fin} 
                  onChange={handleChange} 
                  style={inputStyle} 
                  required 
                />
              </div>
            </div>

            <div>
              <label style={labelStyle}>
                <AccessTimeIcon style={{ fontSize: '1.2rem', color: '#666' }} />
                Durée *
              </label>
              <select 
                name="duree" 
                value={form.duree} 
                onChange={handleChange} 
                style={inputStyle} 
                required
              >
                <option value="4h">4 heures</option>
                <option value="8h">8 heures</option>
              </select>
            </div>

            <div>
              <label style={labelStyle}>
                <SchoolIcon style={{ fontSize: '1.2rem', color: '#666' }} />
                UEA *
              </label>
              <select 
                name="uea_id" 
                value={form.uea_id} 
                onChange={handleChange} 
                style={inputStyle} 
                required
              >
                <option value="">Sélectionner une UEA</option>
                {ueas.map(u => (
                  <option key={u.id} value={u.id}>
                    {u.code} - {u.nom} ({u.filiere?.nom})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label style={labelStyle}>
                <PersonIcon style={{ fontSize: '1.2rem', color: '#666' }} />
                Enseignant *
              </label>
              <select 
                name="enseignant_id" 
                value={form.enseignant_id} 
                onChange={handleChange} 
                style={inputStyle} 
                required
              >
                <option value="">Sélectionner un enseignant</option>
                {enseignants.map(e => (
                  <option key={e.id} value={e.id}>
                    {e.name} {e.specialite ? `(${e.specialite})` : ''}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label style={labelStyle}>
                <MeetingRoomIcon style={{ fontSize: '1.2rem', color: '#666' }} />
                Salle *
              </label>
              <select 
                name="salle_id" 
                value={form.salle_id} 
                onChange={handleChange} 
                style={inputStyle} 
                required
              >
                <option value="">Sélectionner une salle</option>
                {salles.map(s => (
                  <option key={s.id} value={s.id}>
                    {s.nom} {s.capacite ? `(Capacité: ${s.capacite})` : ''}
                  </option>
                ))}
              </select>
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
                gap: '0.5rem'
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
              Créer la séance
            </button>
          </div>
        </div>
      </div>

      {/* Tableau des séances */}
      <div>
        <div style={{ 
          display: 'flex', 
          alignItems: 'center', 
          gap: '0.75rem',
          marginBottom: '1.5rem'
        }}>
          <CalendarTodayIcon style={{ color: '#003366', fontSize: '1.75rem' }} />
          <h2 style={{ 
            margin: 0, 
            color: '#003366',
            fontSize: '1.5rem',
            fontWeight: 600
          }}>
            Liste des séances
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
            {seances.length} séance{seances.length > 1 ? 's' : ''}
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
                <th style={thStyle}>Date</th>
                <th style={thStyle}>Heure</th>
                <th style={thStyle}>UEA</th>
                <th style={thStyle}>Enseignant</th>
                <th style={thStyle}>Salle</th>
                <th style={thStyle}>Durée</th>
                <th style={thStyle}>Statut</th>
                <th style={thStyle}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {seances.length === 0 ? (
                <tr>
                  <td colSpan={8} style={{ 
                    textAlign: 'center', 
                    padding: '3rem', 
                    color: '#999',
                    fontSize: '1.1rem'
                  }}>
                    <CalendarTodayIcon style={{ fontSize: '3rem', opacity: 0.3, marginBottom: '1rem' }} />
                    <div>Aucune séance enregistrée</div>
                  </td>
                </tr>
              ) : (
                seances.map((s, index) => (
                  <tr 
                    key={s.id} 
                    style={{ 
                      backgroundColor: index % 2 === 0 ? '#fff' : '#fafbfc',
                      transition: 'background-color 0.2s'
                    }}
                    onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#f0f7ff'}
                    onMouseOut={(e) => e.currentTarget.style.backgroundColor = index % 2 === 0 ? '#fff' : '#fafbfc'}
                  >
                    <td style={tdStyle}>{new Date(s.date).toLocaleDateString('fr-FR')}</td>
                    <td style={tdStyle}>
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.25rem' }}>
                        <AccessTimeIcon style={{ fontSize: '1rem', color: '#666' }} />
                        {s.heure_debut} - {s.heure_fin}
                      </div>
                    </td>
                    <td style={tdStyle}>
                      <div style={{ fontWeight: 600, color: '#003366' }}>{s.uea?.code}</div>
                      <div style={{ fontSize: '0.85rem', color: '#666' }}>{s.uea?.nom}</div>
                    </td>
                    <td style={tdStyle}>{s.enseignant?.name}</td>
                    <td style={tdStyle}>{s.salle?.nom}</td>
                    <td style={tdStyle}>
                      <span style={{
                        background: '#e3f2fd',
                        color: '#1976d2',
                        padding: '0.25rem 0.75rem',
                        borderRadius: '12px',
                        fontSize: '0.85rem',
                        fontWeight: 600
                      }}>
                        {s.duree}
                      </span>
                    </td>
                    <td style={tdStyle}>
                      <span style={statusStyle(s.statut)}>{s.statut}</span>
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
                        {deleting === s.id ? 'Suppression...' : 'Supprimer'}
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

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

const statusStyle = (statut: string): React.CSSProperties => ({
  padding: '0.4rem 1rem',
  borderRadius: '20px',
  fontSize: '0.85rem',
  fontWeight: 600,
  textTransform: 'capitalize',
  background:
    statut === 'realisee' ? 'linear-gradient(135deg, #4caf50 0%, #45a049 100%)' :
    statut === 'validee' ? 'linear-gradient(135deg, #2196f3 0%, #1976d2 100%)' :
    'linear-gradient(135deg, #ff9800 0%, #f57c00 100%)',
  color: '#fff',
  boxShadow: '0 2px 8px rgba(0,0,0,0.15)'
});

export default SeancesView;