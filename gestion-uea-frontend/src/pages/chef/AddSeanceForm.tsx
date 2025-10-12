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

const AddSeanceForm = () => {
  const [nom, setNom] = useState('');
  const [filiere, setFiliere] = useState('');
  const [date, setDate] = useState('');
  const [heure, setHeure] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await fetch('/api/seances', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ nom, filiere, date, heure })
    });
    alert('Séance créée avec succès');
  };

  return (
    <form onSubmit={handleSubmit} style={formStyle}>
      <h3>Créer une séance</h3>
      <input placeholder="Nom de la séance" value={nom} onChange={e => setNom(e.target.value)} />
      <input placeholder="Filière" value={filiere} onChange={e => setFiliere(e.target.value)} />
      <input type="date" value={date} onChange={e => setDate(e.target.value)} />
      <input type="time" value={heure} onChange={e => setHeure(e.target.value)} />
      <button type="submit">➕ Créer</button>
    </form>
  );
};

export default AddSeanceForm;
