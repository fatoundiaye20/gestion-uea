import { useEffect, useState } from 'react';
import { Bar, Doughnut } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
} from 'chart.js';
import { apiClient } from '../../../api/client';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ArcElement);

type Seance = {
  id: number;
  statut: string;
  duree: string;
  date: string;
};

const StatistiquesView = () => {
  const [seances, setSeances] = useState<Seance[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchSeances();
  }, []);

  const fetchSeances = async () => {
    try {
      const data = await apiClient('/seances');
      setSeances(data);
    } catch (err) {
      console.error('Erreur chargement statistiques:', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div style={{ textAlign: 'center', padding: '2rem' }}>Chargement...</div>;
  }

  const totalSeances = seances.length;
  const seancesRealisees = seances.filter(s => s.statut === 'realisee').length;
  const seancesValidees = seances.filter(s => s.statut === 'validee').length;
  const seancesEnAttente = seances.filter(s => !['realisee', 'validee'].includes(s.statut)).length;
  const totalHeures = seances.reduce((sum, s) => sum + (s.duree === '4h' ? 4 : 8), 0);
  const tauxCompletion = totalSeances > 0 ? Math.round((seancesRealisees / totalSeances) * 100) : 0;

  const seancesData = {
    labels: ['Réalisées', 'Validées', 'En attente'],
    datasets: [
      {
        label: 'Séances',
        data: [seancesRealisees, seancesValidees, seancesEnAttente],
        backgroundColor: ['#4caf50', '#2196f3', '#ff9800']
      }
    ]
  };

  const heureParMois = [
    { mois: 'Janvier', heures: Math.floor(Math.random() * 40) + 10 },
    { mois: 'Février', heures: Math.floor(Math.random() * 40) + 10 },
    { mois: 'Mars', heures: Math.floor(Math.random() * 40) + 10 },
    { mois: 'Avril', heures: Math.floor(Math.random() * 40) + 10 }
  ];

  const heureData = {
    labels: heureParMois.map(h => h.mois),
    datasets: [
      {
        label: 'Heures/Mois',
        data: heureParMois.map(h => h.heures),
        backgroundColor: '#2196f3'
      }
    ]
  };

  const cardStyle: React.CSSProperties = {
    background: '#fff',
    padding: '1.5rem',
    borderRadius: '8px',
    boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
    textAlign: 'center'
  };

  return (
    <div>
      <h2 style={{ marginBottom: '2rem' }}>Statistiques</h2>

      {/* Cards de résumé */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1.5rem', marginBottom: '2rem' }}>
        <div style={cardStyle}>
          <h3 style={{ fontSize: '2rem', margin: '0.5rem 0', color: '#2196f3' }}>{totalSeances}</h3>
          <p style={{ margin: 0, color: '#666' }}>Total Séances</p>
        </div>
        <div style={cardStyle}>
          <h3 style={{ fontSize: '2rem', margin: '0.5rem 0', color: '#4caf50' }}>{seancesRealisees}</h3>
          <p style={{ margin: 0, color: '#666' }}>Réalisées</p>
        </div>
        <div style={cardStyle}>
          <h3 style={{ fontSize: '2rem', margin: '0.5rem 0', color: '#ff9800' }}>{seancesEnAttente}</h3>
          <p style={{ margin: 0, color: '#666' }}>En attente</p>
        </div>
        <div style={cardStyle}>
          <h3 style={{ fontSize: '2rem', margin: '0.5rem 0', color: '#9c27b0' }}>{tauxCompletion}%</h3>
          <p style={{ margin: 0, color: '#666' }}>Taux Complétée</p>
        </div>
      </div>

      {/* Graphiques */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem' }}>
        <div style={{ background: '#fff', padding: '1.5rem', borderRadius: '8px', boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}>
          <h3 style={{ marginTop: 0, color: '#003366' }}>Répartition des Séances</h3>
          <div style={{ position: 'relative', height: '300px' }}>
            <Doughnut
              data={seancesData}
              options={{
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                  legend: {
                    position: 'bottom'
                  }
                }
              }}
            />
          </div>
        </div>

        <div style={{ background: '#fff', padding: '1.5rem', borderRadius: '8px', boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}>
          <h3 style={{ marginTop: 0, color: '#003366' }}>Heures par Mois</h3>
          <div style={{ position: 'relative', height: '300px' }}>
            <Bar
              data={heureData}
              options={{
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                  legend: { display: false }
                },
                scales: {
                  y: {
                    beginAtZero: true
                  }
                }
              }}
            />
          </div>
        </div>
      </div>

      {/* Tableau détaillé */}
      <div style={{ marginTop: '2rem', background: '#fff', padding: '1.5rem', borderRadius: '8px', boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}>
        <h3 style={{ marginTop: 0, color: '#003366' }}>Résumé Détaillé</h3>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ backgroundColor: '#f0f0f0', borderBottom: '2px solid #ddd' }}>
              <th style={{ padding: '0.75rem', textAlign: 'left', fontWeight: 'bold' }}>Métrique</th>
              <th style={{ padding: '0.75rem', textAlign: 'left', fontWeight: 'bold' }}>Valeur</th>
              <th style={{ padding: '0.75rem', textAlign: 'left', fontWeight: 'bold' }}>Pourcentage</th>
            </tr>
          </thead>
          <tbody>
            <tr style={{ borderBottom: '1px solid #eee' }}>
              <td style={{ padding: '0.75rem' }}>Séances Réalisées</td>
              <td style={{ padding: '0.75rem', color: '#4caf50', fontWeight: 'bold' }}>{seancesRealisees}</td>
              <td style={{ padding: '0.75rem' }}>{totalSeances > 0 ? Math.round((seancesRealisees / totalSeances) * 100) : 0}%</td>
            </tr>
            <tr style={{ borderBottom: '1px solid #eee' }}>
              <td style={{ padding: '0.75rem' }}>Séances Validées</td>
              <td style={{ padding: '0.75rem', color: '#2196f3', fontWeight: 'bold' }}>{seancesValidees}</td>
              <td style={{ padding: '0.75rem' }}>{totalSeances > 0 ? Math.round((seancesValidees / totalSeances) * 100) : 0}%</td>
            </tr>
            <tr style={{ borderBottom: '1px solid #eee' }}>
              <td style={{ padding: '0.75rem' }}>Séances En attente</td>
              <td style={{ padding: '0.75rem', color: '#ff9800', fontWeight: 'bold' }}>{seancesEnAttente}</td>
              <td style={{ padding: '0.75rem' }}>{totalSeances > 0 ? Math.round((seancesEnAttente / totalSeances) * 100) : 0}%</td>
            </tr>
            <tr>
              <td style={{ padding: '0.75rem', fontWeight: 'bold' }}>Total Heures</td>
              <td style={{ padding: '0.75rem', color: '#9c27b0', fontWeight: 'bold' }}>{totalHeures}h</td>
              <td style={{ padding: '0.75rem' }}>100%</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default StatistiquesView;