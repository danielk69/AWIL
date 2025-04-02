export interface Theme {
  id: number;
  name: string;
  created_at: Date;
}

export interface Subtheme {
  id: number;
  name: string;
  theme_id: number;
  created_at: Date;
}

export interface Category {
  id: number;
  name: string;
  subtheme_id: number;
  created_at: Date;
}

export interface Name {
  id: number;
  name: string;
  created_at: Date;
}

export interface NameCategory {
  id: number;
  name_id: number;
  category_id: number;
  created_at: Date;
}

export interface Admin {
  id: number;
  username: string;
  password: string;
  created_at: Date;
}

export interface AllData {
  themes: Theme[];
  subthemes: Subtheme[];
  categories: Category[];
  names: Name[];
  nameCategories: NameCategory[];
} 