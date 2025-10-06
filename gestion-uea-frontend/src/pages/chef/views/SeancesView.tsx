import { useEffect, useState } from 'react';
import { Calendar, momentLocalizer } from 'react-big-calendar';
import moment from 'moment';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import { apiClient } from '../../../api/client';

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
    } catch (err: any) {
      alert('Erreur: ' + err.message);
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
    return <div style={{ textAlign: 'center', padding: '2rem' }}>Chargement...</div>;
  }

  return (
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem' }}>
      <div>
        <h3>Calendrier des séances</h3>
        <div style={{
          height: 500,
          background: '#fff',
          padding: '1rem',
          borderRadius: '12px',
          boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
          border: '1px solid #ddd'
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
              today: 'Aujourd’hui',
              previous: '←',
              next: '→'
            }}
            eventPropGetter={(event) => ({
              style: {
                backgroundColor:
                  event.resource.statut === 'realisee' ? '#4caf50' :
                  event.resource.statut === 'validee' ? '#2196f3' :
                  '#ff9800',
                color: '#fff',
                borderRadius: '6px',
                padding: '2px 6px',
                fontWeight: 'bold',
                border: 'none'
              }
            })}
            style={{ height: '100%' }}
          />
        </div>
      </div>

      <div>
        <h3>Créer une séance</h3>
        {success && <div style={{ color: 'green', marginBottom: '1rem' }}>{success}</div>}
        <div style={formStyle}>
          <label>Date</label>
          <input type="date" name="date" value={form.date} onChange={handleChange} style={inputStyle} required />

          <label>Heure début</label>
          <input type="time" name="heure_debut" value={form.heure_debut} onChange={handleChange} style={inputStyle} required />

          <label>Heure fin</label>
          <input type="time" name="heure_fin" value={form.heure_fin} onChange={handleChange} style={inputStyle} required />

          <label>Durée</label>
          <select name="duree" value={form.duree} onChange={handleChange} style={inputStyle} required>
            <option value="4h">4 heures</option>
            <option value="8h">8 heures</option>
          </select>

          <label>UEA</label>
          <select name="uea_id" value={form.uea_id} onChange={handleChange} style={inputStyle} required>
            <option value="">Sélectionner une UEA</option>
            {ueas.map(u => (
              <option key={u.id} value={u.id}>
                {u.code} - {u.nom} ({u.filiere?.nom})
              </option>
            ))}
          </select>

          <label>Enseignant</label>
          <select name="enseignant_id" value={form.enseignant_id} onChange={handleChange} style={inputStyle} required>
            <option value="">Sélectionner un enseignant</option>
            {enseignants.map(e => (
              <option key={e.id} value={e.id}>
                {e.name} {e.specialite ? `(${e.specialite})` : ''}
              </option>
            ))}
          </select>

          <label>Salle</label>
          <select name="salle_id" value={form.salle_id} onChange={handleChange} style={inputStyle} required>
            <option value="">Sélectionner une salle</option>
            {salles.map(s => (
              <option key={s.id} value={s.id}>
                {s.nom} {s.capacite ? `(Capacité: ${s.capacite})` : ''}
              </option>
            ))}
          </select>

          <button onClick={handleSubmit} style={buttonStyle}>Créer la séance</button>
        </div>
      </div>

      <div style={{ gridColumn: '1 / span 2' }}>
        <h3>Liste des séances</h3>
        <div style={{ overflowX: 'auto' }}>
          <table style={tableStyle}>
            <thead>
              <tr>
                <th style={thStyle}>Date</th>
                <th style={thStyle}>Heure</th>
                <th style={thStyle}>UEA</th>
                <th style={thStyle}>Enseignant</th>
                <th style={thStyle}>Salle</th>
                <th style={thStyle}>Durée</th>
                <th style={thStyle}>Statut</th>
              </tr>
            </thead>
            <tbody>
              {seances.map((s, index) => (
                <tr key={s.id} style={{ backgroundColor: index % 2 === 0 ? '#fff' : '#f9f9f9' }}>
                  <td style={tdStyle}>{new Date(s.date).toLocaleDateString('fr-FR')}</td>
                  <td style={tdStyle}>{s.heure_debut} - {s.heure_fin}</td>
                  <td style={tdStyle}>{s.uea?.code} - {s.uea?.nom}</td>
                  <td style={tdStyle}>{s.enseignant?.name}</td>
                  <td style={tdStyle}>{s.salle?.nom}</td>
                  <td style={tdStyle}>{s.duree}</td>
                  <td style={tdStyle}>
                    <span style={statusStyle(s.statut)}>{s.statut}</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

const formStyle: React.CSSProperties = {
  display: 'grid',
  gap: '1rem',
  background: '#fff',
  padding: '1.5rem',
  borderRadius: '8px',
  boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
};

const inputStyle: React.CSSProperties = {
  padding: '0.5rem',
  borderRadius: '4px',
  border: '1px solid #ccc',
  fontSize: '1rem'
};

const buttonStyle: React.CSSProperties = {
  padding: '0.75rem',
  backgroundColor: '#1976d2',
  color: '#fff',
  border: 'none',
  borderRadius: '4px',
  cursor: 'pointer',
  fontSize: '1rem',
  fontWeight: 'bold'
};

const tableStyle: React.CSSProperties = {
  width: '100%',
  borderCollapse: 'collapse',
  background: '#fff',
  boxShadow: '0 2px 8px rgba(0,0,0,0.05)',
  marginTop: '1rem'
};

const thStyle: React.CSSProperties = {
  textAlign: 'center',
  padding: '0.75rem',
  backgroundColor: '#f0f0f0',
  fontWeight: 'bold',
  borderBottom: '1px solid #ccc',
  textTransform: 'uppercase'
};

const tdStyle: React.CSSProperties = {
  textAlign: 'center',
  padding: '0.75rem',
  borderBottom: '1px solid #eee'
};

const statusStyle = (statut: string): React.CSSProperties => ({
  padding: '0.25rem 0.5rem',
  borderRadius: '4px',
  fontSize: '0.875rem',
  backgroundColor:
    statut === 'realisee' ? '#4caf50' :
    statut === 'validee' ? '#2196f3' :
    '#ff9800',
  color: '#fff',
  fontWeight: 'bold'
});

export default SeancesView;
