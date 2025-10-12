import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Users, MessageSquare, LogOut, LayoutDashboard, AlertTriangle, Mail } from 'lucide-react';
import './SuiviRegistre.css';

const SuiviRegistres = () => {
  const [filterEnseignant, setFilterEnseignant] = useState('');
  const [filterFiliere, setFilterFiliere] = useState('');
  const [filterAuteur, setFilterAuteur] = useState('');
  const location = useLocation();

  const chartData = [
    { name: 'Non remplies', value: 6, fill: '#334155' },
    { name: 'En retard', value: 4, fill: '#fb923c' },
    { name: 'Validées', value: 8, fill: '#60a5fa' }
  ];

  const fichesEnRetard = [
    { nom: 'Srr Ndiaye', matiere: 'Bureautique', date: '10/10/2023', statut: 'en retard', ajoutePar: 'chef département' },
    { nom: 'Seni mbaye', matiere: 'Développement Web et Mobile', date: '09/10/2023', statut: 'non rempli', ajoutePar: 'enseignant' }
  ];

  return (
    <div className="page-container">
      <div className="main-layout">
        {/* Sidebar */}
        <aside className="sidebar">
          <nav className="sidebar-nav">
            <Link to="/assistant/home" className={`nav-item ${location.pathname === '/assistant/home' ? 'nav-item-active' : ''}`}>
              <LayoutDashboard size={20} />
              <span>Tableau de bord</span>
            </Link>
            <Link to="/assistant/suivi-registre" className={`nav-item ${location.pathname === '/assistant/suivi-registre' ? 'nav-item-active' : ''}`}>
              <Users size={20} />
              <span>Suivi registres</span>
            </Link>
            <Link to="/assistant/messages" className={`nav-item ${location.pathname === '/assistant/messages' ? 'nav-item-active' : ''}`}>
              <MessageSquare size={20} />
              <span>Messages</span>
            </Link>
            <button className="nav-item">
              <LogOut size={20} />
              <span>Déconnexion</span>
            </button>
          </nav>
        </aside>

        {/* Main Content */}
        <main className="content">
          <h2 className="page-title">Suivi des Registres</h2>

          {/* Filters */}
          <div className="filters-container">
            <select className="filter-select" value={filterEnseignant} onChange={(e) => setFilterEnseignant(e.target.value)}>
              <option value="">Filtrer par enseignant</option>
              <option value="john">John Doe</option>
              <option value="jane">Jane Smith</option>
            </select>

            <select className="filter-select" value={filterFiliere} onChange={(e) => setFilterFiliere(e.target.value)}>
              <option value="">Filtrer par filière</option>
              <option value="dwm">Développement Web et Mobile</option>
              <option value="rt">Réseaux et Télécoms</option>
              <option value="asri">ASRI</option>
            </select>

            <select className="filter-select" value={filterAuteur} onChange={(e) => setFilterAuteur(e.target.value)}>
              <option value="">Filtrer par auteur</option>
              <option value="chef">Chef département</option>
              <option value="enseignant">Enseignant</option>
            </select>
          </div>

          {/* Chart */}
          <div className="chart-container">
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis dataKey="name" stroke="#6b7280" />
                <YAxis stroke="#6b7280" />
                <Tooltip />
                <Bar dataKey="value" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Alert */}
          <div className="alert-box">
            <AlertTriangle className="alert-icon" size={24} />
            <span className="alert-text">3 fiches en retard ou non remplies</span>
          </div>

          {/* Fiches List */}
          <div className="fiches-list">
            {fichesEnRetard.map((fiche, index) => (
              <div key={index} className="fiche-card">
                <div className="fiche-info">
                  <div className="fiche-avatar"><Users size={24} /></div>
                  <div>
                    <h3 className="fiche-title">{fiche.nom} ({fiche.matiere}) - {fiche.date}</h3>
                    <p className={`fiche-status statut-${fiche.statut.replace(' ', '-')}`}>
                      Statut : {fiche.statut} (ajouté par {fiche.ajoutePar})
                    </p>
                  </div>
                </div>
                <button className="btn-message">
                  <Mail size={18} />
                  Envoyer un message
                </button>
              </div>
            ))}
          </div>

          {/* Assistance */}
          <div className="assistance-box">
            <h3 className="assistance-title">Assistance aux Enseignants</h3>
            <div className="assistance-content">
              <MessageSquare className="assistance-icon" size={20} />
              <p className="assistance-text">
                Pour remplir une fiche, allez dans l'onglet séance, sélectionnez la date, complétez les champs obligatoires et sauvegardez. Une validation finale est nécessaire.
              </p>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default SuiviRegistres;
