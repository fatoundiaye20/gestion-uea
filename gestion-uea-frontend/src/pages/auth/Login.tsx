import { useState } from 'react';
import { ChevronDownIcon, EnvelopeIcon, LockClosedIcon, BriefcaseIcon, EyeIcon, EyeSlashIcon } from '@heroicons/react/20/solid';
import { toast, Toaster } from 'react-hot-toast';
import axios from 'axios';

export default function Login() {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    profession: 'chef_dep',
    acceptRules: false,
  });
  
  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    const checked = (e.target as HTMLInputElement).checked;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.acceptRules) {
      toast.error("Veuillez accepter les règles.");
      return;
    }

    try {
      const response = await axios.post('http://localhost:8000/api/login', {
        email: formData.email,
        password: formData.password,
      });

      const { token, user } = response.data;
      console.log("Rôle reçu du backend :", user.role);

      // ✅ Vérification de la compatibilité de la profession
      if (user.role !== formData.profession) {
        toast.error(`Erreur : Votre profession ne correspond pas. Vous êtes ${user.role}, mais vous avez sélectionné ${formData.profession}.`);
        return;
      }

      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(user));

      // ✅ Message toast plus chaleureux et informatif
      toast.success(`Bienvenue ${user.name} 👋 Vous êtes connecté en tant que ${user.role}.`);

      const redirectMap: Record<string, string> = {
        chef_dep: '/chef',
        responsable_metier: '/responsable',
        enseignant: '/enseignant',
        assistant: '/assistant',
      };

      window.location.href = redirectMap[user.role] || '/unauthorized';
    } catch (error: any) {
      toast.error("Échec de la connexion. Vérifiez vos identifiants.");
    }
  };

  return (
    <div className="min-h-screen bg-[#f2f2f2] flex items-center justify-center font-sans ">
      <Toaster />
      <div className="grid grid-cols-1 rounded-3xl md:grid-cols-2 w-249 max-w-9xl bg-[#010724] overflow-hidden shadow-xl ">
        {/* Section gauche avec image */}
        <div className="flex w-120 avatar items-center justify-center bg-[#010724] p-6">
          {/* <img src="/images/graduation.jpg" alt="Illustration" className="max-h-[400px] w-auto object-contain" /> */}
        </div>

        {/* Section droite */}
        <form onSubmit={handleSubmit} className="p-10 flex flex-col justify-center items-center text-[rgb(234,239,244)] w-120 ">
          <br />
          <br />
          <div className="w-full max-w-md">
            <h2 className="text-2xl font-bold mb-6 text-center text-[rgb(234,239,244)]">Connexion</h2>

            {/* Champ Email avec icône */}
            <label className="mb-1 text-sm font-medium text-[rgb(234,239,244)]">Adresse email</label>
            <div className="relative mb-4">
              <EnvelopeIcon className="absolute left-3 top-3 h-5 w-5 text-gray-500" />
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="p-3 pl-11 text-center bg-white h-10 rounded border focus:outline-none focus:ring-2 focus:ring-[#003366] w-full text-black placeholder-gray-400"
                placeholder="nom@domaine.sn"
                required
              />
            </div>
            <br />

            {/* Champ Mot de passe avec icône et œil */}
            <label className="mb-1 text-sm font-medium text-[rgb(234,239,244)]">Mot de passe</label>
            <div className="relative mb-4">
              <LockClosedIcon className="absolute left-3 top-3 h-5 w-5 text-gray-500" />
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Saisir votre mot de passe"
                className="p-3 pl-10 pr-10 text-center rounded border bg-white h-10 text-black border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#003366] w-full placeholder-gray-400"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-3 text-gray-500 hover:text-gray-700 focus:outline-none"
              >
                {showPassword ? (
                  <EyeSlashIcon className="h-5 w-5" />
                ) : (
                  <EyeIcon className="h-5 w-5" />
                )}
              </button>
            </div>
            <br />

            {/* Champ Profession avec icône */}
            <label className="mb-1 text-sm font-medium text-[rgb(234,239,244)]">Profession</label>
            <div className="relative mb-4">
              <BriefcaseIcon className="absolute left-3 top-3 h-5 w-5 text-gray-500 pointer-events-none" />
              <select
                name="profession"
                value={formData.profession}
                onChange={handleChange}
                className="appearance-none text-center h-10 w-full p-3 rounded border border-gray-300 text-gray-700 bg-white focus:outline-none focus:ring-2 focus:ring-[#003366]"
              >
                <option value="chef_dep">Chef de département</option>
                <option value="enseignant">Enseignant</option>
                <option value="assistant">Assistant</option>
                <option value="responsable_metier">Responsable métier</option>
              </select>
              <ChevronDownIcon className="absolute right-3 top-3 h-5 w-5 text-gray-500 pointer-events-none" />
            </div>
            <br />

            <label className="flex items-center text-sm text-[rgb(234,239,244)] mb-6">
              <input
                type="checkbox"
                name="acceptRules"
                checked={formData.acceptRules}
                onChange={handleChange}
                className="mr-2 accent-[#003366]"
              />
              J'accepte les règles
            </label>
            <br />

            <div className="flex justify-center w-full">
              <button
                type="submit"
                className="bg-[#475691] text-black font-semibold py-3 px-6 rounded-3xl hover:bg-[#e6e9f2] transition duration-200 w-72"
              >
                Connectez
              </button>
            </div>
            <br />
            <br />
          </div>
        </form>
      </div>
    </div>
  );
}