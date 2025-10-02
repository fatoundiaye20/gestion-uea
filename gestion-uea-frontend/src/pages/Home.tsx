import React from 'react';
import './Home.css';
import { useNavigate } from 'react-router-dom';
import DrapeauSenegal from '../assets/img/Drapeau_Senegal.jpg';
import LogoISEP from '../assets/img/Logo_ISEP.png';

const Home: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="home-container">
      <header className="home-header">
        <img src={LogoISEP} alt="Logo ISEP" className="logo-isep" />

        <div className="header-center">
          <img src={DrapeauSenegal} alt="Drapeau du Sénégal" className="flag" />
          <span className="header-title">
            Ministère de l'Enseignement Supérieur, de la Recherche et de l'Innovation
          </span>
        </div>

        <button className="login-button" onClick={() => navigate('/login')}>
          Se connecter
        </button>
      </header>

      <main className="home-main">
        <h1>
          Bienvenue dans la plate-forme de gestion des unités d’Enseignement d'Apprentissage (UEA)
          <br />
          au sein du département Electronique, Informatique et Télécommunication (EIT) de l'ISEP de Thiès
        </h1>
        <button className="discover-button" onClick={() => navigate('/about')}>
            Guide d'utilisation
        </button>

      </main>

      <footer className="home-footer">
        © 2025 – Tous droits réservés ISEP-THIÈS
      </footer>
    </div>
  );
};

export default Home;
