import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
  Avatar,
  IconButton,
  Chip,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Button,
  LinearProgress,
} from '@mui/material';
import {
  Dashboard as DashboardIcon,
  People as PeopleIcon,
  Store as StoreIcon,
  Inventory as InventoryIcon,
  PersonAdd as PersonAddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  TrendingUp as TrendingUpIcon,
  Assessment as AssessmentIcon,
} from '@mui/icons-material';
import { motion } from 'framer-motion';
import { useAuth } from '../hooks/useAuth';
import { AdminStats } from '../types/types';

const AdminDashboard: React.FC = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState<AdminStats>({
    totalUsers: 156,
    totalAgents: 45,
    totalMarkets: 32,
    totalProducts: 89,
    activeAgents: 38,
    recentPriceUpdates: 234,
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
    change, 
    changeLabel 
  }: {
    title: string;
    value: number;
    icon: React.ReactNode;
    color: string;
    change?: number;
    changeLabel?: string;
  }) => (
    <motion.div variants={itemVariants}>
      <Card
        sx={{
          height: '100%',
          background: `linear-gradient(135deg, ${color}15, ${color}05)`,
          border: `1px solid ${color}30`,
          borderRadius: 3,
          overflow: 'hidden',
          position: 'relative',
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
                {value.toLocaleString()}
              </Typography>
              <Typography variant="body2" color="text.secondary" fontWeight="medium">
                {title}
              </Typography>
              {change && (
                <Box sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
                  <TrendingUpIcon sx={{ fontSize: 16, mr: 0.5, color: 'success.main' }} />
                  <Typography variant="caption" color="success.main" fontWeight="medium">
                    +{change}% {changeLabel}
                  </Typography>
                </Box>
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

  const recentUsers = [
    { id: 1, name: 'Marie Dubois', role: 'agent', market: 'Marché Central', status: 'active', lastLogin: '2024-01-15' },
    { id: 2, name: 'Jean Martin', role: 'agent', market: 'Marché Nord', status: 'active', lastLogin: '2024-01-14' },
    { id: 3, name: 'Sophie Leroux', role: 'agent', market: 'Marché Sud', status: 'inactive', lastLogin: '2024-01-10' },
    { id: 4, name: 'Pierre Durand', role: 'agent', market: 'Marché Est', status: 'active', lastLogin: '2024-01-15' },
  ];

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
              Tableau de bord Administrateur
            </Typography>
            <Typography variant="body1" color="text.secondary">
              Bienvenue {user?.firstName}, voici un aperçu de votre système AgroMarket
            </Typography>
          </Box>
        </motion.div>

        {/* Stats Cards */}
        <motion.div variants={itemVariants}>
          <Grid container spacing={3} sx={{ mb: 4 }}>
            <Grid item xs={12} sm={6} md={3}>
              <StatCard
                title="Utilisateurs Total"
                value={stats.totalUsers}
                icon={<PeopleIcon />}
                color="#2E7D32"
                change={12}
                changeLabel="ce mois"
              />
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <StatCard
                title="Agents Actifs"
                value={stats.activeAgents}
                icon={<PersonAddIcon />}
                color="#FF6F00"
                change={8}
                changeLabel="cette semaine"
              />
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <StatCard
                title="Marchés"
                value={stats.totalMarkets}
                icon={<StoreIcon />}
                color="#1976D2"
                change={5}
                changeLabel="ce mois"
              />
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <StatCard
                title="Produits"
                value={stats.totalProducts}
                icon={<InventoryIcon />}
                color="#7B1FA2"
                change={15}
                changeLabel="ce mois"
              />
            </Grid>
          </Grid>
        </motion.div>

        {/* Recent Activity */}
        <Grid container spacing={3}>
          <Grid item xs={12} lg={8}>
            <motion.div variants={itemVariants}>
              <Card sx={{ borderRadius: 3 }}>
                <CardContent sx={{ p: 3 }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                    <Typography variant="h6" fontWeight="bold">
                      Gestion des Utilisateurs
                    </Typography>
                    <Button
                      variant="contained"
                      startIcon={<PersonAddIcon />}
                      sx={{ borderRadius: 2 }}
                    >
                      Nouvel Utilisateur
                    </Button>
                  </Box>
                  
                  <TableContainer>
                    <Table>
                      <TableHead>
                        <TableRow>
                          <TableCell>Utilisateur</TableCell>
                          <TableCell>Rôle</TableCell>
                          <TableCell>Marché</TableCell>
                          <TableCell>Statut</TableCell>
                          <TableCell>Dernière Connexion</TableCell>
                          <TableCell>Actions</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {recentUsers.map((user, index) => (
                          <motion.tr
                            key={user.id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.1 }}
                            component={TableRow}
                          >
                            <TableCell>
                              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                <Avatar sx={{ mr: 2, bgcolor: 'primary.main' }}>
                                  {user.name.split(' ').map(n => n[0]).join('')}
                                </Avatar>
                                <Typography variant="body2" fontWeight="medium">
                                  {user.name}
                                </Typography>
                              </Box>
                            </TableCell>
                            <TableCell>
                              <Chip
                                label={user.role}
                                size="small"
                                color={user.role === 'admin' ? 'primary' : 'secondary'}
                              />
                            </TableCell>
                            <TableCell>{user.market}</TableCell>
                            <TableCell>
                              <Chip
                                label={user.status}
                                size="small"
                                color={user.status === 'active' ? 'success' : 'default'}
                                variant={user.status === 'active' ? 'filled' : 'outlined'}
                              />
                            </TableCell>
                            <TableCell>{user.lastLogin}</TableCell>
                            <TableCell>
                              <IconButton size="small" color="primary">
                                <EditIcon fontSize="small" />
                              </IconButton>
                              <IconButton size="small" color="error">
                                <DeleteIcon fontSize="small" />
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

          <Grid item xs={12} lg={4}>
            <motion.div variants={itemVariants}>
              <Card sx={{ borderRadius: 3, mb: 3 }}>
                <CardContent sx={{ p: 3 }}>
                  <Typography variant="h6" fontWeight="bold" gutterBottom>
                    Activité Récente
                  </Typography>
                  
                  <Box sx={{ mt: 2 }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                      <Typography variant="body2">Mises à jour des prix</Typography>
                      <Typography variant="body2" fontWeight="bold">234</Typography>
                    </Box>
                    <LinearProgress 
                      variant="determinate" 
                      value={75} 
                      sx={{ mb: 2, borderRadius: 1, height: 6 }}
                    />
                    
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                      <Typography variant="body2">Nouveaux rapports</Typography>
                      <Typography variant="body2" fontWeight="bold">89</Typography>
                    </Box>
                    <LinearProgress 
                      variant="determinate" 
                      value={60} 
                      sx={{ mb: 2, borderRadius: 1, height: 6 }}
                      color="secondary"
                    />
                    
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                      <Typography variant="body2">Agents connectés</Typography>
                      <Typography variant="body2" fontWeight="bold">38/45</Typography>
                    </Box>
                    <LinearProgress 
                      variant="determinate" 
                      value={84} 
                      sx={{ borderRadius: 1, height: 6 }}
                      color="success"
                    />
                  </Box>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div variants={itemVariants}>
              <Card sx={{ borderRadius: 3 }}>
                <CardContent sx={{ p: 3 }}>
                  <Typography variant="h6" fontWeight="bold" gutterBottom>
                    Actions Rapides
                  </Typography>
                  
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 2 }}>
                    <Button
                      fullWidth
                      variant="outlined"
                      startIcon={<AssessmentIcon />}
                      sx={{ borderRadius: 2, justifyContent: 'flex-start' }}
                    >
                      Générer Rapport
                    </Button>
                    <Button
                      fullWidth
                      variant="outlined"
                      startIcon={<PeopleIcon />}
                      sx={{ borderRadius: 2, justifyContent: 'flex-start' }}
                    >
                      Gérer Utilisateurs
                    </Button>
                    <Button
                      fullWidth
                      variant="outlined"
                      startIcon={<StoreIcon />}
                      sx={{ borderRadius: 2, justifyContent: 'flex-start' }}
                    >
                      Configurer Marchés
                    </Button>
                  </Box>
                </CardContent>
              </Card>
            </motion.div>
          </Grid>
        </Grid>
      </motion.div>
    </Box>
  );
};

export default AdminDashboard;