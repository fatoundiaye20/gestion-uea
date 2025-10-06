import { useEffect, useState } from 'react';
import { apiClient } from '../../../api/client';

type Enseignant = { id: number; name: string };

type UEA = {
  id: number;
  nom: string;
  semestre: string;
  niveau: string;
  enseignants?: Array<{ name: string }>;
  createur?: { name: string };
};

const UeasView = () => {
  const [ueas, setUeas] = useState<UEA[]>([]);
  const [enseignants, setEnseignants] = useState<Enseignant[]>([]);
  const [form, setForm] = useState({ nom: '', semestre: '', niveau: '', enseignantId: '' });
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(true);
  const [mode, setMode] = useState<'form' | 'list'>('form');

  useEffect(() => {
    fetchUeas();
    fetchEnseignants();
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

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.nom.trim()) return alert('Nom requis');
    if (!form.semestre || !form.niveau || !form.enseignantId) return alert('Tous les champs sont requis');

    try {
      const response = await apiClient('/ueas', {
        method: 'POST',
        body: JSON.stringify({
          nom: form.nom,
          semestre: form.semestre,
          niveau: form.niveau,
          enseignant_id: parseInt(form.enseignantId)
        })
      });

      setUeas(prev => [...prev, response.uea]);
      setForm({ nom: '', semestre: '', niveau: '', enseignantId: '' });
      setSuccess('UEA créée avec succès');
      setTimeout(() => setSuccess(''), 3000);
      fetchUeas();
    } catch (err: any) {
      alert('Erreur: ' + err.message);
    }
  };

  if (loading) return <div style={{ textAlign: 'center', padding: '2rem' }}>Chargement...</div>;

  return (
    <div>
      {mode === 'form' ? (
        <>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h3>Créer une UEA</h3>
            <button onClick={() => setMode('list')} style={buttonStyle}>📋 Voir la liste</button>
          </div>
          {success && <div style={{ color: 'green', marginBottom: '1rem' }}>{success}</div>}
          <div style={formStyle}>
            <label>Nom</label>
            <input name="nom" value={form.nom} onChange={handleChange} style={inputStyle} />

            <label>Semestre</label>
            <input
              name="semestre"
              value={form.semestre}
              onChange={handleChange}
              placeholder="S1, S2, S3 ou S4"
              style={inputStyle}
            />

            <label>Niveau</label>
            <input
              name="niveau"
              value={form.niveau}
              onChange={handleChange}
              placeholder="1re_annee ou 2ie_annee"
              style={inputStyle}
            />

            <label>Enseignant responsable</label>
            <select name="enseignantId" value={form.enseignantId} onChange={handleChange} style={inputStyle}>
              <option value="">-- Choisir --</option>
              {enseignants.map(e => (
                <option key={e.id} value={e.id}>{e.name}</option>
              ))}
            </select>

            <button onClick={handleSubmit} style={buttonStyle}>Créer</button>
          </div>
        </>
      ) : (
        <>
          <h3>Liste des UEA ({ueas.length})</h3>
          <table style={tableStyle}>
            <thead>
              <tr>
                <th style={thStyle}>Nom</th>
                <th style={thStyle}>Semestre</th>
                <th style={thStyle}>Niveau</th>
                <th style={thStyle}>Enseignants</th>
                <th style={thStyle}>Créateur</th>
              </tr>
            </thead>
            <tbody>
              {ueas.map(u => (
                <tr key={u.id}>
                  <td style={tdStyle}>{u.nom}</td>
                  <td style={tdStyle}>{u.semestre}</td>
                  <td style={tdStyle}>{u.niveau}</td>
                  <td style={tdStyle}>{u.enseignants?.map(e => e.name).join(', ') || '-'}</td>
                  <td style={tdStyle}>{u.createur?.name || '-'}</td>
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

export default UeasView;
