'use client';

import React from 'react';
import { Box, Button, Container, Typography } from '@mui/material';
import { useRouter } from 'next/navigation';

export default function NotFound() {
  const router = useRouter();

  return (
    <Container maxWidth="md" sx={{ textAlign: 'center', py: 10 }}>
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 4,
        }}
      >
        <Typography 
          variant="h1"
          component="h1"
          sx={{ 
            fontWeight: 700, 
            fontSize: { xs: '6rem', md: '8rem' },
            background: 'linear-gradient(45deg, #2563eb, #4f46e5)',
            backgroundClip: 'text',
            color: 'transparent',
          }}
        >
          404
        </Typography>

        <Typography
          variant="h4"
          component="h2"
          gutterBottom
          sx={{ fontWeight: 600 }}
        >
          Page Not Found
        </Typography>

        <Typography 
          variant="body1" 
          color="text.secondary"
          sx={{ 
            maxWidth: 500,
            mb: 4
          }}
        >
          The page you're looking for doesn't exist or has been moved.
          Please check the URL or return to the homepage.
        </Typography>

        <Button
          variant="contained"
          size="large"
          onClick={() => router.push('/')}
          sx={{ px: 4, py: 1 }}
        >
          Return Home
        </Button>
      </Box>
    </Container>
  );
} 