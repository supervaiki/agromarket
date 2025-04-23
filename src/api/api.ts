import axios from 'axios';

// Définissez l'URL de base de l'API
const API_BASE_URL = 'https://agroapi-qwvb.onrender.com/api/';

// Définir les types pour les réponses
export interface MarketPrice {
  id: number;
  product: string;
  market: string;
  price: number;
  currency: string;
  unit: string;
  change: number;
  date: string;
}
export interface Ad {
  id: number;
  title: string;
  image: string; // URL de l'image
  description: string;
}

export interface Product {
  id: number;
  name: string;
  category: string;
}

export interface Region {
  id: number;
  name: string;
}

// Fonction pour récupérer les prix du marché
export const getMarketPrices = async (): Promise<MarketPrice[]> => {
  try {
    const response = await axios.get<MarketPrice[]>(`${API_BASE_URL}market-prices/`);
    return response.data;
  } catch (error) {
    console.error('Error fetching market prices:', error);
    throw error;
  }
};

// Fonction pour récupérer les produits
export const getProducts = async (): Promise<Product[]> => {
  try {
    const response = await axios.get<Product[]>(`${API_BASE_URL}products/`);
    return response.data;
  } catch (error) {
    console.error('Error fetching products:', error);
    throw error;
  }
};

// Fonction pour récupérer les statistiques du tableau de bord
export const getDashboardStats = async (): Promise<any> => {
  try {
    const response = await axios.get(`${API_BASE_URL}dashboard-stats/`);
    return response.data;
  } catch (error) {
    console.error('Error fetching dashboard stats:', error);
    throw error;
  }
};

// Fonction pour récupérer les insights du marché
export const getMarketInsights = async (): Promise<any> => {
  try {
    const response = await axios.get(`${API_BASE_URL}market-insights/`);
    return response.data;
  } catch (error) {
    console.error('Error fetching market insights:', error);
    throw error;
  }
};

// Fonction pour générer des données historiques
export const generateHistoricalData = async (
  productId: string,
  days: number = 30
): Promise<MarketPrice[]> => {
  try {
    const response = await axios.get<MarketPrice[]>(`${API_BASE_URL}market-prices/?product_id=${productId}&days=${days}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching historical data:', error);
    throw error;
  }
};

// Fonction pour générer des données de comparaison de marché
export const generateMarketComparisonData = async (
  productId: string
): Promise<any> => {
  try {
    const response = await axios.get(`${API_BASE_URL}generate-market-comparison-data/${productId}/`);
    return response.data;
  } catch (error) {
    console.error('Error fetching market comparison data:', error);
    throw error;
  }
};

// Fonction pour générer des prédictions de données
export const generatePredictionData = async (
  productId: string
): Promise<any> => {
  try {
    const response = await axios.get(`${API_BASE_URL}prediction-data/${productId}/`);
    return response.data;
  } catch (error) {
    console.error('Error fetching prediction data:', error);
    throw error;
  }
};

// Fonction pour récupérer les catégories de produits
export const getProductCategories = async (): Promise<string[]> => {
  try {
    const response = await axios.get<string[]>(`${API_BASE_URL}product-categories/`);
    return response.data;
  } catch (error) {
    console.error('Error fetching product categories:', error);
    throw error;
  }
};

// Fonction pour récupérer les régions
export const getRegions = async (): Promise<Region[]> => {
  try {
    const response = await axios.get<Region[]>(`${API_BASE_URL}regions/`);
    return response.data;
  } catch (error) {
    console.error('Error fetching regions:', error);
    throw error;
  }
};

// Fonction pour récupérer les prix du marché filtrés
export const getMarketPricesFiltered = async (
  selectedProducts: number[] | null,
  selectedRegion: string | null,
  startDate: string | null,
  endDate: string | null
): Promise<MarketPrice[]> => {
  try {
    let queryParams: string[] = [];
    if (selectedProducts) queryParams.push(`products=${selectedProducts.join(',')}`);
    if (selectedRegion) queryParams.push(`region=${selectedRegion}`);
    if (startDate) queryParams.push(`start_date=${startDate}`);
    if (endDate) queryParams.push(`end_date=${endDate}`);

    const queryString = queryParams.length ? `?${queryParams.join('&')}` : '';
    const response = await axios.get<MarketPrice[]>(`${API_BASE_URL}market-prices/${queryString}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching filtered market prices:', error);
    throw error;
  }
};
export const getAds = async (): Promise<Ad[]> => {
  try {
    const response = await axios.get<Ad[]>(`${API_BASE_URL}ads/`);
    return response.data;
  } catch (error) {
    console.error('Error fetching ads:', error);
    throw error;
  }
};
