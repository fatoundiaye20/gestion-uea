import React, { useState } from 'react';

const formStyle: React.CSSProperties = {
  display: 'flex',
  flexDirection: 'column',
  gap: '1rem',
  backgroundColor: '#fff',
  padding: '1.5rem',
  borderRadius: '12px',
  boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
};

const AddAssistantForm = () => {
  const [nom, setNom] = useState('');
  const [specialite, setSpecialite] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await fetch('/api/assistants-techniques', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ nom, specialite })
    });
    alert('Assistant ajouté');
  };

  return (
    <form onSubmit={handleSubmit} style={formStyle}>
      <h3>Ajouter un assistant technique</h3>
      <input placeholder="Nom" value={nom} onChange={e => setNom(e.target.value)} />
      <input placeholder="Spécialité" value={specialite} onChange={e => setSpecialite(e.target.value)} />
      <button type="submit">➕ Ajouter</button>
    </form>
  );
};

export default AddAssistantForm;
