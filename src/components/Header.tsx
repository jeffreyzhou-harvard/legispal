'use client';

import React, { useState, useEffect } from 'react';
import { usePathname, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { 
  AppBar, 
  Toolbar, 
  Box, 
  Button, 
  Container, 
  IconButton, 
  Drawer, 
  List, 
  ListItem, 
  ListItemButton, 
  ListItemText, 
  Typography, 
  useScrollTrigger,
  Snackbar,
  Alert
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import CloseIcon from '@mui/icons-material/Close';

const navigation = [
  { name: 'Home', href: '/' },
  { name: 'Search', href: '/?tab=0' },
  { name: 'Upload', href: '/?tab=1' },
  { name: 'About', href: '/about' },
];

export function Header() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [isClient, setIsClient] = useState(false);
  const [snackbarOpen, setSnackbarOpen] = useState(false);

  // Set isClient to true when component mounts
  useEffect(() => {
    setIsClient(true);
  }, []);

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const handleLoginClick = () => {
    setSnackbarOpen(true);
  };

  const handleSnackbarClose = (event?: React.SyntheticEvent | Event, reason?: string) => {
    if (reason === 'clickaway') {
      return;
    }
    setSnackbarOpen(false);
  };

  const scrolled = useScrollTrigger({
    disableHysteresis: true,
    threshold: 10,
  });

  // Function to check if a navigation item is active
  const isNavItemActive = (itemHref: string) => {
    if (pathname === itemHref) return true;
    
    if (isClient && itemHref.includes('?tab=') && pathname === '/') {
      const tabParam = searchParams.get('tab');
      const itemTab = itemHref.split('=')[1];
      return tabParam === itemTab;
    }
    
    return false;
  };

  return (
    <>
      <AppBar 
        position="fixed" 
        color="inherit" 
        elevation={scrolled ? 3 : 0}
        sx={{
          bgcolor: scrolled ? 'rgba(255, 255, 255, 0.95)' : 'transparent',
          backdropFilter: 'blur(8px)',
          borderBottom: scrolled ? 'none' : '1px solid rgba(0, 0, 0, 0.06)',
          transition: 'all 0.3s',
        }}
      >
        <Container maxWidth="lg">
          <Toolbar sx={{ py: 1, px: { xs: 1, sm: 2 } }}>
            <Box sx={{ display: 'flex', alignItems: 'center', flexGrow: 1 }}>
              <Link href="/" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 1 }}>
                <Box
                  sx={{
                    width: 40,
                    height: 40,
                    borderRadius: '50%',
                    background: 'linear-gradient(45deg, #2563eb, #4f46e5)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: 'white',
                    fontWeight: 'bold',
                    fontSize: '1.2rem',
                  }}
                >
                  LP
                </Box>
                <Typography
                  variant="h6"
                  noWrap
                  sx={{
                    background: 'linear-gradient(45deg, #2563eb, #4f46e5)',
                    backgroundClip: 'text',
                    color: 'transparent',
                    fontWeight: 700,
                    letterSpacing: '-0.01em',
                  }}
                >
                  LegisPal
                </Typography>
              </Link>
            </Box>

            {/* Desktop menu */}
            <Box sx={{ display: { xs: 'none', md: 'flex' }, gap: 3 }}>
              {navigation.map((item) => {
                const isActive = isNavItemActive(item.href);
                return (
                  <Link key={item.name} href={item.href} style={{ textDecoration: 'none' }}>
                    <Button
                      variant="text"
                      sx={{
                        color: isActive ? 'primary.main' : 'text.primary',
                        fontWeight: isActive ? 600 : 500,
                        position: 'relative',
                        '&::after': {
                          content: '""',
                          position: 'absolute',
                          bottom: 5,
                          left: '50%',
                          width: isActive ? '30%' : 0,
                          height: 2,
                          bgcolor: 'primary.main',
                          transform: 'translateX(-50%)',
                          transition: 'width 0.3s ease',
                        },
                        '&:hover::after': {
                          width: '30%',
                        },
                      }}
                    >
                      {item.name}
                    </Button>
                  </Link>
                );
              })}
            </Box>

            <Box sx={{ display: { xs: 'none', md: 'block' }, ml: 2 }}>
              <Button
                variant="contained"
                color="primary"
                onClick={handleLoginClick}
                sx={{
                  borderRadius: '8px',
                  px: 3,
                }}
              >
                Log in
              </Button>
            </Box>

            {/* Mobile menu */}
            <Box sx={{ display: { md: 'none' } }}>
              <IconButton
                color="primary"
                aria-label="open drawer"
                edge="end"
                onClick={handleDrawerToggle}
                sx={{ ml: 1 }}
              >
                <MenuIcon />
              </IconButton>
            </Box>
          </Toolbar>
        </Container>
      </AppBar>
      
      {/* Mobile drawer */}
      <Drawer
        anchor="right"
        variant="temporary"
        open={mobileOpen}
        onClose={handleDrawerToggle}
        ModalProps={{
          keepMounted: true, // Better mobile performance
        }}
        sx={{
          display: { xs: 'block', md: 'none' },
          '& .MuiDrawer-paper': { 
            width: { xs: '100%', sm: 300 },
            background: 'linear-gradient(160deg, #ffffff, #f8fafc)',
          },
        }}
      >
        <Box sx={{ p: 2, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Link href="/" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 1 }}>
            <Box
              sx={{
                width: 36,
                height: 36,
                borderRadius: '50%',
                background: 'linear-gradient(45deg, #2563eb, #4f46e5)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'white',
                fontWeight: 'bold',
                fontSize: '1rem',
              }}
            >
              LP
            </Box>
            <Typography
              variant="h6"
              noWrap
              sx={{
                background: 'linear-gradient(45deg, #2563eb, #4f46e5)',
                backgroundClip: 'text',
                color: 'transparent',
                fontWeight: 700,
                letterSpacing: '-0.01em',
              }}
            >
              LegisPal
            </Typography>
          </Link>
          <IconButton
            color="inherit"
            aria-label="close drawer"
            edge="end"
            onClick={handleDrawerToggle}
          >
            <CloseIcon />
          </IconButton>
        </Box>

        <List sx={{ mt: 2 }}>
          {navigation.map((item) => (
            <ListItem key={item.name} disablePadding>
              <ListItemButton
                component={Link}
                href={item.href}
                selected={isNavItemActive(item.href)}
                onClick={handleDrawerToggle}
                sx={{
                  py: 1.5,
                  px: 3,
                  borderRadius: 0,
                  '&.Mui-selected': {
                    bgcolor: 'rgba(37, 99, 235, 0.1)',
                    color: 'primary.main',
                    fontWeight: 600,
                  },
                }}
              >
                <ListItemText primary={item.name} />
              </ListItemButton>
            </ListItem>
          ))}
          <ListItem sx={{ mt: 2 }}>
            <Button
              variant="contained"
              color="primary"
              onClick={handleLoginClick}
              fullWidth
              sx={{ py: 1.5 }}
            >
              Log in
            </Button>
          </ListItem>
        </List>
      </Drawer>
      
      {/* Work in progress message */}
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={4000}
        onClose={handleSnackbarClose}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        <Alert 
          onClose={handleSnackbarClose} 
          severity="info" 
          variant="filled"
          sx={{ width: '100%' }}
        >
          Login functionality is a work in progress
        </Alert>
      </Snackbar>
      
      {/* Toolbar offset to prevent content from going under AppBar */}
      <Toolbar sx={{ mb: 3 }} />
    </>
  );
} 