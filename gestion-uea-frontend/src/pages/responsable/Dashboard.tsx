import { Routes, Route } from 'react-router-dom';
import ResponsableHome from './ResponsableHome';

const ResponsableDashboard = () => {
  return (
    <Routes>
      <Route path="home" element={<ResponsableHome />} />
      <Route path="/" element={<ResponsableHome />} />
    </Routes>
  );
};

export default ResponsableDashboard;
