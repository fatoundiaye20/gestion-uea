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
};

export default ChefDashboard;
