import React from 'react';

const Footer = () => {
  const currentYear = new Date().getFullYear();
  
  return (
    <footer className="bg-white border-t border-gray-200 py-4">
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
    </footer>
  );
};

export default Footer;