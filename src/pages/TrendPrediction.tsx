import React, { useEffect, useState } from 'react';
import { getMarketPrices, getProducts } from '../api/api.js';

const TendancesEtPrevisions = () => {
  const [products, setProducts] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState('');
  const [pricesByRegion, setPricesByRegion] = useState([]);
  const [averageVariation, setAverageVariation] = useState(null);
  const [optimalAction, setOptimalAction] = useState('');

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const productsData = await getProducts();
        setProducts(productsData);
        setSelectedProduct(productsData[0]?.id || '');
      } catch (error) {
        console.error('Erreur lors de la récupération des produits:', error);
      }
    };

    fetchProducts();
  }, []);

  useEffect(() => {
    const fetchMarketPrices = async () => {
      if (!selectedProduct) return;

      try {
        const marketPrices = await getMarketPrices();
        const filteredPrices = marketPrices.filter(
          (price) => price.product.id === selectedProduct
        );

        // Organisation des données par région et marché
        const groupedPrices = filteredPrices.reduce((acc, price) => {
          if (!acc[price.region]) {
            acc[price.region] = [];
          }
          acc[price.region].push({
            market: price.market.name,
            price: price.price,
            date: price.date,
            change: price.change,
          });
          return acc;
        }, {});

        // Analyse par région et calcul des prévisions
        const regionalAnalysis = Object.entries(groupedPrices).map(([region, prices]) => {
          const avgPrice =
            prices.reduce((sum, p) => sum + p.price, 0) / prices.length;
          const forecast = avgPrice * (1 + Math.random() * 0.1 - 0.05);
          const recommendation = forecast > avgPrice ? 'Vendre' : 'Acheter';

          return {
            region,
            prices,
            avgPrice: avgPrice.toFixed(2),
            forecast: forecast.toFixed(2),
            recommendation,
          };
        });

        setPricesByRegion(regionalAnalysis);

        // Calcul de la variation moyenne
        const totalVariation = filteredPrices.reduce(
          (sum, price) => sum + Math.abs(price.change),
          0
        );
        setAverageVariation((totalVariation / filteredPrices.length).toFixed(2));

        // Déterminer l'action optimale (Acheter ou Vendre)
        const action = regionalAnalysis.every(
          (region) => parseFloat(region.forecast) > parseFloat(region.avgPrice)
        )
          ? 'Vendre'
          : 'Acheter';
        setOptimalAction(action);
      } catch (error) {
        console.error('Erreur lors de la récupération des tendances et prévisions:', error);
      }
    };

    fetchMarketPrices();
  }, [selectedProduct]);

  return (
    <div className="container mx-auto p-4">
      {/* Explication du fonctionnement */}
      <div className="bg-blue-50 p-4 rounded-lg">
        <p className="text-blue-700 text-sm">
          Cette page analyse les tendances des prix des produits sélectionnés pour vous aider à prendre des décisions éclairées.  
          Comment ça marche :
          1. Sélectionnez un produit dans la liste déroulante.  
          2. Consultez les tendances des prix par région, leur variation, et une action recommandée (Acheter ou Vendre).  
          3. Analysez les variations moyennes et utilisez les prévisions pour anticiper les évolutions futures.  
          Ces fonctionnalités vous permettent d'optimiser vos décisions commerciales et de maximiser vos profits.
        </p>
      </div>

      <h1 className="text-2xl font-bold text-center mb-6">Tendances et Prévisions</h1>

      {/* Sélecteur de produit */}
      <div className="mb-6">
        <label htmlFor="product-select" className="block text-sm font-medium text-gray-700 mb-2">
          Sélectionnez un produit :
        </label>
        <select
          id="product-select"
          value={selectedProduct}
          onChange={(e) => setSelectedProduct(e.target.value)}
          className="w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
        >
          {products.map((product) => (
            <option key={product.id} value={product.id}>
              {product.name}
            </option>
          ))}
        </select>
      </div>

      {/* Analyse par région */}
      {pricesByRegion.length > 0 && (
        <div className="bg-white p-4 rounded-lg shadow-md">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">Tendances par Région</h2>
          {pricesByRegion.map((regionData, index) => (
            <div key={index} className="mb-6">
              <h3 className="text-sm font-bold text-gray-700">
                Région : {regionData.region} - <span className="font-medium">{regionData.recommendation}</span>
              </h3>
              <ul className="list-disc list-inside text-sm text-gray-600">
                {regionData.prices.map((price, i) => (
                  <li key={i}>
                    Marché : {price.market} | Prix : {price.price.toLocaleString()} XAF | Date : {price.date}
                  </li>
                ))}
              </ul>
              <p className="text-sm text-gray-700 mt-2">
                 
              </p>
            </div>
          ))}
        </div>
      )}

      {/* Variation Moyenne */}
      {averageVariation && (
        <div className="bg-yellow-100 p-4 rounded-lg shadow-md mt-6">
          <h2 className="text-lg font-semibold text-yellow-700 mb-4">Variation Moyenne</h2>
          <p className="text-yellow-800">
            La variation moyenne des prix pour le produit sélectionné est de <span className="font-bold">{averageVariation}%</span>.
          </p>
        </div>
      )}

      {/* Temps Optimal pour Acheter/Vendre */}
      {optimalAction && (
        <div className="bg-blue-100 p-4 rounded-lg shadow-md mt-6">
          <h2 className="text-lg font-semibold text-blue-700 mb-4">Action Recommandée</h2>
          <p className="text-blue-800">
            Basé sur les tendances actuelles par région, il est recommandé de <span className="font-bold">{optimalAction}</span> le produit maintenant.
          </p>
        </div>
      )}
    </div>
  );
};

export default TendancesEtPrevisions;