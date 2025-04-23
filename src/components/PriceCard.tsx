import React from 'react';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';

interface PriceCardProps {
  product: string;
  price: number;
  currency: string;
  change: number;
  unit: string;
  market: string;
  date: string;
}

const PriceCard: React.FC<PriceCardProps> = ({
  product,
  price,
  currency,
  change,
  unit,
  market,
  date
}) => {
  const getTrendIcon = () => {
    if (change > 0) {
      return <TrendingUp className="h-5 w-5 text-red-500" />;
    } else if (change < 0) {
      return <TrendingDown className="h-5 w-5 text-green-500" />;
    } else {
      return <Minus className="h-5 w-5 text-gray-500" />;
    }
  };

  const getTrendColor = () => {
    if (change > 0) {
      return 'text-red-500';
    } else if (change < 0) {
      return 'text-green-500';
    } else {
      return 'text-gray-500';
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-4 hover:shadow-lg transition-shadow duration-200">
      <div className="flex justify-between items-start mb-2">
        <h3 className="text-lg font-semibold text-gray-800">{product}</h3>
        <div className="flex items-center">
          {getTrendIcon()}
          <span className={`ml-1 ${getTrendColor()}`}>
            {change > 0 ? '+' : ''}{change}%
          </span>
        </div>
      </div>
      <div className="mb-3">
        <span className="text-2xl font-bold text-gray-900">{price.toLocaleString()} {currency}</span>
        <span className="text-gray-500 text-sm ml-1">/ {unit}</span>
      </div>
      <div className="text-sm text-gray-600">
        <p>Marché: {market}</p>
        <p>Mise à jour: {date}</p>
      </div>
    </div>
  );
};

export default PriceCard;