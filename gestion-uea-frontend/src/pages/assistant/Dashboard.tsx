import { Routes, Route, Navigate } from 'react-router-dom';
import AssistantHome from './AssistantHome';
import AssistantSeances from './AssistantSeances';
import AssistantStatistiques from './AssistantStatistique';
import AssistantNotifications from './AssistantNotifications';

const AssistantDashboard = ({ theme }: { theme: string }) => {
  return (
    <Routes>
      <Route index element={<Navigate to="home" replace />} />
      <Route path="home" element={<AssistantHome />} />
      <Route path="seances" element={<AssistantSeances theme={theme} />} />
      <Route path="statistiques" element={<AssistantStatistiques />} />
      <Route path="notifications" element={<AssistantNotifications theme={theme} />} />
      <Route path="*" element={<Navigate to="home" replace />} />
    </Routes>
  );
};

export default AssistantDashboard;
