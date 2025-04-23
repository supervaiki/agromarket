import React from 'react';

interface StatCardProps {
  title: string;
  value: string | number;
  icon: React.ReactNode;
  change?: number;
  changeLabel?: string;
  color?: string;
}

const StatCard: React.FC<StatCardProps> = ({
  title,
  value,
  icon,
  change,
  changeLabel,
  color = 'green'
}) => {
  const getColorClasses = () => {
    switch (color) {
      case 'green':
        return {
          bg: 'bg-green-100',
          text: 'text-green-800',
          icon: 'text-green-600'
        };
      case 'blue':
        return {
          bg: 'bg-blue-100',
          text: 'text-blue-800',
          icon: 'text-blue-600'
        };
      case 'orange':
        return {
          bg: 'bg-orange-100',
          text: 'text-orange-800',
          icon: 'text-orange-600'
        };
      case 'purple':
        return {
          bg: 'bg-purple-100',
          text: 'text-purple-800',
          icon: 'text-purple-600'
        };
      default:
        return {
          bg: 'bg-green-100',
          text: 'text-green-800',
          icon: 'text-green-600'
        };
    }
  };

  const colorClasses = getColorClasses();

  return (
    <div className="bg-white rounded-lg shadow-md p-5 hover:shadow-lg transition-shadow duration-200">
      <div className="flex justify-between items-start">
        <div>
          <p className="text-gray-500 text-sm font-medium">{title}</p>
          <h3 className="text-2xl font-bold mt-1 text-gray-900">{value}</h3>
          
          {change !== undefined && (
            <div className="mt-2 flex items-center">
              <span className={`text-sm font-medium ${change >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                {change >= 0 ? '+' : ''}{change}%
              </span>
              {changeLabel && (
                <span className="text-gray-500 text-xs ml-1">
                  {changeLabel}
                </span>
              )}
            </div>
          )}
        </div>
        
        <div className={`p-3 rounded-full ${colorClasses.bg} ${colorClasses.icon}`}>
          {icon}
        </div>
      </div>
    </div>
  );
};

export default StatCard;