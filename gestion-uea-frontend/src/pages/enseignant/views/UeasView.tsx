import { useEffect, useState } from 'react';
import { apiClient } from '../../../api/client';

type Uea = {
  id: number;
  code: string;
  nom: string;
  description?: string;
  volume_horaire_total: number;
  semestre: string;
  niveau: string;
  filiere?: { nom: string };
};

type Seance = {
  id: number;
  uea?: Uea;
};

const UeasView = () => {
  const [ueas, setUeas] = useState<Uea[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchUeas();
  }, []);

  const fetchUeas = async () => {
    try {
      const seancesData = await apiClient('/seances');
      
      // Extraire les UEAs uniques des séances
      const ueaUniques = [...new Map(
        seancesData
          .filter((s: Seance) => s.uea)
          .map((s: Seance) => [s.uea?.id, s.uea])
      ).values()];
      
      setUeas(ueaUniques as Uea[]);
    } catch (err) {
      console.error('Erreur chargement UEAs:', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div style={{ textAlign: 'center', padding: '2rem' }}>Chargement...</div>;
  }

  const cardStyle: React.CSSProperties = {
    background: '#fff',
    padding: '1.5rem',
    borderRadius: '8px',
    boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
    borderLeft: '4px solid #0077cc',
    cursor: 'pointer',
    transition: 'all 0.3s ease'
  };

  return (
    <div>
      <h3>Mes UEAs ({ueas.length})</h3>
      
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.5rem', marginTop: '1rem' }}>
        {ueas.length > 0 ? (
          ueas.map(u => (
            <div 
              key={u.id} 
              style={cardStyle}
              onMouseEnter={(e) => {
                const el = e.currentTarget as HTMLElement;
                el.style.boxShadow = '0 4px 12px rgba(0,0,0,0.15)';
                el.style.transform = 'translateY(-2px)';
              }}
              onMouseLeave={(e) => {
                const el = e.currentTarget as HTMLElement;
                el.style.boxShadow = '0 2px 8px rgba(0,0,0,0.1)';
                el.style.transform = 'translateY(0)';
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '0.5rem' }}>
                <div>
                  <h4 style={{ margin: '0 0 0.25rem 0', color: '#003366', fontSize: '1.1rem' }}>
                    {u.code}
                  </h4>
                  <p style={{ margin: 0, color: '#666', fontSize: '0.9rem' }}>
                    {u.nom}
                  </p>
                </div>
                <span style={{
                  backgroundColor: '#e6f0ff',
                  color: '#0077cc',
                  padding: '0.25rem 0.75rem',
                  borderRadius: '4px',
                  fontSize: '0.75rem',
                  fontWeight: 'bold',
                  whiteSpace: 'nowrap'
                }}>
                  {u.semestre}
                </span>
              </div>

              <p style={{ margin: '0.5rem 0', fontSize: '0.85rem', color: '#999' }}>
                <strong>Filière:</strong> {u.filiere?.nom || 'N/A'}
              </p>

              <p style={{ margin: '0.5rem 0', fontSize: '0.85rem', color: '#999' }}>
                <strong>Niveau:</strong> {u.niveau === '1re_annee' ? '1ère année' : '2ème année'}
              </p>

              <p style={{ margin: '0.5rem 0', fontSize: '0.85rem', color: '#999' }}>
                <strong>Volume horaire:</strong> {u.volume_horaire_total}h
              </p>

              {u.description && (
                <p style={{ margin: '0.75rem 0 0 0', fontSize: '0.85rem', color: '#666', fontStyle: 'italic' }}>
                  {u.description}
                </p>
              )}
            </div>
          ))
        ) : (
          <p style={{ gridColumn: '1 / -1', color: '#999', textAlign: 'center', padding: '2rem' }}>
            Aucune UEA attribuée
          </p>
        )}
      </div>
    </div>
  );
};

export default UeasView;