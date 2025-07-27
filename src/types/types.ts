// Common type definitions for the application
export interface Product {
  id: string;
  name: string;
  category?: string;
}

export interface Region {
  id: string;
  name: string;
}

export interface Market {
  id: string;
  name: string;
  region: Region;
}

export interface MarketPrice {
  id: number;
  product: Product;
  market: Market;
  price: number;
  currency: string;
  unit: string;
  change: number;
  date: string;
}

export interface Ad {
  id: number;
  title: string;
  image: string;
  image_url?: string;
  description: string;
}

export interface DashboardStat {
  title: string;
  value: string | number;
  change?: number;
  changeLabel?: string;
}

export interface MarketInsight {
  id: number;
  title: string;
  content: string;
}