import React, { useState, useEffect, useMemo } from 'react';
import { getRegions, getProducts, getMarketPrices } from '../api/api';
import { Product, MarketPrice, Region } from '../types/types';
import { ChevronLeft, ChevronRight, RefreshCcw, Download, Filter, X } from 'lucide-react';
import { jsPDF } from 'jspdf';
import "jspdf-autotable";
import html2canvas from 'html2canvas';
import { saveAs } from 'file-saver';
import * as XLSX from 'xlsx';

interface MarketPricesProps {}

const MarketPrices: React.FC<MarketPricesProps> = () => {
  // États
  const [selectedRegion, setSelectedRegion] = useState<string>('all');
  const [selectedProducts, setSelectedProducts] = useState<string[]>([]);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [regions, setRegions] = useState<Region[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [marketPrices, setMarketPrices] = useState<MarketPrice[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [exportLoading, setExportLoading] = useState<boolean>(false);
  const [showFilters, setShowFilters] = useState<boolean>(true);
  const itemsPerPage = 10;

  // Filtrage des prix
  const filteredPrices = useMemo(() => {
    return marketPrices.filter((price) => {
      // Filtre par région
      if (selectedRegion !== 'all' && price.market.region.id !== selectedRegion) {
        return false;
      }
  
      // Filtre par produits
      if (selectedProducts.length > 0 && !selectedProducts.includes('all') && !selectedProducts.includes(price.product.id)) {
        return false;
      }
  
      // Filtre par terme de recherche
      if (searchTerm) {
        const searchLower = searchTerm.toLowerCase();
        return (
          price.product.name.toLowerCase().includes(searchLower) ||
          price.market.name.toLowerCase().includes(searchLower) ||
          price.market.region.name.toLowerCase().includes(searchLower) ||
          price.price.toString().includes(searchTerm) ||
          price.currency.toLowerCase().includes(searchLower)
        );
      }
  
      return true;
    });
  }, [marketPrices, selectedRegion, selectedProducts, searchTerm]);

  // Pagination
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedPrices = filteredPrices.slice(startIndex, startIndex + itemsPerPage);
  const totalPages = Math.ceil(filteredPrices.length / itemsPerPage);
  const totalItems = filteredPrices.length;

  // Chargement des données initiales
  useEffect(() => {
    const fetchInitialData = async () => {
      setLoading(true);
      setError(null);
      
      try {
        const [regionsData, productsData, pricesData] = await Promise.all([
          getRegions(),
          getProducts(),
          getMarketPrices()
        ]);
        
        setRegions([{ id: 'all', name: 'Toutes les régions' }, ...regionsData]);
        setProducts([{ id: 'all', name: 'Tous les produits' }, ...productsData]);
        setMarketPrices(pricesData);
      } catch (err) {
        console.error('Erreur lors de la récupération des données :', err);
        setError('Impossible de charger les données. Veuillez réessayer plus tard.');
      } finally {
        setLoading(false);
      }
    };

    fetchInitialData();
  }, []);

  // Réinitialiser la page quand les filtres changent
  useEffect(() => {
    setCurrentPage(1);
  }, [selectedRegion, selectedProducts, searchTerm]);

  // Export en PDF
  const exportToPDF = async () => {
    setExportLoading(true);
    try {
      const input = document.getElementById('market-prices-table');
      if (!input) throw new Error("Élément tableau introuvable");
  
      // Préparation des données
      const dateStr = new Date().toLocaleDateString('fr-FR', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
      
      const regionName = regions.find(r => r.id === selectedRegion)?.name || 'Toutes régions';
      const productsList = selectedProducts.includes('all') 
        ? 'Tous produits' 
        : selectedProducts.map(id => products.find(p => p.id === id)?.name).join(', ');
  
      // Création du conteneur d'export
      const exportContainer = document.createElement('div');
      exportContainer.style.width = '1000px';
      exportContainer.style.padding = '20px';
      exportContainer.style.backgroundColor = 'white';
      exportContainer.style.fontFamily = 'Arial, sans-serif';
  
      // En-tête avec logo
      const header = document.createElement('div');
      header.style.display = 'flex';
      header.style.marginBottom = '20px';
      header.style.alignItems = 'center';
  
      // Logo (remplacez par votre chemin)
      const logoImg = document.createElement('img');
      logoImg.src = '/log.png';
      logoImg.style.height = '60px';
      logoImg.style.width = 'auto';
      logoImg.style.marginRight = '20px';
      logoImg.alt = 'Logo AgroMarket';
      header.appendChild(logoImg);
  
      // Titres
      const titleContainer = document.createElement('div');
      const mainTitle = document.createElement('h1');
      mainTitle.textContent = 'Rapport des Prix du Marché';
      mainTitle.style.color = '#228B22';
      mainTitle.style.fontSize = '22px';
      mainTitle.style.margin = '0 0 5px 0';
      mainTitle.style.fontWeight = 'bold';
  
      const subTitle = document.createElement('div');
      subTitle.style.fontSize = '12px';
      subTitle.style.color = '#555';
      subTitle.innerHTML = `
        <div><strong>Date :</strong> ${dateStr}</div>
        <div><strong>Région :</strong> ${regionName}</div>
        <div><strong>Produits :</strong> ${productsList}</div>
      `;
  
      titleContainer.appendChild(mainTitle);
      titleContainer.appendChild(subTitle);
      header.appendChild(titleContainer);
      exportContainer.appendChild(header);
  
      // Tableau
      const tableClone = input.cloneNode(true) as HTMLElement;
      tableClone.style.width = '100%';
      tableClone.style.borderCollapse = 'collapse';
      tableClone.style.margin = '15px 0';
  
      // Style du tableau
      Array.from(tableClone.getElementsByTagName('th')).forEach(th => {
        th.style.backgroundColor = '#228B22';
        th.style.color = 'white';
        th.style.padding = '8px';
        th.style.textAlign = 'left';
      });
  
      Array.from(tableClone.getElementsByTagName('td')).forEach(td => {
        td.style.padding = '6px 8px';
        td.style.borderBottom = '1px solid #ddd';
      });
  
      exportContainer.appendChild(tableClone);
  
      // Pied de page
      const footer = document.createElement('div');
      footer.style.marginTop = '20px';
      footer.style.paddingTop = '10px';
      footer.style.borderTop = '1px solid #eee';
      footer.style.fontSize = '10px';
      footer.style.color = '#777';
      footer.style.textAlign = 'center';
      footer.textContent = `© ${new Date().getFullYear()} AgroMarket - Document généré le ${new Date().toLocaleString('fr-FR')}`;
      exportContainer.appendChild(footer);
  
      // Conversion en PDF
      const tempContainer = document.createElement('div');
      tempContainer.style.position = 'fixed';
      tempContainer.style.left = '-9999px';
      tempContainer.appendChild(exportContainer);
      document.body.appendChild(tempContainer);
  
      const canvas = await html2canvas(exportContainer, {
        scale: 2,
        logging: false,
        useCORS: true,
        scrollX: 0,
        scrollY: 0,
        backgroundColor: 'white'
      });
  
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF({
        orientation: 'landscape',
        unit: 'mm'
      });
  
      const imgProps = pdf.getImageProperties(imgData);
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;
  
      pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
      pdf.save(`prix_marche_${new Date().toISOString().slice(0, 10)}.pdf`);
  
      // Nettoyage
      document.body.removeChild(tempContainer);
    } catch (err) {
      console.error("Erreur lors de l'export PDF:", err);
      setError(`Erreur lors de la génération du PDF: ${err instanceof Error ? err.message : 'Erreur inconnue'}`);
    } finally {
      setExportLoading(false);
    }
  };

  // Export en PNG
  const exportToPNG = async () => {
    setExportLoading(true);
    try {
      const input = document.getElementById('market-prices-table');
      if (!input) throw new Error("Élément tableau introuvable");
      
      const tableClone = input.cloneNode(true) as HTMLElement;
      
      // Création d'un conteneur pour l'export
      const exportContainer = document.createElement('div');
      exportContainer.style.padding = '20px';
      exportContainer.style.backgroundColor = 'white';
      exportContainer.style.maxWidth = '1000px';
      exportContainer.style.margin = '0 auto';
      
      // Création de l'en-tête avec logo et titre
      const header = document.createElement('div');
      header.style.display = 'flex';
      header.style.alignItems = 'center';
      header.style.marginBottom = '20px';
      header.style.borderBottom = '1px solid #eee';
      header.style.paddingBottom = '20px';
      
      // Ajout du logo
      const logoContainer = document.createElement('div');
      logoContainer.style.marginRight = '20px';
      
      const logoImg = document.createElement('img');
      logoImg.src = '/log.png';
      logoImg.style.height = '60px';
      logoImg.style.width = 'auto';
      logoImg.alt = 'AgroMarket Logo';
      logoContainer.appendChild(logoImg);
      header.appendChild(logoContainer);
      
      // Ajout des titres
      const titleContainer = document.createElement('div');
      titleContainer.style.flex = '1';
      
      const mainTitle = document.createElement('h1');
      mainTitle.textContent = 'Rapport des Prix du Marché';
      mainTitle.style.fontSize = '24px';
      mainTitle.style.fontWeight = 'bold';
      mainTitle.style.marginBottom = '5px';
      mainTitle.style.color = '#228B22';
      
      const subTitle = document.createElement('div');
      subTitle.style.fontSize = '14px';
      subTitle.style.color = '#666';
      subTitle.innerHTML = `
        <div><strong>Date :</strong> ${new Date().toLocaleDateString('fr-FR', { 
          weekday: 'long', 
          year: 'numeric', 
          month: 'long', 
          day: 'numeric' 
        })}</div>
        <div><strong>Région :</strong> ${regions.find(r => r.id === selectedRegion)?.name || 'Toutes régions'}</div>
        <div><strong>Produits :</strong> ${selectedProducts.includes('all') 
          ? 'Tous produits' 
          : selectedProducts.map(id => products.find(p => p.id === id)?.name).join(', ')}</div>
      `;
      
      titleContainer.appendChild(mainTitle);
      titleContainer.appendChild(subTitle);
      header.appendChild(titleContainer);
      
      exportContainer.appendChild(header);
      exportContainer.appendChild(tableClone);
      
      // Style amélioré du tableau cloné
      tableClone.style.width = '100%';
      tableClone.style.borderCollapse = 'collapse';
      tableClone.style.fontFamily = 'Arial, sans-serif';
      
      Array.from(tableClone.getElementsByTagName('th')).forEach(th => {
        th.style.backgroundColor = '#228B22';
        th.style.color = 'white';
        th.style.padding = '10px';
        th.style.textAlign = 'left';
      });
      
      Array.from(tableClone.getElementsByTagName('td')).forEach(td => {
        td.style.padding = '8px 10px';
        td.style.borderBottom = '1px solid #eee';
      });
      
      // Ajout du pied de page
      const footer = document.createElement('div');
      footer.style.marginTop = '20px';
      footer.style.paddingTop = '10px';
      footer.style.borderTop = '1px solid #eee';
      footer.style.fontSize = '12px';
      footer.style.color = '#999';
      footer.style.textAlign = 'center';
      footer.textContent = `© ${new Date().getFullYear()} AgroMarket - Données mises à jour le ${new Date().toLocaleDateString('fr-FR')}`;
      
      exportContainer.appendChild(footer);
      
      // Ajout temporaire au DOM
      const tempContainer = document.createElement('div');
      tempContainer.style.position = 'fixed';
      tempContainer.style.left = '-9999px';
      tempContainer.appendChild(exportContainer);
      document.body.appendChild(tempContainer);
      
      // Capture avec html2canvas
      const canvas = await html2canvas(exportContainer, {
        scale: 2,
        logging: false,
        useCORS: true,
        scrollX: 0,
        scrollY: 0,
        backgroundColor: 'white'
      });
      
      // Conversion et sauvegarde
      canvas.toBlob((blob) => {
        if (blob) {
          saveAs(blob, `prix_marche_${new Date().toISOString().slice(0, 10)}.png`);
        }
      }, 'image/png', 0.95);
      
      // Nettoyage
      document.body.removeChild(tempContainer);
    } catch (err) {
      console.error("Erreur lors de l'export PNG:", err);
      setError(`Une erreur est survenue lors de l'export : ${err instanceof Error ? err.message : 'Erreur inconnue'}`);
    } finally {
      setExportLoading(false);
    }
  };

  // Réinitialiser les filtres
  const resetFilters = () => {
    setSelectedRegion('all');
    setSelectedProducts([]);
    setSearchTerm('');
    setCurrentPage(1);
  };

  return (
    <div className="space-y-6 p-4 bg-gray-50 min-h-screen">
      {/* Bannière d'information */}
      <div className="bg-white p-4 rounded-md shadow-md">
        <p className="text-gray-700 text-sm">
          Utilisez les filtres ci-dessous pour affiner votre recherche. Par défaut, toutes les régions et tous les produits sont affichés. Les prix sont exprimés par "Sac".
        </p>
      </div>

      {/* En-tête avec titre et boutons */}
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-4 rounded-md shadow-md">
        <div className="flex items-center space-x-4">
          <h1 className="text-2xl font-bold text-gray-900 flex items-center">
            <Filter className="mr-2 h-6 w-6 text-green-600" />
            Prix du Marché
          </h1>
          {totalItems > 0 && (
            <span className="px-3 py-1 bg-green-100 text-green-800 text-sm rounded-full">
              {totalItems} résultat{totalItems > 1 ? 's' : ''}
            </span>
          )}
        </div>
        
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 shadow-md flex items-center"
            aria-label="Actualiser les données"
          >
            <RefreshCcw className="mr-2 h-5 w-5" />
            Actualiser
          </button>
          
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 shadow-md flex items-center"
            aria-label={showFilters ? "Masquer les filtres" : "Afficher les filtres"}
          >
            {showFilters ? (
              <>
                <X className="mr-2 h-5 w-5" />
                Masquer les filtres
              </>
            ) : (
              <>
                <Filter className="mr-2 h-5 w-5" />
                Afficher les filtres
              </>
            )}
          </button>
          
          {/* Boutons d'export */}
          <div className="flex gap-2">
            <button
              onClick={exportToPDF}
              disabled={exportLoading || filteredPrices.length === 0}
              className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 shadow-md flex items-center transition-colors disabled:opacity-50"
              aria-label="Exporter en PDF"
            >
              {exportLoading ? (
                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
              ) : (
                <Download className="mr-2 h-4 w-4" />
              )}
              Export PDF
            </button>

            <button
              onClick={exportToPNG}
              disabled={exportLoading || filteredPrices.length === 0}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 shadow-md flex items-center transition-colors disabled:opacity-50"
              aria-label="Exporter en image PNG"
            >
              {exportLoading ? (
                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
              ) : (
                <Download className="mr-2 h-4 w-4" />
              )}
              Export Image
            </button>
          </div>
        </div>
      </header>

      {/* Filtres */}
      {showFilters && (
        <section aria-labelledby="filters-heading" className="bg-white p-4 rounded-md shadow-md space-y-4">
          <h2 id="filters-heading" className="sr-only">Filtres de recherche</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Filtre région */}
            <div>
              <label htmlFor="region-select" className="block text-sm font-medium text-gray-700 mb-2">
                Région
              </label>
              <select
                id="region-select"
                value={selectedRegion}
                onChange={(e) => setSelectedRegion(e.target.value)}
                className="block w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-1 focus:ring-green-500 focus:border-green-500 sm:text-sm"
                aria-label="Sélectionner une région"
              >
                {regions.map((region) => (
                  <option key={region.id} value={region.id}>
                    {region.name}
                  </option>
                ))}
              </select>
            </div>
            
            {/* Filtre produits */}
            <div className="col-span-2">
              <div className="flex justify-between items-center mb-2">
                <label htmlFor="product-select" className="block text-sm font-medium text-gray-700">
                  Produits
                </label>
                {selectedProducts.length > 0 && (
                  <button
                    onClick={() => setSelectedProducts([])}
                    className="text-xs text-red-600 hover:text-red-800 focus:outline-none"
                    aria-label="Désélectionner tous les produits"
                  >
                    Tout désélectionner
                  </button>
                )}
              </div>
              <select
                id="product-select"
                multiple
                value={selectedProducts}
                onChange={(e) => {
                  const options = Array.from(e.target.selectedOptions);
                  const selectedValues = options.map((option) => option.value);
                  setSelectedProducts(selectedValues);
                }}
                className="block w-full px-4 py-3 border border-gray-300 rounded-md focus:ring-1 focus:ring-green-500 focus:border-green-500 sm:text-sm h-auto min-h-[100px] overflow-y-auto"
                size={5}
                aria-describedby="product-help"
                aria-multiselectable="true"
              >
                {products.map((product) => (
                  <option key={product.id} value={product.id} className="p-2 hover:bg-gray-100">
                    {product.name}
                  </option>
                ))}
              </select>
              <p id="product-help" className="mt-1 text-xs text-gray-500">
                Maintenez Ctrl (Windows) ou Commande (Mac) pour sélectionner plusieurs produits
              </p>
            </div>
          </div>
          
          {/* Barre de recherche */}
          <div>
            <label htmlFor="search-input" className="block text-sm font-medium text-gray-700 mb-2">
              Recherche
            </label>
            <input
              id="search-input"
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Rechercher par produit, marché, région, prix..."
              className="block w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-1 focus:ring-green-500 focus:border-green-500 sm:text-sm"
              aria-label="Rechercher dans les prix du marché"
            />
          </div>
          
          {/* Bouton réinitialiser */}
          {(selectedRegion !== 'all' || selectedProducts.length > 0 || searchTerm) && (
            <div className="flex justify-end">
              <button
                onClick={resetFilters}
                className="px-3 py-1 text-sm text-red-600 hover:text-red-800 flex items-center focus:outline-none"
                aria-label="Réinitialiser tous les filtres"
              >
                <X className="mr-1 h-4 w-4" />
                Réinitialiser les filtres
              </button>
            </div>
          )}
        </section>
      )}

      {/* Résultats */}
      {loading ? (
        <div 
          role="status" 
          aria-live="polite" 
          className="text-center py-8"
        >
          <div 
            className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto" 
            aria-hidden="true"
          />
          <p className="mt-4 text-gray-600">Chargement des données en cours...</p>
        </div>
      ) : error ? (
        <div 
          role="alert" 
          aria-live="assertive" 
          className="bg-red-50 border-l-4 border-red-500 p-4 rounded-md"
        >
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-red-500" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-sm text-red-700">{error}</p>
            </div>
          </div>
        </div>
      ) : paginatedPrices.length > 0 ? (
        <>
          <div className="overflow-x-auto bg-white rounded-md shadow-md">
            <table 
              id="market-prices-table" 
              className="min-w-full divide-y divide-gray-200"
              aria-label="Liste des prix du marché"
            >
              <caption className="sr-only">Prix du marché par produit, marché et région</caption>
              <thead className="bg-green-600">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">
                    Produit
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">
                    Marché
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">
                    Région
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">
                    Prix/Sac
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">
                    Devise
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {paginatedPrices.map((price, index) => (
                  <tr 
                    key={`${price.product.id}-${price.market.id}-${price.date}`} 
                    className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}
                  >
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {price.product.name}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {price.market.name}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {price.market.region.name}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {Number(price.price).toLocaleString('fr-FR')}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {price.currency}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <nav 
            className="flex flex-col sm:flex-row justify-between items-center bg-white p-4 rounded-md shadow-md"
            aria-label="Pagination"
          >
            <div className="mb-2 sm:mb-0">
              <p className="text-sm text-gray-700">
                Affichage de <span className="font-medium">{startIndex + 1}</span> à{' '}
                <span className="font-medium">
                  {Math.min(startIndex + itemsPerPage, totalItems)}
                </span> sur <span className="font-medium">{totalItems}</span> résultats
              </p>
            </div>
            
            <div className="flex space-x-2">
              <button
                disabled={currentPage === 1}
                onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                className={`px-3 py-1 rounded-md flex items-center ${
                  currentPage === 1
                    ? 'bg-gray-200 text-gray-500 cursor-not-allowed'
                    : 'bg-green-600 text-white hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500'
                }`}
                aria-label="Page précédente"
              >
                <ChevronLeft className="h-4 w-4 mr-1" />
                <span className="text-sm">Précédent</span>
              </button>
              
              <div className="flex overflow-x-auto">
                {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                  let pageNum;
                  if (totalPages <= 5) {
                    pageNum = i + 1;
                  } else if (currentPage <= 3) {
                    pageNum = i + 1;
                  } else if (currentPage >= totalPages - 2) {
                    pageNum = totalPages - 4 + i;
                  } else {
                    pageNum = currentPage - 2 + i;
                  }
                  
                  return (
                    <button
                      key={pageNum}
                      onClick={() => setCurrentPage(pageNum)}
                      className={`px-3 py-1 mx-1 rounded-md text-sm ${
                        currentPage === pageNum
                          ? 'bg-green-600 text-white font-medium focus:outline-none focus:ring-2 focus:ring-green-500'
                          : 'bg-gray-200 text-gray-700 hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-500'
                      }`}
                      aria-label={`Page ${pageNum}`}
                      aria-current={currentPage === pageNum ? 'page' : undefined}
                    >
                      {pageNum}
                    </button>
                  );
                })}
                
                {totalPages > 5 && currentPage < totalPages - 2 && (
                  <span className="px-2 py-1 mx-1">...</span>
                )}
                
                {totalPages > 5 && currentPage < totalPages - 2 && (
                  <button
                    onClick={() => setCurrentPage(totalPages)}
                    className="px-3 py-1 mx-1 rounded-md bg-gray-200 text-gray-700 hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-500 text-sm"
                    aria-label={`Dernière page (${totalPages})`}
                  >
                    {totalPages}
                  </button>
                )}
              </div>
              
              <button
                disabled={currentPage === totalPages || totalPages === 0}
                onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                className={`px-3 py-1 rounded-md flex items-center ${
                  currentPage === totalPages || totalPages === 0
                    ? 'bg-gray-200 text-gray-500 cursor-not-allowed'
                    : 'bg-green-600 text-white hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500'
                }`}
                aria-label="Page suivante"
              >
                <span className="text-sm">Suivant</span>
                <ChevronRight className="h-4 w-4 ml-1" />
              </button>
            </div>
          </nav>
        </>
      ) : (
        <div 
          role="status"
          aria-live="polite"
          className="bg-white p-8 rounded-md shadow-md text-center"
        >
          <svg 
            className="mx-auto h-12 w-12 text-gray-400" 
            fill="none" 
            viewBox="0 0 24 24" 
            stroke="currentColor"
            aria-hidden="true"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <h3 className="mt-2 text-lg font-medium text-gray-900">Aucun résultat trouvé</h3>
          <p className="mt-1 text-sm text-gray-500">
            {searchTerm || selectedRegion !== 'all' || selectedProducts.length > 0
              ? "Essayez d'ajuster vos filtres de recherche."
              : "Aucune donnée disponible pour le moment."}
          </p>
          {(searchTerm || selectedRegion !== 'all' || selectedProducts.length > 0) && (
            <div className="mt-6">
              <button
                onClick={resetFilters}
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                aria-label="Réinitialiser tous les filtres"
              >
                Réinitialiser tous les filtres
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default MarketPrices;