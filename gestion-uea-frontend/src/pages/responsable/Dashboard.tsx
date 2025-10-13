import { useState } from 'react';
import ChefLayout from './ResponsableLayout';
import StatistiquesView from './views/StatistiquesView';
import SeancesView from './views/SeancesView';
import EnseignantsView from './views/EnseignantsView';

import AssistantsView from './views/AssistantsView';
import NotificationsView from './views/NotificationsView';
import ParametresView from './views/ParametresView';
import UeasView from './views/UeasView';
import SallesView from './views/SallesView';

const Dashboard = () => {
  const [activeSection, setActiveSection] = useState<'statistiques' | 'seances' | 'ueas' | 'salles' | 'enseignants' | 'responsables' | 'assistants' | 'notifications' | 'parametres'>('statistiques');

  return (
    <ChefLayout active={activeSection} onNavigate={setActiveSection}>
      {activeSection === 'statistiques' && <StatistiquesView />}
      {activeSection === 'seances' && <SeancesView />}
      {activeSection === 'ueas' && <UeasView />}
      {activeSection === 'salles' && <SallesView />}
      {activeSection === 'enseignants' && <EnseignantsView />}
      
      {activeSection === 'assistants' && <AssistantsView />}
      {activeSection === 'notifications' && <NotificationsView />}
      {activeSection === 'parametres' && <ParametresView />}
    </ChefLayout>
  );
};

export default Dashboard;