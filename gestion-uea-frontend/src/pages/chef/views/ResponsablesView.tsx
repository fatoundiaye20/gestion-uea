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
  const [deleting, setDeleting] = useState<number | null>(null);

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
    if (!form.email.includes('@isep-thies.edu.sn')) return 'Email doit être @isep-thies.edu.sn';
    if (!/^\d{9}$/.test(form.telephone)) return 'Téléphone invalide (9 chiffres)';
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
      const response = await apiClient('/create-user', {
        method: 'POST',
        body: JSON.stringify({ ...form, role: 'responsable_metier' })
      });
      setForm({ name: '', email: '', telephone: '', filiere_id: '' });
      setSuccess('Responsable ajouté avec succès. Email envoyé avec identifiants.');
      setTimeout(() => setSuccess(''), 5000);
      fetchData();
    } catch (err: any) {
      alert('Erreur: ' + err.message);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Êtes-vous sûr de vouloir supprimer ce responsable ?')) return;
    
    setDeleting(id);
    try {
      await apiClient(`/users/${id}`, { method: 'DELETE' });
      setResponsables(prev => prev.filter(r => r.id !== id));
      alert('Responsable supprimé avec succès');
      fetchData();
    } catch (err: any) {
      alert('Erreur lors de la suppression: ' + err.message);
    } finally {
      setDeleting(null);
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
          {success && <div style={{ color: 'green', marginBottom: '1rem', padding: '1rem', backgroundColor: '#d4edda', borderRadius: '4px' }}>{success}</div>}
          <div style={formStyle}>
            <label>Nom *</label>
            <input name="name" value={form.name} onChange={handleChange} style={inputStyle} placeholder="Prénom Nom" />

            <label>Email *</label>
            <input name="email" value={form.email} onChange={handleChange} style={inputStyle} placeholder="prenom.nom@isep-thies.edu.sn" />

            <label>Téléphone *</label>
            <input name="telephone" value={form.telephone} onChange={handleChange} style={inputStyle} placeholder="771234567" />

            <label>Filière *</label>
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
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
            <h3>Responsables de métier ({responsables.length})</h3>
            <button onClick={() => setMode('form')} style={buttonStyle}>➕ Ajouter un responsable</button>
          </div>
          <table style={tableStyle}>
            <thead>
              <tr>
                <th style={thStyle}>Nom</th>
                <th style={thStyle}>Email</th>
                <th style={thStyle}>Téléphone</th>
                <th style={thStyle}>Filière</th>
                <th style={thStyle}>UEAs</th>
                <th style={thStyle}>Séances</th>
                <th style={thStyle}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {responsables.length === 0 ? (
                <tr>
                  <td colSpan={7} style={{ ...tdStyle, textAlign: 'center', padding: '2rem', color: '#666' }}>
                    Aucun responsable enregistré
                  </td>
                </tr>
              ) : (
                responsables.map(r => (
                  <tr key={r.id}>
                    <td style={tdStyle}>{r.name}</td>
                    <td style={tdStyle}>{r.email}</td>
                    <td style={tdStyle}>{r.telephone}</td>
                    <td style={tdStyle}>{r.filiere?.nom || '-'}</td>
                    <td style={tdStyle}>{r.ueas?.length || 0}</td>
                    <td style={tdStyle}>{r.seances?.length || 0}</td>
                    <td style={tdStyle}>
                      <button 
                        onClick={() => handleDelete(r.id)}
                        disabled={deleting === r.id}
                        style={{
                          ...deleteButtonStyle,
                          opacity: deleting === r.id ? 0.5 : 1,
                          cursor: deleting === r.id ? 'not-allowed' : 'pointer'
                        }}
                        title="Supprimer"
                      >
                        🗑️
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
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
const deleteButtonStyle: React.CSSProperties = { 
  padding: '0.5rem', 
  backgroundColor: '#dc3545', 
  color: '#fff', 
  border: 'none', 
  borderRadius: '4px', 
  cursor: 'pointer',
  fontSize: '1rem'
};

export default ResponsablesView;