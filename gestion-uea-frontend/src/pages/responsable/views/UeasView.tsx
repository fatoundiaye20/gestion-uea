import { useEffect, useState } from 'react';
import { apiClient } from '../../../api/client';

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
  const [loading, setLoading] = useState(true);
  const [mode, setMode] = useState<'form' | 'list'>('form');
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
            <label>Nom *</label>
            <input name="nom" value={form.nom} onChange={handleChange} style={inputStyle} placeholder="Ex: Programmation Web" />

            <label>Code *</label>
            <input name="code" value={form.code} onChange={handleChange} style={inputStyle} placeholder="Ex: UEA101" />

            <label>Description</label>
            <textarea name="description" value={form.description} onChange={handleChange} style={{...inputStyle, minHeight: '80px'}} placeholder="Description optionnelle" />

            <label>Volume horaire total *</label>
            <input name="volume_horaire_total" type="number" value={form.volume_horaire_total} onChange={handleChange} style={inputStyle} placeholder="Ex: 40" />

            <label>Filière *</label>
            <select name="filiere_id" value={form.filiere_id} onChange={handleChange} style={inputStyle}>
              <option value="">-- Choisir une filière --</option>
              {filieres.map(f => (
                <option key={f.id} value={f.id}>{f.nom}</option>
              ))}
            </select>

            <label>Semestre *</label>
            <select name="semestre" value={form.semestre} onChange={handleChange} style={inputStyle}>
              <option value="">-- Choisir --</option>
              <option value="S1">S1</option>
              <option value="S2">S2</option>
              <option value="S3">S3</option>
              <option value="S4">S4</option>
            </select>

            <label>Niveau *</label>
            <select name="niveau" value={form.niveau} onChange={handleChange} style={inputStyle}>
              <option value="">-- Choisir --</option>
              <option value="1re_annee">1ère année</option>
              <option value="2e_annee">2ème année</option>
            </select>

            <button onClick={handleSubmit} style={buttonStyle}>Créer</button>
          </div>
        </>
      ) : (
        <>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h3>Liste des UEA ({ueas.length})</h3>
            <button onClick={() => setMode('form')} style={buttonStyle}>➕ Créer une UEA</button>
          </div>
          <div style={{ overflowX: 'auto', marginTop: '1rem' }}>
            <table style={tableStyle}>
              <thead>
                <tr>
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
                    <td colSpan={10} style={{ ...tdStyle, textAlign: 'center', padding: '2rem', color: '#666' }}>
                      Aucune UEA enregistrée
                    </td>
                  </tr>
                ) : (
                  ueas.map((u) => (
                    <tr key={u.id}>
                      <td style={tdStyle}>{u.code}</td>
                      <td style={tdStyle}>{u.nom}</td>
                      <td style={tdStyle}>{u.volume_horaire_total}h</td>
                      <td style={tdStyle}>{u.filiere?.nom || '-'}</td>
                      <td style={tdStyle}>{u.semestre}</td>
                      <td style={tdStyle}>{u.niveau === '1re_annee' ? '1ère année' : '2ème année'}</td>
                      <td style={tdStyle}>
                        {u.enseignants && u.enseignants.length > 0
                          ? u.enseignants.map(e => e.name).join(', ')
                          : 'Aucun'}
                      </td>
                      <td style={tdStyle}>
                        {u.created_by
                          ? `${u.created_by.name} (${u.created_by.role === 'chef_dep' ? 'Chef Dép.' : 'Resp. Métier'})`
                          : 'Non défini'}
                      </td>
                      <td style={tdStyle}>{getStatut(u)}</td>
                      <td style={tdStyle}>
                        <button 
                          onClick={() => handleDelete(u.id)}
                          disabled={deleting === u.id}
                          style={{
                            ...deleteButtonStyle,
                            opacity: deleting === u.id ? 0.5 : 1,
                            cursor: deleting === u.id ? 'not-allowed' : 'pointer'
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
            <button onClick={() => setMode('form')} style={{ marginTop: '1rem' }}>↩ Retour au formulaire</button>
          </div>
        </>
      )}
    </div>
  );
};

const formStyle: React.CSSProperties = {
  display: 'grid',
  gap: '1rem',
  background: '#fff',
  padding: '1.5rem',
  borderRadius: '8px',
  boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
  maxWidth: '600px'
};

const inputStyle: React.CSSProperties = {
  padding: '0.5rem',
  borderRadius: '4px',
  border: '1px solid #ccc',
  fontSize: '1rem',
  width: '100%'
};

const buttonStyle: React.CSSProperties = {
  padding: '0.75rem',
  backgroundColor: '#057a26', 
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
  boxShadow: '0 2px 8px rgba(0,0,0,0.05)'
};

const thStyle: React.CSSProperties = {
  textAlign: 'center',
  padding: '0.75rem',
  backgroundColor: '#eaf6ee', 
  fontWeight: 'bold',
  borderBottom: '2px solid #ccc',
  color: '#034d1a' 
};

const tdStyle: React.CSSProperties = {
  textAlign: 'center',
  padding: '0.75rem',
  borderBottom: '1px solid #eee'
};

const deleteButtonStyle: React.CSSProperties = {
  padding: '0.5rem',
  backgroundColor: '#dc3545',
  color: '#fff',
  border: 'none',
  borderRadius: '4px',
  cursor: 'pointer',
  fontSize: '1rem'
};


export default UeasView;