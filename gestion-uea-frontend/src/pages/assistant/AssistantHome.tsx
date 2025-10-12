import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  FaHome,
  FaClipboardList,
  FaEnvelope,
  FaSignOutAlt,
  FaUserTie,
} from "react-icons/fa";
import { motion } from "framer-motion";
import axiosInstance from "../../api/axiosInstance";
import "./AssistantHome.css";

interface DashboardStats {
  totalSeances: number;
  seancesNonRemplies: number;
  seancesRemplies: number;
}

const AssistantHome: React.FC = () => {
  const navigate = useNavigate();
  const [assistantName, setAssistantName] = useState("Assistante");
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const storedName = localStorage.getItem("assistantName");
    if (storedName) setAssistantName(storedName);

    const fetchStats = async () => {
      try {
        const response = await axiosInstance.get("/assistant/stats");
        setStats(response.data);
      } catch (err) {
        console.error("Erreur fetch stats:", err);
        setError("Impossible de charger les statistiques.");
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  const handleLogout = () => {
    localStorage.clear();
    navigate("/login");
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#f9fafb]">
      {/* HEADER */}
      <header className="bg-[#006699] text-white px-8 py-4 flex justify-between items-center shadow-lg">
        <div className="flex items-center gap-3">
          <img
            src="https://upload.wikimedia.org/wikipedia/commons/f/fd/Flag_of_Senegal.svg"
            alt="Sénégal"
            className="w-10 h-6 rounded-sm"
          />
          <h1 className="text-lg font-semibold">
            Ministère de l’Enseignement Supérieur - ISEP Thiès
          </h1>
        </div>
        <div className="flex items-center gap-2">
          <FaUserTie className="text-xl" />
          <span>Bienvenue, <b>{assistantName}</b></span>
        </div>
      </header>

      <div className="flex flex-1">
        {/* SIDEBAR */}
        <aside className="bg-[#004d73] text-white w-64 flex flex-col justify-between">
          <div>
            <h2 className="text-center text-lg font-bold py-4 border-b border-white/20">
              Espace Assistante
            </h2>
            <nav className="flex flex-col mt-4">
              <button
                onClick={() => navigate("/assistant")}
                className="flex items-center gap-3 px-6 py-3 hover:bg-[#005b88] transition-all"
              >
                <FaHome /> <span>Tableau de bord</span>
              </button>
              <button
                onClick={() => navigate("/assistant/suivi-registre")}
                className="flex items-center gap-3 px-6 py-3 hover:bg-[#005b88] transition-all"
              >
                <FaClipboardList /> <span>Suivi registres</span>
              </button>
              <button
                onClick={() => navigate("/assistant/messages")}
                className="flex items-center gap-3 px-6 py-3 hover:bg-[#005b88] transition-all"
              >
                <FaEnvelope /> <span>Messages</span>
              </button>
            </nav>
          </div>
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 px-6 py-3 bg-red-600 hover:bg-red-700 transition-all"
          >
            <FaSignOutAlt /> <span>Déconnexion</span>
          </button>
        </aside>

        {/* MAIN */}
        <main className="flex-1 p-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">
            Tableau de bord
          </h2>

          {loading ? (
            <p className="text-gray-500">Chargement...</p>
          ) : error ? (
            <p className="text-red-600">{error}</p>
          ) : stats ? (
            <>
              {/* Cartes statistiques */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-8">
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  className="bg-white p-6 rounded-xl shadow-md border-t-4 border-blue-500 text-center"
                >
                  <h3 className="text-lg font-semibold text-gray-600">
                    Séances totales
                  </h3>
                  <p className="text-3xl font-bold text-blue-600 mt-2">
                    {stats.totalSeances}
                  </p>
                </motion.div>

                <motion.div
                  whileHover={{ scale: 1.05 }}
                  className="bg-white p-6 rounded-xl shadow-md border-t-4 border-green-500 text-center"
                >
                  <h3 className="text-lg font-semibold text-gray-600">
                    Séances remplies
                  </h3>
                  <p className="text-3xl font-bold text-green-600 mt-2">
                    {stats.seancesRemplies}
                  </p>
                </motion.div>

                <motion.div
                  whileHover={{ scale: 1.05 }}
                  className="bg-white p-6 rounded-xl shadow-md border-t-4 border-red-500 text-center"
                >
                  <h3 className="text-lg font-semibold text-gray-600">
                    Séances non remplies
                  </h3>
                  <p className="text-3xl font-bold text-red-600 mt-2">
                    {stats.seancesNonRemplies}
                  </p>
                </motion.div>
              </div>

              {/* Zone d’infos */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white rounded-xl p-6 shadow-md border border-gray-100"
              >
                <p className="text-gray-700 mb-3">
                  En tant qu’assistante technique, vous pouvez :
                </p>
                <ul className="list-disc pl-6 text-gray-600 space-y-2">
                  <li>Suivre les registres des enseignants formateurs</li>
                  <li>Identifier les retards ou absences de saisie</li>
                  <li>Envoyer des rappels automatiques</li>
                  <li>Consulter les messages internes</li>
                </ul>
              </motion.div>
            </>
          ) : (
            <p className="text-gray-500">Aucune donnée disponible.</p>
          )}
        </main>
      </div>

      <footer className="text-center py-4 bg-gray-100 text-gray-600 text-sm">
        © 2025 - ISEP Thiès | Plateforme de gestion des UEA
      </footer>
    </div>
  );
};

export default AssistantHome;
