'use client';

import React, { useState } from 'react';
import { Button, Paper, Typography, Input } from '@mui/material';

const BillUpload: React.FC = () => {
  const [file, setFile] = useState<File | null>(null);
  const [summary, setSummary] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setFile(e.target.files[0]);
      setSummary(null);
    }
  };

  const handleUpload = async () => {
    if (!file) return;
    setUploading(true);
    // Simulate file upload and processing
    setTimeout(() => {
      setSummary(`Summary for uploaded bill: The document highlights major legal points including ... [Example summary]`);
      setUploading(false);
    }, 1500);
  };

  return (
    <Paper sx={{ padding: 3 }}>
      <Typography variant="h5" gutterBottom>
        Upload a Bill Document
      </Typography>
      <Input type="file" onChange={handleFileChange} />
      <Button
        variant="contained"
        color="primary"
        onClick={handleUpload}
        disabled={uploading || !file}
        sx={{ marginTop: 2 }}
      >
        {uploading ? 'Processing...' : 'Upload and Summarize'}
      </Button>
      {summary && (
        <Paper sx={{ marginTop: 2, padding: 2, backgroundColor: '#f5f5f5' }}>
          <Typography variant="body1">{summary}</Typography>
        </Paper>
      )}
    </Paper>
  );
};

export default BillUpload; 