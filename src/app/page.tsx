'use client';

import React, { useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { 
  Box, 
  Container, 
  Paper, 
  Typography, 
  Tabs,
  Tab,
  useTheme,
  useMediaQuery
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import UploadFileIcon from '@mui/icons-material/UploadFile';
import BillSearch from '../components/BillSearch';
import BillUpload from '../components/BillUpload';

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`tabpanel-${index}`}
      aria-labelledby={`tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ pt: 3 }}>
          {children}
        </Box>
      )}
    </div>
  );
}

// This component uses searchParams and is wrapped in Suspense
function HomeContent() {
  const [value, setValue] = React.useState(0);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const searchParams = useSearchParams();

  // Set tab based on URL parameter
  useEffect(() => {
    const tabParam = searchParams.get('tab');
    if (tabParam !== null) {
      const tabValue = parseInt(tabParam, 10);
      if (!isNaN(tabValue) && (tabValue === 0 || tabValue === 1)) {
        setValue(tabValue);
      }
    }
  }, [searchParams]);

  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
    
    // Update URL without reloading the page
    const url = new URL(window.location.href);
    url.searchParams.set('tab', newValue.toString());
    window.history.pushState({}, '', url);
  };

  return (
    <>
      <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
        <Tabs 
          value={value} 
          onChange={handleChange} 
          variant={isMobile ? 'fullWidth' : 'standard'}
          centered={!isMobile}
          aria-label="bill search and upload tabs"
        >
          <Tab 
            icon={<SearchIcon sx={{ mr: 1 }} />} 
            iconPosition="start"
            label="Search Bills" 
            id="tab-0" 
          />
          <Tab 
            icon={<UploadFileIcon sx={{ mr: 1 }} />}
            iconPosition="start"
            label="Upload Bill" 
            id="tab-1"
          />
        </Tabs>
      </Box>
      
      <TabPanel value={value} index={0}>
        <BillSearch />
      </TabPanel>
      
      <TabPanel value={value} index={1}>
        <BillUpload />
      </TabPanel>
    </>
  );
}

// Fallback while loading
function HomeFallback() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  
  return (
    <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
      <Tabs 
        value={0} 
        variant={isMobile ? 'fullWidth' : 'standard'}
        centered={!isMobile}
      >
        <Tab 
          icon={<SearchIcon sx={{ mr: 1 }} />} 
          iconPosition="start"
          label="Search Bills" 
        />
        <Tab 
          icon={<UploadFileIcon sx={{ mr: 1 }} />}
          iconPosition="start" 
          label="Upload Bill" 
        />
      </Tabs>
    </Box>
  );
}

export default function Home() {
  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 8 }}>
      {/* Hero Section */}
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
          Legislation Assistant
        </Typography>
        <Typography 
          variant="h5" 
          color="text.secondary" 
          sx={{ 
            maxWidth: 800, 
            mx: 'auto', 
            mb: 4,
            px: 2
          }}
        >
          Search through bills or upload legislation for AI-powered analysis and insights
        </Typography>
      </Box>

      {/* Main Content */}
      <Paper 
        elevation={0}
        sx={{ 
          borderRadius: 3, 
          overflow: 'hidden',
          border: '1px solid',
          borderColor: 'divider',
          mx: 'auto',
          maxWidth: 900,
          p: { xs: 2, sm: 3 },
        }}
      >
        <Suspense fallback={<HomeFallback />}>
          <HomeContent />
        </Suspense>
      </Paper>

      {/* Features Section */}
      <Box sx={{ mt: 8, textAlign: 'center' }}>
        <Typography 
          variant="h4" 
          component="h2" 
          gutterBottom
          sx={{ 
            fontWeight: 600, 
            mb: 4,
          }}
        >
          Powerful AI-Driven Features
        </Typography>
        
        <Box
          sx={{
            display: 'flex',
            flexDirection: { xs: 'column', md: 'row' },
            gap: 4,
            justifyContent: 'center',
            mt: 4,
          }}
        >
          <Paper 
            elevation={0}
            sx={{ 
              p: 3,
              borderRadius: 3,
              bgcolor: 'background.default',
              border: '1px solid',
              borderColor: 'divider',
              flex: 1,
              maxWidth: { xs: '100%', md: 300 },
            }}
          >
            <Typography variant="h6" gutterBottom>
              Bill Search
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Search through thousands of bills using natural language queries to find relevant legislation.
            </Typography>
          </Paper>

          <Paper 
            elevation={0}
            sx={{ 
              p: 3,
              borderRadius: 3,
              bgcolor: 'background.default',
              border: '1px solid',
              borderColor: 'divider',
              flex: 1,
              maxWidth: { xs: '100%', md: 300 },
            }}
          >
            <Typography variant="h6" gutterBottom>
              Document Analysis
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Upload your documents for AI-powered analysis and get comprehensive summaries and insights.
            </Typography>
          </Paper>

          <Paper 
            elevation={0}
            sx={{ 
              p: 3,
              borderRadius: 3,
              bgcolor: 'background.default',
              border: '1px solid',
              borderColor: 'divider',
              flex: 1,
              maxWidth: { xs: '100%', md: 300 },
            }}
          >
            <Typography variant="h6" gutterBottom>
              AI Insights
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Leverage advanced AI models to extract key points, analyze implications, and generate recommendations.
            </Typography>
          </Paper>
        </Box>
      </Box>
    </Container>
  );
} 