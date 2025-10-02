import { Routes, Route } from 'react-router-dom';
import AssistantHome from './AssistantHome';

const AssistantDashboard = () => {
  return (
    <Routes>
      <Route path="home" element={<AssistantHome />} />
      <Route path="/" element={<AssistantHome />} />
    </Routes>
  );
};

export default AssistantDashboard;
