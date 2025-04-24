import React, { useState } from 'react';
import { Info } from 'lucide-react';

const Footer = () => {
  const currentYear = new Date().getFullYear();
  const [showName, setShowName] = useState(false);
  
  return (
    <footer className="bg-white border-t border-gray-200 py-4 relative">
      <style jsx>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(2px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .name-tooltip {
          animation: fadeIn 0.3s ease-out forwards;
        }
      `}</style>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="mb-4 md:mb-0">
            <p className="text-gray-600 text-sm">
              &copy; {currentYear} AgroMarket Tchad. Tous droits réservés.
            </p>
          </div>
          <div className="flex space-x-6">
            <a href="#" className="text-gray-500 hover:text-green-600 text-sm">
              Conditions d'utilisation
            </a>
            <a href="#" className="text-gray-500 hover:text-green-600 text-sm">
              Politique de confidentialité
            </a>
            <a href="#" className="text-gray-500 hover:text-green-600 text-sm">
              Contact
            </a>
          </div>
        </div>
      </div>

      {/* Signature discrète */}
      <div className="absolute bottom-2 right-4 flex items-end gap-1">
        {showName && (
          <span className="name-tooltip text-xs text-gray-400 bg-white px-2 py-1 rounded shadow-sm">
            djongnabe gueyake beni
          </span>
        )}
        <button
          onClick={() => setShowName(!showName)}
          className="text-gray-400 hover:text-gray-600 transition-colors p-1"
          aria-label="Signature"
          title="Signature"
        >
          <Info className="h-3 w-3" />
        </button>
      </div>
    </footer>
  );
};

export default Footer;