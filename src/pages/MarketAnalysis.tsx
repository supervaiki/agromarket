import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

// Interfaces pour les données
interface Region {
  id: string;
  name: string;
}
interface MarketPrice {
  product: { id: string; name: string };
  market: { id: string; name: string; region: { id: string; name: string } };
  price: number;
  date: string;
}

const MarketDashboard: React.FC = () => {
  const [regions, setRegions] = useState<Region[]>([]);
  const [marketPrices, setMarketPrices] = useState<MarketPrice[]>([]);
  const [selectedRegion, setSelectedRegion] = useState<string>('all');
  const [chartData, setChartData] = useState<any>(null);
  const [mostExpensiveProduct, setMostExpensiveProduct] = useState<MarketPrice | null>(null);
  const [leastExpensiveProduct, setLeastExpensiveProduct] = useState<MarketPrice | null>(null);
  const [topProducts, setTopProducts] = useState<{ product: string; count: number }[]>([]);
  const [volumeByRegion, setVolumeByRegion] = useState<{ region: string; volume: number }[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [regionsResponse, pricesResponse] = await Promise.all([
          axios.get<Region[]>('https://agroapi-qwvb.onrender.com/api/regions/'),
          axios.get<MarketPrice[]>('https://agroapi-qwvb.onrender.com/api/market-prices/'),
        ]);
        setRegions([{ id: 'all', name: 'Toutes les régions' }, ...regionsResponse.data]);
        setMarketPrices(pricesResponse.data);
      } catch (error) {
        console.error('Erreur lors de la récupération des données :', error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  useEffect(() => {
    const filteredPrices = marketPrices.filter(
      (price) => selectedRegion === 'all' || price.market.region.id === selectedRegion
    );

    // Mise à jour des données du graphique (Histogramme)
    setChartData({
      labels: filteredPrices.map((price) => price.product.name),
      datasets: [
        {
          label: 'Prix',
          data: filteredPrices.map((price) => price.price),
          backgroundColor: 'rgba(75, 192, 192, 0.5)',
          borderColor: 'rgba(75, 192, 192, 1)',
          borderWidth: 1,
        },
      ],
    });

    // Produit le plus cher et le moins cher
    if (filteredPrices.length > 0) {
      const mostExpensive = filteredPrices.reduce((prev, curr) =>
        curr.price > prev.price ? curr : prev
      );
      const leastExpensive = filteredPrices.reduce((prev, curr) =>
        curr.price < prev.price ? curr : prev
      );
      setMostExpensiveProduct(mostExpensive);
      setLeastExpensiveProduct(leastExpensive);
    } else {
      setMostExpensiveProduct(null);
      setLeastExpensiveProduct(null);
    }

    // Top 5 des produits les plus populaires
    const productCounts: { [key: string]: number } = {};
    filteredPrices.forEach((price) => {
      productCounts[price.product.name] = (productCounts[price.product.name] || 0) + 1;
    });
    const topProductsArray = Object.entries(productCounts)
      .map(([product, count]) => ({ product, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 5);
    setTopProducts(topProductsArray);

    // Volume total des produits par région
    const volumeRegion: { [key: string]: number } = {};
    filteredPrices.forEach((price) => {
      const regionName = price.market.region.name;
      volumeRegion[regionName] = (volumeRegion[regionName] || 0) + 1;
    });
    const volumeArray = Object.entries(volumeRegion).map(([region, volume]) => ({ region, volume }));
    setVolumeByRegion(volumeArray);
  }, [selectedRegion, marketPrices]);

  if (loading) {
    return <div className="text-center mt-10">Chargement des données...</div>;
  }

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      {/* Texte explicatif */}
      <div className="bg-white p-6 rounded-lg shadow-md mb-6">
        <p className="text-gray-700">
          Ce tableau de bord permet de visualiser les données des marchés, y compris les prix des produits,
          le produit le plus cher, le moins cher, et les analyses détaillées comme les produits populaires
          et les volumes par région. Utilisez les filtres pour personnaliser l'affichage.
        </p>
      </div>

      {/* Filtre par région */}
      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-2">Région</label>
        <select
          value={selectedRegion}
          onChange={(e) => setSelectedRegion(e.target.value)}
          className="block w-full px-4 py-2 border rounded-md"
        >
          {regions.map((region) => (
            <option key={region.id} value={region.id}>
              {region.name}
            </option>
          ))}
        </select>
      </div>

      {/* Produit le plus cher et le moins cher */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-lg font-bold text-gray-700 mb-4">Produit le plus cher</h2>
          {mostExpensiveProduct ? (
            <p>
              <strong>{mostExpensiveProduct.product.name}</strong> à {mostExpensiveProduct.price} XAF
              dans {mostExpensiveProduct.market.region.name}.
            </p>
          ) : (
            <p>Aucun produit trouvé.</p>
          )}
        </div>
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-lg font-bold text-gray-700 mb-4">Produit le moins cher</h2>
          {leastExpensiveProduct ? (
            <p>
              <strong>{leastExpensiveProduct.product.name}</strong> à {leastExpensiveProduct.price}{' '}
              XAF dans {leastExpensiveProduct.market.region.name}.
            </p>
          ) : (
            <p>Aucun produit trouvé.</p>
          )}
        </div>
      </div>

      {/* Top 5 Produits les Plus Populaires */}
      <div className="bg-white p-6 rounded-lg shadow-md mb-6">
        <h2 className="text-lg font-bold text-gray-700 mb-4">Top 5 Produits les Plus Populaires</h2>
        {topProducts.length > 0 ? (
          <div style={{ position: 'relative', width: '100%', maxWidth: '600px', margin: '0 auto' }}>
            <Bar
              data={{
                labels: topProducts.map((product) => product.product),
                datasets: [
                  {
                    label: 'Occurrences',
                    data: topProducts.map((product) => product.count),
                    backgroundColor: 'rgba(75, 192, 75, 0.5)', // Couleur verte translucide
                    borderColor: 'rgba(75, 192, 75, 1)', // Couleur verte
                    borderWidth: 1,
                  },
                ],
              }}
              options={{
                responsive: true,
                maintainAspectRatio: false, // Permet une meilleure adaptabilité mobile
                plugins: {
                  legend: { position: 'top' },
                  title: { display: true, text: 'Top 5 Produits les Plus Populaires' },
                },
                scales: {
                  x: { title: { display: true, text: 'Produits' } },
                  y: { title: { display: true, text: 'Occurrences' }, beginAtZero: true },
                },
              }}
              height={300} // Hauteur fixée pour une adaptation optimale
            />
          </div>
        ) : (
          <div className="text-center text-gray-500">Aucun produit populaire trouvé.</div>
        )}
      </div>

           {/* Volume total par région */}
           <div className="bg-white p-6 rounded-lg shadow-md mb-6">
        <h2 className="text-lg font-bold text-gray-700 mb-4">Volume Total par Région</h2>
        <div style={{ position: 'relative', width: '100%', maxWidth: '600px', margin: '0 auto' }}>
          {volumeByRegion.length > 0 ? (
            <Bar
              data={{
                labels: volumeByRegion.map((region) => region.region),
                datasets: [
                  {
                    label: 'Volumes',
                    data: volumeByRegion.map((region) => region.volume),
                    backgroundColor: 'rgba(54, 162, 235, 0.5)', // Bleu translucide
                    borderColor: 'rgba(54, 162, 235, 1)', // Bleu solide
                    borderWidth: 1,
                  },
                ],
              }}
              options={{
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                  legend: { position: 'top' },
                  title: { display: true, text: 'Volume Total par Région' },
                },
                scales: {
                  x: { title: { display: true, text: 'Régions' } },
                  y: { title: { display: true, text: 'Volumes' }, beginAtZero: true },
                },
              }}
              height={300}
            />
          ) : (
            <div className="text-center text-gray-500">Aucune donnée disponible pour les volumes.</div>
          )}
        </div>
      </div>

      {/* Histogramme des prix */}
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-lg font-bold text-gray-700 mb-4">Histogramme des Prix</h2>
        <div style={{ position: 'relative', width: '100%', maxWidth: '600px', margin: '0 auto' }}>
          {chartData && chartData.datasets[0]?.data.length > 0 ? (
            <Bar
              data={chartData}
              options={{
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                  legend: { position: 'top' },
                  title: { display: true, text: 'Distribution des Prix des Produits (Histogramme)' },
                },
                scales: {
                  x: { title: { display: true, text: 'Produits' } },
                  y: { title: { display: true, text: 'Prix (XAF)' }, beginAtZero: true },
                },
              }}
              height={300}
            />
          ) : (
            <div className="text-center text-gray-500">Aucune donnée disponible pour l'histogramme.</div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MarketDashboard;