import React from 'react';
import { Box, Typography, Container, Paper } from '@mui/material';
import ModelProvidersList from '../components/model-providers/ModelProvidersList';

const ModelProvidersPage: React.FC = () => {
  return (
    <Container maxWidth="xl">
      <Box py={3}>
        <Typography variant="h4" gutterBottom>
          Model Providers
        </Typography>
        <Typography variant="body1" color="textSecondary" paragraph>
          Manage model providers and their associated models for use in agents.
        </Typography>
        
        <Paper sx={{ p: 3, mt: 3 }}>
          <ModelProvidersList />
        </Paper>
      </Box>
    </Container>
  );
};

export default ModelProvidersPage;