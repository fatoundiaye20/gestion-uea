import { useEffect, useState } from 'react';
import { apiClient } from '../../../api/client';

const ParametresView = () => {
  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
    telephone: ''
  });
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchChef = async () => {
      try {
        setLoading(true);
        // ✅ Utiliser l'endpoint correct
        const data = await apiClient('/responsable-metier');

        
        console.log('✅ Données reçues:', data);

        setForm({
          name: data.name || '',
          email: data.email || '',
          password: '',
          telephone: data.telephone || ''
        });
        setError('');
      } catch (err: any) {
        console.error('❌ Erreur:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchChef();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      await apiClient('/responsable-metier', {
        method: 'PUT',
        body: JSON.stringify(form)
      });

      setSuccess('✅ Informations mises à jour');
      setTimeout(() => setSuccess(''), 3000);
    } catch (err: any) {
      alert('Erreur lors de la mise à jour: ' + err.message);
    }
  };

  if (loading) {
    return (
      <div style={{ textAlign: 'center', padding: '2rem' }}>
        Chargement...
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ textAlign: 'center', padding: '2rem', color: 'red' }}>
        Erreur: {error}
      </div>
    );
  }

  return (
    <div style={{ display: 'flex', justifyContent: 'center' }}>
      <form onSubmit={handleSubmit} style={{
        width: '100%',
        maxWidth: '500px',
        display: 'grid',
        gap: '1rem',
        background: '#e6f0ff',
        padding: '2rem',
        borderRadius: '8px',
        boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
        color: '#003366'
      }}>
        <h3 style={{ textAlign: 'center' }}>Paramètres du chef de département</h3>
        {success && <div style={{ color: 'green', textAlign: 'center' }}>{success}</div>}
        
        <label>Nom</label>
        <input name="name" value={form.name} onChange={handleChange} style={inputStyle} />

        <label>Email</label>
        <input name="email" value={form.email} onChange={handleChange} style={inputStyle} />
        
        <label>Mot de passe</label>
        <input type="password" name="password" value={form.password} onChange={handleChange} style={inputStyle} placeholder="Laisser vide pour ne pas changer" />
        
        <label>Téléphone</label>
        <input name="telephone" value={form.telephone} onChange={handleChange} style={inputStyle} />
        
        <button type="submit" style={buttonStyle}>Mettre à jour</button>
      </form>
    </div>
  );
};

const inputStyle = {
  padding: '0.5rem',
  borderRadius: '4px',
  border: '1px solid #006699',
  backgroundColor: '#ffffff',
  color: '#003366'
};

const buttonStyle = {
  padding: '0.75rem',
  backgroundColor: '#006699',
  color: '#ffffff',
  border: 'none',
  borderRadius: '4px',
  cursor: 'pointer'
};

export default ParametresView;