import React, { useEffect, useState } from 'react';
import { BarChart2, AlertTriangle } from 'lucide-react';
import { ToastContainer, toast } from 'react-toastify'; // Import de Toastify pour afficher des notifications
import 'react-toastify/dist/ReactToastify.css'; // Import des styles nécessaires pour Toastify
import StatCard from '../components/StatCard';
import PriceCard from '../components/PriceCard';
import AdSlider from '../components/AdSlider'; // Import du composant AdSlider
import { getMarketPrices, getProducts, getDashboardStats, getMarketInsights } from '../api/api.js'; // Import des fonctions pour récupérer les données

const Dashboard = () => {
  // États pour stocker les différentes données récupérées depuis l'API
  const [marketPrices, setMarketPrices] = useState([]);
  const [products, setProducts] = useState([]);
  const [dashboardStats, setDashboardStats] = useState([]);
  const [marketInsights, setMarketInsights] = useState([]);
  const [recommendations, setRecommendations] = useState([]);
  const [displayedNotifications, setDisplayedNotifications] = useState(new Set()); // Garde une trace des notifications affichées

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Récupération des données depuis l'API
        const pricesData = await getMarketPrices();
        const productsData = await getProducts();
        const statsData = await getDashboardStats();
        const insightsData = await getMarketInsights();

        // Mise à jour des états avec les données récupérées
        setMarketPrices(pricesData);
        setProducts(productsData);
        setDashboardStats(statsData);
        setMarketInsights(insightsData);

        // Traitement pour trouver les marchés optimaux pour chaque produit
        const optimalMarkets = pricesData.reduce((acc, price) => {
          const existing = acc.find((item) => item.product === price.product.name);
          if (!existing || price.price < existing.price) {
            acc = acc.filter((item) => item.product !== price.product.name);
            acc.push({
              product: price.product.name,
              market: price.market.name,
              price: price.price,
              unit: price.unit,
              currency: price.currency,
            });
          }
          return acc;
        }, []);

        setRecommendations(optimalMarkets);

        // Affichage des notifications pour chaque insight du marché
        insightsData.forEach((insight) => {
          if (!displayedNotifications.has(insight.id)) { // Vérifie si la notification a déjà été affichée
            toast.info(
              <div>
                <AlertTriangle style={{ color: 'yellow', marginRight: '8px' }} />
                <strong>{insight.title}</strong>
                <p>{insight.content}</p>
              </div>,
              {
                position: 'top-right',
                autoClose: 5000, // La notification disparaît après 5 secondes
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
              }
            );
            setDisplayedNotifications((prev) => new Set(prev).add(insight.id)); // Marque cette notification comme affichée
          }
        });
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, [displayedNotifications]);

  // Liste des produits clés à mettre en avant
  const featuredProducts = ['mil', 'oignon', 'arachide', 'riz'];
  const featuredPrices = featuredProducts.map((productId) => {
    const product = products.find((p) => p.id === productId);
    const prices = marketPrices.filter((p) => p.product.id === productId);

    if (prices.length === 0 || !product) return null;

    // Trie les prix par date décroissante et sélectionne le plus récent
    const latestPrice = prices.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())[0];

    return {
      product: product.name,
      price: latestPrice.price,
      currency: latestPrice.currency,
      change: latestPrice.change,
      unit: latestPrice.unit,
      market: latestPrice.market.name,
      date: latestPrice.date,
    };
  }).filter(Boolean);

  return (
    <div className="space-y-6">
      {/* Slider de publicité */}
      <AdSlider />
      
      {/* Introduction */}
      <div className="bg-blue-50 p-4 rounded-lg">
        <p className="text-blue-700 text-sm">
          Bienvenue sur le tableau de bord de gestion des prix ! Ici, vous pouvez consulter les produits clés,
          les marchés optimaux pour acheter ou vendre, et un aperçu général du marché.
        </p>
      </div>

      {/* En-tête du tableau de bord */}
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Tableau de bord</h1>
        
      </div>

      {/* Statistiques du tableau de bord */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {dashboardStats.map((stat, index) => (
          <StatCard
            key={index}
            title={stat.title}
            value={stat.value}
            icon={<BarChart2 className="h-6 w-6" />}
            change={stat.change}
            changeLabel={stat.changeLabel}
            color="green"
          />
        ))}
      </div>

      {/* Section des prix et marchés optimaux */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Affichage des prix des produits clés */}
        <div className="lg:col-span-2 space-y-4">
          <h2 className="text-lg font-semibold">Prix des produits clés</h2>
          {featuredPrices.map((item, index) => (
            <PriceCard
              key={index}
              product={item.product}
              price={item.price}
              currency={item.currency}
              change={item.change}
              unit={item.unit}
              market={item.market}
              date={item.date}
            />
          ))}
        </div>

        {/* Affichage des recommandations de marchés optimaux */}
        <div className="lg:col-span-2 space-y-4">
          <h2 className="text-lg font-semibold">Marchés Optimaux</h2>
          {recommendations.map((item, index) => (
            <div key={index} className="bg-white p-4 rounded-lg shadow-md">
              <h3 className="text-sm font-bold">{item.product}</h3>
              <p>Marché : {item.market}</p>
              <p>Prix : {item.price.toLocaleString()} {item.currency}</p>
              <p>Unité : {item.unit}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Conteneur pour les notifications */}
      <ToastContainer />
    </div>
  );
};

export default Dashboard;