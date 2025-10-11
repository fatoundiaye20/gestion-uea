import React from 'react';
import './FicheSeance.css';

interface FicheSeanceProps {
  date: string;
  module: string;
  metier: string;
  duree: string;
  annee: string;
  onClose: () => void;
}

const FicheSeance: React.FC<FicheSeanceProps> = ({
  date,
  module,
  metier,
  duree,
  annee,
  onClose,
}) => {
  return (
    <div className="modal-overlay">
      <div className="modal-content fiche-seance">
        <button className="close-btn" onClick={onClose}>×</button>
        <h2>Fiche active</h2>
        <p><strong>Date :</strong> {date}</p>
        <p><strong>UEA :</strong> {module}</p>
        <p><strong>Métier :</strong> {metier}</p>
        <p><strong>Durée :</strong> {duree}</p>
        <p><strong>Année :</strong> {annee}</p>

        <div className="toggle-group">
          <label>Objectifs pédagogiques atteints ?</label>
          <div>
            <button>OUI</button>
            <button>NON</button>
          </div>
        </div>

        <div className="toggle-group">
          <label>Satisfaction vis-à-vis de la séance ?</label>
          <div>
            <button>OUI</button>
            <button>NON</button>
          </div>
        </div>

        <textarea placeholder="Décris ici les points abordés durant la séance..." />
        <textarea placeholder="Commentaires... (optionnel)" />

        <div className="fiche-actions">
          <button>Sauvegarder</button>
          <button>Marquer comme terminée</button>
        </div>
      </div>
    </div>
  );
};

export default FicheSeance;
