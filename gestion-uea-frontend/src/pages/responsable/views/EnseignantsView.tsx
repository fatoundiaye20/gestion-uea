import { useEffect, useState } from 'react';
import { apiClient } from '../../../api/client';
import { Trash2 } from 'lucide-react';        

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
    const error = validate();
    if (error) return alert(error);

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
      setTimeout(() => setSuccess(''), 5000);
      fetchData();
    } catch (err: any) {
      alert('Erreur: ' + err.message);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Êtes-vous sûr de vouloir supprimer cet enseignant ?')) return;
    
    setDeleting(id);
    try {
      await apiClient(`/users/${id}`, { method: 'DELETE' });
      setEnseignants(prev => prev.filter(e => e.id !== id));
      alert('Enseignant supprimé avec succès');
    } catch (err: any) {
      alert('Erreur lors de la suppression: ' + err.message);
    } finally {
      setDeleting(null);
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
          {success && <div style={{ color: 'green', marginBottom: '1rem', padding: '1rem', backgroundColor: '#d4edda', borderRadius: '4px' }}>{success}</div>}
          <div style={formStyle}>
            <label>Nom *</label>
            <input name="name" value={form.name} onChange={handleChange} style={inputStyle} placeholder="Prénom Nom" />

            <label>Email *</label>
            <input name="email" value={form.email} onChange={handleChange} style={inputStyle} placeholder="prenom.nom@isep-thies.edu.sn" />

            <label>Spécialité (optionnel)</label>
            <input name="specialite" value={form.specialite} onChange={handleChange} style={inputStyle} placeholder="Ex: Informatique" />

            <button onClick={handleSubmit} style={buttonStyle}>Créer</button>
          </div>
        </>
      ) : (
        <>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
            <h3>Liste des enseignants ({enseignants.length})</h3>
            <button onClick={() => setMode('form')} style={buttonStyle}>➕ Ajouter un enseignant</button>
          </div>
          <table style={tableStyle}>
            <thead>
              <tr>
                <th style={thStyle}>Nom</th>
                <th style={thStyle}>Email</th>
                <th style={thStyle}>Spécialité</th>
                <th style={thStyle}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {enseignants.length === 0 ? (
                <tr>
                  <td colSpan={4} style={{ ...tdStyle, textAlign: 'center', padding: '2rem', color: '#666' }}>
                    Aucun enseignant enregistré
                  </td>
                </tr>
              ) : (
                enseignants.map(e => (
                  <tr key={e.id}>
                    <td style={tdStyle}>{e.name}</td>
                    <td style={tdStyle}>{e.email}</td>
                    <td style={tdStyle}>{e.specialite || '-'}</td>
                    <td style={tdStyle}>
                      <button 
                        onClick={() => handleDelete(e.id)}
                        disabled={deleting === e.id}
                        style={{
                          ...deleteButtonStyle,
                          opacity: deleting === e.id ? 0.5 : 1,
                          cursor: deleting === e.id ? 'not-allowed' : 'pointer'
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
const buttonStyle: React.CSSProperties = { padding: '0.75rem', backgroundColor: '#057a26', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer', fontSize: '1rem', fontWeight: 'bold' };
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

export default EnseignantsView;