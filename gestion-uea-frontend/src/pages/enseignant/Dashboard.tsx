import { useState } from 'react';
import EnseignantLayout from './EnseignantLayout';
import AccueilView from './views/AccueilView';
import SeancesView from './views/SeancesView';
import UeasView from './views/UeasView';
import FichesView from './views/FichesView';
import StatistiquesView from './views/StatistiquesView';
import ParametresView from './views/ParametresView';

const Dashboard = () => {
  const [activeSection, setActiveSection] = useState<'accueil' | 'seances' | 'ueas' | 'fiches' | 'statistiques' | 'parametres'>('accueil');

  return (
    <EnseignantLayout active={activeSection} onNavigate={setActiveSection}>
      {activeSection === 'accueil' && <AccueilView />}
      {activeSection === 'seances' && <SeancesView />}
      {activeSection === 'ueas' && <UeasView />}
      {activeSection === 'fiches' && <FichesView />}
      {activeSection === 'statistiques' && <StatistiquesView />}
      {activeSection === 'parametres' && <ParametresView />}
    </EnseignantLayout>
  );
};

export default Dashboard;