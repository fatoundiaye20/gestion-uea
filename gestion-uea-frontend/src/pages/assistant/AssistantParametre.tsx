// AssistantParametres.tsx
import React, { useState } from 'react';

const AssistantParametres = () => {
  const [nom, setNom] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Ici tu peux appeler ton API pour modifier les données
    console.log({ nom, email, password });
    alert('Paramètres mis à jour !');
  };

  return (
    <div style={{ padding: '1rem' }}>
      <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold', marginBottom: '1rem' }}>Paramètres</h2>
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem', maxWidth: '400px' }}>
        <div>
          <label style={{ display: 'block', marginBottom: '0.25rem' }}>Nom</label>
          <input 
            type="text" 
            value={nom} 
            onChange={(e) => setNom(e.target.value)} 
            style={{ width: '100%', padding: '0.5rem', borderRadius: '5px', border: '1px solid #ccc' }}
            placeholder="Nom"
          />
        </div>
        <div>
          <label style={{ display: 'block', marginBottom: '0.25rem' }}>Email</label>
          <input 
            type="email" 
            value={email} 
            onChange={(e) => setEmail(e.target.value)} 
            style={{ width: '100%', padding: '0.5rem', borderRadius: '5px', border: '1px solid #ccc' }}
            placeholder="Email"
          />
        </div>
        <div>
          <label style={{ display: 'block', marginBottom: '0.25rem' }}>Mot de passe</label>
          <input 
            type="password" 
            value={password} 
            onChange={(e) => setPassword(e.target.value)} 
            style={{ width: '100%', padding: '0.5rem', borderRadius: '5px', border: '1px solid #ccc' }}
            placeholder="Mot de passe"
          />
        </div>
        <button 
          type="submit" 
          style={{ padding: '0.5rem 1rem', borderRadius: '5px', backgroundColor: '#3b82f6', color: 'white', border: 'none', cursor: 'pointer' }}
        >
          Enregistrer
        </button>
      </form>
    </div>
  );
};

export default AssistantParametres;
