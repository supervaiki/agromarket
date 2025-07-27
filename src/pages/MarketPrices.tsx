import React, { useState, useEffect, useMemo } from 'react';
import {
  Box,
  Container,
  Typography,
  Card,
  CardContent,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Button,
  Chip,
  Alert,
  CircularProgress,
  Grid,
  IconButton,
  Collapse,
  Paper,
  TableContainer,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  TablePagination,
  Tooltip,
  Fab,
  Skeleton,
  useTheme,
  useMediaQuery,
} from '@mui/material';
import {
  FilterList,
  Refresh,
  Download,
  Search,
  Clear,
  ExpandMore,
  ExpandLess,
  PictureAsPdf,
  Image as ImageIcon,
  TableChart,
} from '@mui/icons-material';
import { getRegions, getProducts, getMarketPrices } from '../api/api';
import { Product, MarketPrice, Region } from '../types/types';

const ModernMarketPrices: React.FC = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  // State management
  const [selectedRegion, setSelectedRegion] = useState<string>('all');
  const [selectedProducts, setSelectedProducts] = useState<string[]>([]);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [regions, setRegions] = useState<Region[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [marketPrices, setMarketPrices] = useState<MarketPrice[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState<number>(0);
  const [rowsPerPage, setRowsPerPage] = useState<number>(10);
  const [showFilters, setShowFilters] = useState<boolean>(true);
  const [exportLoading, setExportLoading] = useState<boolean>(false);

  // Filtered data
  const filteredPrices = useMemo(() => {
    return marketPrices.filter((price) => {
      // Region filter
      if (selectedRegion !== 'all' && price.market?.region?.id !== selectedRegion) {
        return false;
      }

      // Product filter
      if (selectedProducts.length > 0 && !selectedProducts.includes('all') && !selectedProducts.includes(price.product?.id)) {
        return false;
      }

      // Search filter
      if (searchTerm) {
        const searchLower = searchTerm.toLowerCase();
        return (
          price.product?.name?.toLowerCase().includes(searchLower) ||
          price.market?.name?.toLowerCase().includes(searchLower) ||
          price.market?.region?.name?.toLowerCase().includes(searchLower) ||
          price.price?.toString().includes(searchTerm) ||
          price.currency?.toLowerCase().includes(searchLower)
        );
      }

      return true;
    });
  }, [marketPrices, selectedRegion, selectedProducts, searchTerm]);

  // Pagination
  const paginatedPrices = useMemo(() => {
    const startIndex = page * rowsPerPage;
    return filteredPrices.slice(startIndex, startIndex + rowsPerPage);
  }, [filteredPrices, page, rowsPerPage]);

  // Data fetching
  useEffect(() => {
    const fetchData = async () => {
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
        console.error('Error fetching data:', err);
        setError('Impossible de charger les données. Veuillez réessayer.');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Reset page when filters change
  useEffect(() => {
    setPage(0);
  }, [selectedRegion, selectedProducts, searchTerm]);

  const handlePageChange = (event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleRowsPerPageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const resetFilters = () => {
    setSelectedRegion('all');
    setSelectedProducts([]);
    setSearchTerm('');
    setPage(0);
  };

  const exportToExcel = async () => {
    setExportLoading(true);
    try {
      const XLSX = await import('xlsx');
      const wb = XLSX.utils.book_new();
      const wsData = [
        ['Produit', 'Marché', 'Région', 'Prix', 'Devise', 'Unité', 'Date'],
        ...filteredPrices.map(price => [
          price.product?.name || '',
          price.market?.name || '',
          price.market?.region?.name || '',
          price.price || 0,
          price.currency || '',
          price.unit || '',
          new Date(price.date).toLocaleDateString('fr-FR')
        ])
      ];

      const ws = XLSX.utils.aoa_to_sheet(wsData);
      XLSX.utils.book_append_sheet(wb, ws, 'Prix du Marché');
      XLSX.writeFile(wb, `prix_marche_${new Date().toISOString().slice(0, 10)}.xlsx`);
    } catch (err) {
      console.error('Export error:', err);
      setError('Erreur lors de l\'export');
    } finally {
      setExportLoading(false);
    }
  };

  if (loading && marketPrices.length === 0) {
    return (
      <Container maxWidth="xl">
        <Box sx={{ py: 4 }}>
          <Skeleton variant="text" height={60} sx={{ mb: 3 }} />
          <Grid container spacing={3}>
            {[1, 2, 3, 4].map((i) => (
              <Grid item xs={12} md={3} key={i}>
                <Skeleton variant="rectangular" height={100} />
              </Grid>
            ))}
          </Grid>
          <Skeleton variant="rectangular" height={400} sx={{ mt: 3 }} />
        </Box>
      </Container>
    );
  }

  return (
    <Container maxWidth="xl">
      <Box sx={{ py: 4 }}>
        {/* Header */}
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 4, flexWrap: 'wrap', gap: 2 }}>
          <Box>
            <Typography variant="h3" sx={{ fontWeight: 700, mb: 1, color: 'primary.main' }}>
              Prix du Marché
            </Typography>
            <Typography variant="body1" color="text.secondary">
              Consultez les prix actuels des produits agricoles par région et marché
            </Typography>
            {filteredPrices.length > 0 && (
              <Chip 
                label={`${filteredPrices.length} résultat${filteredPrices.length > 1 ? 's' : ''}`}
                color="primary"
                size="small"
                sx={{ mt: 1 }}
              />
            )}
          </Box>
          
          <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
            <Button
              variant="outlined"
              startIcon={<FilterList />}
              onClick={() => setShowFilters(!showFilters)}
              size={isMobile ? 'small' : 'medium'}
            >
              {showFilters ? 'Masquer' : 'Filtres'}
            </Button>
            <Button
              variant="outlined"
              startIcon={<Refresh />}
              onClick={() => window.location.reload()}
              size={isMobile ? 'small' : 'medium'}
            >
              Actualiser
            </Button>
            <Button
              variant="contained"
              startIcon={exportLoading ? <CircularProgress size={16} /> : <TableChart />}
              onClick={exportToExcel}
              disabled={exportLoading || filteredPrices.length === 0}
              size={isMobile ? 'small' : 'medium'}
            >
              Export Excel
            </Button>
          </Box>
        </Box>

        {/* Error Alert */}
        {error && (
          <Alert severity="error" sx={{ mb: 3 }} onClose={() => setError(null)}>
            {error}
          </Alert>
        )}

        {/* Filters */}
        <Collapse in={showFilters}>
          <Card sx={{ mb: 3 }}>
            <CardContent>
              <Typography variant="h6" sx={{ mb: 2, display: 'flex', alignItems: 'center' }}>
                <FilterList sx={{ mr: 1 }} />
                Filtres de recherche
              </Typography>
              
              <Grid container spacing={3}>
                {/* Search */}
                <Grid item xs={12} md={4}>
                  <TextField
                    fullWidth
                    label="Rechercher"
                    placeholder="Produit, marché, région..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    InputProps={{
                      startAdornment: <Search sx={{ mr: 1, color: 'text.secondary' }} />,
                      endAdornment: searchTerm && (
                        <IconButton size="small" onClick={() => setSearchTerm('')}>
                          <Clear />
                        </IconButton>
                      )
                    }}
                  />
                </Grid>

                {/* Region Filter */}
                <Grid item xs={12} md={4}>
                  <FormControl fullWidth>
                    <InputLabel>Région</InputLabel>
                    <Select
                      value={selectedRegion}
                      label="Région"
                      onChange={(e) => setSelectedRegion(e.target.value)}
                    >
                      {regions.map((region) => (
                        <MenuItem key={region.id} value={region.id}>
                          {region.name}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>

                {/* Product Filter */}
                <Grid item xs={12} md={4}>
                  <FormControl fullWidth>
                    <InputLabel>Produits</InputLabel>
                    <Select
                      multiple
                      value={selectedProducts}
                      label="Produits"
                      onChange={(e) => setSelectedProducts(typeof e.target.value === 'string' ? e.target.value.split(',') : e.target.value)}
                      renderValue={(selected) => (
                        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                          {selected.map((value) => {
                            const product = products.find(p => p.id === value);
                            return (
                              <Chip
                                key={value}
                                label={product?.name || value}
                                size="small"
                                onDelete={() => setSelectedProducts(prev => prev.filter(p => p !== value))}
                              />
                            );
                          })}
                        </Box>
                      )}
                    >
                      {products.map((product) => (
                        <MenuItem key={product.id} value={product.id}>
                          {product.name}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>
              </Grid>

              {/* Reset Filters */}
              {(selectedRegion !== 'all' || selectedProducts.length > 0 || searchTerm) && (
                <Box sx={{ mt: 2, display: 'flex', justifyContent: 'flex-end' }}>
                  <Button
                    startIcon={<Clear />}
                    onClick={resetFilters}
                    size="small"
                    color="error"
                  >
                    Réinitialiser les filtres
                  </Button>
                </Box>
              )}
            </CardContent>
          </Card>
        </Collapse>

        {/* Data Table */}
        <Card>
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell sx={{ fontWeight: 600 }}>Produit</TableCell>
                  <TableCell sx={{ fontWeight: 600 }}>Marché</TableCell>
                  <TableCell sx={{ fontWeight: 600 }}>Région</TableCell>
                  <TableCell sx={{ fontWeight: 600 }} align="right">Prix</TableCell>
                  <TableCell sx={{ fontWeight: 600 }}>Devise</TableCell>
                  <TableCell sx={{ fontWeight: 600 }}>Unité</TableCell>
                  <TableCell sx={{ fontWeight: 600 }}>Date</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {loading ? (
                  Array.from({ length: rowsPerPage }).map((_, index) => (
                    <TableRow key={index}>
                      {Array.from({ length: 7 }).map((_, cellIndex) => (
                        <TableCell key={cellIndex}>
                          <Skeleton />
                        </TableCell>
                      ))}
                    </TableRow>
                  ))
                ) : paginatedPrices.length > 0 ? (
                  paginatedPrices.map((price, index) => (
                    <TableRow 
                      key={`${price.id}-${index}`}
                      hover
                      sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                    >
                      <TableCell sx={{ fontWeight: 500 }}>
                        {price.product?.name || 'N/A'}
                      </TableCell>
                      <TableCell>
                        {price.market?.name || 'N/A'}
                      </TableCell>
                      <TableCell>
                        {price.market?.region?.name || 'N/A'}
                      </TableCell>
                      <TableCell align="right" sx={{ fontWeight: 500 }}>
                        {price.price ? Number(price.price).toLocaleString('fr-FR') : 'N/A'}
                      </TableCell>
                      <TableCell>
                        <Chip 
                          label={price.currency || 'N/A'} 
                          size="small" 
                          variant="outlined"
                        />
                      </TableCell>
                      <TableCell>
                        {price.unit || 'N/A'}
                      </TableCell>
                      <TableCell>
                        {price.date ? new Date(price.date).toLocaleDateString('fr-FR') : 'N/A'}
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={7} align="center" sx={{ py: 4 }}>
                      <Typography variant="body1" color="text.secondary">
                        {searchTerm || selectedRegion !== 'all' || selectedProducts.length > 0
                          ? 'Aucun résultat trouvé avec les filtres actuels'
                          : 'Aucune donnée disponible'}
                      </Typography>
                      {(searchTerm || selectedRegion !== 'all' || selectedProducts.length > 0) && (
                        <Button 
                          onClick={resetFilters} 
                          sx={{ mt: 1 }}
                          size="small"
                        >
                          Réinitialiser les filtres
                        </Button>
                      )}
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>
          
          {/* Pagination */}
          <TablePagination
            rowsPerPageOptions={[5, 10, 25, 50]}
            component="div"
            count={filteredPrices.length}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handlePageChange}
            onRowsPerPageChange={handleRowsPerPageChange}
            labelRowsPerPage="Lignes par page:"
            labelDisplayedRows={({ from, to, count }) => `${from}-${to} sur ${count}`}
          />
        </Card>
      </Box>
    </Container>
  );
};

export default ModernMarketPrices;