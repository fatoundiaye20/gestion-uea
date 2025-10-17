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

import EventIcon from '@mui/icons-material/Event';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import ScheduleIcon from '@mui/icons-material/Schedule';
import PlaylistAddIcon from '@mui/icons-material/PlaylistAdd';
import MenuBookIcon from '@mui/icons-material/MenuBook';
import DoneAllIcon from '@mui/icons-material/DoneAll';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
);

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
    return (
      <div style={{ 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center', 
        minHeight: '60vh',
        flexDirection: 'column',
        gap: '1rem'
      }}>
        <div style={{
          width: '50px',
          height: '50px',
          border: '4px solid #f3f3f3',
          borderTop: '4px solid #003366',
          borderRadius: '50%',
          animation: 'spin 1s linear infinite'
        }} />
        <p style={{ color: '#666', fontSize: '1.1rem' }}>Chargement des statistiques...</p>
        <style>{`
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
        `}</style>
      </div>
    );
  }

  const seancesData = {
    labels: ['Réalisées', 'En cours', 'Programmées'],
    datasets: [
      {
        label: 'Séances',
        data: [stats.seances.realisees, stats.seances.en_cours, stats.seances.programmees],
        backgroundColor: ['rgba(76, 175, 80, 0.8)', 'rgba(255, 152, 0, 0.8)', 'rgba(33, 150, 243, 0.8)'],
        borderColor: ['#4caf50', '#ff9800', '#2196f3'],
        borderWidth: 2,
        borderRadius: 8
      }
    ]
  };

  const ueasData = {
    labels: ['Terminées', 'En cours', 'Programmées'],
    datasets: [
      {
        data: [stats.ueas.terminees, stats.ueas.en_cours, stats.ueas.programmees],
        backgroundColor: [
          'rgba(76, 175, 80, 0.9)',
          'rgba(255, 152, 0, 0.9)',
          'rgba(0, 51, 102, 0.9)'
        ],
        borderColor: ['#fff', '#fff', '#fff'],
        borderWidth: 3,
        hoverOffset: 15
      }
    ]
  };

  const cardBaseStyle = {
    background: 'linear-gradient(135deg, #ffffff 0%, #f8f9fa 100%)',
    padding: '1.75rem',
    borderRadius: '16px',
    boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
    textAlign: 'center' as const,
    display: 'flex',
    flexDirection: 'column' as const,
    alignItems: 'center',
    gap: '0.75rem',
    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
    cursor: 'pointer',
    border: '1px solid rgba(0,0,0,0.04)',
    position: 'relative' as const,
    overflow: 'hidden'
  };

  const hoverStyle = {
    transform: 'translateY(-8px)',
    boxShadow: '0 12px 24px rgba(0,0,0,0.12)'
  };

  const StatCard = ({
    icon,
    label,
    value,
    color,
    gradient
  }: {
    icon: React.ReactNode;
    label: string;
    value: number;
    color: string;
    gradient: string;
  }) => {
    const [hovered, setHovered] = useState(false);

    return (
      <div
        style={{ ...cardBaseStyle, ...(hovered ? hoverStyle : {}) }}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
      >
        <div style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          height: '4px',
          background: gradient,
          opacity: hovered ? 1 : 0.7,
          transition: 'opacity 0.3s'
        }} />
        
        <div style={{ 
          fontSize: '2.5rem', 
          color,
          background: `${color}15`,
          borderRadius: '50%',
          width: '70px',
          height: '70px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          transition: 'transform 0.3s',
          transform: hovered ? 'scale(1.1) rotate(5deg)' : 'scale(1)'
        }}>
          {icon}
        </div>
        
        <h3 style={{ 
          fontSize: '2.25rem', 
          margin: 0, 
          color: '#1a1a1a',
          fontWeight: 700,
          letterSpacing: '-0.5px'
        }}>
          {value}
        </h3>
        
        <p style={{ 
          margin: 0, 
          color: '#666',
          fontSize: '0.95rem',
          fontWeight: 500,
          textTransform: 'uppercase',
          letterSpacing: '0.5px'
        }}>
          {label}
        </p>
      </div>
    );
  };

  const chartOptions: any = {
    responsive: true,
    maintainAspectRatio: true,
    plugins: {
      legend: {
        display: false
      },
      tooltip: {
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        padding: 12,
        titleFont: { size: 14, weight: 'bold' },
        bodyFont: { size: 13 },
        borderColor: 'rgba(255, 255, 255, 0.1)',
        borderWidth: 1,
        callbacks: {
          label: (context: any) => `${context.label}: ${context.parsed.y} séance(s)`
        }
      }
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          stepSize: 1,
          font: { size: 12 }
        },
        grid: {
          color: 'rgba(0, 0, 0, 0.05)',
          drawBorder: false
        }
      },
      x: {
        grid: {
          display: false
        },
        ticks: {
          font: { size: 12, weight: '500' }
        }
      }
    }
  };

  const doughnutOptions: any = {
    responsive: true,
    maintainAspectRatio: true,
    plugins: {
      legend: {
        position: 'bottom',
        labels: {
          padding: 15,
          font: { size: 13, weight: '500' },
          usePointStyle: true,
          pointStyle: 'circle'
        }
      },
      tooltip: {
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        padding: 12,
        titleFont: { size: 14, weight: 'bold' },
        bodyFont: { size: 13 },
        borderColor: 'rgba(255, 255, 255, 0.1)',
        borderWidth: 1,
        callbacks: {
          label: (context: any) => `${context.label}: ${context.parsed} UEA(s)`
        }
      }
    },
    cutout: '65%'
  };

  const tauxRealisation = stats.seances.total > 0 
    ? Math.round((stats.seances.realisees / stats.seances.total) * 100) 
    : 0;

  const tauxCompletionUEA = stats.ueas.total > 0
    ? Math.round((stats.ueas.terminees / stats.ueas.total) * 100)
    : 0;

  return (
    <div style={{ 
      padding: '2rem',
      background: 'linear-gradient(to bottom, #f8f9fa 0%, #ffffff 100%)',
      minHeight: '100vh'
    }}>
      {/* Header */}
      <div style={{ 
        marginBottom: '2.5rem',
        background: 'linear-gradient(135deg, #003366 0%, #004080 100%)',
        padding: '2rem',
        borderRadius: '20px',
        color: '#fff',
        boxShadow: '0 8px 24px rgba(0, 51, 102, 0.2)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <TrendingUpIcon style={{ fontSize: '3rem' }} />
          <div>
            <h1 style={{ margin: 0, fontSize: '2rem', fontWeight: 700 }}>
              Tableau de bord
            </h1>
            <p style={{ margin: '0.5rem 0 0 0', opacity: 0.9, fontSize: '1.1rem' }}>
              Vue d'ensemble des statistiques et performances
            </p>
          </div>
        </div>
      </div>

      {/* Section Séances */}
      <div style={{ marginBottom: '3rem' }}>
        <div style={{ 
          display: 'flex', 
          alignItems: 'center', 
          gap: '0.75rem',
          marginBottom: '1.5rem'
        }}>
          <EventIcon style={{ color: '#003366', fontSize: '1.75rem' }} />
          <h2 style={{ 
            margin: 0, 
            color: '#003366',
            fontSize: '1.5rem',
            fontWeight: 600
          }}>
            Séances
          </h2>
          <div style={{
            marginLeft: 'auto',
            background: tauxRealisation >= 70 ? '#4caf50' : tauxRealisation >= 40 ? '#ff9800' : '#f44336',
            color: '#fff',
            padding: '0.5rem 1rem',
            borderRadius: '20px',
            fontSize: '0.9rem',
            fontWeight: 600
          }}>
            {tauxRealisation}% réalisé
          </div>
        </div>
        
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', 
          gap: '1.5rem',
          marginBottom: '2rem'
        }}>
          <StatCard 
            icon={<EventIcon />} 
            label="Total Séances" 
            value={stats.seances.total} 
            color="#2196f3"
            gradient="linear-gradient(135deg, #2196f3 0%, #1976d2 100%)"
          />
          <StatCard 
            icon={<CheckCircleIcon />} 
            label="Réalisées" 
            value={stats.seances.realisees} 
            color="#4caf50"
            gradient="linear-gradient(135deg, #4caf50 0%, #388e3c 100%)"
          />
          <StatCard 
            icon={<ScheduleIcon />} 
            label="En cours" 
            value={stats.seances.en_cours} 
            color="#ff9800"
            gradient="linear-gradient(135deg, #ff9800 0%, #f57c00 100%)"
          />
          <StatCard 
            icon={<PlaylistAddIcon />} 
            label="Programmées" 
            value={stats.seances.programmees} 
            color="#2196f3"
            gradient="linear-gradient(135deg, #2196f3 0%, #1565c0 100%)"
          />
        </div>
      </div>

      {/* Section UEAs */}
      <div style={{ marginBottom: '3rem' }}>
        <div style={{ 
          display: 'flex', 
          alignItems: 'center', 
          gap: '0.75rem',
          marginBottom: '1.5rem'
        }}>
          <MenuBookIcon style={{ color: '#003366', fontSize: '1.75rem' }} />
          <h2 style={{ 
            margin: 0, 
            color: '#003366',
            fontSize: '1.5rem',
            fontWeight: 600
          }}>
            UEAs
          </h2>
          <div style={{
            marginLeft: 'auto',
            background: tauxCompletionUEA >= 70 ? '#4caf50' : tauxCompletionUEA >= 40 ? '#ff9800' : '#f44336',
            color: '#fff',
            padding: '0.5rem 1rem',
            borderRadius: '20px',
            fontSize: '0.9rem',
            fontWeight: 600
          }}>
            {tauxCompletionUEA}% terminé
          </div>
        </div>
        
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', 
          gap: '1.5rem',
          marginBottom: '2rem'
        }}>
          <StatCard 
            icon={<MenuBookIcon />} 
            label="Total UEAs" 
            value={stats.ueas.total} 
            color="#2196f3"
            gradient="linear-gradient(135deg, #2196f3 0%, #1976d2 100%)"
          />
          <StatCard 
            icon={<DoneAllIcon />} 
            label="Terminées" 
            value={stats.ueas.terminees} 
            color="#4caf50"
            gradient="linear-gradient(135deg, #4caf50 0%, #388e3c 100%)"
          />
          <StatCard 
            icon={<ScheduleIcon />} 
            label="En cours" 
            value={stats.ueas.en_cours} 
            color="#ff9800"
            gradient="linear-gradient(135deg, #ff9800 0%, #f57c00 100%)"
          />
          <StatCard 
            icon={<PlaylistAddIcon />} 
            label="Programmées" 
            value={stats.ueas.programmees} 
            color="#003366"
            gradient="linear-gradient(135deg, #003366 0%, #004080 100%)"
          />
        </div>
      </div>

      {/* Graphiques */}
      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', 
        gap: '2rem' 
      }}>
        <div style={{ 
          background: '#fff', 
          padding: '2rem', 
          borderRadius: '20px',
          boxShadow: '0 4px 16px rgba(0,0,0,0.08)',
          border: '1px solid rgba(0,0,0,0.04)'
        }}>
          <h3 style={{ 
            marginBottom: '1.5rem', 
            color: '#003366',
            fontSize: '1.25rem',
            fontWeight: 600,
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem'
          }}>
            📈 Répartition des Séances
          </h3>
          <Bar data={seancesData} options={chartOptions} />
        </div>
        
        <div style={{ 
          background: '#fff', 
          padding: '2rem', 
          borderRadius: '20px',
          boxShadow: '0 4px 16px rgba(0,0,0,0.08)',
          border: '1px solid rgba(0,0,0,0.04)'
        }}>
          <h3 style={{ 
            marginBottom: '1.5rem', 
            color: '#003366',
            fontSize: '1.25rem',
            fontWeight: 600,
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem'
          }}>
            📊 Répartition des UEAs
          </h3>
          <div style={{ maxWidth: '350px', margin: '0 auto' }}>
            <Doughnut data={ueasData} options={doughnutOptions} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default StatistiquesView;