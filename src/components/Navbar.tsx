import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  IconButton,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Box,
  useTheme,
  useMediaQuery,
  Avatar,
  Menu,
  MenuItem,
  Divider,
  Badge,
  Chip,
} from '@mui/material';
import {
  Menu as MenuIcon,
  Dashboard as DashboardIcon,
  Store as StoreIcon,
  Compare as CompareIcon,
  TrendingUp as TrendingUpIcon,
  Analytics as AnalyticsIcon,
  Login as LoginIcon,
  Close as CloseIcon,
  AccountCircle as AccountCircleIcon,
  Logout as LogoutIcon,
  Settings as SettingsIcon,
  Notifications as NotificationsIcon,
  AdminPanelSettings as AdminIcon,
  Assignment as AssignmentIcon,
} from '@mui/icons-material';
import { motion } from 'framer-motion';
import { useAuth } from '../hooks/useAuth';

const Navbar = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [notificationAnchor, setNotificationAnchor] = useState<null | HTMLElement>(null);
  
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const location = useLocation();
  const navigate = useNavigate();
  
  const { user, logout, isAuthenticated } = useAuth();

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const handleProfileMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleProfileMenuClose = () => {
    setAnchorEl(null);
  };

  const handleNotificationMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setNotificationAnchor(event.currentTarget);
  };

  const handleNotificationMenuClose = () => {
    setNotificationAnchor(null);
  };

  const handleLogout = () => {
    logout();
    handleProfileMenuClose();
    navigate('/login');
  };

  // Dynamic menu items based on user role
  const getMenuItems = () => {
    const baseItems = [
      { path: '/market-prices', name: 'Prix du marché', icon: <StoreIcon /> },
      { path: '/price-comparison', name: 'Comparaison', icon: <CompareIcon /> },
      { path: '/trend-prediction', name: 'Prédictions', icon: <TrendingUpIcon /> },
      { path: '/market-analysis', name: 'Analyses', icon: <AnalyticsIcon /> },
    ];

    if (!user) return baseItems;

    if (user.role === 'admin') {
      return [
        { path: '/admin', name: 'Dashboard Admin', icon: <AdminIcon /> },
        ...baseItems,
      ];
    } else if (user.role === 'agent') {
      return [
        { path: '/agent', name: 'Dashboard Agent', icon: <AssignmentIcon /> },
        ...baseItems,
      ];
    }

    return baseItems;
  };

  const menuItems = getMenuItems();

  const isActiveRoute = (path: string) => {
    return location.pathname === path;
  };

  const drawer = (
    <Box sx={{ width: 280 }}>
      <Box sx={{ p: 2, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <Typography variant="h6" color="primary" fontWeight="bold">
          AgroMarket
        </Typography>
        <IconButton onClick={handleDrawerToggle}>
          <CloseIcon />
        </IconButton>
      </Box>
      
      {/* User info in mobile drawer */}
      {isAuthenticated && user && (
        <Box sx={{ px: 2, pb: 2 }}>
          <Box sx={{ 
            display: 'flex', 
            alignItems: 'center', 
            p: 2, 
            bgcolor: 'primary.main', 
            borderRadius: 2,
            color: 'white'
          }}>
            <Avatar sx={{ mr: 2, bgcolor: 'white', color: 'primary.main' }}>
              {user.firstName?.[0] || user.username[0].toUpperCase()}
            </Avatar>
            <Box>
              <Typography variant="body2" fontWeight="bold">
                {user.firstName ? `${user.firstName} ${user.lastName}` : user.username}
              </Typography>
              <Chip 
                label={user.role === 'admin' ? 'Administrateur' : 'Agent'}
                size="small"
                sx={{ 
                  bgcolor: 'rgba(255,255,255,0.2)', 
                  color: 'white',
                  fontSize: '0.7rem'
                }}
              />
            </Box>
          </Box>
        </Box>
      )}
      
      <List>
        {menuItems.map((item) => (
          <ListItem key={item.path} disablePadding>
            <ListItemButton
              component={Link}
              to={item.path}
              onClick={handleDrawerToggle}
              selected={isActiveRoute(item.path)}
              sx={{
                mx: 1,
                borderRadius: 1,
                '&.Mui-selected': {
                  backgroundColor: theme.palette.primary.main,
                  color: 'white',
                  '&:hover': {
                    backgroundColor: theme.palette.primary.dark,
                  },
                  '& .MuiListItemIcon-root': {
                    color: 'white',
                  },
                },
              }}
            >
              <ListItemIcon sx={{ minWidth: 40 }}>
                {item.icon}
              </ListItemIcon>
              <ListItemText primary={item.name} />
            </ListItemButton>
          </ListItem>
        ))}
        
        {!isAuthenticated && (
          <ListItem sx={{ mt: 2 }}>
            <Button
              component={Link}
              to="/login"
              variant="outlined"
              startIcon={<LoginIcon />}
              fullWidth
              sx={{ borderRadius: 2 }}
            >
              Se connecter
            </Button>
          </ListItem>
        )}
        
        {isAuthenticated && (
          <ListItem sx={{ mt: 2 }}>
            <Button
              onClick={handleLogout}
              variant="outlined"
              color="error"
              startIcon={<LogoutIcon />}
              fullWidth
              sx={{ borderRadius: 2 }}
            >
              Déconnexion
            </Button>
          </ListItem>
        )}
      </List>
    </Box>
  );

  return (
    <>
      <AppBar 
        position="sticky" 
        sx={{ 
          backgroundColor: 'white',
          color: theme.palette.text.primary,
          borderBottom: `1px solid ${theme.palette.divider}`,
        }}
      >
        <Toolbar sx={{ justifyContent: 'space-between' }}>
          {/* Logo */}
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            {isMobile && (
              <IconButton
                color="inherit"
                aria-label="open drawer"
                edge="start"
                onClick={handleDrawerToggle}
                sx={{ mr: 2 }}
              >
                <MenuIcon />
              </IconButton>
            )}
            <Link to="/" style={{ textDecoration: 'none', color: 'inherit' }}>
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <Avatar
                  sx={{
                    width: 40,
                    height: 40,
                    backgroundColor: theme.palette.primary.main,
                    mr: 1,
                    fontSize: '1.2rem',
                    fontWeight: 'bold',
                  }}
                >
                  A
                </Avatar>
                <Typography
                  variant="h6"
                  component="div"
                  sx={{
                    fontWeight: 'bold',
                    color: theme.palette.primary.main,
                    display: { xs: 'none', sm: 'block' },
                  }}
                >
                  AgroMarket
                </Typography>
              </Box>
            </Link>
          </Box>

          {/* Desktop Navigation */}
          {!isMobile && isAuthenticated && (
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              {menuItems.map((item) => (
                <Button
                  key={item.path}
                  component={Link}
                  to={item.path}
                  startIcon={item.icon}
                  variant={isActiveRoute(item.path) ? 'contained' : 'text'}
                  sx={{
                    borderRadius: 2,
                    textTransform: 'none',
                    fontWeight: 500,
                    px: 2,
                    py: 1,
                    color: isActiveRoute(item.path) ? 'white' : theme.palette.text.primary,
                    '&:hover': {
                      backgroundColor: isActiveRoute(item.path) 
                        ? theme.palette.primary.dark 
                        : theme.palette.action.hover,
                    },
                  }}
                >
                  {item.name}
                </Button>
              ))}
            </Box>
          )}

          {/* User Actions */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            {isAuthenticated ? (
              <>
                {!isMobile && (
                  <>
                    {/* Notifications */}
                    <IconButton
                      color="inherit"
                      onClick={handleNotificationMenuOpen}
                      sx={{ mr: 1 }}
                    >
                      <Badge badgeContent={3} color="error">
                        <NotificationsIcon />
                      </Badge>
                    </IconButton>

                    {/* User Profile */}
                    <motion.div
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <Button
                        onClick={handleProfileMenuOpen}
                        startIcon={
                          <Avatar 
                            sx={{ 
                              width: 32, 
                              height: 32, 
                              bgcolor: user?.role === 'admin' ? 'secondary.main' : 'primary.main'
                            }}
                          >
                            {user?.firstName?.[0] || user?.username[0].toUpperCase()}
                          </Avatar>
                        }
                        endIcon={
                          <Chip 
                            label={user?.role === 'admin' ? 'Admin' : 'Agent'}
                            size="small"
                            color={user?.role === 'admin' ? 'secondary' : 'primary'}
                          />
                        }
                        sx={{
                          borderRadius: 3,
                          textTransform: 'none',
                          color: theme.palette.text.primary,
                          '&:hover': {
                            backgroundColor: theme.palette.action.hover,
                          },
                        }}
                      >
                        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', ml: 1 }}>
                          <Typography variant="body2" fontWeight="medium">
                            {user?.firstName ? `${user.firstName} ${user.lastName}` : user?.username}
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            {user?.role === 'admin' ? 'Administrateur' : 'Agent'}
                          </Typography>
                        </Box>
                      </Button>
                    </motion.div>
                  </>
                )}
              </>
            ) : (
              !isMobile && (
                <Button
                  component={Link}
                  to="/login"
                  variant="outlined"
                  startIcon={<LoginIcon />}
                  sx={{
                    borderRadius: 2,
                    textTransform: 'none',
                    fontWeight: 500,
                  }}
                >
                  Se connecter
                </Button>
              )
            )}
          </Box>
        </Toolbar>
      </AppBar>

      {/* Mobile Drawer */}
      <Drawer
        variant="temporary"
        open={mobileOpen}
        onClose={handleDrawerToggle}
        ModalProps={{
          keepMounted: true,
        }}
        sx={{
          display: { xs: 'block', md: 'none' },
          '& .MuiDrawer-paper': { boxSizing: 'border-box', width: 280 },
        }}
      >
        {drawer}
      </Drawer>

      {/* Profile Menu */}
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleProfileMenuClose}
        PaperProps={{
          sx: {
            mt: 1,
            borderRadius: 2,
            minWidth: 200,
          },
        }}
      >
        <MenuItem onClick={handleProfileMenuClose}>
          <ListItemIcon>
            <AccountCircleIcon fontSize="small" />
          </ListItemIcon>
          Profil
        </MenuItem>
        <MenuItem onClick={handleProfileMenuClose}>
          <ListItemIcon>
            <SettingsIcon fontSize="small" />
          </ListItemIcon>
          Paramètres
        </MenuItem>
        <Divider />
        <MenuItem onClick={handleLogout} sx={{ color: 'error.main' }}>
          <ListItemIcon>
            <LogoutIcon fontSize="small" color="error" />
          </ListItemIcon>
          Déconnexion
        </MenuItem>
      </Menu>

      {/* Notifications Menu */}
      <Menu
        anchorEl={notificationAnchor}
        open={Boolean(notificationAnchor)}
        onClose={handleNotificationMenuClose}
        PaperProps={{
          sx: {
            mt: 1,
            borderRadius: 2,
            minWidth: 300,
            maxHeight: 400,
          },
        }}
      >
        <Box sx={{ p: 2, borderBottom: '1px solid', borderColor: 'divider' }}>
          <Typography variant="h6" fontWeight="bold">
            Notifications
          </Typography>
        </Box>
        <MenuItem onClick={handleNotificationMenuClose}>
          <Box sx={{ display: 'flex', alignItems: 'center', width: '100%' }}>
            <Avatar sx={{ mr: 2, bgcolor: 'info.main', width: 32, height: 32 }}>
              <NotificationsIcon fontSize="small" />
            </Avatar>
            <Box sx={{ flexGrow: 1 }}>
              <Typography variant="body2" fontWeight="medium">
                Nouveaux prix disponibles
              </Typography>
              <Typography variant="caption" color="text.secondary">
                Il y a 5 minutes
              </Typography>
            </Box>
          </Box>
        </MenuItem>
        <MenuItem onClick={handleNotificationMenuClose}>
          <Box sx={{ display: 'flex', alignItems: 'center', width: '100%' }}>
            <Avatar sx={{ mr: 2, bgcolor: 'warning.main', width: 32, height: 32 }}>
              <TrendingUpIcon fontSize="small" />
            </Avatar>
            <Box sx={{ flexGrow: 1 }}>
              <Typography variant="body2" fontWeight="medium">
                Rapport mensuel prêt
              </Typography>
              <Typography variant="caption" color="text.secondary">
                Il y a 1 heure
              </Typography>
            </Box>
          </Box>
        </MenuItem>
        <MenuItem onClick={handleNotificationMenuClose}>
          <Box sx={{ display: 'flex', alignItems: 'center', width: '100%' }}>
            <Avatar sx={{ mr: 2, bgcolor: 'success.main', width: 32, height: 32 }}>
              <StoreIcon fontSize="small" />
            </Avatar>
            <Box sx={{ flexGrow: 1 }}>
              <Typography variant="body2" fontWeight="medium">
                Nouveau marché ajouté
              </Typography>
              <Typography variant="caption" color="text.secondary">
                Hier
              </Typography>
            </Box>
          </Box>
        </MenuItem>
        <Divider />
        <MenuItem onClick={handleNotificationMenuClose} sx={{ justifyContent: 'center' }}>
          <Typography variant="body2" color="primary.main" fontWeight="medium">
            Voir toutes les notifications
          </Typography>
        </MenuItem>
      </Menu>
    </>
  );
};

export default Navbar;