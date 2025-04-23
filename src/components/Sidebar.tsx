import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, 
  TrendingUp, 
  BarChart, 
  LineChart, 
  PieChart,
  Map,
  Settings,
  HelpCircle
} from 'lucide-react';

const Sidebar = () => {
  const location = useLocation();
  
  const isActive = (path: string) => {
    return location.pathname === path;
  };

  return (
    <aside className="hidden md:flex flex-col w-64 bg-white border-r border-gray-200 shadow-sm">
      <div className="p-4 border-b border-gray-200">
        <h2 className="text-lg font-semibold text-gray-800">Navigation</h2>
      </div>
      <nav className="flex-1 overflow-y-auto p-4">
        <ul className="space-y-2">
          <li>
            <Link 
              to="/" 
              className={`flex items-center p-2 rounded-md ${
                isActive('/') 
                  ? 'bg-green-100 text-green-700' 
                  : 'text-gray-700 hover:bg-gray-100'
              }`}
            >
              <LayoutDashboard className="h-5 w-5 mr-3" />
              <span>Tableau de bord</span>
            </Link>
          </li>
          <li>
            <Link 
              to="/market-prices" 
              className={`flex items-center p-2 rounded-md ${
                isActive('/market-prices') 
                  ? 'bg-green-100 text-green-700' 
                  : 'text-gray-700 hover:bg-gray-100'
              }`}
            >
              <BarChart className="h-5 w-5 mr-3" />
              <span>Prix du marché</span>
            </Link>
          </li>
          <li>
            <Link 
              to="/price-comparison" 
              className={`flex items-center p-2 rounded-md ${
                isActive('/price-comparison') 
                  ? 'bg-green-100 text-green-700' 
                  : 'text-gray-700 hover:bg-gray-100'
              }`}
            >
              <LineChart className="h-5 w-5 mr-3" />
              <span>Comparaison</span>
            </Link>
          </li>
          <li>
            <Link 
              to="/trend-prediction" 
              className={`flex items-center p-2 rounded-md ${
                isActive('/trend-prediction') 
                  ? 'bg-green-100 text-green-700' 
                  : 'text-gray-700 hover:bg-gray-100'
              }`}
            >
              <TrendingUp className="h-5 w-5 mr-3" />
              <span>Prédictions</span>
            </Link>
          </li>
          <li>
            <Link 
              to="/market-analysis" 
              className={`flex items-center p-2 rounded-md ${
                isActive('/market-analysis') 
                  ? 'bg-green-100 text-green-700' 
                  : 'text-gray-700 hover:bg-gray-100'
              }`}
            >
              <PieChart className="h-5 w-5 mr-3" />
              <span>Analyses</span>
            </Link>
          </li>
        </ul>
        
        
      </nav>
    </aside>
  );
};

export default Sidebar;