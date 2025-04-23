import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Menu, X } from 'lucide-react';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="bg-green-700 text-white shadow-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo avec conteneur dédié pour meilleur contrôle */}
          <div className="flex-shrink-0">
            <Link to="/" className="inline-flex items-centr">
              <img 
                src="/logo.png" 
                alt="AgroMarket" 
                className="h-10 w-auto md:h-11 transition-all duration-200 hover:scale-105"
                width={160}
                height={40}
                loading="eager"
              />
            </Link>
          </div>

          {/* Menu desktop - centré avec espacement amélioré */}
          <div className="hidden md:flex flex-1 justify-center items-center space-x-2 lg:space-x-4 ml-4">
            {[
              { path: "/", name: "Tableau de bord" },
              { path: "/market-prices", name: "Prix du marché" },
              { path: "/price-comparison", name: "Comparaison" },
              { path: "/trend-prediction", name: "Prédictions" },
              { path: "/market-analysis", name: "Analyses" }
            ].map((item) => (
              <NavLink 
                key={item.path}
                to={item.path}
                onClick={() => setIsOpen(false)}
              >
                {item.name}
              </NavLink>
            ))}
          </div>

          {/* Bouton connexion séparé */}
          <div className="hidden md:block ml-4">
            <NavLink 
              to="https://agroapi-qwvb.onrender.com/admin"
              className="bg-green-600 hover:bg-green-500 px-4 py-2 rounded-md"
            >
              Se connecter
            </NavLink>
          </div>

          {/* Bouton mobile */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="p-2 rounded-md text-white hover:bg-green-600 focus:outline-none transition-colors"
              aria-label="Menu"
            >
              {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>
      
      {/* Menu mobile optimisé */}
      {isOpen && (
        <div className="md:hidden bg-green-700 transition-all duration-300 ease-in-out">
          <div className="px-2 pt-2 pb-4 space-y-2">
            {[
              { path: "/", name: "Tableau de bord" },
              { path: "/market-prices", name: "Prix du marché" },
              { path: "/price-comparison", name: "Comparaison" },
              { path: "/trend-prediction", name: "Prédictions" },
              { path: "/market-analysis", name: "Analyses" },
              { path: "https://agroapi-qwvb.onrender.com/admin", name: "Se connecter" }
            ].map((item) => (
              <MobileNavLink 
                key={item.path}
                to={item.path}
                onClick={() => setIsOpen(false)}
              >
                {item.name}
              </MobileNavLink>
            ))}
          </div>
        </div>
      )}
    </nav>
  );
};

// Composants réutilisables
const NavLink = ({ to, children, className = '', ...props }) => (
  <Link
    to={to}
    className={`px-3 py-2 rounded-md hover:bg-green-600 transition-colors ${className}`}
    {...props}
  >
    {children}
  </Link>
);

const MobileNavLink = ({ to, children, ...props }) => (
  <Link
    to={to}
    className="block px-3 py-2 rounded-md hover:bg-green-600 transition-colors text-sm"
    {...props}
  >
    {children}
  </Link>
);

export default Navbar;