export interface Theme {
  id: number;
  name: string;
  created_at: string;
  updated_at: string;
}

export interface Subtheme {
  id: number;
  theme_id: number;
  name: string;
  created_at: string;
  updated_at: string;
}

export interface Category {
  id: number;
  subtheme_id: number;
  name: string;
  created_at: string;
  updated_at: string;
}

export interface Name {
  id: number;
  name: string;
  created_at: string;
  updated_at: string;
}

export interface NameCategory {
  name_id: number;
  category_id: number;
  created_at: string;
}

export interface AllData {
  themes: Theme[];
  subthemes: Subtheme[];
  categories: Category[];
  names: Name[];
  nameCategories: NameCategory[];
}

export interface AuthContextType {
  isAuthenticated: boolean;
  login: (username: string, password: string) => Promise<void>;
  logout: () => void;
} 