// ================= IMPORTS =================
import React, { useState, useEffect } from 'react';
import SidebarAssistant from '../../components/Assistant/SidebarAssistant';
import AssistantHeader from '../../components/Assistant/HeaderAssistant';
import { apiClient } from '../../api/client';
import toast from 'react-hot-toast';
import { TrendingUp } from 'lucide-react';

// ================= INTERFACE =================
interface Statistiques {
  total_seances: number;
  seances_validees: number;
  seances_realisees: number;
  seances_en_attente: number;
}

// ================= COMPOSANT PRINCIPAL =================
const AssistantStatistiques: React.FC = () => {
  const [theme, setTheme] = useState<'light' | 'dark'>(() => {
    return (localStorage.getItem('theme') as 'light' | 'dark') || 'light';
  });

  const [statistiques, setStatistiques] = useState<Statistiques>({
    total_seances: 0,
    seances_validees: 0,
    seances_realisees: 0,
    seances_en_attente: 0,
  });

  const [loading, setLoading] = useState(true);

  // Sauvegarde du thème dans le localStorage
  useEffect(() => {
    localStorage.setItem('theme', theme);
  }, [theme]);

  // Chargement initial des statistiques
  useEffect(() => {
    fetchStatistiques();
  }, []);

  // ================= FETCH STATISTIQUES =================
  const fetchStatistiques = async () => {
    try {
      const data = await apiClient('/statistiques');
      if (data.resume_global) {
        setStatistiques(data.resume_global);
      }
    } catch (error: any) {
      console.error('Erreur chargement statistiques:', error);
      toast.error(error.message || 'Erreur lors du chargement des statistiques');
    } finally {
      setLoading(false);
    }
  };

  // ================= CALCUL POURCENTAGE =================
  const getPercentage = (value: number) => {
    if (statistiques.total_seances === 0) return 0;
    return Math.round((value / statistiques.total_seances) * 100);
  };

  // ================= ÉTAT DE CHARGEMENT =================
  if (loading) {
    return (
      <div
        className={`min-h-screen flex items-center justify-center ${
          theme === 'light' ? 'bg-gray-100' : 'bg-gray-900'
        }`}
      >
        <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  // ================= RENDU PRINCIPAL =================
  return (
    <div
      className={`flex min-h-screen ${
        theme === 'light' ? 'bg-gray-50' : 'bg-gray-900'
      } transition-colors duration-300`}
    >
      {/* Barre latérale */}
      <SidebarAssistant theme={theme} />

      {/* Contenu principal */}
      <main className="flex-1 ml-64 p-8">
        <AssistantHeader theme={theme} setTheme={setTheme} />

        <div
          className={`${
            theme === 'light' ? 'bg-white' : 'bg-gray-800'
          } rounded-xl p-6 shadow-lg border ${
            theme === 'light' ? 'border-gray-200' : 'border-gray-700'
          }`}
        >
          <h2
            className={`${
              theme === 'light' ? 'text-gray-900' : 'text-gray-100'
            } text-xl font-bold mb-6 flex items-center gap-2`}
          >
            <TrendingUp className="w-6 h-6" />
            Statistiques Détaillées
          </h2>

          {/* ================= CONTENU ================= */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* ---- Colonne gauche ---- */}
            <div className="space-y-6">
              <h3
                className={`${
                  theme === 'light' ? 'text-gray-900' : 'text-gray-100'
                } font-semibold text-lg mb-4`}
              >
                📊 Répartition des Séances
              </h3>

              {/* Séances validées */}
              <StatItem
                label="✅ Séances Validées"
                value={statistiques.seances_validees}
                color="green"
                percentage={getPercentage(statistiques.seances_validees)}
                theme={theme}
              />

              {/* Séances réalisées */}
              <StatItem
                label="✔️ Séances Réalisées"
                value={statistiques.seances_realisees}
                color="purple"
                percentage={getPercentage(statistiques.seances_realisees)}
                theme={theme}
              />

              {/* Séances en attente */}
              <StatItem
                label="⏳ Séances en Attente"
                value={statistiques.seances_en_attente}
                color="yellow"
                percentage={getPercentage(statistiques.seances_en_attente)}
                theme={theme}
              />
            </div>

            {/* ---- Colonne droite ---- */}
            <div className="space-y-6">
              <h3
                className={`${
                  theme === 'light' ? 'text-gray-900' : 'text-gray-100'
                } font-semibold text-lg mb-4`}
              >
                📈 Résumé Global
              </h3>

              <div
                className={`${
                  theme === 'light' ? 'bg-blue-50' : 'bg-blue-900/20'
                } rounded-lg p-6 border-2 border-blue-500`}
              >
                <div className="text-center">
                  <p className="text-blue-600 dark:text-blue-400 text-sm font-medium mb-2">
                    TOTAL DES SÉANCES
                  </p>
                  <p
                    className={`${
                      theme === 'light' ? 'text-gray-900' : 'text-gray-100'
                    } text-5xl font-bold`}
                  >
                    {statistiques.total_seances}
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <MiniCard
                  label="VALIDÉES"
                  value={statistiques.seances_validees}
                  color="green"
                  theme={theme}
                />
                <MiniCard
                  label="RÉALISÉES"
                  value={statistiques.seances_realisees}
                  color="purple"
                  theme={theme}
                />
                <MiniCard
                  label="EN ATTENTE"
                  value={statistiques.seances_en_attente}
                  color="yellow"
                  theme={theme}
                  full
                />
              </div>

              <div
                className={`${
                  theme === 'light' ? 'bg-gray-50' : 'bg-gray-700/50'
                } rounded-lg p-4 mt-6`}
              >
                <p
                  className={`${
                    theme === 'light' ? 'text-gray-600' : 'text-gray-400'
                  } text-sm`}
                >
                  <strong>Note :</strong> Les statistiques sont mises à jour en
                  temps réel et reflètent l'état actuel de toutes les séances
                  dans le système.
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

// ================= COMPOSANTS SECONDAIRES =================
interface StatItemProps {
  label: string;
  value: number;
  color: string;
  percentage: number;
  theme: string;
}

const StatItem: React.FC<StatItemProps> = ({
  label,
  value,
  color,
  percentage,
  theme,
}) => (
  <div className="space-y-2">
    <div className="flex justify-between items-center">
      <span
        className={`${
          theme === 'light' ? 'text-gray-600' : 'text-gray-400'
        } font-medium`}
      >
        {label}
      </span>
      <div className="flex items-center gap-2">
        <span
          className={`${
            theme === 'light' ? 'text-gray-900' : 'text-gray-100'
          } font-bold text-lg`}
        >
          {value}
        </span>
        <span
          className={`${
            theme === 'light' ? 'text-gray-500' : 'text-gray-400'
          } text-sm`}
        >
          ({percentage}%)
        </span>
      </div>
    </div>
    <div
      className={`w-full ${
        theme === 'light' ? 'bg-gray-200' : 'bg-gray-700'
      } rounded-full h-3`}
    >
      <div
        className={`bg-${color}-500 h-3 rounded-full transition-all duration-500`}
        style={{ width: `${percentage}%` }}
      ></div>
    </div>
  </div>
);

interface MiniCardProps {
  label: string;
  value: number;
  color: string;
  theme: string;
  full?: boolean;
}

const MiniCard: React.FC<MiniCardProps> = ({
  label,
  value,
  color,
  theme,
  full,
}) => (
  <div
    className={`${
      theme === 'light'
        ? `bg-${color}-50`
        : `bg-${color}-900/20`
    } rounded-lg p-4 border border-${color}-500 ${full ? 'col-span-2' : ''}`}
  >
    <p className={`text-${color}-600 dark:text-${color}-400 text-xs font-medium mb-1`}>
      {label}
    </p>
    <p
      className={`${
        theme === 'light' ? 'text-gray-900' : 'text-gray-100'
      } text-2xl font-bold`}
    >
      {value}
    </p>
  </div>
);

export default AssistantStatistiques;
