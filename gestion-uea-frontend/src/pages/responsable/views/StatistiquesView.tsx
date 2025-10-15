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

const StatistiquesView = () => {
  const [stats, setStats] = useState({
    seances: {
      total: 0,
      en_cours: 0,
      programmees: 0,
      realisees: 0
    },
    ueas: {
      total: 0,
      terminees: 0,
      en_cours: 0,
      programmees: 0
    }
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const data = await apiClient('/statistiques');
        
        // Adapter les données selon votre structure backend
        setStats({
          seances: {
            total: data.resume_global?.total_seances || 0,
            en_cours: data.resume_global?.seances_en_cours || 0,
            programmees: data.resume_global?.seances_programmees || 0,
            realisees: data.resume_global?.seances_realisees || 0
          },
          ueas: {
            total: data.resume_global?.total_ueas || 0,
            terminees: data.resume_global?.ueas_terminees || 0,
            en_cours: data.resume_global?.ueas_en_cours || 0,
            programmees: data.resume_global?.ueas_non_commencees || 0
          }
        });
      } catch (err) {
        console.error('Erreur chargement statistiques:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  if (loading) {
    return <div style={{ textAlign: 'center', padding: '2rem' }}>Chargement...</div>;
  }

  const seancesData = {
    labels: ['Réalisées', 'En cours', 'Programmées'],
    datasets: [
      {
        label: 'Séances',
        data: [stats.seances.realisees, stats.seances.en_cours, stats.seances.programmees],
        backgroundColor: ['#4caf50', '#ff9800', '#2196f3']
      }
    ]
  };

  const ueasData = {
    labels: ['Terminées', 'En cours', 'Programmées'],
    datasets: [
      {
        data: [stats.ueas.terminees, stats.ueas.en_cours, stats.ueas.programmees],
        backgroundColor: ['#4caf50', '#ff9800', '#057a26']
      }
    ]
  };

  const cardStyle = {
    background: '#fff',
    padding: '1.5rem',
    borderRadius: '8px',
    boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
    textAlign: 'center' as const
  };

  return (
    <div>
      <h2 style={{ marginBottom: '2rem' }}>Tableau de bord - Statistiques</h2>
      
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1.5rem', marginBottom: '2rem' }}>
        <div style={cardStyle}>
          <h3 style={{ fontSize: '2rem', margin: '0.5rem 0', color: '#2196f3' }}>{stats.seances.total}</h3>
          <p style={{ margin: 0, color: '#666' }}>Total Séances</p>
        </div>
        <div style={cardStyle}>
          <h3 style={{ fontSize: '2rem', margin: '0.5rem 0', color: '#4caf50' }}>{stats.seances.realisees}</h3>
          <p style={{ margin: 0, color: '#666' }}>Séances Réalisées</p>
        </div>
        <div style={cardStyle}>
          <h3 style={{ fontSize: '2rem', margin: '0.5rem 0', color: '#ff9800' }}>{stats.seances.en_cours}</h3>
          <p style={{ margin: 0, color: '#666' }}>Séances En cours</p>
        </div>
        <div style={cardStyle}>
          <h3 style={{ fontSize: '2rem', margin: '0.5rem 0', color: '#2196f3' }}>{stats.seances.programmees}</h3>
          <p style={{ margin: 0, color: '#666' }}>Séances Programmées</p>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1.5rem', marginBottom: '2rem' }}>
        <div style={cardStyle}>
          <h3 style={{ fontSize: '2rem', margin: '0.5rem 0', color: '#2196f3' }}>{stats.ueas.total}</h3>
          <p style={{ margin: 0, color: '#666' }}>Total UEAs</p>
        </div>
        <div style={cardStyle}>
          <h3 style={{ fontSize: '2rem', margin: '0.5rem 0', color: '#4caf50' }}>{stats.ueas.terminees}</h3>
          <p style={{ margin: 0, color: '#666' }}>UEAs Terminées</p>
        </div>
        <div style={cardStyle}>
          <h3 style={{ fontSize: '2rem', margin: '0.5rem 0', color: '#ff9800' }}>{stats.ueas.en_cours}</h3>
          <p style={{ margin: 0, color: '#666' }}>UEAs En cours</p>
        </div>
        <div style={cardStyle}>
          <h3 style={{ fontSize: '2rem', margin: '0.5rem 0', color: '#2196f3' }}>{stats.ueas.programmees}</h3>
          <p style={{ margin: 0, color: '#666' }}>UEAs Programmées</p>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem' }}>
        <div style={{ background: '#fff', padding: '1.5rem', borderRadius: '8px' }}>
          <h3>Répartition des Séances</h3>
          <Bar 
            data={seancesData} 
            options={{ 
              responsive: true, 
              plugins: { 
                legend: { display: false },
                tooltip: {
                  callbacks: {
                    label: (context) => `${context.label}: ${context.parsed.y}`
                  }
                }
              },
              scales: {
                y: {
                  beginAtZero: true,
                  ticks: {
                    stepSize: 1
                  }
                }
              }
            }} 
          />
        </div>
        <div style={{ background: '#fff', padding: '1.5rem', borderRadius: '8px' }}>
          <h3>Répartition des UEAs</h3>
          <Doughnut 
            data={ueasData}
            options={{
              responsive: true,
              plugins: {
                legend: {
                  position: 'bottom'
                }
              }
            }}
          />
        </div>
      </div>
    </div>
  );
};

export default StatistiquesView;