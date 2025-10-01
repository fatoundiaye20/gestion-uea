import React from 'react';
import './About.css';

const About: React.FC = () => {
  return (
    <div className="about-container">
      <h2>Guide d'utilisation de la plateforme UEA</h2>

      <p>
        Cette plateforme est conçue pour faciliter la gestion des unités d’enseignement d’apprentissage (UEA)
        au sein du département Electronique, Informatique et Télécommunication (EIT) de l’ISEP de Thiès.
      </p>

      <h3>👨‍🏫 Pour les enseignants</h3>
      <ul>
        <li>Consulter les modules attribués</li>
        <li>Suivre les compétences à enseigner</li>
        <li>Enregistrer les évaluations et les notes</li>
      </ul>

      <h3>🧑‍💼 Pour les assistants</h3>
      <ul>
        <li>Appuyer les enseignants dans la saisie des données</li>
        <li>Gérer les plannings et les supports pédagogiques</li>
      </ul>

      <h3>👩‍💼 Pour les responsables de métier</h3>
      <ul>
        <li>Valider les contenus des modules</li>
        <li>Suivre les indicateurs de performance</li>
        <li>Coordonner les équipes pédagogiques</li>
      </ul>

      <h3>👨‍💼 Pour le chef de département</h3>
      <ul>
        <li>Superviser l’ensemble des activités pédagogiques</li>
        <li>Gérer les affectations et les validations</li>
        <li>Accéder aux tableaux de bord stratégiques</li>
      </ul>

      <p>
        Ce guide est évolutif et sera enrichi au fur et à mesure des besoins et des retours des utilisateurs.
      </p>
    </div>
  );
};

export default About;
