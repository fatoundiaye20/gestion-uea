import { useEffect, useState } from 'react';
import { apiClient } from '../../../api/client';

type Seance = {
  id: number;
  date: string;
  heure_debut: string;
  chapitre?: string;
  objectifs_pedagogiques?: string;
  points_abordes?: string;
  objectifs_atteints?: boolean;
  satisfaction_apprenants?: boolean;
  uea?: { nom: string; code: string };
};

const FichesView = () => {
  const [seances, setSeances] = useState<Seance[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [selectedSeance, setSelectedSeance] = useState<Seance | null>(null);
  const [ficheData, setFicheData] = useState({
    chapitre: '',
    objectifs_pedagogiques: '',
    points_abordes: '',
    objectifs_atteints: false,
    satisfaction_apprenants: false,
    raisons_insatisfaction: '',
    commentaire_responsable: ''
  });

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

  const openFiche = (seance: Seance) => {
    setSelectedSeance(seance);
    setFicheData({
      chapitre: seance.chapitre || '',
      objectifs_pedagogiques: seance.objectifs_pedagogiques || '',
      points_abordes: seance.points_abordes || '',
      objectifs_atteints: seance.objectifs_atteints || false,
      satisfaction_apprenants: seance.satisfaction_apprenants || false,
      raisons_insatisfaction: '',
      commentaire_responsable: ''
    });
    setShowModal(true);
  };

  const saveFiche = async () => {
    if (!selectedSeance) return;

    try {
      await apiClient(`/seances/${selectedSeance.id}`, {
        method: 'PUT',
        body: JSON.stringify(ficheData)
      });

      alert('Fiche sauvegardée avec succès');
      setShowModal(false);
      fetchSeances();
    } catch (err) {
      console.error('Erreur sauvegarde:', err);
      alert('Erreur lors de la sauvegarde');
    }
  };

  if (loading) {
    return <div style={{ textAlign: 'center', padding: '2rem' }}>Chargement...</div>;
  }

  const fichesList = seances.filter(s => s.chapitre);

  return (
    <div>
      <h3>Fiches de Séance ({fichesList.length})</h3>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginTop: '1rem' }}>
        {fichesList.length > 0 ? (
          fichesList.map(s => (
            <div
              key={s.id}
              style={{
                background: '#fff',
                padding: '1.5rem',
                borderRadius: '8px',
                boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                borderLeft: '4px solid #0077cc'
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '1rem' }}>
                <div style={{ flex: 1 }}>
                  <h4 style={{ margin: '0 0 0.25rem 0', color: '#003366' }}>
                    {s.uea?.nom}
                  </h4>
                  <p style={{ margin: '0 0 0.5rem 0', fontSize: '0.9rem', color: '#666' }}>
                    {s.date} à {s.heure_debut} • Chapitre: {s.chapitre}
                  </p>
                  <p style={{ margin: 0, fontSize: '0.85rem', color: '#999' }}>
                    {s.objectifs_pedagogiques}
                  </p>
                </div>
                <button
                  onClick={() => openFiche(s)}
                  style={{
                    padding: '0.5rem 1rem',
                    backgroundColor: '#0077cc',
                    color: '#fff',
                    border: 'none',
                    borderRadius: '4px',
                    cursor: 'pointer',
                    fontWeight: 'bold',
                    whiteSpace: 'nowrap',
                    marginLeft: '1rem'
                  }}
                >
                  Voir/Éditer
                </button>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', fontSize: '0.85rem' }}>
                <div>
                  <span style={{
                    display: 'inline-block',
                    padding: '0.25rem 0.75rem',
                    backgroundColor: s.objectifs_atteints ? '#d4edda' : '#f8d7da',
                    color: s.objectifs_atteints ? '#155724' : '#721c24',
                    borderRadius: '4px',
                    fontWeight: 'bold'
                  }}>
                    Objectifs: {s.objectifs_atteints ? '✓ Atteints' : '✗ Non atteints'}
                  </span>
                </div>
                <div>
                  <span style={{
                    display: 'inline-block',
                    padding: '0.25rem 0.75rem',
                    backgroundColor: s.satisfaction_apprenants ? '#d4edda' : '#f8d7da',
                    color: s.satisfaction_apprenants ? '#155724' : '#721c24',
                    borderRadius: '4px',
                    fontWeight: 'bold'
                  }}>
                    Satisfaction: {s.satisfaction_apprenants ? '✓ Oui' : '✗ Non'}
                  </span>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div style={{
            background: '#fff',
            padding: '2rem',
            borderRadius: '8px',
            textAlign: 'center',
            color: '#999'
          }}>
            Aucune fiche disponible. Créez une fiche lors de votre prochaine séance.
          </div>
        )}
      </div>

      {/* Modal */}
      {showModal && selectedSeance && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0,0,0,0.5)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000
        }}>
          <div style={{
            background: '#fff',
            borderRadius: '12px',
            boxShadow: '0 10px 40px rgba(0,0,0,0.2)',
            maxWidth: '600px',
            width: '90%',
            maxHeight: '90vh',
            overflowY: 'auto',
            padding: '2rem'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
              <h2 style={{ margin: 0, color: '#003366' }}>Fiche de Séance</h2>
              <button
                onClick={() => setShowModal(false)}
                style={{
                  background: 'none',
                  border: 'none',
                  fontSize: '1.5rem',
                  cursor: 'pointer',
                  color: '#999'
                }}
              >
                ✕
              </button>
            </div>

            <div style={{ backgroundColor: '#e6f0ff', padding: '1rem', borderRadius: '6px', marginBottom: '1.5rem' }}>
              <p style={{ margin: 0, fontSize: '0.9rem', color: '#003366' }}>
                <strong>{selectedSeance.uea?.nom}</strong> • {selectedSeance.date} à {selectedSeance.heure_debut}
              </p>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div>
                <label style={{ display: 'block', fontWeight: 'bold', marginBottom: '0.5rem', color: '#003366' }}>
                  Chapitre abordé
                </label>
                <input
                  type="text"
                  value={ficheData.chapitre}
                  onChange={(e) => setFicheData({ ...ficheData, chapitre: e.target.value })}
                  style={{
                    width: '100%',
                    padding: '0.75rem',
                    border: '1px solid #ccc',
                    borderRadius: '4px',
                    fontSize: '1rem',
                    boxSizing: 'border-box'
                  }}
                  placeholder="Ex: Normalisation de bases de données"
                />
              </div>

              <div>
                <label style={{ display: 'block', fontWeight: 'bold', marginBottom: '0.5rem', color: '#003366' }}>
                  Objectifs pédagogiques
                </label>
                <textarea
                  value={ficheData.objectifs_pedagogiques}
                  onChange={(e) => setFicheData({ ...ficheData, objectifs_pedagogiques: e.target.value })}
                  style={{
                    width: '100%',
                    padding: '0.75rem',
                    border: '1px solid #ccc',
                    borderRadius: '4px',
                    fontSize: '1rem',
                    fontFamily: 'inherit',
                    minHeight: '80px',
                    boxSizing: 'border-box'
                  }}
                  placeholder="Décrire les objectifs de cette séance"
                />
              </div>

              <div>
                <label style={{ display: 'block', fontWeight: 'bold', marginBottom: '0.5rem', color: '#003366' }}>
                  Points abordés
                </label>
                <textarea
                  value={ficheData.points_abordes}
                  onChange={(e) => setFicheData({ ...ficheData, points_abordes: e.target.value })}
                  style={{
                    width: '100%',
                    padding: '0.75rem',
                    border: '1px solid #ccc',
                    borderRadius: '4px',
                    fontSize: '1rem',
                    fontFamily: 'inherit',
                    minHeight: '80px',
                    boxSizing: 'border-box'
                  }}
                  placeholder="Résumer les points clés couverts"
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <label style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.75rem',
                  padding: '0.75rem',
                  border: '1px solid #ddd',
                  borderRadius: '4px',
                  cursor: 'pointer',
                  backgroundColor: ficheData.objectifs_atteints ? '#e6f0ff' : '#f9f9f9'
                }}>
                  <input
                    type="checkbox"
                    checked={ficheData.objectifs_atteints}
                    onChange={(e) => setFicheData({ ...ficheData, objectifs_atteints: e.target.checked })}
                    style={{ width: '20px', height: '20px', cursor: 'pointer' }}
                  />
                  <span style={{ fontWeight: 'bold', color: '#003366' }}>Objectifs atteints</span>
                </label>

                <label style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.75rem',
                  padding: '0.75rem',
                  border: '1px solid #ddd',
                  borderRadius: '4px',
                  cursor: 'pointer',
                  backgroundColor: ficheData.satisfaction_apprenants ? '#e6f0ff' : '#f9f9f9'
                }}>
                  <input
                    type="checkbox"
                    checked={ficheData.satisfaction_apprenants}
                    onChange={(e) => setFicheData({ ...ficheData, satisfaction_apprenants: e.target.checked })}
                    style={{ width: '20px', height: '20px', cursor: 'pointer' }}
                  />
                  <span style={{ fontWeight: 'bold', color: '#003366' }}>Satisfaction apprenants</span>
                </label>
              </div>

              {!ficheData.satisfaction_apprenants && (
                <div>
                  <label style={{ display: 'block', fontWeight: 'bold', marginBottom: '0.5rem', color: '#003366' }}>
                    Raisons d'insatisfaction
                  </label>
                  <textarea
                    value={ficheData.raisons_insatisfaction}
                    onChange={(e) => setFicheData({ ...ficheData, raisons_insatisfaction: e.target.value })}
                    style={{
                      width: '100%',
                      padding: '0.75rem',
                      border: '1px solid #ccc',
                      borderRadius: '4px',
                      fontSize: '1rem',
                      fontFamily: 'inherit',
                      minHeight: '60px',
                      boxSizing: 'border-box'
                    }}
                    placeholder="Expliquer les raisons de l'insatisfaction"
                  />
                </div>
              )}

              <div>
                <label style={{ display: 'block', fontWeight: 'bold', marginBottom: '0.5rem', color: '#003366' }}>
                  Commentaires additionnels
                </label>
                <textarea
                  value={ficheData.commentaire_responsable}
                  onChange={(e) => setFicheData({ ...ficheData, commentaire_responsable: e.target.value })}
                  style={{
                    width: '100%',
                    padding: '0.75rem',
                    border: '1px solid #ccc',
                    borderRadius: '4px',
                    fontSize: '1rem',
                    fontFamily: 'inherit',
                    minHeight: '60px',
                    boxSizing: 'border-box'
                  }}
                  placeholder="Notes ou commentaires supplémentaires"
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginTop: '1.5rem', borderTop: '1px solid #ddd', paddingTop: '1rem' }}>
                <button
                  onClick={saveFiche}
                  style={{
                    padding: '0.75rem',
                    backgroundColor: '#0077cc',
                    color: '#fff',
                    border: 'none',
                    borderRadius: '4px',
                    cursor: 'pointer',
                    fontWeight: 'bold',
                    fontSize: '1rem'
                  }}
                >
                  Sauvegarder
                </button>
                <button
                  onClick={() => setShowModal(false)}
                  style={{
                    padding: '0.75rem',
                    backgroundColor: '#e0e0e0',
                    color: '#333',
                    border: 'none',
                    borderRadius: '4px',
                    cursor: 'pointer',
                    fontWeight: 'bold',
                    fontSize: '1rem'
                  }}
                >
                  Annuler
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default FichesView;