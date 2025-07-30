import React, { useState } from 'react';
import {
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
  Avatar,
  Button,
  TextField,
  MenuItem,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Alert,
} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Save as SaveIcon,
  Cancel as CancelIcon,
  Store as StoreIcon,
  TrendingUp as TrendingUpIcon,
  Assessment as AssessmentIcon,
  Notifications as NotificationsIcon,
} from '@mui/icons-material';
import { motion } from 'framer-motion';
import { useAuth } from '../hooks/useAuth';
import { AgentStats, Product, Market } from '../types/types';

const AgentDashboard: React.FC = () => {
  const { user } = useAuth();
  const [openPriceDialog, setOpenPriceDialog] = useState(false);
  const [editingPrice, setEditingPrice] = useState<any>(null);
  
  const [stats] = useState<AgentStats>({
    assignedMarkets: 3,
    priceUpdatesThisMonth: 87,
    pendingReports: 5,
    lastUpdateDate: '2024-01-15T10:30:00Z',
  });

  const [priceForm, setPriceForm] = useState({
    product: '',
    market: '',
    price: '',
    unit: 'kg',
  });

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.5,
        ease: 'easeOut',
      },
    },
  };

  const StatCard = ({ 
    title, 
    value, 
    icon, 
    color, 
    subtitle 
  }: {
    title: string;
    value: string | number;
    icon: React.ReactNode;
    color: string;
    subtitle?: string;
  }) => (
    <motion.div variants={itemVariants}>
      <Card
        sx={{
          height: '100%',
          background: `linear-gradient(135deg, ${color}15, ${color}05)`,
          border: `1px solid ${color}30`,
          borderRadius: 3,
          overflow: 'hidden',
          '&:hover': {
            transform: 'translateY(-2px)',
            transition: 'transform 0.3s ease',
            boxShadow: '0 8px 25px rgba(0,0,0,0.15)',
          },
        }}
      >
        <CardContent sx={{ p: 3 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <Box>
              <Typography variant="h4" fontWeight="bold" color={color}>
                {value}
              </Typography>
              <Typography variant="body2" color="text.secondary" fontWeight="medium">
                {title}
              </Typography>
              {subtitle && (
                <Typography variant="caption" color="text.secondary">
                  {subtitle}
                </Typography>
              )}
            </Box>
            <Avatar
              sx={{
                bgcolor: color,
                width: 56,
                height: 56,
              }}
            >
              {icon}
            </Avatar>
          </Box>
        </CardContent>
      </Card>
    </motion.div>
  );

  const recentPrices = [
    { id: 1, product: 'Tomates', market: 'Marché Central', price: 2500, unit: 'kg', date: '2024-01-15', status: 'confirmed' },
    { id: 2, product: 'Oignons', market: 'Marché Central', price: 1800, unit: 'kg', date: '2024-01-15', status: 'pending' },
    { id: 3, product: 'Pommes de terre', market: 'Marché Nord', price: 1200, unit: 'kg', date: '2024-01-14', status: 'confirmed' },
    { id: 4, product: 'Carottes', market: 'Marché Nord', price: 1500, unit: 'kg', date: '2024-01-14', status: 'confirmed' },
  ];

  const products = [
    { id: 1, name: 'Tomates' },
    { id: 2, name: 'Oignons' },
    { id: 3, name: 'Pommes de terre' },
    { id: 4, name: 'Carottes' },
    { id: 5, name: 'Choux' },
  ];

  const markets = [
    { id: 1, name: 'Marché Central' },
    { id: 2, name: 'Marché Nord' },
    { id: 3, name: 'Marché Sud' },
  ];

  const handleAddPrice = () => {
    setEditingPrice(null);
    setPriceForm({ product: '', market: '', price: '', unit: 'kg' });
    setOpenPriceDialog(true);
  };

  const handleEditPrice = (price: any) => {
    setEditingPrice(price);
    setPriceForm({
      product: price.product,
      market: price.market,
      price: price.price.toString(),
      unit: price.unit,
    });
    setOpenPriceDialog(true);
  };

  const handleSavePrice = () => {
    // Here you would normally save to the API
    console.log('Saving price:', priceForm);
    setOpenPriceDialog(false);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('fr-FR');
  };

  const formatTime = (dateString: string) => {
    return new Date(dateString).toLocaleTimeString('fr-FR', { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  return (
    <Box sx={{ p: 3 }}>
      <motion.div
        initial="hidden"
        animate="visible"
        variants={containerVariants}
      >
        {/* Header */}
        <motion.div variants={itemVariants}>
          <Box sx={{ mb: 4 }}>
            <Typography variant="h4" fontWeight="bold" gutterBottom>
              Tableau de bord Agent
            </Typography>
            <Typography variant="body1" color="text.secondary">
              Bienvenue {user?.firstName}, gérez vos prix et marchés efficacement
            </Typography>
          </Box>
        </motion.div>

        {/* Quick Actions Bar */}
        <motion.div variants={itemVariants}>
          <Card sx={{ mb: 4, borderRadius: 3, background: 'linear-gradient(135deg, #4CAF50, #2E7D32)' }}>
            <CardContent sx={{ p: 3 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <Box sx={{ color: 'white' }}>
                  <Typography variant="h6" fontWeight="bold" gutterBottom>
                    Actions Rapides
                  </Typography>
                  <Typography variant="body2" sx={{ opacity: 0.9 }}>
                    Dernière mise à jour: {formatDate(stats.lastUpdateDate)} à {formatTime(stats.lastUpdateDate)}
                  </Typography>
                </Box>
                <Button
                  variant="contained"
                  startIcon={<AddIcon />}
                  onClick={handleAddPrice}
                  sx={{
                    bgcolor: 'white',
                    color: 'primary.main',
                    fontWeight: 'bold',
                    '&:hover': {
                      bgcolor: 'grey.100',
                    },
                  }}
                >
                  Nouveau Prix
                </Button>
              </Box>
            </CardContent>
          </Card>
        </motion.div>

        {/* Stats Cards */}
        <motion.div variants={itemVariants}>
          <Grid container spacing={3} sx={{ mb: 4 }}>
            <Grid item xs={12} sm={6} md={3}>
              <StatCard
                title="Marchés Assignés"
                value={stats.assignedMarkets}
                icon={<StoreIcon />}
                color="#2E7D32"
                subtitle="Sous votre responsabilité"
              />
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <StatCard
                title="Mises à jour ce mois"
                value={stats.priceUpdatesThisMonth}
                icon={<TrendingUpIcon />}
                color="#FF6F00"
                subtitle="Prix mis à jour"
              />
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <StatCard
                title="Rapports en attente"
                value={stats.pendingReports}
                icon={<AssessmentIcon />}
                color="#1976D2"
                subtitle="À compléter"
              />
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <StatCard
                title="Notifications"
                value={3}
                icon={<NotificationsIcon />}
                color="#7B1FA2"
                subtitle="Nouvelles alertes"
              />
            </Grid>
          </Grid>
        </motion.div>

        {/* Notifications */}
        <motion.div variants={itemVariants}>
          <Alert 
            severity="info" 
            sx={{ mb: 4, borderRadius: 2 }}
            action={
              <Button color="inherit" size="small">
                Voir tout
              </Button>
            }
          >
            Rappel: Veuillez mettre à jour les prix des légumes verts avant 18h aujourd'hui.
          </Alert>
        </motion.div>

        {/* Price Management */}
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <motion.div variants={itemVariants}>
              <Card sx={{ borderRadius: 3 }}>
                <CardContent sx={{ p: 3 }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                    <Typography variant="h6" fontWeight="bold">
                      Gestion des Prix
                    </Typography>
                    <Button
                      variant="contained"
                      startIcon={<AddIcon />}
                      onClick={handleAddPrice}
                      sx={{ borderRadius: 2 }}
                    >
                      Ajouter Prix
                    </Button>
                  </Box>
                  
                  <TableContainer>
                    <Table>
                      <TableHead>
                        <TableRow>
                          <TableCell>Produit</TableCell>
                          <TableCell>Marché</TableCell>
                          <TableCell>Prix (FCFA)</TableCell>
                          <TableCell>Unité</TableCell>
                          <TableCell>Date</TableCell>
                          <TableCell>Statut</TableCell>
                          <TableCell>Actions</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {recentPrices.map((price, index) => (
                          <motion.tr
                            key={price.id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.1 }}
                            component={TableRow}
                          >
                            <TableCell>
                              <Typography variant="body2" fontWeight="medium">
                                {price.product}
                              </Typography>
                            </TableCell>
                            <TableCell>{price.market}</TableCell>
                            <TableCell>
                              <Typography variant="body2" fontWeight="bold" color="primary.main">
                                {price.price.toLocaleString()}
                              </Typography>
                            </TableCell>
                            <TableCell>{price.unit}</TableCell>
                            <TableCell>{formatDate(price.date)}</TableCell>
                            <TableCell>
                              <Chip
                                label={price.status === 'confirmed' ? 'Confirmé' : 'En attente'}
                                size="small"
                                color={price.status === 'confirmed' ? 'success' : 'warning'}
                                variant={price.status === 'confirmed' ? 'filled' : 'outlined'}
                              />
                            </TableCell>
                            <TableCell>
                              <IconButton 
                                size="small" 
                                color="primary"
                                onClick={() => handleEditPrice(price)}
                              >
                                <EditIcon fontSize="small" />
                              </IconButton>
                            </TableCell>
                          </motion.tr>
                        ))}
                      </TableBody>
                    </Table>
                  </TableContainer>
                </CardContent>
              </Card>
            </motion.div>
          </Grid>
        </Grid>
      </motion.div>

      {/* Price Dialog */}
      <Dialog 
        open={openPriceDialog} 
        onClose={() => setOpenPriceDialog(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>
          {editingPrice ? 'Modifier le prix' : 'Ajouter un nouveau prix'}
        </DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12}>
              <TextField
                select
                fullWidth
                label="Produit"
                value={priceForm.product}
                onChange={(e) => setPriceForm({ ...priceForm, product: e.target.value })}
              >
                {products.map((product) => (
                  <MenuItem key={product.id} value={product.name}>
                    {product.name}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>
            <Grid item xs={12}>
              <TextField
                select
                fullWidth
                label="Marché"
                value={priceForm.market}
                onChange={(e) => setPriceForm({ ...priceForm, market: e.target.value })}
              >
                {markets.map((market) => (
                  <MenuItem key={market.id} value={market.name}>
                    {market.name}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>
            <Grid item xs={8}>
              <TextField
                fullWidth
                label="Prix (FCFA)"
                type="number"
                value={priceForm.price}
                onChange={(e) => setPriceForm({ ...priceForm, price: e.target.value })}
              />
            </Grid>
            <Grid item xs={4}>
              <TextField
                select
                fullWidth
                label="Unité"
                value={priceForm.unit}
                onChange={(e) => setPriceForm({ ...priceForm, unit: e.target.value })}
              >
                <MenuItem value="kg">kg</MenuItem>
                <MenuItem value="g">g</MenuItem>
                <MenuItem value="pièce">pièce</MenuItem>
                <MenuItem value="botte">botte</MenuItem>
              </TextField>
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button 
            onClick={() => setOpenPriceDialog(false)}
            startIcon={<CancelIcon />}
          >
            Annuler
          </Button>
          <Button 
            onClick={handleSavePrice}
            variant="contained"
            startIcon={<SaveIcon />}
          >
            Enregistrer
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default AgentDashboard;