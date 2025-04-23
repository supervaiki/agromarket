// src/pages/PriceComparison.js
import React, { useState, useEffect } from 'react';
import PriceChart from '../components/PriceChart';
import { getProducts, generateMarketComparisonData } from '../api/api';

const PriceComparison = () => {
  const [selectedProduct, setSelectedProduct] = useState('mil');
  const [products, setProducts] = useState([]);
  const [comparisonData, setComparisonData] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const productsData = await getProducts();
        setProducts(productsData);

        const comparisonData = await generateMarketComparisonData(selectedProduct);
        setComparisonData(comparisonData);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, [selectedProduct]);

  // Assurez-vous que `comparisonData` contient des prix valides
  const validComparisonData = comparisonData.filter(item => item.price != null);
  const marketNames = validComparisonData.map(item => item.market.name);
  const prices = validComparisonData.map(item => parseFloat(item.price)); // Convert prices to float

  // Calcul du prix moyen pour le tableau comparatif
  const averagePrice = prices.length ? prices.reduce((sum, price) => sum + price, 0) / prices.length : 0;

  // Get the product name
  const productName = products.find(p => p.id === selectedProduct)?.name || '';

  // Prepare data for the region comparison chart
  const regionData = validComparisonData.reduce((acc, item) => {
    if (!acc[item.market.region.name]) {
      acc[item.market.region.name] = {
        prices: [],
        count: 0
      };
    }

    acc[item.market.region.name].prices.push(parseFloat(item.price)); // Convert prices to float
    acc[item.market.region.name].count += 1;

    return acc;
  }, {});

  const regionNames = Object.keys(regionData);
  const regionAveragePrices = regionNames.map(region => {
    const { prices, count } = regionData[region];
    return Math.round(prices.reduce((sum, price) => sum + price, 0) / count);
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Comparaison des prix</h1>
        <div className="flex space-x-2">
          <button className="px-4 py-2 bg-white border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500">
            Exporter
          </button>
        </div>
      </div>
      
      {/* Product selector */}
      <div className="bg-white p-4 rounded-lg shadow-md">
        <label htmlFor="product-select" className="block text-sm font-medium text-gray-700 mb-2">
          Sélectionner un produit
        </label>
        <select
          id="product-select"
          value={selectedProduct}
          onChange={(e) => setSelectedProduct(e.target.value)}
          className="block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring focus:ring-green-200 focus:ring-opacity-50"
        >
          {products.map(product => (
            <option key={product.id} value={product.id}>
              {product.name}
            </option>
          ))}
        </select>
      </div>
      
      {/* Comparison charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <PriceChart
          title={`Prix du ${productName} par marché (XAF/sac)`}
          type="bar"
          labels={marketNames}
          datasets={[
            {
              label: 'Prix (XAF)',
              data: prices,
              backgroundColor: 'rgba(16, 185, 129, 0.6)'
            }
          ]}
          height={400}
        />
        
        <PriceChart
          title={`Prix moyen du ${productName} par région (XAF/sac)`}
          type="bar"
          labels={regionNames}
          datasets={[
            {
              label: 'Prix moyen (XAF)',
              data: regionAveragePrices,
              backgroundColor: 'rgba(59, 130, 246, 0.6)'
            }
          ]}
          height={400}
        />
      </div>
      
      {/* Price comparison table */}
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="p-4 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-800">Tableau comparatif des prix du {productName}</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Marché
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Région
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Prix (XAF/sac)
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Différence avec la moyenne
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {validComparisonData.map((item, index) => {
                const difference = item.price - averagePrice;
                const percentDifference = (difference / averagePrice) * 100;

                return (
                  <tr key={index} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {item.market.name}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {item.market.region.name}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {parseFloat(item.price).toLocaleString()} XAF
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        difference > 0 
                          ? 'bg-red-100 text-red-800' 
                          : 'bg-green-100 text-green-800'
                      }`}>
                        {difference > 0 ? '+' : ''}{difference.toFixed(0)} XAF ({percentDifference.toFixed(1)}%)
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default PriceComparison;
