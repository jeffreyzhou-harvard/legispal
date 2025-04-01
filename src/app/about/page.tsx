'use client';

import React from 'react';
import { 
  Box, 
  Container, 
  Paper, 
  Typography,
  Avatar,
  useTheme,
  useMediaQuery
} from '@mui/material';

export default function About() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 8 }}>
      <Box
        sx={{
          textAlign: 'center',
          mb: 6,
        }}
      >
        <Typography 
          variant="h2" 
          component="h1" 
          gutterBottom
          sx={{ 
            fontWeight: 700, 
            background: 'linear-gradient(45deg, #2563eb, #4f46e5)',
            backgroundClip: 'text',
            color: 'transparent',
            mb: 2,
          }}
        >
          About Me
        </Typography>
      </Box>

      <Paper 
        elevation={0}
        sx={{ 
          borderRadius: 3, 
          overflow: 'hidden',
          border: '1px solid',
          borderColor: 'divider',
          mx: 'auto',
          maxWidth: 800,
          p: { xs: 3, md: 5 },
          display: 'flex',
          flexDirection: { xs: 'column', sm: 'row' },
          alignItems: { xs: 'center', sm: 'flex-start' },
          gap: 4,
        }}
      >
        <Box sx={{ display: 'flex', justifyContent: 'center' }}>
          <Avatar 
            sx={{ 
              width: { xs: 120, sm: 150 }, 
              height: { xs: 120, sm: 150 },
              bgcolor: 'primary.main',
              fontSize: '2rem',
              fontWeight: 'bold',
            }}
          >
            JZ
          </Avatar>
        </Box>

        <Box sx={{ textAlign: { xs: 'center', sm: 'left' }, flex: 1 }}>
          <Typography variant="h4" component="h2" gutterBottom sx={{ fontWeight: 600 }}>
            Jeffrey Zhou
          </Typography>
          
          <Typography variant="body1" sx={{ mb: 3, color: 'text.secondary' }}>
            Thanks for stopping by my page! I'm a current first-year at Harvard, studying Computer Science and Math although I have varying interests in economics, world history, and statistics.
          </Typography>
          
          <Typography variant="h6" gutterBottom sx={{ mt: 4, fontWeight: 600 }}>
            About LegisPal
          </Typography>
          
          <Typography variant="body1" color="text.secondary">
            LegisPal is an AI-powered tool designed to make legislation more accessible and understandable. 
            This project combines my interests in technology and public policy to create a platform that helps 
            people search through and analyze complex legal documents with ease.
          </Typography>
        </Box>
      </Paper>
    </Container>
  );
} 