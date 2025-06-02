//src/data/types.ts
export type Product = {
  id: string;
  title: string;
  subtitle?: string;
  name: string;
  slug?: string;
  description?: string;
  extraDescription?: string;
  priceUSD: number;
  cjProductId: string;
  category: { id: string; name: string };
  subCategory: { id: string; name: string };
  team: { id: string; name: string };
  league: string;
  images?: string[];
  stock?: { [size: string]: number };
  sizes?: string[];
  active: boolean;
  defaultDescriptionType?: string;
  extraDescriptionTop?: string;
  extraDescriptionBottom?: string;
  descriptionPosition?: "top" | "bottom";
  allowCustomization?: boolean;
  customName?: string;
  customNumber?: string;
};

export interface League {
  id: string;
  name: string;
  teams: string[];
}

export interface Team {
  id: string;
  name: string;
  subCategoryId: string;
}

export type CartItem = {
  id: string;
  slug: string;
  name: string;
  image: string;
  priceUSD: number;
  quantity: number;
  size: string;
  customName?: string;
  customNumber?: string;
};

export type User = {
  id: string;
  name: string;
  email: string;
  password?: string;
  role?: string;
};
export type AuthUser = {
  id: string;
  name: string;
  email: string;
  password?: string;
};
export type Client = {
  id: string;
  name: string;
  email: string;
  phone?: string;
  address?: string;
  country?: string;
};

export type LeagueData = {
  id: string;
  name: string;
  teams: string[];
};

export type Subcategory = {
  id: string;
  name: string;
  categoryId: string;
};