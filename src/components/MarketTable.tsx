import React from 'react';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';

interface MarketPrice {
  id: string;
  product: string;
  market: string;
  region: string;
  price: number;
  currency: string;
  unit: string;
  change: number;
  date: string;
}

interface MarketTableProps {
  data: MarketPrice[];
  title: string;
}

const MarketTable: React.FC<MarketTableProps> = ({ data, title }) => {
  const getTrendIcon = (change: number) => {
    if (change > 0) {
      return <TrendingUp className="h-4 w-4 text-red-500" />;
    } else if (change < 0) {
      return <TrendingDown className="h-4 w-4 text-green-500" />;
    } else {
      return <Minus className="h-4 w-4 text-gray-500" />;
    }
  };

  const getTrendColor = (change: number) => {
    if (change > 0) {
      return 'text-red-500';
    } else if (change < 0) {
      return 'text-green-500';
    } else {
      return 'text-gray-500';
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      <div className="p-4 border-b border-gray-200">
        <h3 className="text-lg font-semibold text-gray-800">{title}</h3>
      </div>
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Produit
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Marché
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Région
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Prix
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Variation
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Date
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {data.map((item) => (
              <tr key={item.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                  {item.product}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {item.market}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {item.region}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {item.price.toLocaleString()} {item.currency}/{item.unit}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    {getTrendIcon(item.change)}
                    <span className={`ml-1 text-sm ${getTrendColor(item.change)}`}>
                      {item.change > 0 ? '+' : ''}{item.change}%
                    </span>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {item.date}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default MarketTable;