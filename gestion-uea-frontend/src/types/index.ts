// src/types/index.ts

export interface User {
  id: number;
  name: string;
  email: string;
  telephone?: string;
  specialite?: string;
  role: 'chef_dep' | 'responsable_metier' | 'enseignant' | 'assistant';
  filiere_id?: number;
  filiere?: Filiere;
  created_at?: string;
  updated_at?: string;
}

export interface Filiere {
  id: number;
  nom: string;
  description?: string;
  created_at?: string;
  updated_at?: string;
}

export interface Uea {
  id: number;
  code: string;
  nom: string;
  description?: string;
  volume_horaire_total: number;
  filiere_id: number;
  semestre: 'S1' | 'S2' | 'S3' | 'S4';
  niveau: '1re_annee' | '2e_annee';
  filiere?: Filiere;
  volume_horaire_effectue?: number;
  volume_horaire_restant?: number;
  taux_execution?: number;
  est_terminee?: boolean;
  created_at?: string;
  updated_at?: string;
}

export interface Salle {
  id: number;
  nom: string;
  capacite?: number;
  description?: string;
  created_at?: string;
  updated_at?: string;
}

export interface Seance {
  id: number;
  date: string;
  heure_debut: string;
  heure_fin: string;
  duree: '4h' | '8h';
  salle_id: number;
  enseignant_id: number;
  uea_id: number;
  statut: 'prevue' | 'validee' | 'realisee';
  chapitre?: string;
  objectifs_pedagogiques?: string;
  points_abordes?: string;
  objectifs_atteints?: boolean;
  satisfaction_apprenants?: boolean;
  raisons_insatisfaction?: string;
  commentaire_responsable?: string;
  salle?: Salle;
  enseignant?: User;
  uea?: Uea;
  created_at?: string;
  updated_at?: string;
}

export interface AuthContextType {
  user: User | null;
  token: string | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<{ success: boolean; message?: string; user?: User }>;
  logout: () => Promise<void>;
  hasRole: (role: string) => boolean;
  hasAnyRole: (roles: string[]) => boolean;
  isAuthenticated: boolean;
}
export interface Statistiques {
  total_seances: number;
  seances_prevues: number;
  seances_validees: number;
  seances_realisees: number;
  total_participants: number;
  taux_presence: number;
  taux_satisfaction: number;
  taux_execution_uea: number;
  volume_horaire_total: number;
  volume_horaire_effectue: number;
  volume_horaire_restant: number;
}