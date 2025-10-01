// src/pages/Home.tsx
import { Link } from 'react-router-dom';

const Home = () => {
  return (
    <div className="min-h-screen flex flex-col" style={{ backgroundColor: '#f5f5f5' }}>
      {/* Bande supérieure brun avec drapeau et bouton connexion */}
      <header className="py-2 px-6" style={{ backgroundColor: '#6b4e3d' }}>
        <div className="flex items-center justify-between max-w-full">
          {/* Drapeau + texte ministère */}
          <div className="flex items-center gap-2">
            <div className="w-6 h-4 flex">
              <div className="w-2 h-4" style={{ backgroundColor: '#009639' }}></div>
              <div className="w-2 h-4" style={{ backgroundColor: '#fcd116' }}></div>
              <div className="w-2 h-4" style={{ backgroundColor: '#ce1126' }}></div>
            </div>
            <span className="text-white text-xs">
              Ministère de l'Enseignement Supérieur de la Recherche et de l'Innovation du Sénégal
            </span>
          </div>

          {/* Bouton connexion */}
          <Link
            to="/login"
            className="px-4 py-1 rounded-md text-xs font-medium hover:opacity-90 transition-opacity"
            style={{ backgroundColor: 'white', color: '#6b4e3d' }}
          >
            se connecter
          </Link>
        </div>
      </header>

      {/* Contenu principal */}
      <main className="flex-1 flex items-center justify-center relative">
        {/* Image de fond */}
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: 'url("/images/home-bg.png")', // <-- Mets ton image ici
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            opacity: 0.9,
          }}
        ></div>

        {/* Overlay */}
        <div className="absolute inset-0 bg-white/40"></div>

        {/* Bloc central */}
        <div className="relative text-center px-4 max-w-3xl">
          {/* Bulle marron */}
          <div
            className="rounded-full px-8 py-6 mb-4"
            style={{ backgroundColor: '#6b4e3de0' }}
          >
            <h1 className="text-white text-2xl font-bold leading-snug">
              Bienvenue dans la plate-forme
            </h1>
            <h2 className="text-white text-xl font-bold leading-snug">
              de gestion des unités
            </h2>
          </div>

          {/* Texte en dessous */}
          <p className="text-black font-semibold text-sm">
            d’Enseignement Apprentissage (UEA)
          </p>
          <p className="text-black text-sm">
            au sein du département EIT (ISEP Thiès)
          </p>

          {/* Bouton découvrir */}
          <Link
            to="/login"
            className="inline-block mt-6 px-4 py-2 rounded-md text-sm font-medium hover:opacity-90 transition-opacity"
            style={{ backgroundColor: '#6b4e3d', color: 'white' }}
          >
            Découvrir plus...
          </Link>
        </div>
      </main>

      {/* Footer */}
      <footer
        className="py-3 text-center text-xs"
        style={{ backgroundColor: '#6b4e3d', color: 'white' }}
      >
        © 2025 - Tous droits réservés ISEP-THIÈS
      </footer>
    </div>
  );
};

export default Home;
