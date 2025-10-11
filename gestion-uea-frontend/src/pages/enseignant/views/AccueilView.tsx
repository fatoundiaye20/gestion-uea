import { useEffect, useState } from 'react';
import { apiClient } from '../../../api/client';

type Seance = {
  id: number;
  date: string;
  heure_debut: string;
  heure_fin: string;
  duree: string;
  statut: string;
  uea?: { id: number; nom: string; code: string };
  salle?: { nom: string };
};

type Uea = {
  id: number;
  code: string;
  nom: string;
};

const AccueilView = () => {
  const [seances, setSeances] = useState<Seance[]>([]);
  const [ueas, setUeas] = useState<Uea[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const seancesData = await apiClient('/seances');
      setSeances(seancesData);

      // Extraire les UEAs uniques
      const ueaUniques = [...new Map(
        seancesData
          .filter((s: Seance) => s.uea)
          .map((s: Seance) => [s.uea?.id, s.uea])
      ).values()];
      setUeas(ueaUniques as Uea[]);
    } catch (err) {
      console.error('Erreur chargement données:', err);
    } finally {
      setLoading(false);
    }
  };

  const today = new Date().toISOString().split('T')[0];
  const seancesAujourd = seances.filter(s => s.date === today);
  const seancesProchaines = seances.filter(s => new Date(s.date) >= new Date()).slice(0, 5);
  const nbSeancesRealisees = seances.filter(s => s.statut === 'realisee').length;
  const totalHeures = seances.reduce((sum, s) => sum + (s.duree === '4h' ? 4 : 8), 0);

  if (loading) {
    return <div style={{ textAlign: 'center', padding: '2rem' }}>Chargement...</div>;
  }

  const cardStyle = {
    background: '#fff',
    padding: '1.5rem',
    borderRadius: '8px',
    boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
    textAlign: 'center' as const
  };

  return (
    <div>
      <h2 style={{ marginBottom: '2rem' }}>Tableau de bord - Accueil</h2>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1.5rem', marginBottom: '2rem' }}>
        <div style={cardStyle}>
          <h3 style={{ fontSize: '2rem', margin: '0.5rem 0', color: '#2196f3' }}>{seancesAujourd.length}</h3>
          <p style={{ margin: 0, color: '#666' }}>Séances Aujourd'hui</p>
        </div>
        <div style={cardStyle}>
          <h3 style={{ fontSize: '2rem', margin: '0.5rem 0', color: '#4caf50' }}>{seancesProchaines.length}</h3>
          <p style={{ margin: 0, color: '#666' }}>Séances Prochaines</p>
        </div>
        <div style={cardStyle}>
          <h3 style={{ fontSize: '2rem', margin: '0.5rem 0', color: '#ff9800' }}>{totalHeures}h</h3>
          <p style={{ margin: 0, color: '#666' }}>Total Heures</p>
        </div>
        <div style={cardStyle}>
          <h3 style={{ fontSize: '2rem', margin: '0.5rem 0', color: '#9c27b0' }}>{ueas.length}</h3>
          <p style={{ margin: 0, color: '#666' }}>UEAs</p>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
        <div style={{ background: '#fff', padding: '1.5rem', borderRadius: '8px', boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}>
          <h3 style={{ marginTop: 0, color: '#003366' }}>Prochaines Séances</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {seancesProchaines.length > 0 ? (
              seancesProchaines.map(s => (
                <div key={s.id} style={{ padding: '1rem', backgroundColor: '#f0f0f0', borderRadius: '6px', borderLeft: '4px solid #0077cc' }}>
                  <p style={{ margin: '0 0 0.5rem 0', fontWeight: 'bold', color: '#003366' }}>
                    {s.uea?.nom || 'UEA'}
                  </p>
                  <p style={{ margin: '0 0 0.25rem 0', fontSize: '0.9rem', color: '#666' }}>
                    {s.date} à {s.heure_debut}
                  </p>
                  <p style={{ margin: 0, fontSize: '0.85rem', color: '#999' }}>
                    {s.salle?.nom || 'Salle'} • {s.duree}
                  </p>
                </div>
              ))
            ) : (
              <p style={{ color: '#999' }}>Aucune séance prévue</p>
            )}
          </div>
        </div>

        <div style={{ background: '#fff', padding: '1.5rem', borderRadius: '8px', boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}>
          <h3 style={{ marginTop: 0, color: '#003366' }}>Mes UEAs</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {ueas.length > 0 ? (
              ueas.map(u => (
                <div key={u.id} style={{ padding: '1rem', backgroundColor: '#f0f0f0', borderRadius: '6px' }}>
                  <p style={{ margin: '0 0 0.25rem 0', fontWeight: 'bold', color: '#003366' }}>
                    {u.code}
                  </p>
                  <p style={{ margin: 0, fontSize: '0.9rem', color: '#666' }}>
                    {u.nom}
                  </p>
                </div>
              ))
            ) : (
              <p style={{ color: '#999' }}>Aucune UEA attribuée</p>
            )}
          </div>
        </div>
      </div>

      <div style={{ marginTop: '1.5rem', background: '#fff', padding: '1.5rem', borderRadius: '8px', boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}>
        <h3 style={{ marginTop: 0, color: '#003366' }}>Résumé des Séances</h3>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ backgroundColor: '#f0f0f0', borderBottom: '2px solid #ddd' }}>
              <th style={{ padding: '0.75rem', textAlign: 'left', fontWeight: 'bold' }}>Total</th>
              <th style={{ padding: '0.75rem', textAlign: 'left', fontWeight: 'bold' }}>Réalisées</th>
              <th style={{ padding: '0.75rem', textAlign: 'left', fontWeight: 'bold' }}>Validées</th>
              <th style={{ padding: '0.75rem', textAlign: 'left', fontWeight: 'bold' }}>En attente</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td style={{ padding: '0.75rem', borderBottom: '1px solid #eee' }}>{seances.length}</td>
              <td style={{ padding: '0.75rem', borderBottom: '1px solid #eee', color: '#4caf50', fontWeight: 'bold' }}>
                {nbSeancesRealisees}
              </td>
              <td style={{ padding: '0.75rem', borderBottom: '1px solid #eee', color: '#2196f3', fontWeight: 'bold' }}>
                {seances.filter(s => s.statut === 'validee').length}
              </td>
              <td style={{ padding: '0.75rem', borderBottom: '1px solid #eee', color: '#ff9800', fontWeight: 'bold' }}>
                {seances.filter(s => !['realisee', 'validee'].includes(s.statut)).length}
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AccueilView;