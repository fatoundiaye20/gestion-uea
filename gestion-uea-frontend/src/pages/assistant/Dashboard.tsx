import { Routes, Route } from 'react-router-dom';
import AssistantHome from './AssistantHome';
import SuiviRegistres from './SuiviRegistre';
import Messages from './Message';

const DashboardAssistant = () => {
  return (
    <Routes>
      {/* Page principale /home */}
      <Route path="/" element={<AssistantHome />} />
      <Route path="/home" element={<AssistantHome />} />

      {/* Suivi des registres */}
      <Route path="/suivi-registre" element={<SuiviRegistres />} />

      {/* Messages */}
      <Route path="/messages" element={<Messages />} />
    </Routes>
  );
};

export default DashboardAssistant;
