import { useEffect, useState } from 'react';
import { apiClient } from '../../../api/client';

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
  const [loading, setLoading] = useState(true);
  const [mode, setMode] = useState<'form' | 'list'>('form');

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
    if (!form.email.includes('@')) return 'Email invalide';
    return null;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const error = validate();
    if (error) return alert(error);

    try {
      const response = await apiClient('/users', {
        method: 'POST',
        body: JSON.stringify({
          ...form,
          role: 'enseignant'
        })
      });

      setEnseignants(prev => [...prev, response.user]);
      setForm({ name: '', email: '', specialite: '' });
      setSuccess('Enseignant ajouté avec succès');
      setTimeout(() => setSuccess(''), 3000);
      fetchData();
    } catch (err: any) {
      alert('Erreur: ' + err.message);
    }
  };

  if (loading) {
    return <div style={{ textAlign: 'center', padding: '2rem' }}>Chargement...</div>;
  }

  return (
    <div>
      {mode === 'form' ? (
        <>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h3>Ajouter un enseignant</h3>
            <button onClick={() => setMode('list')} style={buttonStyle}>📋 Voir la liste</button>
          </div>
          {success && <div style={{ color: 'green', marginBottom: '1rem' }}>{success}</div>}
          <div style={formStyle}>
            <label>Nom</label>
            <input name="name" value={form.name} onChange={handleChange} style={inputStyle} />

            <label>Email</label>
            <input name="email" value={form.email} onChange={handleChange} style={inputStyle} placeholder="nom@isep-thies.edu.sn" />

            <label>Spécialité (optionnel)</label>
            <input name="specialite" value={form.specialite} onChange={handleChange} style={inputStyle} />

            <button onClick={handleSubmit} style={buttonStyle}>Créer</button>
          </div>
        </>
      ) : (
        <>
          <h3>Liste des enseignants ({enseignants.length})</h3>
          <table style={tableStyle}>
            <thead>
              <tr>
                <th style={thStyle}>Nom</th>
                <th style={thStyle}>Email</th>
                <th style={thStyle}>Spécialité</th>
              </tr>
            </thead>
            <tbody>
              {enseignants.map(e => (
                <tr key={e.id}>
                  <td style={tdStyle}>{e.name}</td>
                  <td style={tdStyle}>{e.email}</td>
                  <td style={tdStyle}>{e.specialite || '-'}</td>
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

export default EnseignantsView;
