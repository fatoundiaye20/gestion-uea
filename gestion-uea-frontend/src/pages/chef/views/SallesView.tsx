import { useEffect, useState } from 'react';
import { apiClient } from '../../../api/client';

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
  const [loading, setLoading] = useState(true);
  const [mode, setMode] = useState<'form' | 'list'>('form');

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
    const error = validate();
    if (error) return alert(error);

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
      setTimeout(() => setSuccess(''), 3000);
      fetchSalles();
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
            <h3>Ajouter une salle</h3>
            <button onClick={() => setMode('list')} style={buttonStyle}>📋 Voir la liste</button>
          </div>
          {success && <div style={{ color: 'green', marginBottom: '1rem' }}>{success}</div>}
          <div style={formStyle}>
            <label>Nom</label>
            <input name="nom" value={form.nom} onChange={handleChange} style={inputStyle} />

            <label>Capacité (optionnel)</label>
            <input name="capacite" value={form.capacite} onChange={handleChange} style={inputStyle} />

            <label>Description (optionnel)</label>
            <textarea name="description" value={form.description} onChange={handleChange} style={inputStyle} />

            <button onClick={handleSubmit} style={buttonStyle}>Créer</button>
          </div>
        </>
      ) : (
        <>
          <h3>Liste des salles ({salles.length})</h3>
          <table style={tableStyle}>
            <thead>
              <tr>
                <th style={thStyle}>Nom</th>
                <th style={thStyle}>Capacité</th>
                <th style={thStyle}>Description</th>
              </tr>
            </thead>
            <tbody>
              {salles.map(s => (
                <tr key={s.id}>
                  <td style={tdStyle}>{s.nom}</td>
                  <td style={tdStyle}>{s.capacite || '-'}</td>
                  <td style={tdStyle}>{s.description || '-'}</td>
                </tr>
              ))}
            </tbody>
          </table>

          <h4 style={{ marginTop: '2rem' }}>📅 Séances programmées</h4>
          <table style={tableStyle}>
            <thead>
              <tr>
                <th style={thStyle}>Salle</th>
                <th style={thStyle}>Date</th>
                <th style={thStyle}>Séance (UEA)</th>
                <th style={thStyle}>Enseignant</th>
              </tr>
            </thead>
            <tbody>
              {salles.flatMap(s =>
                s.seances?.map(seance => (
                  <tr key={seance.id}>
                    <td style={tdStyle}>{s.nom}</td>
                    <td style={tdStyle}>{seance.date}</td>
                    <td style={tdStyle}>{seance.uea?.nom || '-'}</td>
                    <td style={tdStyle}>{seance.enseignant?.name || '-'}</td>
                  </tr>
                )) || []
              )}
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

export default SallesView;
