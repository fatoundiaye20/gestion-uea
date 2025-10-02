import { Routes, Route } from 'react-router-dom';
import EnseignantHome from './EnseignantHome';

const EnseignantDashboard = () => {
  return (
    <Routes>
      <Route path="home" element={<EnseignantHome />} />
      <Route path="/" element={<EnseignantHome />} />
    </Routes>
  );
};

export default EnseignantDashboard;
