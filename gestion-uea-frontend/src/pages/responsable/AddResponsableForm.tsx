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

const AddResponsableForm = () => {
  const [nom, setNom] = useState('');
  const [filiere, setFiliere] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await fetch('/api/responsables-metier', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ nom, filiere })
    });
    alert('Responsable ajouté');
  };

  return (
    <form onSubmit={handleSubmit} style={formStyle}>
      <h3>Ajouter un responsable métier</h3>
      <input placeholder="Nom" value={nom} onChange={e => setNom(e.target.value)} />
      <input placeholder="Filière" value={filiere} onChange={e => setFiliere(e.target.value)} />
      <button type="submit">➕ Ajouter</button>
    </form>
  );
};

export default AddResponsableForm;
