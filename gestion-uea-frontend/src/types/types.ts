// src/types/types.ts

export interface User {
  id: number;
  name: string;
  email: string;
  role: string; // "chef" | "responsable" | "enseignant" | "assistant"
}

export interface AuthContextType {
  user: User | null;
  token: string | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<{ success: boolean; user?: User; message?: string }>;
  logout: () => void;
  hasRole: (role: string) => boolean;
  hasAnyRole: (roles: string[]) => boolean;
  isAuthenticated: boolean;
}
