'use client';

import React, { useState } from 'react';
import { 
  TextField, 
  Button, 
  Paper, 
  Typography, 
  CircularProgress, 
  Box, 
  List, 
  ListItem, 
  ListItemButton, 
  ListItemText,
  Chip,
  Divider,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Card,
  CardContent,
  Alert,
  IconButton,
  Stack,
  Link
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

interface Bill {
  id: string;
  title: string;
  identifier: string;
  classification: string[];
  subject: string[];
  abstract: string;
  session: string;
  jurisdiction: {
    name: string;
    id: string;
  };
  primarySponsor?: {
    name: string;
    id: string;
  };
  actions: {
    date: string;
    description: string;
    classification: string[];
  }[];
  documents: {
    url: string;
    note: string;
  }[];
  versions?: {
    url: string;
    note: string;
    date: string;
  }[];
  votes: {
    date: string;
    result: string;
    counts: {
      yes: number;
      no: number;
      abstain: number;
    };
  }[];
  updatedAt: string;
}

interface PaginationInfo {
  hasNextPage: boolean;
  endCursor: string;
  currentPage: number;
  totalPages: number;
}

const BillSearch: React.FC = () => {
  const [query, setQuery] = useState('');
  const [bills, setBills] = useState<Bill[]>([]);
  const [selectedBill, setSelectedBill] = useState<Bill | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [pagination, setPagination] = useState<PaginationInfo | null>(null);

  const handleSearch = async () => {
    if (!query.trim()) return;
    
    setLoading(true);
    setError(null);
    setBills([]);
    setSelectedBill(null);
    
    try {
      const response = await fetch('/api/search', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ query }),
      });
      
      if (!response.ok) {
        throw new Error(`Error: ${response.status}`);
      }
      
      const data = await response.json();
      
      if (data.error) {
        throw new Error(data.error);
      }
      
      setBills(data.bills || []);
      setPagination(data.pagination || null);
      
      if (data.bills.length === 0) {
        setError('No bills found matching your search criteria.');
      }
    } catch (error) {
      console.error('Error searching for bills:', error);
      setError('Failed to search for bills. Please check your connection and try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleBillSelect = async (bill: Bill) => {
    setLoading(true);
    
    try {
      // Fetch detailed bill information
      const response = await fetch(`/api/bill/${bill.jurisdiction.id}/${bill.session}/${bill.identifier}`);
      
      if (!response.ok) {
        throw new Error(`Error: ${response.status}`);
      }
      
      const detailedBill = await response.json();
      
      if (detailedBill.error) {
        throw new Error(detailedBill.error);
      }
      
      setSelectedBill(detailedBill);
    } catch (error) {
      console.error('Error fetching bill details:', error);
      // Fall back to the basic bill info if we can't get details
      setSelectedBill(bill);
    } finally {
      setLoading(false);
    }
  };

  const handleBackToResults = () => {
    setSelectedBill(null);
  };

  // Format date to be more readable
  const formatDate = (dateString: string) => {
    const options: Intl.DateTimeFormatOptions = { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  // Render bill details view
  const renderBillDetails = () => {
    if (!selectedBill) return null;

    return (
      <Box>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
          <IconButton 
            onClick={handleBackToResults} 
            aria-label="back to results"
            sx={{ mr: 1 }}
          >
            <ArrowBackIcon />
          </IconButton>
          <Typography variant="h6">Back to results</Typography>
        </Box>

        <Paper sx={{ p: 3, mb: 3 }}>
          <Typography variant="h5" gutterBottom sx={{ fontWeight: 'bold' }}>
            {selectedBill.identifier}: {selectedBill.title}
          </Typography>
          
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 2 }}>
            <Chip label={selectedBill.jurisdiction.name} color="primary" variant="outlined" />
            <Chip label={`Session: ${selectedBill.session}`} variant="outlined" />
            {selectedBill.classification.map((cls, index) => (
              <Chip 
                key={index} 
                label={cls} 
                size="small" 
                variant="outlined"
              />
            ))}
          </Box>

          {selectedBill.abstract && (
            <Box sx={{ my: 2 }}>
              <Typography variant="subtitle1" fontWeight="bold">Abstract</Typography>
              <Typography variant="body1">{selectedBill.abstract}</Typography>
            </Box>
          )}

          {selectedBill.primarySponsor && (
            <Box sx={{ my: 2 }}>
              <Typography variant="subtitle1" fontWeight="bold">Primary Sponsor</Typography>
              <Typography variant="body1">{selectedBill.primarySponsor.name}</Typography>
            </Box>
          )}

          {selectedBill.subject && selectedBill.subject.length > 0 && (
            <Box sx={{ my: 2 }}>
              <Typography variant="subtitle1" fontWeight="bold">Subjects</Typography>
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5, mt: 1 }}>
                {selectedBill.subject.map((subj, index) => (
                  <Chip 
                    key={index} 
                    label={subj} 
                    size="small" 
                    color="secondary" 
                    variant="outlined"
                  />
                ))}
              </Box>
            </Box>
          )}

          <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>
            Last updated: {formatDate(selectedBill.updatedAt)}
          </Typography>
        </Paper>

        <Stack direction={{ xs: 'column', md: 'row' }} spacing={3} sx={{ mb: 3 }}>
          {selectedBill.versions && selectedBill.versions.length > 0 && (
            <Card sx={{ flex: 1 }}>
              <CardContent>
                <Typography variant="h6" gutterBottom>Bill Versions</Typography>
                <List>
                  {selectedBill.versions.map((version, index) => (
                    <ListItem key={index} disablePadding>
                      <ListItemButton component="a" href={version.url} target="_blank" rel="noopener noreferrer">
                        <ListItemText 
                          primary={version.note || `Version ${index + 1}`} 
                          secondary={version.date ? `Date: ${formatDate(version.date)}` : 'Click to view'}
                        />
                      </ListItemButton>
                    </ListItem>
                  ))}
                </List>
              </CardContent>
            </Card>
          )}

          {selectedBill.documents && selectedBill.documents.length > 0 && (
            <Card sx={{ flex: 1 }}>
              <CardContent>
                <Typography variant="h6" gutterBottom>Documents</Typography>
                <List>
                  {selectedBill.documents.map((doc, index) => (
                    <ListItem key={index} disablePadding>
                      <ListItemButton component="a" href={doc.url} target="_blank" rel="noopener noreferrer">
                        <ListItemText 
                          primary={doc.note || `Document ${index + 1}`} 
                          secondary="Click to view"
                        />
                      </ListItemButton>
                    </ListItem>
                  ))}
                </List>
              </CardContent>
            </Card>
          )}

          {selectedBill.votes && selectedBill.votes.length > 0 && (
            <Card sx={{ flex: 1 }}>
              <CardContent>
                <Typography variant="h6" gutterBottom>Votes</Typography>
                <List>
                  {selectedBill.votes.map((vote, index) => (
                    <ListItem key={index}>
                      <ListItemText
                        primary={`Vote on ${formatDate(vote.date)}`}
                        secondary={
                          <React.Fragment>
                            <Typography component="span" variant="body2">
                              Result: {vote.result} <br />
                              Yes: {vote.counts.yes} | No: {vote.counts.no} | Abstain: {vote.counts.abstain}
                            </Typography>
                          </React.Fragment>
                        }
                      />
                    </ListItem>
                  ))}
                </List>
              </CardContent>
            </Card>
          )}
        </Stack>

        <Accordion sx={{ mt: 3 }}>
          <AccordionSummary
            expandIcon={<ExpandMoreIcon />}
            aria-controls="actions-content"
            id="actions-header"
          >
            <Typography>Bill History ({selectedBill.actions.length} actions)</Typography>
          </AccordionSummary>
          <AccordionDetails>
            <List>
              {selectedBill.actions.map((action, index) => (
                <React.Fragment key={index}>
                  <ListItem alignItems="flex-start">
                    <ListItemText
                      primary={formatDate(action.date)}
                      secondary={
                        <React.Fragment>
                          <Typography component="span" variant="body2">
                            {action.description}
                          </Typography>
                          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5, mt: 0.5 }}>
                            {action.classification.map((cls, i) => (
                              <Chip 
                                key={i} 
                                label={cls} 
                                size="small" 
                                variant="outlined" 
                                sx={{ fontSize: '0.7rem' }}
                              />
                            ))}
                          </Box>
                        </React.Fragment>
                      }
                    />
                  </ListItem>
                  {index < selectedBill.actions.length - 1 && <Divider component="li" />}
                </React.Fragment>
              ))}
            </List>
          </AccordionDetails>
        </Accordion>
      </Box>
    );
  };

  // Render search results
  const renderSearchResults = () => {
    if (loading) {
      return (
        <Box sx={{ display: 'flex', justifyContent: 'center', my: 4 }}>
          <CircularProgress />
        </Box>
      );
    }

    if (error) {
      return (
        <Alert severity="error" sx={{ my: 2 }}>
          {error}
        </Alert>
      );
    }

    if (bills.length === 0) {
      return null;
    }

    return (
      <Box sx={{ mt: 3 }}>
        <Typography variant="h6" gutterBottom>
          Found {bills.length} bill{bills.length !== 1 ? 's' : ''}
        </Typography>
        <Paper elevation={0} variant="outlined">
          <List>
            {bills.map((bill, index) => (
              <React.Fragment key={bill.id}>
                <ListItem disablePadding>
                  <ListItemButton onClick={() => handleBillSelect(bill)}>
                    <ListItemText
                      primary={
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <Typography fontWeight="bold">{bill.identifier}</Typography>
                          <Typography> - {bill.title}</Typography>
                        </Box>
                      }
                      secondary={
                        <Box>
                          <Typography variant="body2" color="text.secondary">
                            {bill.jurisdiction.name} • {bill.session}
                          </Typography>
                          {bill.subject && bill.subject.length > 0 && (
                            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5, mt: 0.5 }}>
                              {bill.subject.slice(0, 3).map((subj, i) => (
                                <Chip 
                                  key={i} 
                                  label={subj} 
                                  size="small" 
                                  variant="outlined" 
                                  sx={{ fontSize: '0.7rem' }}
                                />
                              ))}
                              {bill.subject.length > 3 && (
                                <Chip 
                                  label={`+${bill.subject.length - 3} more`} 
                                  size="small" 
                                  variant="outlined" 
                                  sx={{ fontSize: '0.7rem' }}
                                />
                              )}
                            </Box>
                          )}
                        </Box>
                      }
                    />
                  </ListItemButton>
                </ListItem>
                {index < bills.length - 1 && <Divider />}
              </React.Fragment>
            ))}
          </List>
        </Paper>
      </Box>
    );
  };

  return (
    <Paper sx={{ p: 3, maxWidth: 800, mx: 'auto' }}>
      {!selectedBill ? (
        <>
          <Typography variant="h5" gutterBottom>
            Search for a Bill
          </Typography>
          <Box sx={{ mb: 2 }}>
            <Typography variant="body2" color="text.secondary">
              Powered by <Link href="https://v3.openstates.org" target="_blank" style={{ textDecoration: 'none' }}>OpenStates API</Link>. 
              Search for bills by keyword, bill number, or topic to get detailed information from state legislatures.
              <em style={{ display: 'block', marginTop: '4px', color: 'orange' }}>
                Note: Using mock data for demonstration purposes.
              </em>
            </Typography>
          </Box>
          <Box sx={{ display: 'flex', gap: 2, mb: 3 }}>
            <TextField
              label="Enter Bill Name or Number"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              fullWidth
              variant="outlined"
              placeholder="e.g., H.R. 1, S. 1234, or bill description"
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  handleSearch();
                }
              }}
            />
            <Button
              variant="contained"
              color="primary"
              onClick={handleSearch}
              disabled={loading || !query.trim()}
              startIcon={loading ? <CircularProgress size={20} /> : <SearchIcon />}
            >
              {loading ? 'Searching...' : 'Search'}
            </Button>
          </Box>
          {renderSearchResults()}
        </>
      ) : (
        renderBillDetails()
      )}
    </Paper>
  );
};

export default BillSearch; 