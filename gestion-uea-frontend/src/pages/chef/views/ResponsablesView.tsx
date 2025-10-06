import { useEffect, useState } from 'react';
import { apiClient } from '../../../api/client';

type Responsable = {
  id: number;
  name: string;
  email: string;
  telephone: string;
  filiere?: { id: number; nom: string };
  seances?: Array<{ id: number }>;
  ueas?: Array<{ code: string; nom: string }>;
};

type Filiere = {
  id: number;
  nom: string;
};

const ResponsablesView = () => {
  const [responsables, setResponsables] = useState<Responsable[]>([]);
  const [filieres, setFilieres] = useState<Filiere[]>([]);
  const [form, setForm] = useState({ name: '', email: '', telephone: '', filiere_id: '' });
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [mode, setMode] = useState<'form' | 'list'>('form');

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [responsablesData, filieresData] = await Promise.all([
        apiClient('/users?role=responsable_metier'),
        apiClient('/filieres')
      ]);
      setResponsables(responsablesData);
      setFilieres(filieresData);
      setError('');
    } catch (err: any) {
      setError('Erreur chargement données: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  const validate = () => {
    if (!form.name.trim()) return 'Nom requis';
    if (!form.email.includes('@')) return 'Email invalide';
    if (!/^\d{9}$/.test(form.telephone)) return 'Téléphone invalide';
    if (!form.filiere_id) return 'Filière requise';
    return null;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const error = validate();
    if (error) return alert(error);

    const existe = responsables.some(r => r.filiere?.id.toString() === form.filiere_id);
    if (existe) {
      const filiere = filieres.find(f => f.id.toString() === form.filiere_id);
      return alert(`Un responsable existe déjà pour ${filiere?.nom}`);
    }

    try {
      const response = await apiClient('/users', {
        method: 'POST',
        body: JSON.stringify({ ...form, role: 'responsable_metier' })
      });
      setResponsables(prev => [...prev, response.user]);
      setForm({ name: '', email: '', telephone: '', filiere_id: '' });
      setSuccess('Responsable ajouté avec succès');
      setTimeout(() => setSuccess(''), 3000);
      fetchData();
    } catch (err: any) {
      alert('Erreur: ' + err.message);
    }
  };

  if (loading) return <div style={{ textAlign: 'center', padding: '2rem' }}>Chargement...</div>;
  if (error) return <div style={{ color: 'red', padding: '2rem' }}>{error}</div>;

  return (
    <div>
      {mode === 'form' ? (
        <>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h3>Créer un responsable de métier</h3>
            <button onClick={() => setMode('list')} style={buttonStyle}>📋 Voir la liste</button>
          </div>
          {success && <div style={{ color: 'green', marginBottom: '1rem' }}>{success}</div>}
          <div style={formStyle}>
            <label>Nom</label>
            <input name="name" value={form.name} onChange={handleChange} style={inputStyle} />

            <label>Email</label>
            <input name="email" value={form.email} onChange={handleChange} style={inputStyle} />

            <label>Téléphone</label>
            <input name="telephone" value={form.telephone} onChange={handleChange} style={inputStyle} />

            <label>Filière</label>
            <select name="filiere_id" value={form.filiere_id} onChange={handleChange} style={inputStyle}>
              <option value="">Choisir une filière</option>
              {filieres.map(f => {
                const dejaAssignee = responsables.some(r => r.filiere?.id === f.id);
                return (
                  <option key={f.id} value={f.id} disabled={dejaAssignee}>
                    {f.nom} {dejaAssignee ? '(Déjà assignée)' : ''}
                  </option>
                );
              })}
            </select>

            <button onClick={handleSubmit} style={buttonStyle}>Créer</button>
          </div>
        </>
      ) : (
        <>
          <h3>Responsables de métier ({responsables.length})</h3>
          <table style={tableStyle}>
            <thead>
              <tr>
                <th style={thStyle}>Nom</th>
                <th style={thStyle}>Email</th>
                <th style={thStyle}>Téléphone</th>
                <th style={thStyle}>Filière</th>
                <th style={thStyle}>UEAs</th>
                <th style={thStyle}>Séances</th>
              </tr>
            </thead>
            <tbody>
              {responsables.map(r => (
                <tr key={r.id}>
                  <td style={tdStyle}>{r.name}</td>
                  <td style={tdStyle}>{r.email}</td>
                  <td style={tdStyle}>{r.telephone}</td>
                  <td style={tdStyle}>{r.filiere?.nom || '-'}</td>
                  <td style={tdStyle}>{r.ueas?.length || 0}</td>
                  <td style={tdStyle}>{r.seances?.length || 0}</td>
                </tr>
              ))}
            </tbody>
          </table>
          <button onClick={() => setMode('form')} style={{ marginTop: '1rem' }}>↩ Retour au formulaire</button>
        </>
      )}
    </div>
  );
};

const formStyle: React.CSSProperties = { display: 'grid', gap: '1rem', background: '#fff', padding: '1.5rem', borderRadius: '8px', boxShadow: '0 2px 8px rgba(0,0,0,0.1)', maxWidth: '600px' };
const inputStyle: React.CSSProperties = { padding: '0.5rem', borderRadius: '4px', border: '1px solid #ccc', fontSize: '1rem', width: '100%' };
const buttonStyle: React.CSSProperties = { padding: '0.75rem', backgroundColor: '#1976d2', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer', fontSize: '1rem', fontWeight: 'bold' };
const tableStyle: React.CSSProperties = { width: '100%', borderCollapse: 'collapse', background: '#fff', boxShadow: '0 2px 8px rgba(0,0,0,0.05)', marginTop: '1rem' };
const thStyle: React.CSSProperties = { textAlign: 'center', padding: '0.75rem', backgroundColor: '#f0f0f0', fontWeight: 'bold', borderBottom: '1px solid #ccc' };
const tdStyle: React.CSSProperties = { textAlign: 'center', padding: '0.75rem', borderBottom: '1px solid #eee' };

export default ResponsablesView;
