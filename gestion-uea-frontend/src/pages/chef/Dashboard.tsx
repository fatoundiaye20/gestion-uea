// pages/chef/Dashboard.tsx
import { Routes, Route } from 'react-router-dom';
import ChefHome from './ChefHome'; // Ton composant principal

const ChefDashboard = () => {
  return (
    <Routes>
      {/* Route appelée par /chef/home */}
      <Route path="home" element={<ChefHome />} />

      {/* Route par défaut si tu arrives sur /chef */}
      <Route path="/" element={<ChefHome />} />
    </Routes>
  );
import React from 'react';
import './Dashboard.css';

import StatistiquesUEA from './components/StatistiquesUEA';
import CalendrierDepartement from './components/CalendrierDepartement';
import PlanificationSeances from './components/PlanificationSeances';
import GestionEnseignants from './components/GestionEnseignants';
import GestionResponsablesMetier from './components/GestionResponsablesMetier';
import GestionAssistants from './components/GestionAssistants';
import NotificationsIntelligentes from './components/NotificationsIntelligentes';

const Dashboard: React.FC = () => {
  return (
    <div className="dashboard-wrapper">
      {/* En-tête */}
      <header className="dashboard-header">
        <h1>Ministère de l’Enseignement Supérieur, de la Recherche et de l’Innovation</h1>
        <h2>ISEP-Thiès</h2>
        <div className="greeting">BONJOUR <span>chef de département</span></div>
      </header>

      {/* Contenu principal */}
      <main className="dashboard-main">
        <NotificationsIntelligentes />
        <StatistiquesUEA />
        <CalendrierDepartement />
        <PlanificationSeances />
        <GestionEnseignants />
        <GestionResponsablesMetier />
        <GestionAssistants />
      </main>

      {/* Pied de page */}
      <footer className="dashboard-footer">
        © 2025 – Tous droits réservés ISEP-THIÈS
      </footer>
    </div>
  );
};

export default ChefDashboard;

export default Dashboard;
