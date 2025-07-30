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

// Authentication types
export interface User {
  id: string;
  username: string;
  email: string;
  role: 'admin' | 'agent';
  firstName?: string;
  lastName?: string;
  avatar?: string;
  createdAt?: string;
  lastLogin?: string;
  isActive?: boolean;
}

export interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}

export interface LoginCredentials {
  username: string;
  password: string;
}

export interface AuthResponse {
  user: User;
  token: string;
  refreshToken?: string;
}

// Dashboard specific types
export interface AdminStats {
  totalUsers: number;
  totalAgents: number;
  totalMarkets: number;
  totalProducts: number;
  activeAgents: number;
  recentPriceUpdates: number;
}

export interface AgentStats {
  assignedMarkets: number;
  priceUpdatesThisMonth: number;
  pendingReports: number;
  lastUpdateDate: string;
}