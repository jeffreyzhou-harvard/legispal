'use client';

import React from 'react';
import Link from 'next/link';
import { 
  Box, 
  Container, 
  Typography, 
  Stack, 
  IconButton, 
  Divider,
  useTheme,
  useMediaQuery
} from '@mui/material';
import GitHubIcon from '@mui/icons-material/GitHub';
import TwitterIcon from '@mui/icons-material/Twitter';
import LinkedInIcon from '@mui/icons-material/LinkedIn';

const navigation = {
  main: [
    { name: 'Home', href: '/' },
    { name: 'About', href: '/about' },
    { name: 'Search', href: '/?tab=0' },
    { name: 'Upload', href: '/?tab=1' },
    { name: 'Contact', href: '/contact' },
  ],
  social: [
    {
      name: 'GitHub',
      href: 'https://github.com/jeffreyzhou-harvard',
      icon: GitHubIcon,
    },
    {
      name: 'Twitter',
      href: 'https://x.com/JeffreyZh0u',
      icon: TwitterIcon,
    },
    {
      name: 'LinkedIn',
      href: 'https://www.linkedin.com/in/jeffrey-zhou-121997162/',
      icon: LinkedInIcon,
    },
  ],
};

export function Footer() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  return (
    <Box 
      component="footer" 
      sx={{ 
        bgcolor: 'background.default',
        borderTop: '1px solid',
        borderColor: 'divider',
        mt: 'auto',
        pt: 6,
        pb: 4,
      }}
    >
      <Container maxWidth="lg">
        <Box
          sx={{
            display: 'flex',
            flexDirection: { xs: 'column', md: 'row' },
            justifyContent: 'space-between',
            alignItems: { xs: 'center', md: 'flex-start' },
            gap: 4,
          }}
        >
          {/* Logo and description */}
          <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: { xs: 'center', md: 'flex-start' }, maxWidth: 280 }}>
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
            
            <Typography 
              variant="body2" 
              color="text.secondary" 
              sx={{ 
                mt: 2, 
                textAlign: { xs: 'center', md: 'left' }
              }}
            >
              AI-powered tool for searching, analyzing, and understanding legislation.
            </Typography>
          </Box>
          
          {/* Navigation links */}
          <Box sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, gap: 4, alignItems: { xs: 'center', md: 'flex-start' } }}>
            <Box sx={{ textAlign: { xs: 'center', md: 'left' } }}>
              <Typography variant="h6" color="text.primary" gutterBottom>
                Quick Links
              </Typography>
              <Box
                sx={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(2, 1fr)',
                  gap: 2,
                  width: 'fit-content',
                }}
              >
                {navigation.main.map((item) => (
                  <Link key={item.name} href={item.href} style={{ textDecoration: 'none' }}>
                    <Typography 
                      variant="body2" 
                      color="text.secondary"
                      sx={{ 
                        '&:hover': { color: 'primary.main' },
                        transition: 'color 0.2s',
                      }}
                    >
                      {item.name}
                    </Typography>
                  </Link>
                ))}
              </Box>
            </Box>
            
            <Box sx={{ textAlign: { xs: 'center', md: 'left' } }}>
              <Typography variant="h6" color="text.primary" gutterBottom>
                Connect
              </Typography>
              <Stack 
                direction="row" 
                spacing={1} 
                justifyContent={{ xs: 'center', md: 'flex-start' }}
              >
                {navigation.social.map((item) => (
                  <IconButton 
                    key={item.name} 
                    aria-label={item.name} 
                    href={item.href} 
                    target="_blank" 
                    rel="noopener"
                    size="small"
                    sx={{ 
                      color: 'text.secondary',
                      '&:hover': { 
                        color: 'primary.main',
                        bgcolor: 'rgba(37, 99, 235, 0.08)',
                      },
                    }}
                  >
                    <item.icon />
                  </IconButton>
                ))}
              </Stack>
            </Box>
          </Box>
        </Box>
        
        <Divider sx={{ my: 4 }} />
        
        <Box 
          sx={{
            display: 'flex',
            flexDirection: { xs: 'column', md: 'row' },
            justifyContent: 'space-between',
            alignItems: 'center',
            gap: 2,
          }}
        >
          <Typography variant="body2" color="text.secondary">
            &copy; {new Date().getFullYear()} LegisPal. All rights reserved.
          </Typography>
          <Typography 
            variant="body2" 
            color="primary.main"
            fontWeight={500}
          >
            Created by: Jeffrey Zhou
          </Typography>
        </Box>
      </Container>
    </Box>
  );
} 