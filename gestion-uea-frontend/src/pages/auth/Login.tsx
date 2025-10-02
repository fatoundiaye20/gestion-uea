import { useState } from 'react';
import { ChevronDownIcon } from '@heroicons/react/20/solid';
import { toast, Toaster } from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

export default function Login() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    acceptRules: false,
  });

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
    <div className="min-h-screen bg-[#e6fff5] flex items-center justify-center font-sans">
      <Toaster />
      <div className="grid grid-cols-1 rounded-3xl md:grid-cols-2 w-233 max-w-5xl bg-[#1c2128] overflow-hidden shadow-xl">
        {/* Section gauche avec image */}
        <div className="flex w-98 items-center justify-center bg-[#3f2a02] p-6">
          <img
            src="/images/graduation.jpg"
            alt="Illustration"
            className="max-h-[400px] w-auto object-contain"
          />
        </div>

        {/* Section droite */}
        <form
          onSubmit={handleSubmit}
          className="p-10 flex flex-col justify-center items-center text-[rgb(234,239,244)] w-100"
        >
          <div className="w-full max-w-md">
            <h2 className="text-3xl font-bold mb-6 text-center text-[rgb(234,239,244)]">Connexion</h2>

            <label className="mb-1 text-sm font-medium text-[rgb(234,239,244)]">Adresse email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="mb-4 p-3 bg-white h-10 text-center rounded border focus:outline-none focus:ring-2 focus:ring-[#003366] w-full text-black placeholder-[#3f2a02]"
              placeholder="nom@domaine.sn"
              required
            /> <br /> <br />

            <label className="mb-1 text-sm font-medium text-[rgb(234,239,244)]">Mot de passe</label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Saisir votre mot de passe"
              className="mb-4 p-3 rounded text-center border bg-white h-10 text-black border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#003366] w-full placeholder-[#3f2a02]"
              required
            /> <br /> <br />

            {/* Ce champ est conservé pour l'affichage, mais n'est pas envoyé au backend */}
            <label className="mb-1 text-sm font-medium text-[rgb(234,239,244)]">Profession</label>
            <div className="relative mb-4">
              <select
                name="profession"
                onChange={handleChange}
                className="appearance-none text-center h-10 w-full p-3 rounded border border-gray-300 text-gray-700 bg-white focus:outline-none focus:ring-2 focus:ring-[#003366]"
              >
                <option value="enseignant">Enseignant</option>
                <option value="assistant">Assistant</option>
                <option value="chef_dep">Chef de département</option>
                <option value="responsable_metier">Responsable métier</option>
              </select>
              <ChevronDownIcon className="absolute right-3 top-3 h-5 w-5 text-gray-500 pointer-events-none" />
            </div> <br />

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
                className="bg-[#f4eded] text-black font-semibold py-3 px-6 rounded-3xl hover:bg-[#475691] transition duration-200 w-72"
              >
                Entrer
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
