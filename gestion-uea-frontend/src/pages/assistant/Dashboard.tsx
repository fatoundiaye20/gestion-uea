import {
  FaCalendarAlt,
  FaChalkboardTeacher,
  FaCogs,
  FaSignOutAlt,
} from "react-icons/fa";

const DashboardAssistant = () => {
  return (
    <div className="min-h-screen flex bg-gray-100">
      {/* Sidebar */}
      <aside className="w-64 bg-gray-800 text-white flex flex-col">
        <div className="p-6 text-center font-bold text-xl border-b border-gray-700">
          ISEP - Thiès
        </div>
        <nav className="flex-1 p-4 space-y-4">
          <a href="#" className="flex items-center gap-3 p-2 rounded hover:bg-gray-700">
            <FaCalendarAlt /> Emploi du temps
          </a>
          <a href="#" className="flex items-center gap-3 p-2 rounded hover:bg-gray-700">
            <FaChalkboardTeacher /> Formateurs
          </a>
          <a href="#" className="flex items-center gap-3 p-2 rounded hover:bg-gray-700">
            <FaCogs /> Gestion UEA
          </a>
        </nav>
        <div className="p-4 border-t border-gray-700">
          <button className="w-full flex items-center justify-center gap-2 bg-red-600 hover:bg-red-700 px-4 py-2 rounded">
            <FaSignOutAlt /> Déconnexion
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-8">
        <h1 className="text-2xl font-bold mb-6">
          Tableau de bord - Assistant Technique
        </h1>

        {/* Cards section */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white p-6 rounded-lg shadow hover:shadow-lg cursor-pointer">
            <h2 className="text-lg font-semibold mb-2">Séances planifiées</h2>
            <p className="text-gray-600">
              Voir et gérer toutes les séances prévues.
            </p>
          </div>

          <div className="bg-white p-6 rounded-lg shadow hover:shadow-lg cursor-pointer">
            <h2 className="text-lg font-semibold mb-2">Suivi des UEA</h2>
            <p className="text-gray-600">
              Ajouter, modifier ou supprimer des UEA.
            </p>
          </div>

          <div className="bg-white p-6 rounded-lg shadow hover:shadow-lg cursor-pointer">
            <h2 className="text-lg font-semibold mb-2">Gestion des formateurs</h2>
            <p className="text-gray-600">
              Consulter la liste des enseignants affectés.
            </p>
          </div>
        </div>

        {/* Notifications or updates */}
        <div className="mt-10">
          <h2 className="text-xl font-semibold mb-4">Notifications récentes</h2>
          <ul className="bg-white p-4 rounded-lg shadow space-y-2">
            <li className="border-b pb-2">
              📌 Nouvelle séance ajoutée par le formateur X.
            </li>
            <li className="border-b pb-2">
              📌 UEA "Mathématiques appliquées" modifiée.
            </li>
            <li>📌 Rappel : réunion prévue demain à 10h.</li>
          </ul>
        </div>
      </main>
    </div>
  );
};

export default DashboardAssistant;
