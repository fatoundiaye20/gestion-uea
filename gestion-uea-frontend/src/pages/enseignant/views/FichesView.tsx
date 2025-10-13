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
  raisons_insatisfaction?: string;
  commentaire_responsable?: string;
  fiche_status?: string;
  uea?: { nom: string; code: string };
  enseignant_id: number;
};

const FichesView = () => {
  const [seances, setSeances] = useState<Seance[]>([]);
  const [enseignantId, setEnseignantId] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [selectedSeance, setSelectedSeance] = useState<Seance | null>(null);
  const [filtreStatut, setFiltreStatut] = useState('non_commencee');
  const [ficheData, setFicheData] = useState({
    chapitre: '',
    objectifs_pedagogiques: '',
    points_abordes: '',
    objectifs_atteints: false,
    satisfaction_apprenants: false,
    raisons_insatisfaction: '',
    commentaire_responsable: ''
  });
  const [isSaving, setIsSaving] = useState(false);
  const [saveMessage, setSaveMessage] = useState('');

  useEffect(() => {
    fetchSeances();
  }, []);

  const fetchSeances = async () => {
    try {
      const meData = await apiClient('/me');
      const currentEnseignantId = meData.user.id;
      setEnseignantId(currentEnseignantId);

      const allSeances = await apiClient('/seances');

      const seancesEnseignant = allSeances.filter(
        (s: Seance) => s.enseignant_id === currentEnseignantId
      );
      setSeances(seancesEnseignant);
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
      raisons_insatisfaction: seance.raisons_insatisfaction || '',
      commentaire_responsable: seance.commentaire_responsable || ''
    });
    setSaveMessage('');
    setShowModal(true);
  };

  const saveFiche = async () => {
    if (!selectedSeance) return;

    if (!ficheData.chapitre.trim()) {
      setSaveMessage('Veuillez remplir le chapitre abordé');
      return;
    }

    setIsSaving(true);
    try {
      await apiClient(`/seances/${selectedSeance.id}`, {
        method: 'PUT',
        body: JSON.stringify(ficheData)
      });

      setSaveMessage('✓ Fiche sauvegardée avec succès');
      setTimeout(() => {
        setShowModal(false);
        fetchSeances();
      }, 1500);
    } catch (err) {
      console.error('Erreur sauvegarde:', err);
      setSaveMessage('✗ Erreur lors de la sauvegarde');
    } finally {
      setIsSaving(false);
    }
  };

  if (loading) {
    return <div style={{ textAlign: 'center', padding: '2rem' }}>Chargement...</div>;
  }

  const getStatusLabel = (status?: string) => {
    switch (status) {
      case 'non_commencee':
        return 'Non commencée';
      case 'en_cours':
        return 'En cours';
      case 'sauvegardee':
        return 'Sauvegardée';
      case 'terminee':
        return 'Terminée';
      default:
        return 'Non commencée';
    }
  };

  const getStatusColor = (status?: string) => {
    switch (status) {
      case 'non_commencee':
        return { bg: '#fff3cd', color: '#856404', border: '#ffeaa7' };
      case 'en_cours':
        return { bg: '#cfe2ff', color: '#084298', border: '#b6d4fe' };
      case 'sauvegardee':
        return { bg: '#d1e7dd', color: '#0f5132', border: '#badbcc' };
      case 'terminee':
        return { bg: '#d1ecf1', color: '#0c5460', border: '#bee5eb' };
      default:
        return { bg: '#f8f9fa', color: '#6c757d', border: '#dee2e6' };
    }
  };

  const fichesFiltrees = seances.filter(s => (s.fiche_status || 'non_commencee') === filtreStatut);
  const fiches = {
    non_commencee: seances.filter(s => (s.fiche_status || 'non_commencee') === 'non_commencee').length,
    en_cours: seances.filter(s => (s.fiche_status || 'non_commencee') === 'en_cours').length,
    sauvegardee: seances.filter(s => (s.fiche_status || 'non_commencee') === 'sauvegardee').length,
    terminee: seances.filter(s => (s.fiche_status || 'non_commencee') === 'terminee').length
  };

  return (
    <div>
      <h2 style={{ marginBottom: '2rem' }}>Historique des Fiches de Séance</h2>

      {/* Filtres par statut */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: '1rem', marginBottom: '2rem' }}>
        {['non_commencee', 'en_cours', 'sauvegardee', 'terminee'].map(status => {
          const count = fiches[status as keyof typeof fiches];
          const colors = getStatusColor(status);
          return (
            <button
              key={status}
              onClick={() => setFiltreStatut(status)}
              style={{
                padding: '1rem',
                backgroundColor: filtreStatut === status ? colors.bg : '#fff',
                color: colors.color,
                border: `2px solid ${colors.border}`,
                borderRadius: '8px',
                cursor: 'pointer',
                fontWeight: 'bold',
                fontSize: '0.95rem'
              }}
            >
              {getStatusLabel(status)}
              <br />
              <span style={{ fontSize: '1.5rem' }}>{count}</span>
            </button>
          );
        })}
      </div>

      {/* Liste des fiches */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        {fichesFiltrees.length > 0 ? (
          fichesFiltrees.map(s => {
            const statusColors = getStatusColor(s.fiche_status);
            return (
              <div
                key={s.id}
                style={{
                  background: '#fff',
                  padding: '1.5rem',
                  borderRadius: '8px',
                  boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                  borderLeft: `4px solid ${statusColors.border}`,
                  position: 'relative'
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '1rem' }}>
                  <div style={{ flex: 1 }}>
                    <h4 style={{ margin: '0 0 0.25rem 0', color: '#003366' }}>
                      {s.uea?.nom}
                    </h4>
                    <p style={{ margin: '0 0 0.5rem 0', fontSize: '0.9rem', color: '#666' }}>
                      {s.date} à {s.heure_debut}
                    </p>
                    <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                      <span
                        style={{
                          display: 'inline-block',
                          padding: '0.25rem 0.75rem',
                          backgroundColor: statusColors.bg,
                          color: statusColors.color,
                          borderRadius: '4px',
                          fontSize: '0.85rem',
                          fontWeight: 'bold'
                        }}
                      >
                        {getStatusLabel(s.fiche_status)}
                      </span>
                      {s.chapitre && (
                        <span style={{ fontSize: '0.9rem', color: '#666' }}>
                          • {s.chapitre}
                        </span>
                      )}
                    </div>
                  </div>
                  <button
                    onClick={() => openFiche(s)}
                    style={{
                      padding: '0.6rem 1.2rem',
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
                    {s.fiche_status === 'non_commencee' ? 'Créer' : 'Voir/Éditer'}
                  </button>
                </div>

                {s.chapitre && (
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
                )}
              </div>
            );
          })
        ) : (
          <div style={{
            background: '#fff',
            padding: '2rem',
            borderRadius: '8px',
            textAlign: 'center',
            color: '#999'
          }}>
            Aucune fiche au statut "{getStatusLabel(filtreStatut)}"
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
          zIndex: 1000,
          padding: '1rem'
        }}>
          <div style={{
            background: '#fff',
            borderRadius: '12px',
            boxShadow: '0 10px 40px rgba(0,0,0,0.2)',
            maxWidth: '600px',
            width: '100%',
            maxHeight: '90vh',
            overflowY: 'auto'
          }}>
            <div style={{ padding: '2rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
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

              {saveMessage && (
                <div style={{
                  backgroundColor: saveMessage.startsWith('✓') ? '#d4edda' : '#f8d7da',
                  color: saveMessage.startsWith('✓') ? '#155724' : '#721c24',
                  padding: '0.75rem',
                  borderRadius: '4px',
                  marginBottom: '1rem',
                  textAlign: 'center'
                }}>
                  {saveMessage}
                </div>
              )}

              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.2rem' }}>
                <div>
                  <label style={{ display: 'block', fontWeight: 'bold', marginBottom: '0.5rem', color: '#003366' }}>
                    Chapitre abordé *
                  </label>
                  <input
                    type="text"
                    value={ficheData.chapitre}
                    onChange={(e) => setFicheData({...ficheData, chapitre: e.target.value})}
                    style={{
                      width: '100%',
                      padding: '0.75rem',
                      border: '1px solid #ccc',
                      borderRadius: '4px',
                      fontSize: '1rem',
                      boxSizing: 'border-box'
                    }}
                    placeholder="Ex: Normalisation de bases de données"
                    disabled={isSaving}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontWeight: 'bold', marginBottom: '0.5rem', color: '#003366' }}>
                    Objectifs pédagogiques
                  </label>
                  <textarea
                    value={ficheData.objectifs_pedagogiques}
                    onChange={(e) => setFicheData({...ficheData, objectifs_pedagogiques: e.target.value})}
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
                    disabled={isSaving}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontWeight: 'bold', marginBottom: '0.5rem', color: '#003366' }}>
                    Points abordés
                  </label>
                  <textarea
                    value={ficheData.points_abordes}
                    onChange={(e) => setFicheData({...ficheData, points_abordes: e.target.value})}
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
                    disabled={isSaving}
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
                    cursor: isSaving ? 'not-allowed' : 'pointer',
                    backgroundColor: ficheData.objectifs_atteints ? '#e6f0ff' : '#f9f9f9'
                  }}>
                    <input
                      type="checkbox"
                      checked={ficheData.objectifs_atteints}
                      onChange={(e) => setFicheData({...ficheData, objectifs_atteints: e.target.checked})}
                      style={{ width: '20px', height: '20px', cursor: 'pointer' }}
                      disabled={isSaving}
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
                    cursor: isSaving ? 'not-allowed' : 'pointer',
                    backgroundColor: ficheData.satisfaction_apprenants ? '#e6f0ff' : '#f9f9f9'
                  }}>
                    <input
                      type="checkbox"
                      checked={ficheData.satisfaction_apprenants}
                      onChange={(e) => setFicheData({...ficheData, satisfaction_apprenants: e.target.checked})}
                      style={{ width: '20px', height: '20px', cursor: 'pointer' }}
                      disabled={isSaving}
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
                      onChange={(e) => setFicheData({...ficheData, raisons_insatisfaction: e.target.value})}
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
                      placeholder="Expliquer les raisons"
                      disabled={isSaving}
                    />
                  </div>
                )}

                <div>
                  <label style={{ display: 'block', fontWeight: 'bold', marginBottom: '0.5rem', color: '#003366' }}>
                    Commentaires additionnels
                  </label>
                  <textarea
                    value={ficheData.commentaire_responsable}
                    onChange={(e) => setFicheData({...ficheData, commentaire_responsable: e.target.value})}
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
                    disabled={isSaving}
                  />
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginTop: '1.5rem', borderTop: '1px solid #ddd', paddingTop: '1rem' }}>
                  <button
                    onClick={saveFiche}
                    disabled={isSaving}
                    style={{
                      padding: '0.75rem',
                      backgroundColor: '#0077cc',
                      color: '#fff',
                      border: 'none',
                      borderRadius: '4px',
                      cursor: isSaving ? 'not-allowed' : 'pointer',
                      fontWeight: 'bold',
                      fontSize: '1rem',
                      opacity: isSaving ? 0.7 : 1
                    }}
                  >
                    {isSaving ? 'Sauvegarde...' : 'Sauvegarder'}
                  </button>
                  <button
                    onClick={() => setShowModal(false)}
                    disabled={isSaving}
                    style={{
                      padding: '0.75rem',
                      backgroundColor: '#e0e0e0',
                      color: '#333',
                      border: 'none',
                      borderRadius: '4px',
                      cursor: isSaving ? 'not-allowed' : 'pointer',
                      fontWeight: 'bold',
                      fontSize: '1rem',
                      opacity: isSaving ? 0.7 : 1
                    }}
                  >
                    Annuler
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default FichesView;