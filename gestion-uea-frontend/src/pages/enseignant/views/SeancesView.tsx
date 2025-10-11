import { useEffect, useState } from 'react';
import { apiClient } from '../../../api/client';

type Seance = {
  id: number;
  date: string;
  heure_debut: string;
  heure_fin: string;
  duree: string;
  statut: string;
  uea?: { code: string; nom: string };
  salle?: { nom: string };
};

const SeancesView = () => {
  const [seances, setSeances] = useState<Seance[]>([]);
  const [loading, setLoading] = useState(true);
  const [filtreStatut, setFiltreStatut] = useState('');

  useEffect(() => {
    fetchSeances();
  }, []);

  const fetchSeances = async () => {
    try {
      const data = await apiClient('/seances');
      setSeances(data);
    } catch (err) {
      console.error('Erreur chargement séances:', err);
    } finally {
      setLoading(false);
    }
  };

  const seancesFiltrees = filtreStatut
    ? seances.filter(s => s.statut === filtreStatut)
    : seances;

  if (loading) {
    return <div style={{ textAlign: 'center', padding: '2rem' }}>Chargement...</div>;
  }

  const tableStyle: React.CSSProperties = {
    width: '100%',
    borderCollapse: 'collapse',
    background: '#fff',
    boxShadow: '0 2px 8px rgba(0,0,0,0.05)',
    marginTop: '1rem'
  };

  const thStyle: React.CSSProperties = {
    textAlign: 'center',
    padding: '0.75rem',
    backgroundColor: '#f0f0f0',
    fontWeight: 'bold',
    borderBottom: '1px solid #ccc'
  };

  const tdStyle: React.CSSProperties = {
    textAlign: 'center',
    padding: '0.75rem',
    borderBottom: '1px solid #eee'
  };

  const getStatutStyle = (statut: string) => {
    if (statut === 'realisee') return { backgroundColor: '#4caf50', color: '#fff' };
    if (statut === 'validee') return { backgroundColor: '#2196f3', color: '#fff' };
    return { backgroundColor: '#ff9800', color: '#fff' };
  };

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
        <h3>Mes Séances ({seancesFiltrees.length})</h3>
        <select
          value={filtreStatut}
          onChange={(e) => setFiltreStatut(e.target.value)}
          style={{
            padding: '0.5rem',
            borderRadius: '4px',
            border: '1px solid #ccc',
            backgroundColor: '#fff',
            cursor: 'pointer',
            fontWeight: 'bold'
          }}
        >
          <option value="">Tous les statuts</option>
          <option value="realisee">Réalisées</option>
          <option value="validee">Validées</option>
          <option value="prevue">En attente</option>
        </select>
      </div>

      <div style={{ overflowX: 'auto' }}>
        <table style={tableStyle}>
          <thead>
            <tr>
              <th style={thStyle}>Date</th>
              <th style={thStyle}>UEA</th>
              <th style={thStyle}>Heure</th>
              <th style={thStyle}>Salle</th>
              <th style={thStyle}>Durée</th>
              <th style={thStyle}>Statut</th>
            </tr>
          </thead>
          <tbody>
            {seancesFiltrees.length === 0 ? (
              <tr>
                <td colSpan={6} style={{ ...tdStyle, textAlign: 'center', padding: '2rem', color: '#666' }}>
                  Aucune séance
                </td>
              </tr>
            ) : (
              seancesFiltrees.map(s => (
                <tr key={s.id}>
                  <td style={tdStyle}>{s.date}</td>
                  <td style={tdStyle}>
                    <strong>{s.uea?.code}</strong> - {s.uea?.nom}
                  </td>
                  <td style={tdStyle}>{s.heure_debut} - {s.heure_fin}</td>
                  <td style={tdStyle}>{s.salle?.nom || '-'}</td>
                  <td style={tdStyle}>{s.duree}</td>
                  <td style={tdStyle}>
                    <span
                      style={{
                        padding: '0.25rem 0.75rem',
                        borderRadius: '4px',
                        fontSize: '0.875rem',
                        fontWeight: 'bold',
                        ...getStatutStyle(s.statut)
                      }}
                    >
                      {s.statut}
                    </span>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default SeancesView;