// src/utils/helpers.ts

/**
 * Formater une date au format français
 */
export const formatDate = (date: string | Date): string => {
  if (!date) return '';
  const d = new Date(date);
  return d.toLocaleDateString('fr-FR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  });
};

/**
 * Formater une heure
 */
export const formatTime = (time: string): string => {
  if (!time) return '';
  return time.substring(0, 5); // "08:00:00" -> "08:00"
};

/**
 * Obtenir le label du rôle en français
 */
export const getRoleLabel = (role: string): string => {
  const roles: Record<string, string> = {
    chef_dep: 'Chef de Département',
    responsable_metier: 'Responsable de Métier',
    enseignant: 'Enseignant',
    assistant: 'Assistant Technique',
  };
  return roles[role] || role;
};

/**
 * Obtenir le label du statut de séance
 */
export const getStatutLabel = (statut: string): string => {
  const statuts: Record<string, string> = {
    prevue: 'Prévue',
    validee: 'Validée',
    realisee: 'Réalisée',
  };
  return statuts[statut] || statut;
};

/**
 * Obtenir la couleur du statut
 */
export const getStatutColor = (statut: string): string => {
  const colors: Record<string, string> = {
    prevue: 'bg-yellow-100 text-yellow-800',
    validee: 'bg-blue-100 text-blue-800',
    realisee: 'bg-green-100 text-green-800',
  };
  return colors[statut] || 'bg-gray-100 text-gray-800';
};

/**
 * Formater le niveau
 */
export const getNiveauLabel = (niveau: string): string => {
  const niveaux: Record<string, string> = {
    '1re_annee': '1ère année',
    '2e_annee': '2ème année',
  };
  return niveaux[niveau] || niveau;
};

/**
 * Calculer le pourcentage
 */
export const calculatePercentage = (value: number, total: number): number => {
  if (!total || total === 0) return 0;
  return Math.round((value / total) * 100);
};

/**
 * Obtenir la couleur du taux d'exécution
 */
export const getTauxColor = (taux: number): string => {
  if (taux >= 100) return 'text-green-600';
  if (taux >= 75) return 'text-blue-600';
  if (taux >= 50) return 'text-yellow-600';
  return 'text-red-600';
};

/**
 * Valider un email avec le domaine ISEP
 */
export const validateIsepEmail = (email: string): boolean => {
  const regex = /@isep-thies\.edu\.sn$/;
  return regex.test(email);
};

/**
 * Formater un numéro de téléphone sénégalais
 */
export const formatPhone = (phone: string): string => {
  if (!phone) return '';
  const cleaned = phone.replace(/\s/g, '');
  if (cleaned.startsWith('+221')) {
    return `+221 ${cleaned.substring(4, 6)} ${cleaned.substring(6, 9)} ${cleaned.substring(9)}`;
  }
  return phone;
};

/**
 * Obtenir le nom du jour en français
 */
export const getJourSemaine = (date: string | Date): string => {
  const jours = ['Dimanche', 'Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi'];
  const d = new Date(date);
  return jours[d.getDay()];
};

/**
 * Vérifier si une date est aujourd'hui
 */
export const isToday = (date: string | Date): boolean => {
  const today = new Date();
  const d = new Date(date);
  return today.toDateString() === d.toDateString();
};

/**
 * Obtenir la semaine en cours (début et fin)
 */
export const getCurrentWeek = (): { debut: string; fin: string } => {
  const now = new Date();
  const dayOfWeek = now.getDay();
  const startOfWeek = new Date(now);
  startOfWeek.setDate(now.getDate() - (dayOfWeek === 0 ? 6 : dayOfWeek - 1));
  
  const endOfWeek = new Date(startOfWeek);
  endOfWeek.setDate(startOfWeek.getDate() + 6);
  
  return {
    debut: startOfWeek.toISOString().split('T')[0],
    fin: endOfWeek.toISOString().split('T')[0],
  };
};

/**
 * Gérer les erreurs API
 */
export const handleApiError = (error: any): string => {
  if (error.response) {
    if (error.response.status === 422) {
      const errors = error.response.data.errors;
      return Object.values(errors).flat().join(', ');
    }
    return error.response.data.message || 'Une erreur est survenue';
  } else if (error.request) {
    return 'Impossible de contacter le serveur';
  }
  return 'Une erreur inattendue est survenue';
};

/**
 * Télécharger un fichier (pour export PDF/Excel)
 */
export const downloadFile = (data: BlobPart, filename: string, type: string): void => {
  const blob = new Blob([data], { type });
  const url = window.URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  window.URL.revokeObjectURL(url);
};